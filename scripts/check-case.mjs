import fs from 'fs';
import path from 'path';

const root = 'C:/Users/Suraj/explore-pune';

function checkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', '.firebase'].includes(entry.name)) continue;
      checkDir(fullPath);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /(?:import|from)\s+['"](@\/[^'"]+|\.[^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        let importPath = match[1];
        let resolvedPath;
        if (importPath.startsWith('@/')) {
          resolvedPath = path.resolve(root, importPath.slice(2));
        } else {
          resolvedPath = path.resolve(dir, importPath);
        }

        // Check extensions
        let actualFile = null;
        for (const ext of ['', '.ts', '.tsx', '.js', '.jsx', '.json', '/index.ts', '/index.tsx']) {
          const testPath = resolvedPath + ext;
          if (fs.existsSync(testPath) && fs.statSync(testPath).isFile()) {
            actualFile = testPath;
            break;
          }
        }

        if (!actualFile) {
          console.log(`MISSING FILE: in ${path.relative(root, fullPath)} -> ${importPath}`);
          continue;
        }

        // Verify case sensitivity
        const segments = path.relative(root, actualFile).split(/[\\/]/);
        let curr = root;
        for (const seg of segments) {
          const diskEntries = fs.readdirSync(curr);
          if (!diskEntries.includes(seg)) {
            const actualDisk = diskEntries.find(e => e.toLowerCase() === seg.toLowerCase());
            console.log(`CASE MISMATCH in ${path.relative(root, fullPath)}:`);
            console.log(`  Imported: ${seg}`);
            console.log(`  On disk:  ${actualDisk}`);
          }
          curr = path.join(curr, seg);
        }
      }
    }
  }
}

checkDir(root);
console.log('Case check complete.');
