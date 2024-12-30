const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [72, 192, 512];
const baseIcon = path.join(__dirname, 'icon-base.png');
const outputDir = __dirname;

async function generateIcons() {
  try {
    for (const size of sizes) {
      await sharp(baseIcon)
        .resize(size, size)
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      console.log(`Generated ${size}x${size} icon`);
    }
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}
