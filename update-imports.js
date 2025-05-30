#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

// Configuration
const CONFIG = {
  rootDir: path.resolve(__dirname),
  srcDir: path.resolve(__dirname, 'src'),
  excludeDirs: ['node_modules', 'dist', 'build', 'coverage'],
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  aliasMap: {
    '@': 'src',
    '@components': 'src/components',
    '@pages': 'src/pages',
    '@hooks': 'src/hooks',
    '@services': 'src/services',
    '@store': 'src/store',
    '@utils': 'src/utils',
    '@types': 'src/types',
    '@assets': 'src/assets',
    '@styles': 'src/styles',
    '@config': 'src/config',
    '@constants': 'src/constants',
    '@features': 'src/features',
    '@layouts': 'src/layouts',
    '@theme': 'src/theme',
  }
};

// Utility Functions
const isExcluded = (filePath) => {
  return CONFIG.excludeDirs.some(dir => filePath.includes(dir));
};

const getRelativePath = (from, to) => {
  let relativePath = path.relative(path.dirname(from), to);
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  return relativePath.replace(/\\/g, '/');
};

const findAliasMatch = (importPath) => {
  for (const [alias, dir] of Object.entries(CONFIG.aliasMap)) {
    if (importPath.startsWith(alias)) {
      return { alias, dir };
    }
  }
  return null;
};

// Import Processing Functions
const processImportPath = (filePath, importPath) => {
  const aliasMatch = findAliasMatch(importPath);
  if (!aliasMatch) return importPath;

  const { alias, dir } = aliasMatch;
  const importWithoutAlias = importPath.slice(alias.length + 1);
  const absolutePath = path.join(CONFIG.rootDir, dir, importWithoutAlias);
  return getRelativePath(filePath, absolutePath);
};

const shouldUpdateImport = (importPath) => {
  return importPath.startsWith('.') || findAliasMatch(importPath);
};

// File Processing Functions
async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    let isModified = false;

    // Parse the file
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    // Track imports for sorting
    const imports = new Map();

    // First pass: collect and normalize imports
    traverse(ast, {
      ImportDeclaration(path) {
        const importPath = path.node.source.value;
        if (shouldUpdateImport(importPath)) {
          const normalizedPath = processImportPath(filePath, importPath);
          if (normalizedPath !== importPath) {
            path.node.source.value = normalizedPath;
            isModified = true;
          }
        }
        imports.set(path.node, importPath);
      }
    });

    // Sort imports
    if (imports.size > 0) {
      const sortedImports = Array.from(imports.entries()).sort((a, b) => {
        const [nodeA, pathA] = a;
        const [nodeB, pathB] = b;
        
        // Custom sorting logic
        const getImportType = (p) => {
          if (p.startsWith('@')) return 0; // Alias imports first
          if (p.startsWith('.')) return 1; // Relative imports second
          return 2; // Third-party imports last
        };

        const typeA = getImportType(pathA);
        const typeB = getImportType(pathB);

        if (typeA !== typeB) return typeA - typeB;
        return pathA.localeCompare(pathB);
      });

      // Update import order if needed
      const firstImport = ast.program.body.find(node => t.isImportDeclaration(node));
      if (firstImport) {
        const importNodes = ast.program.body.filter(node => t.isImportDeclaration(node));
        const otherNodes = ast.program.body.filter(node => !t.isImportDeclaration(node));

        if (JSON.stringify(importNodes) !== JSON.stringify(sortedImports.map(([node]) => node))) {
          ast.program.body = [...sortedImports.map(([node]) => node), ...otherNodes];
          isModified = true;
        }
      }
    }

    // Generate modified code if needed
    if (isModified) {
      const output = generate(ast, {
        retainLines: true,
        retainFunctionParens: true,
        jsescOption: {
          minimal: true,
        },
      });

      await fs.writeFile(filePath, output.code);
      console.log(`✓ Updated imports in ${path.relative(CONFIG.rootDir, filePath)}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`✗ Error processing ${path.relative(CONFIG.rootDir, filePath)}:`, error.message);
    return false;
  }
}

// Main execution
async function main() {
  try {
    console.log('🔍 Scanning for files...');

    const files = glob.sync(`**/*{${CONFIG.extensions.join(',')}}`, {
      cwd: CONFIG.srcDir,
      ignore: CONFIG.excludeDirs.map(dir => `**/${dir}/**`),
      absolute: true,
    });

    console.log(`📦 Found ${files.length} files to process`);

    let updated = 0;
    let errors = 0;

    for (const file of files) {
      try {
        const wasUpdated = await processFile(file);
        if (wasUpdated) updated++;
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
        errors++;
      }
    }

    console.log('\nSummary:');
    console.log(`✓ Updated ${updated} files`);
    if (errors > 0) {
      console.log(`✗ Encountered errors in ${errors} files`);
    }
    console.log('✨ Import update complete!');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Add to package.json scripts
const updatePackageJson = async () => {
  const packageJsonPath = path.join(CONFIG.rootDir, 'package.json');
  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    if (!packageJson.scripts) packageJson.scripts = {};
    
    packageJson.scripts['update-imports'] = 'node update-imports.js';
    
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✓ Added update-imports script to package.json');
  } catch (error) {
    console.error('Error updating package.json:', error);
  }
};

// Run the script
if (require.main === module) {
  updatePackageJson().then(() => main());
}
