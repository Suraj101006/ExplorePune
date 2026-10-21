import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (['node_modules', '.next', '.git'].includes(item)) continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (/\.(tsx?|mjs|js)$/.test(item)) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk('.');
const missing = [];

for (const file of allFiles) {
  const code = fs.readFileSync(file, 'utf8');
  const matches = [...code.matchAll(/['"](\/images\/[^'"]+\.(?:jpg|jpeg|png|svg|webp))['"]/g)].map(m => m[1]);
  for (const u of matches) {
    const local = path.join('public', u.slice(1));
    if (!fs.existsSync(local)) {
      missing.push({ file, url: u });
    }
  }
}

console.log('Total missing image references:', missing.length);
console.log(JSON.stringify(missing, null, 2));
