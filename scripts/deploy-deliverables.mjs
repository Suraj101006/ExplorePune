import fs from 'node:fs';
import path from 'node:path';

const outDir = 'C:/Users/Suraj/explore-pune/website-marketing-kit/out';
const rootDir = 'C:/Users/Suraj/explore-pune';
const publicVideos = 'C:/Users/Suraj/explore-pune/public/videos';
const artifactDir = 'C:/Users/Suraj/.gemini/antigravity/brain/423c92e7-93f0-43f0-b5f3-a18653c595ae';

if (!fs.existsSync(publicVideos)) {
  fs.mkdirSync(publicVideos, { recursive: true });
}

const mediaFiles = [
  'explore-pune-metro-transit-en.mp4',
  'explore-pune-metro-transit-mr.mp4',
  'explore-pune-metro-transit-short.mp4',
  'explore-pune-metro-transit-poster.jpg'
];

for (const file of mediaFiles) {
  const src = path.join(outDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(rootDir, file));
    fs.copyFileSync(src, path.join(publicVideos, file));
    fs.copyFileSync(src, path.join(artifactDir, file));
    const stat = fs.statSync(src);
    console.log(`✓ Deployed ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.error(`✗ Source missing: ${src}`);
  }
}

const srtFiles = ['explore-pune-metro-transit-en.srt', 'explore-pune-metro-transit-mr.srt'];
for (const srt of srtFiles) {
  const src = path.join(rootDir, srt);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicVideos, srt));
    fs.copyFileSync(src, path.join(artifactDir, srt));
    console.log(`✓ Deployed ${srt}`);
  }
}

const playerPath = path.join(rootDir, 'play-metro-transit.html');
if (fs.existsSync(playerPath)) {
  fs.copyFileSync(playerPath, path.join(artifactDir, 'play-metro-transit.html'));
  console.log(`✓ Deployed play-metro-transit.html`);
}
