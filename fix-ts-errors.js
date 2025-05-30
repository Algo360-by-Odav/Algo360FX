// fix-ts-errors.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix the comma issue in advancedTradingPageJs.js
const advancedTradingPath = path.join(__dirname, 'client', 'src', 'pages', 'advancedTradingPageJs.js');
let content = fs.readFileSync(advancedTradingPath, 'utf8');

// Replace the function definition ending with a semicolon to use a comma
content = content.replace(/\s+\}\;\s+\/\/\s+Main\s+render/g, '},\n\n  // Main render');

// Write the fixed content back
fs.writeFileSync(advancedTradingPath, content, 'utf8');

console.log('Successfully fixed TypeScript errors in advancedTradingPageJs.js');

// Check for apostrophes in string literals that might cause errors
const communityForumPath = path.join(__dirname, 'client', 'src', 'components', 'signal-provider', 'CommunityForum.tsx');
let communityContent = fs.readFileSync(communityForumPath, 'utf8');

// Replace problematic apostrophes in strings
communityContent = communityContent.replace(/content: '([^']*)you've([^']*)'/g, "content: \"$1you've$2\"");

// Write the fixed content back
fs.writeFileSync(communityForumPath, communityContent, 'utf8');

// Fix ProviderProfile.tsx
const providerProfilePath = path.join(__dirname, 'client', 'src', 'components', 'signal-provider', 'ProviderProfile.tsx');
let providerContent = fs.readFileSync(providerProfilePath, 'utf8');

// Replace problematic apostrophes in strings
providerContent = providerContent.replace(/comment: '([^']*)I've([^']*)'/g, "comment: \"$1I've$2\"");

// Write the fixed content back
fs.writeFileSync(providerProfilePath, providerContent, 'utf8');

console.log('Successfully fixed TypeScript errors in all files');
