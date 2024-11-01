import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Entirely optional, generates a manifest of blog posts for the client to consume.
 * You could easily just maintain this manually & check it into source control too.
 *
 * Probably could do with some caching, to avoid reading the file system on every request.
 */
export function blogManifest() {
    return {
        name: 'blog-manifest-plugin',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url !== '/content/blog-manifest.json') return next();

                const postsMeta = [];
                const blogPostsDir = path.resolve('./content/posts');

                const files = await fs.readdir(blogPostsDir);
                await Promise.all(
                    Array(5)
                        .fill(files.values())
                        .map(async (files) => {
                            for (const file of files) {
                                const url = new URL(
                                    `/content/posts/${file.replace('.md', '.json')}`,
                                    req.headers.referer,
                                );
                                const res = await fetch(url);
                                const { meta } = await res.json();

                                postsMeta.push(meta);
                            }
                        }),
                );

                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(postsMeta, null, 4));
            });
        },
        async generateBundle() {
            const postsMeta = [];
            const blogPostsDir = path.resolve('./dist/content/posts');

            const files = await fs.readdir(blogPostsDir);
            await Promise.all(
                Array(5)
                    .fill(files.values())
                    .map(async (files) => {
                        for (const file of files) {
                            const content = await fs.readFile(
                                path.join(blogPostsDir, file),
                                'utf-8',
                            );
                            const { meta } = JSON.parse(content);

                            postsMeta.push(meta);
                        }
                    }),
            );

            await fs.writeFile(
                './dist/content/blog-manifest.json',
                JSON.stringify(postsMeta, null, 4),
            );
        },
    };
}
