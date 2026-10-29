/* Builds the Windows executable with Node's Single Executable Applications feature.
     npm run build:exe   -> dist/SecurityPlusStudyLab.exe (Windows x64)
   (Linux uses the AppImage and macOS uses the .app bundle; see scripts/build-release.sh.)
   Windows builds download the official node.exe for the running Node version from nodejs.org
   and verify it against the published SHA-256 checksums before using it. */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const DIST = path.join(ROOT, 'dist');
const CACHE = path.join(BUILD, 'cache');
const target = (process.argv[2] || 'win').toLowerCase();
const VERSION = process.version; // the SEA blob must be made by the same Node version as the runtime it is injected into
const FUSE = 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2';

if (process.versions.node.split('.')[0] < 20) { console.error('Node 20 or later is required to build the executable.'); process.exit(1); }

// App files embedded in the executable.
function appFiles() {
  const out = ['index.html'];
  const walk = (dir) => fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).forEach((d) => {
    const rel = dir + '/' + d.name;
    if (d.isDirectory()) walk(rel); else out.push(rel);
  });
  walk('css'); walk('js'); walk('fonts');
  return out;
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Download failed (' + res.status + '): ' + url);
  return Buffer.from(await res.arrayBuffer());
}

async function windowsRuntime() {
  const file = path.join(CACHE, 'node-' + VERSION + '-win-x64.exe');
  const sums = (await download('https://nodejs.org/dist/' + VERSION + '/SHASUMS256.txt')).toString();
  const line = sums.split('\n').find((l) => l.trim().endsWith(' win-x64/node.exe'));
  if (!line) throw new Error('No checksum for win-x64/node.exe in SHASUMS256.txt for ' + VERSION);
  const expected = line.trim().split(/\s+/)[0];
  const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
  if (!fs.existsSync(file) || sha(fs.readFileSync(file)) !== expected) {
    console.log('Downloading official node.exe ' + VERSION + ' ...');
    const buf = await download('https://nodejs.org/dist/' + VERSION + '/win-x64/node.exe');
    if (sha(buf) !== expected) throw new Error('Checksum mismatch for downloaded node.exe; refusing to build.');
    fs.writeFileSync(file, buf);
  }
  console.log('Verified node.exe SHA-256 ' + expected);
  return file;
}

async function main() {
  const targets = {
    win: { out: 'SecurityPlusStudyLab.exe', runtime: windowsRuntime }
  };
  const t = targets[target];
  if (!t) { console.error('Unknown target "' + target + '". Use: win'); process.exit(1); }
  fs.mkdirSync(CACHE, { recursive: true });
  fs.mkdirSync(DIST, { recursive: true });

  const assets = {};
  appFiles().forEach((rel) => { assets[rel] = path.join(ROOT, rel); });
  const blob = path.join(BUILD, 'sea-prep.blob');
  const config = { main: path.join(ROOT, 'desktop', 'launcher.js'), output: blob, disableExperimentalSEAWarning: true, useSnapshot: false, useCodeCache: false, assets };
  fs.writeFileSync(path.join(BUILD, 'sea-config.json'), JSON.stringify(config, null, 2));
  console.log('Embedding ' + Object.keys(assets).length + ' app files');
  execFileSync(process.execPath, ['--experimental-sea-config', path.join(BUILD, 'sea-config.json')], { stdio: 'inherit' });

  const runtime = await t.runtime();
  const out = path.join(DIST, t.out);
  fs.copyFileSync(runtime, out);
  fs.chmodSync(out, 0o755);
  const { inject } = require('postject');
  await inject(out, 'NODE_SEA_BLOB', fs.readFileSync(blob), { sentinelFuse: FUSE });
  const mb = (fs.statSync(out).size / 1048576).toFixed(1);
  console.log('Built ' + path.relative(ROOT, out) + ' (' + mb + ' MB)');
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
