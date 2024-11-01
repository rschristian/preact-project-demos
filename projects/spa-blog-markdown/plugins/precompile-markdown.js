import yaml from 'yaml';
import { marked } from 'marked';
import { parse } from 'node-html-parser';
import { codeToHtml } from 'shiki';

/**
 * Precompile markdown files into JSON for the client to consume.
 * First it parses out frontmatter metadata, then converts markdown to HTML,
 * and finally highlights code blocks.
 *
 * @param {string} content
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function precompileMarkdown(content, path) {
    const parsed = parseContent(content.toString(), path);
    const htmlified = await markdownToHTML(parsed);
    const result = await highlightCodeBlocks(htmlified);

    // client only needs `.html` and `.meta` fields,
    // original markdown content can be discarded
    delete result.content;

    return JSON.stringify(result);
}

/**
 * Parse Markdown with YAML FrontMatter into a data structure that can be reasoned about:
 *
 * @param {string} content
 * @param {string} path
 * @returns {{ content: string, meta: Record<string, string> }}
 */
function parseContent(content, path) {
    // Find YAML FrontMatter preceeding a markdown document
    const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

    const matches = content.match(FRONT_MATTER_REG);
    /** @type {Record<string, string>} */
    let meta = {};
    if (matches) {
        try {
            meta = yaml.parse('---\n' + matches[1].replace(/^/gm, '  ') + '\n');
        } catch (e) {
            throw new Error(`Error parsing YAML FrontMatter in ${path}`);
        }
        content = content.replace(FRONT_MATTER_REG, '');
    }

    return {
        content,
        meta,
    };
}

/**
 * Convert markdown to HTML
 *
 * @param {{ content: string }} data
 * @returns {Promise<{ html: string, content: string }>}
 */
async function markdownToHTML(data) {
    marked.use({
        renderer: {
            // Blanket lazy loading is preferable for our examples here
            image({ href, text }) {
                return `<img loading="lazy" src="${href}" alt="${text}">`;
            },
        },
    });
    data.html = await marked(data.content);
    return data;
}

/**
 * Highlight code blocks in markdown
 *
 * @param {{ html: string; content: string; }} data
 */
async function highlightCodeBlocks(data) {
    const post = parse(data.html, { blockTextElements: { code: true } });

    const codeBlocks = post.querySelectorAll('pre:has(> code[class])');
    for (const block of codeBlocks) {
        const child = block.childNodes[0];

        const code = unescapeHTML(child.innerText);
        const lang = child.getAttribute('class').replace('language-', '');
        const html = await codeToHtml(code, { lang, theme: 'github-dark' });
        block.replaceWith(html);
    }

    data.html = post.toString();
    return data;
}

/**
 * Marked escapes HTML entities, which is normally great,
 * but we want to feed the raw code into Shiki for highlighting.
 *
 * @param {string} str
 * @returns {string}
 */
function unescapeHTML(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}
