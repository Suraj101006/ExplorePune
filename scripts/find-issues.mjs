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

console.log('Total source files found:', allFiles.length);

// 1. Check localStorage usage
console.log('\n--- 1. Checking localStorage Usage ---');
const storageFiles = [];
for (const file of allFiles) {
  const code = fs.readFileSync(file, 'utf8');
  if (code.includes('localStorage')) {
    storageFiles.push(file);
    // Check if JSON.parse(localStorage.getItem) is wrapped in try/catch
    const parseMatches = code.match(/JSON\.parse\([^)]*localStorage/g);
    if (parseMatches) {
      console.log(`[Storage File] ${file} has JSON.parse(localStorage):`, parseMatches.length);
    }
  }
}
console.log('Files with localStorage:', storageFiles);

// 2. Check dangerouslySetInnerHTML and innerHTML
console.log('\n--- 2. Checking dangerouslySetInnerHTML & innerHTML ---');
for (const file of allFiles) {
  const code = fs.readFileSync(file, 'utf8');
  if (code.includes('dangerouslySetInnerHTML') || code.includes('innerHTML')) {
    console.log(`[Potential XSS sink] ${file}`);
  }
}

// 3. Check for dead buttons (button without onClick, href, or type="submit")
console.log('\n--- 3. Checking Interactive Elements (Buttons & Links) ---');
for (const file of allFiles) {
  if (!file.endsWith('.tsx')) continue;
  const code = fs.readFileSync(file, 'utf8');
  // Check empty onClick
  if (code.includes('onClick={() => {}}') || code.includes('onClick={() => {}}')) {
    console.log(`[Dead button] ${file} has empty onClick`);
  }
}

// 4. Check images without alt attributes
console.log('\n--- 4. Checking Images for missing alt ---');
for (const file of allFiles) {
  if (!file.endsWith('.tsx')) continue;
  const code = fs.readFileSync(file, 'utf8');
  const imgMatches = code.match(/<img(?![^>]*\balt=)[^>]*>/g);
  if (imgMatches) {
    console.log(`[Missing alt on <img>] ${file}:`, imgMatches.length);
  }
  const nextImgMatches = code.match(/<Image(?![^>]*\balt=)[^>]*>/g);
  if (nextImgMatches) {
    console.log(`[Missing alt on <Image>] ${file}:`, nextImgMatches.length);
  }
}

// 5. Check hardcoded external/internal links for dead routes
console.log('\n--- 5. Checking Internal Links ---');
const internalLinks = new Set();
for (const file of allFiles) {
  if (!file.endsWith('.tsx')) continue;
  const code = fs.readFileSync(file, 'utf8');
  const linkMatches = code.match(/href=["'](\/[^"']*)["']/g);
  if (linkMatches) {
    for (const m of linkMatches) {
      const href = m.slice(6, -1);
      internalLinks.add(href);
    }
  }
}
console.log('Unique internal links in codebase:', Array.from(internalLinks));
