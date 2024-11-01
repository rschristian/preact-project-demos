import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'node:path';

import { precompileMarkdown } from './plugins/precompile-markdown.js';
import { blogManifest } from './plugins/blog-manifest-plugin.js';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        preact({
            prerender: {
                enabled: true,
                renderTarget: '#app',
                additionalPrerenderRoutes: ['/404'],
                previewMiddlewareEnabled: true,
                previewMiddlewareFallback: '/404',
            },
        }),
        viteStaticCopy({
            targets: [
                {
                    src: './content/**/*.md',
                    dest: './',
                    rename: (_name, _fileExtension, fullPath) =>
                        path.basename(fullPath).replace('.md', '.json'),
                    transform: precompileMarkdown,
                },
            ],
            structured: true,
            watch: {
                reloadPageOnChange: true,
            },
        }),
        blogManifest(),
    ],
});
