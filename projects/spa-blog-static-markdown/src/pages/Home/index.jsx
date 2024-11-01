import { useBlogManifest, prefetchContent } from '../../lib/use-content.js';
import { useTitle } from '../../lib/utils.js';

import './style.css';

export default function Home() {
    const blogPosts = useBlogManifest();

    useTitle('Home');

    return (
        <div class="home">
            <a href="https://preactjs.com" target="_blank">
                <img src="/preact.svg" alt="Preact logo" height="160" width="160" />
            </a>
            <h1>Example Blog Site Using Preact</h1>
            <section>
                {blogPosts
                    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
                    .map((post) => (
                        <BlogPost
                            key={post.slug}
                            slug={post.slug}
                            title={post.title}
                            excerpt={post.excerpt}
                            date={post.date}
                        />
                    ))}
            </section>
        </div>
    );
}

/**
 * @param {{ slug: string, title: string, excerpt: string, date: string }} props
 */
function BlogPost(props) {
    return (
        <a
            href={`/blog/${props.slug}`}
            onMouseOver={() => prefetchContent(`/content/posts/${props.slug}.json`)}
            class="resource"
        >
            <time datetime={props.date}>{new Date(props.date).toLocaleDateString()}</time>
            <h2>{props.title}</h2>
            <p>{props.excerpt}</p>
        </a>
    );
}
