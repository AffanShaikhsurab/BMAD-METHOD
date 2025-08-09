const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');
const crypto = require('crypto');

class LearningsStore {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.baseDir = options.baseDir || path.join(this.rootDir, '.bmad', 'learnings');
    this.manifestPath = options.manifestPath || path.join(this.baseDir, 'manifest.yaml');
  }

  async loadManifest() {
    try {
      const raw = await fs.readFile(this.manifestPath, 'utf8');
      const data = yaml.load(raw) || {};
      if (!data.categories || typeof data.categories !== 'object') {
        throw new Error('Invalid manifest: missing categories map');
      }
      return data;
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`Learnings manifest not found at ${this.manifestPath}`);
      }
      throw err;
    }
  }

  resolveCategoryDir(manifest, category) {
    const rel = manifest.categories?.[category];
    if (!rel) throw new Error(`Unknown learnings category: ${category}`);
    return path.isAbsolute(rel) ? rel : path.join(this.rootDir, '.bmad', rel.replace(/^learnings\/?/, 'learnings/'));
  }

  categoryIndexPath(categoryDir) {
    return path.join(categoryDir, 'index.jsonl');
  }

  globalIndexPath() {
    return path.join(this.baseDir, 'index.jsonl');
  }

  async ensureDir(p) {
    await fs.mkdirp(p);
    return p;
  }

  async validateOrInit() {
    // Ensure base dir
    await this.ensureDir(this.baseDir);

    // Ensure manifest exists; if not, create a default one
    const exists = await fs.pathExists(this.manifestPath);
    if (!exists) {
      const defaultManifest = {
        categories: {
          api: 'learnings/api',
          database: 'learnings/database',
          routing: 'learnings/routing',
          functionality: 'learnings/functionality',
          'text-issues': 'learnings/text-issues',
          misc: 'learnings/misc'
        }
      };
      await fs.writeFile(this.manifestPath, yaml.dump(defaultManifest), 'utf8');
    }

    const manifest = await this.loadManifest();
    // Ensure each category directory exists
    for (const [, rel] of Object.entries(manifest.categories)) {
      const dir = path.join(this.rootDir, '.bmad', rel);
      await this.ensureDir(dir);
      // Ensure per-category index file exists
      const catIndex = this.categoryIndexPath(dir);
      if (!(await fs.pathExists(catIndex))) await fs.writeFile(catIndex, '', 'utf8');
    }

    // Ensure global index exists
    const gIndex = this.globalIndexPath();
    if (!(await fs.pathExists(gIndex))) await fs.writeFile(gIndex, '', 'utf8');

    return { baseDir: this.baseDir, manifestPath: this.manifestPath, categories: manifest.categories };
  }

  async listJsonlFiles(category) {
    const manifest = await this.loadManifest();
    const dir = this.resolveCategoryDir(manifest, category);
    await this.ensureDir(dir);
    return new Promise((resolve, reject) => {
      glob('**/*.jsonl', { cwd: dir, absolute: true, nodir: true }, (err, files) => {
        if (err) return reject(err);
        resolve(files);
      });
    });
  }

  async readJsonlEntries(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split(/\r?\n/).filter(Boolean);
    const entries = [];
    for (let i = 0; i < lines.length; i++) {
      try {
        const obj = JSON.parse(lines[i]);
        entries.push({ ...obj, __file: filePath, __line: i + 1 });
      } catch (_) {
        // skip invalid lines
      }
    }
    return entries;
  }

  tokenize(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[^a-z0-9_\- ]+/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  jaccard(aTokens, bTokens) {
    const a = new Set(aTokens);
    const b = new Set(bTokens);
    let inter = 0;
    for (const t of a) if (b.has(t)) inter++;
    const union = a.size + b.size - inter;
    return union === 0 ? 0 : inter / union;
  }

  scoreEntry(queryTokens, entry) {
    const hay = [entry.issue, (entry.metadata && entry.metadata.tags || []).join(' '), (entry.metadata && (entry.metadata.files || []).join(' '))].join(' ');
    const tokens = this.tokenize(hay);
    return this.jaccard(queryTokens, tokens);
  }

  buildSummary(learning, category, filePath) {
    const title = String(learning.issue || learning.resolution || '').slice(0, 140);
    return {
      id: (crypto.randomUUID && crypto.randomUUID()) || crypto.randomBytes(8).toString('hex'),
      title,
      category,
      file: path.relative(this.rootDir, filePath),
      date: learning.metadata?.date || new Date().toISOString(),
      tags: learning.metadata?.tags || [category],
      files: learning.metadata?.files || []
    };
  }

  async appendIndexEntry(indexPath, summary) {
    const line = JSON.stringify(summary) + '\n';
    await fs.appendFile(indexPath, line, { encoding: 'utf8' });
  }

  async search(query, categories = []) {
    // Fast path via indices
    const manifest = await this.loadManifest();
    const usedCats = categories.length ? categories : Object.keys(manifest.categories);
    const queryTokens = this.tokenize(query);
    const results = [];

    for (const cat of usedCats) {
      const dir = this.resolveCategoryDir(manifest, cat);
      const idx = this.categoryIndexPath(dir);
      if (await fs.pathExists(idx)) {
        const indexEntries = await this.readJsonlEntries(idx);
        for (const s of indexEntries) {
          const score = this.jaccard(queryTokens, this.tokenize([s.title, (s.tags||[]).join(' '), (s.files||[]).join(' ')].join(' ')));
          if (score > 0) results.push({ category: cat, score, summary: s });
        }
      }
    }

    // If no results via index, fall back to scanning JSONL
    if (results.length === 0) {
      for (const cat of usedCats) {
        const files = await this.listJsonlFiles(cat);
        for (const f of files) {
          const entries = await this.readJsonlEntries(f);
          for (const e of entries) {
            const score = this.scoreEntry(queryTokens, e);
            if (score > 0) results.push({ category: cat, score, entry: e });
          }
        }
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results;
  }

  currentMonthlyFile(categoryDir, date = new Date()) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    return path.join(categoryDir, `${y}-${m}.jsonl`);
  }

  validateLearning(learning) {
    if (!learning || typeof learning !== 'object') throw new Error('Learning must be an object');
    const { issue, attempts, resolution, metadata } = learning;
    if (!issue || !resolution) throw new Error('Learning requires issue and resolution');
    if (attempts && !Array.isArray(attempts)) throw new Error('attempts must be an array of strings');
    if (!metadata || typeof metadata !== 'object') throw new Error('metadata is required');
    return true;
  }

  async append(category, learning, options = {}) {
    const manifest = await this.loadManifest();
    const dir = this.resolveCategoryDir(manifest, category);
    await this.ensureDir(dir);
    this.validateLearning(learning);

    // Ensure minimal metadata
    learning.metadata = learning.metadata || {};
    learning.metadata.date = learning.metadata.date || new Date().toISOString();
    learning.metadata.agent = learning.metadata.agent || 'repair-agent-v1';
    learning.metadata.tags = learning.metadata.tags || [category];

    const filePath = options.filePath || this.currentMonthlyFile(dir);
    const line = JSON.stringify(learning) + '\n';
    await fs.appendFile(filePath, line, { encoding: 'utf8' });

    // Update indices (category + global)
    const summary = this.buildSummary(learning, category, filePath);
    await this.appendIndexEntry(this.categoryIndexPath(dir), summary);
    await this.appendIndexEntry(this.globalIndexPath(), summary);
    return { filePath };
  }

  async rebuildIndex(category) {
    const manifest = await this.loadManifest();
    const cats = category ? [category] : Object.keys(manifest.categories);
    const globalSummaries = [];
    for (const cat of cats) {
      const dir = this.resolveCategoryDir(manifest, cat);
      const files = await this.listJsonlFiles(cat);
      const summaries = [];
      for (const f of files) {
        const entries = await this.readJsonlEntries(f);
        for (const e of entries) summaries.push(this.buildSummary(e, cat, f));
      }
      const catIndex = this.categoryIndexPath(dir);
      await fs.writeFile(catIndex, summaries.map(s => JSON.stringify(s)).join('\n') + (summaries.length ? '\n' : ''), 'utf8');
      globalSummaries.push(...summaries);
    }
    if (!category) {
      const gIndex = this.globalIndexPath();
      await fs.writeFile(gIndex, globalSummaries.map(s => JSON.stringify(s)).join('\n') + (globalSummaries.length ? '\n' : ''), 'utf8');
    }
    return { rebuilt: category || 'all' };
  }

  async listIndex(category) {
    if (category) {
      const manifest = await this.loadManifest();
      const dir = this.resolveCategoryDir(manifest, category);
      const idx = this.categoryIndexPath(dir);
      if (!(await fs.pathExists(idx))) return [];
      return this.readJsonlEntries(idx);
    }
    const gIndex = this.globalIndexPath();
    if (!(await fs.pathExists(gIndex))) return [];
    return this.readJsonlEntries(gIndex);
  }
}

module.exports = LearningsStore;
