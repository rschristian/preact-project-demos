// This is a dead-simple "build" script that just copies files
// from src/ to dist/ and strips out `preact/debug` which you probably
// don't want in production.
import { promises as fs } from 'node:fs';
import path from 'node:path';

(async function build() {
    const srcDir = path.resolve('src');
    const distDir = path.resolve('dist');

    try {
        await fs.rm(distDir, { recursive: true });
    } catch {}
    await fs.cp(srcDir, distDir, { recursive: true });

    const htmlPath = path.resolve(distDir, 'index.html');
    const html = await fs.readFile(htmlPath, 'utf8');
    await fs.writeFile(htmlPath, html.replace(/\s+import 'preact\/debug';/, ''));
})();
