const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

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
    }

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

  async search(query, categories = []) {
    const manifest = await this.loadManifest();
    const usedCats = categories.length ? categories : Object.keys(manifest.categories);
    const queryTokens = this.tokenize(query);
    const results = [];
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
    return { filePath };
  }
}

module.exports = LearningsStore;
