import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to recursively find all TypeScript files
function findTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('dist')) {
      findTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to fix unused variables by prefixing with _
async function fixUnusedVariables(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const unusedVarRegex = /(?:is defined but never used|is assigned a value but never used)\. Allowed unused (?:vars|args) must match/;
  
  try {
    const { ESLint } = await import('eslint');
    const eslint = new ESLint();
    const results = await eslint.lintFiles(filePath);
    
    if (results[0]) {
      const messages = results[0].messages
        .filter(msg => unusedVarRegex.test(msg.message))
        .sort((a, b) => b.line - a.line || b.column - a.column); // Sort in reverse order
      
      messages.forEach(msg => {
        const lines = content.split('\n');
        const line = lines[msg.line - 1];
        const varName = msg.message.split("'")[1];
        
        if (varName && !varName.startsWith('_')) {
          // Replace the variable name with _varName, being careful with word boundaries
          const newLine = line.replace(new RegExp(`\\b${varName}\\b`), `_${varName}`);
          lines[msg.line - 1] = newLine;
          content = lines.join('\n');
        }
      });
      
      fs.writeFileSync(filePath, content);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Main execution
const rootDir = process.cwd();
const tsFiles = findTypeScriptFiles(rootDir);

console.log(`Found ${tsFiles.length} TypeScript files to process`);

(async () => {
  for (let i = 0; i < tsFiles.length; i++) {
    const file = tsFiles[i];
    console.log(`Processing file ${i + 1}/${tsFiles.length}: ${file}`);
    await fixUnusedVariables(file);
  }
  console.log('Finished processing files');
})();
