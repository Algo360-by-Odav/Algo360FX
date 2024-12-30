const fs = require('fs');
const path = require('path');

function updateImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Update relative imports to use aliases
  let updatedContent = content
    .replace(/from ['"]\.\.\/components\/trading\//g, 'from \'@components/Trading/')
    .replace(/from ['"]\.\.\/components\//g, 'from \'@components/')
    .replace(/from ['"]\.\.\/hooks\//g, 'from \'@/hooks/')
    .replace(/from ['"]\.\.\/utils\//g, 'from \'@/utils/')
    .replace(/from ['"]\.\.\/services\//g, 'from \'@/services/')
    .replace(/from ['"]\.\.\/stores\//g, 'from \'@/stores/')
    .replace(/from ['"]\.\.\/types\//g, 'from \'@/types/');

  fs.writeFileSync(filePath, updatedContent);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      updateImports(filePath);
    }
  });
}

// Update all files in src directory
walkDir('src');
