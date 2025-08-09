#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, '.bmad', 'learnings', 'manifest.yaml');
const repairSpecPath = path.join(repoRoot, 'bmad-core', 'agents', 'repair.md');

if (!fs.existsSync(manifestPath)) fail('.bmad/learnings/manifest.yaml is missing');
if (!fs.existsSync(repairSpecPath)) fail('bmad-core/agents/repair.md is missing');

const repairSpec = fs.readFileSync(repairSpecPath, 'utf8');

if (!repairSpec.includes('LEARNINGS-MANIFEST')) {
  fail('repair.md must document LEARNINGS-MANIFEST section');
}
if (!repairSpec.includes('.bmad/learnings/manifest.yaml')) {
  fail('repair.md must reference .bmad/learnings/manifest.yaml');
}
if (!repairSpec.match(/\.bmad\/learnings\/.+\.jsonl/)) {
  fail('repair.md must mention writing category JSONL files under .bmad/learnings');
}

console.log('Repair spec and learnings manifest validated.');
