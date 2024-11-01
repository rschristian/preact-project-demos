import { useRoute } from 'preact-iso';
import Markup from 'preact-markup';

import { useContent } from '../../lib/use-content.js';
import { useTitle, useDescription } from '../../lib/utils.js';

import './style.css';

export default function BlogPost() {
    const { params } = useRoute();
    const { html, meta } = useContent(`/content/posts/${params.slug}.json`);

    useTitle(meta.title);
    useDescription(meta.excerpt);

    return (
        <article class="blog-post">
            <time datetime={meta.date}>{new Date(meta.date).toLocaleDateString()}</time>
            <Markup
                markup={html}
                type="html"
                trim={false}
                components={{ buttoncontainer: ButtonContainer }}
            />
        </article>
    );
}

/**
 * Silly example, but shows how you can use a Preact component
 * in your markdown content.
 */
function ButtonContainer({ color }) {
    return (
        <div class="button-container">
            <a href="#top" style={{ background: color }}>
                Scroll to Top
            </a>
            <a href="/" style={{ background: color }}>
                Back to Home
            </a>
        </div>
    );
}
