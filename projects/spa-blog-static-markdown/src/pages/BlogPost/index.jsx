import { useRoute } from 'preact-iso';

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
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
    );
}
