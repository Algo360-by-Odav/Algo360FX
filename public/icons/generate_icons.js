import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, 'icon.svg');
const outputDir = __dirname;

async function generateIcons() {
  try {
    console.log('Generating icons from:', inputFile);
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Generate icons for each size
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputFile);
      
      console.log(`Generated ${size}x${size} icon:`, outputFile);
    }

    // Generate favicon.png (we'll use the 32x32 size)
    const faviconOutput = path.join(outputDir, '..', 'favicon.png');
    await sharp(inputFile)
      .resize(32, 32)
      .png()
      .toFile(faviconOutput);
    
    console.log('Generated favicon:', faviconOutput);
    console.log('Icon generation complete!');

  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
