import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourceLogoPath = path.join(rootDir, 'public', 'assets', 'explore-pune-logo.png');

if (!fs.existsSync(sourceLogoPath)) {
  console.error('Source logo not found at:', sourceLogoPath);
  process.exit(1);
}

async function buildIco(sizes, outputPath) {
  const pngBuffers = [];
  for (const s of sizes) {
    const buf = await sharp(sourceLogoPath)
      .resize(s, s, { kernel: 'lanczos3' })
      .png()
      .toBuffer();
    pngBuffers.push({ size: s, buffer: buf });
  }

  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let currentOffset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size, 0); // width
    entry.writeUInt8(item.size, 1); // height
    entry.writeUInt8(0, 2); // color count (0 for >=8bpp)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(currentOffset, 12); // offset of image data
    dirEntries.push(entry);
    currentOffset += item.buffer.length;
  }

  const icoBuf = Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
  fs.writeFileSync(outputPath, icoBuf);
  console.log(`Generated ICO at ${outputPath} (${icoBuf.length} bytes, ${count} resolutions: ${sizes.join(', ')})`);
}

async function generateAll() {
  console.log('Generating Google Search compliant logo and favicon assets from official source...');

  // 1. Google Search Favicon Guidelines: Multiple of 48px square (48, 96, 144, 192, 512)
  const pngTargets = [
    { size: 48, dest: path.join(rootDir, 'public', 'favicon-48x48.png') },
    { size: 96, dest: path.join(rootDir, 'public', 'favicon-96x96.png') },
    { size: 144, dest: path.join(rootDir, 'public', 'favicon-144x144.png') },
    { size: 192, dest: path.join(rootDir, 'public', 'favicon-192x192.png') },
    { size: 512, dest: path.join(rootDir, 'public', 'favicon-512x512.png') },
    { size: 180, dest: path.join(rootDir, 'public', 'apple-touch-icon.png') },
    { size: 180, dest: path.join(rootDir, 'public', 'apple-icon.png') },
    { size: 180, dest: path.join(rootDir, 'app', 'apple-icon.png') },
    { size: 512, dest: path.join(rootDir, 'public', 'icon.png') },
    { size: 512, dest: path.join(rootDir, 'app', 'icon.png') },
  ];

  for (const target of pngTargets) {
    await sharp(sourceLogoPath)
      .resize(target.size, target.size, { kernel: 'lanczos3' })
      .png({ compressionLevel: 9 })
      .toFile(target.dest);
    const sz = fs.statSync(target.dest).size;
    console.log(`Generated ${path.relative(rootDir, target.dest)} (${target.size}x${target.size}, ${sz} bytes)`);
  }

  // 2. Multi-resolution ICOs (48x48, 32x32, 16x16) for public/favicon.ico and app/favicon.ico
  await buildIco([48, 32, 16], path.join(rootDir, 'public', 'favicon.ico'));
  await buildIco([48, 32, 16], path.join(rootDir, 'app', 'favicon.ico'));

  console.log('All Google Search favicon and logo assets successfully generated!');
}

generateAll().catch((err) => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
