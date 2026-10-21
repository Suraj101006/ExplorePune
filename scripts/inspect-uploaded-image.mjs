import fs from 'fs';

// Simple script to read JPEG dimensions and corner colors
// If canvas or sharp is not installed, we can check basic JPEG header or install/use jimp/canvas or write custom
const buffer = fs.readFileSync('C:/Users/Suraj/.gemini/antigravity/brain/423c92e7-93f0-43f0-b5f3-a18653c595ae/.user_uploaded/media_1792501734077_7b4ea3ff.jpg');
console.log('Buffer length:', buffer.length);

// Read JPEG SOF0 / SOF2 to get width and height
let offset = 2;
while (offset < buffer.length) {
  if (buffer[offset] === 0xff) {
    const marker = buffer[offset + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      console.log(`JPEG Dimensions: ${width} x ${height}`);
      break;
    } else {
      const len = buffer.readUInt16BE(offset + 2);
      offset += 2 + len;
    }
  } else {
    offset++;
  }
}
