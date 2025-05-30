import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { gzip } from 'zlib';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gzipAsync = promisify(gzip);

const DIST_DIR = path.join(__dirname, '..', 'dist');

async function optimizeImages() {
  const assetsDir = path.join(DIST_DIR, 'assets', 'images');
  const files = await fs.readdir(assetsDir);
  
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      const filePath = path.join(assetsDir, file);
      const stats = await fs.stat(filePath);
      
      // Skip already optimized files
      if (stats.size < 10000) continue;
      
      try {
        const image = sharp(filePath);
        const metadata = await image.metadata();
        
        // Convert to WebP with quality optimization
        if (!file.endsWith('.webp')) {
          const webpPath = filePath.replace(/\.[^.]+$/, '.webp');
          await image
            .webp({ quality: 80, effort: 6 })
            .toFile(webpPath);
          console.log(`Converted ${file} to WebP`);
        }
        
        // Create responsive sizes
        const sizes = [2048, 1024, 768, 480];
        for (const width of sizes) {
          if (metadata.width > width) {
            const resizedPath = filePath.replace(/\.([^.]+)$/, `-${width}.$1`);
            await image
              .resize(width, null, { fit: 'inside' })
              .toFile(resizedPath);
            console.log(`Created ${width}px version of ${file}`);
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }
  }
}

async function compressJsAndCss() {
  const files = await fs.readdir(path.join(DIST_DIR, 'assets'));
  
  for (const file of files) {
    if (file.match(/\.(js|css)$/i)) {
      const filePath = path.join(DIST_DIR, 'assets', file);
      try {
        const content = await fs.readFile(filePath);
        const compressed = await gzipAsync(content);
        await fs.writeFile(`${filePath}.gz`, compressed);
        console.log(`Compressed ${file}`);
      } catch (error) {
        console.error(`Error compressing ${file}:`, error);
      }
    }
  }
}

async function generatePreloadLinks() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  let indexContent = await fs.readFile(indexPath, 'utf-8');
  
  // Find critical assets
  const criticalAssets = [
    'main-BAPlT_Rm.js',
    'main-Dz4Z6cx0.css',
    'vendor-CLh-Pxkp.js',
    'mui-DV_ojX2v.js'
  ];
  
  // Generate preload tags
  const preloadTags = criticalAssets.map(asset => {
    const ext = path.extname(asset).slice(1);
    return `<link rel="preload" href="/assets/${asset}" as="${ext === 'js' ? 'script' : 'style'}" crossorigin>`;
  }).join('\n    ');
  
  // Insert preload tags
  indexContent = indexContent.replace(
    '</head>',
    `    ${preloadTags}\n  </head>`
  );
  
  await fs.writeFile(indexPath, indexContent);
  console.log('Added preload tags to index.html');
}

async function optimize() {
  console.log('Starting build optimization...');
  
  try {
    await optimizeImages();
    await compressJsAndCss();
    await generatePreloadLinks();
    
    console.log('Build optimization complete!');
  } catch (error) {
    console.error('Build optimization failed:', error);
    process.exit(1);
  }
}

optimize();
