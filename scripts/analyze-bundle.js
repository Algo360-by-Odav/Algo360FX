import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '..', 'dist');

async function analyzeBundle() {
  console.log('Analyzing bundle size...\n');
  
  const assets = await fs.readdir(path.join(DIST_DIR, 'assets'));
  const bundles = {};
  let totalSize = 0;
  
  // Group bundles by type
  for (const file of assets) {
    if (file.endsWith('.map')) continue;
    
    const filePath = path.join(DIST_DIR, 'assets', file);
    const stats = await fs.stat(filePath);
    const size = stats.size;
    totalSize += size;
    
    const type = path.extname(file).slice(1);
    const category = file.split('-')[0];
    
    if (!bundles[category]) {
      bundles[category] = { size: 0, files: [] };
    }
    
    bundles[category].size += size;
    bundles[category].files.push({
      name: file,
      size,
      type
    });
  }
  
  // Print analysis
  console.log('Bundle Analysis:\n');
  
  Object.entries(bundles)
    .sort((a, b) => b[1].size - a[1].size)
    .forEach(([category, data]) => {
      console.log(`${category}:`);
      console.log(`  Total Size: ${formatSize(data.size)}`);
      console.log('  Files:');
      data.files
        .sort((a, b) => b.size - a.size)
        .forEach(file => {
          console.log(`    - ${file.name}: ${formatSize(file.size)}`);
        });
      console.log();
    });
  
  console.log(`Total Bundle Size: ${formatSize(totalSize)}`);
  
  // Suggest optimizations
  console.log('\nOptimization Suggestions:');
  
  if (bundles.vendor?.size > 500000) {
    console.log('- Large vendor bundle detected. Consider code splitting and lazy loading.');
  }
  
  if (bundles.main?.size > 200000) {
    console.log('- Main bundle is large. Consider route-based code splitting.');
  }
  
  const largeModules = Object.entries(bundles)
    .filter(([_, data]) => data.size > 100000)
    .map(([name]) => name);
  
  if (largeModules.length > 0) {
    console.log(`- Large modules detected (${largeModules.join(', ')}). Consider lazy loading.`);
  }
}

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

analyzeBundle().catch(error => {
  console.error('Analysis failed:', error);
  process.exit(1);
});
