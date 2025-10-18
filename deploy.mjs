import { copyFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load configuration
const configPath = resolve(__dirname, 'deploy.config.json');
if (!existsSync(configPath)) {
    console.error('❌ deploy.config.json not found!');
    console.log('Create deploy.config.json with your vault path:');
    console.log(JSON.stringify({
        vaultPath: "C:/Path/To/Your/Vault/.obsidian/plugins/future-dates-cjw",
        pluginId: "future-dates-cjw",
        filesToCopy: ["main.js", "manifest.json", "styles.css"]
    }, null, 2));
    process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const { vaultPath, filesToCopy } = config;

// Ensure target directory exists
try {
    mkdirSync(vaultPath, { recursive: true });
    console.log(`📁 Ensured directory exists: ${vaultPath}`);
} catch (err) {
    console.error(`❌ Failed to create directory: ${err.message}`);
    process.exit(1);
}

// Copy files
let successCount = 0;
let failCount = 0;

console.log('\n🚀 Deploying plugin files...\n');

for (const file of filesToCopy) {
    const sourcePath = resolve(__dirname, file);
    const targetPath = resolve(vaultPath, file);

    try {
        if (!existsSync(sourcePath)) {
            console.log(`⚠️  ${file} - Source not found, skipping`);
            continue;
        }

        copyFileSync(sourcePath, targetPath);
        console.log(`✅ ${file} - Copied successfully`);
        successCount++;
    } catch (err) {
        console.error(`❌ ${file} - Failed: ${err.message}`);
        failCount++;
    }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Success: ${successCount} files`);
if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} files`);
}
console.log('='.repeat(50));

if (successCount > 0) {
    console.log('\n💡 Reload Obsidian or refresh plugins to see changes');
}

process.exit(failCount > 0 ? 1 : 0);
