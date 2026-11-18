const fs = require('fs');
const path = require('path');

const places = JSON.parse(fs.readFileSync('data/pune_places_106.json', 'utf8'));
console.log('=== IMAGE EXISTENCE AUDIT ===');
let missingLocalImages = [];
let remoteImages = [];
let localImages = [];

places.forEach(p => {
  const img = p.image_url;
  if (!img) return;
  if (img.startsWith('http://') || img.startsWith('https://')) {
    remoteImages.push({ id: p.id, url: img });
  } else if (img.startsWith('/')) {
    const localPath = path.join(process.cwd(), 'public', img.replace(/^\//, ''));
    if (!fs.existsSync(localPath)) {
      missingLocalImages.push({ id: p.id, img, localPath });
    } else {
      localImages.push({ id: p.id, img });
    }
  } else {
    missingLocalImages.push({ id: p.id, img, reason: 'unknown path format' });
  }
});

console.log('Total places:', places.length);
console.log('Remote images:', remoteImages.length);
console.log('Local images found:', localImages.length);
console.log('Missing local images:', missingLocalImages.length);
if (missingLocalImages.length > 0) {
  console.log('Missing sample:', missingLocalImages.slice(0, 5));
}
