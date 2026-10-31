/* Loads the browser content/grading scripts into a Node sandbox for testing. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const FILES = [
  'js/objectives.js', 'js/diagrams.js',
  'js/content/lessons-d1.js', 'js/content/lessons-d2.js', 'js/content/lessons-d3.js', 'js/content/lessons-d4.js', 'js/content/lessons-d5.js',
  'js/content/questions-d1.js', 'js/content/questions-d2.js', 'js/content/questions-d3.js', 'js/content/questions-d4.js', 'js/content/questions-d5.js', 'js/content/questions-scenarios.js', 'js/content/questions-more.js',
  'js/content/pbqs.js', 'js/content/pbqs-more.js', 'js/content/acronyms.js', 'js/practice-gen.js', 'js/grading.js', 'js/store.js'
];

function load() {
  const mem = {};
  const localStorage = {
    getItem: (k) => (k in mem ? mem[k] : null),
    setItem: (k, v) => { mem[k] = String(v); },
    removeItem: (k) => { delete mem[k]; }
  };
  const sandbox = { console, localStorage };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
  return { SEC: sandbox.SEC, Grading: sandbox.Grading, Store: sandbox.Store, storage: mem };
}
module.exports = { load, FILES, ROOT };
