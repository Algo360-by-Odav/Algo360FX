#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const config = {
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
  ignoreDirs: ['node_modules', 'dist', 'build', 'coverage'],
  importAliases: {
    '@app': './src',
    '@api': './src/api',
    '@components': './src/components',
    '@config': './src/config',
    '@constants': './src/constants',
    '@controllers': './src/controllers',
    '@db': './src/db',
    '@models': './src/models',
    '@routes': './src/routes',
    '@services': './src/services',
    '@utils': './src/utils',
    '@types': './src/types',
    '@hooks': './src/hooks',
    '@store': './src/store',
    '@assets': './src/assets',
    '@styles': './src/styles',
  },
};

// Regular expressions for matching imports
const importRegex = /^import\s+(?:(?:\{[^}]*\}|\*\s+as\s+[^,]+|\w+)\s*,?\s*)*\s*from\s+['"]([^'"]+)['"]/gm;
const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;

/**
 * Get all files to process
 * @returns {Promise<string[]>} Array of file paths
 */
async function getFiles() {
  const pattern = `**/*{${config.extensions.join(',')}}`;
  const ignore = config.ignoreDirs.map(dir => `**/${dir}/**`);
  
  return glob(pattern, {
    ignore,
    absolute: true,
    nodir: true,
    cwd: resolve(__dirname),
  });
}

/**
 * Fix import path based on aliases
 * @param {string} importPath - Original import path
 * @returns {string} Fixed import path
 */
function fixImportPath(importPath) {
  for (const [alias, path] of Object.entries(config.importAliases)) {
    if (importPath.startsWith(alias)) {
      return importPath.replace(alias, path);
    }
  }
  return importPath;
}

/**
 * Process a single file
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} True if file was modified
 */
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let modified = false;
    let newContent = content;

    // Fix regular imports
    newContent = newContent.replace(importRegex, (match, importPath) => {
      const fixedPath = fixImportPath(importPath);
      if (fixedPath !== importPath) {
        modified = true;
        return match.replace(importPath, fixedPath);
      }
      return match;
    });

    // Fix dynamic imports
    newContent = newContent.replace(dynamicImportRegex, (match, importPath) => {
      const fixedPath = fixImportPath(importPath);
      if (fixedPath !== importPath) {
        modified = true;
        return match.replace(importPath, fixedPath);
      }
      return match;
    });

    if (modified) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(chalk.green(`✓ Fixed imports in ${chalk.bold(filePath)}`));
      return true;
    }

    return false;
  } catch (error) {
    console.error(chalk.red(`✗ Error processing ${chalk.bold(filePath)}`), error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log(chalk.blue('🔍 Scanning for files...'));
    const files = await getFiles();
    console.log(chalk.blue(`Found ${chalk.bold(files.length)} files to process`));

    let modifiedCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        const wasModified = await processFile(file);
        if (wasModified) modifiedCount++;
      } catch (error) {
        errorCount++;
        console.error(chalk.red(`Error processing ${chalk.bold(file)}`), error);
      }
    }

    console.log('\nSummary:');
    console.log(chalk.blue(`Total files processed: ${chalk.bold(files.length)}`));
    console.log(chalk.green(`Files modified: ${chalk.bold(modifiedCount)}`));
    
    if (errorCount > 0) {
      console.log(chalk.red(`Errors encountered: ${chalk.bold(errorCount)}`));
      process.exit(1);
    }

    console.log(chalk.green('\n✨ Import paths fixed successfully!'));
  } catch (error) {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});
