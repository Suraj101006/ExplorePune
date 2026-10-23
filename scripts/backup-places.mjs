import fs from 'fs';
import path from 'path';
import { AUTHENTIC_PLACES } from './seed-authentic-places.mjs';

const backupDir = 'data';
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const backupPath = path.join(backupDir, 'backup_places_pre_audit_20261023.json');
fs.writeFileSync(backupPath, JSON.stringify(AUTHENTIC_PLACES, null, 2));

console.log(`✓ Backup successfully created: ${backupPath}`);
console.log(`✓ Total places preserved in backup: ${AUTHENTIC_PLACES.length}`);
