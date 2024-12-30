import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function updateImports(filePath) {
  const content = readFileSync(filePath, 'utf8');
  
  // Update relative imports to use aliases
  let updatedContent = content
    .replace(/from ['"]\.\.\/components\/trading\//g, 'from \'@components/Trading/')
    .replace(/from ['"]\.\.\/components\//g, 'from \'@components/')
    .replace(/from ['"]\.\.\/hooks\//g, 'from \'@/hooks/')
    .replace(/from ['"]\.\.\/utils\//g, 'from \'@/utils/')
    .replace(/from ['"]\.\.\/services\//g, 'from \'@/services/')
    .replace(/from ['"]\.\.\/stores\//g, 'from \'@/stores/')
    .replace(/from ['"]\.\.\/types\//g, 'from \'@/types/');

  writeFileSync(filePath, updatedContent);
}

function walkDir(dir) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      console.log(`Updating imports in ${filePath}`);
      updateImports(filePath);
    }
  });
}

// Update all files in src directory
walkDir(join(__dirname, 'src'));
