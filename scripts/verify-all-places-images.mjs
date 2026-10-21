import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dir = path.resolve('public/images/places');
const files = fs.readdirSync(dir);

console.log(`Total images in public/images/places: ${files.length}`);

const hashes = new Map();
let duplicates = 0;
let tooSmall = 0;

for (const f of files) {
  const p = path.join(dir, f);
  const buf = fs.readFileSync(p);
  if (buf.length < 5000) {
    console.log(`⚠️ Warning: ${f} is unusually small (${buf.length} bytes)`);
    tooSmall++;
  }
  const hash = crypto.createHash('md5').update(buf).digest('hex');
  if (hashes.has(hash)) {
    console.log(`❌ DUPLICATE DETECTED: ${f} matches ${hashes.get(hash)}`);
    duplicates++;
  } else {
    hashes.set(hash, f);
  }
}

console.log(`\nVerification complete:`);
console.log(`  Total images: ${files.length}`);
console.log(`  Duplicates: ${duplicates}`);
console.log(`  Too small (<5KB): ${tooSmall}`);
