import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Header } from './components/Header.jsx';
import Home from './pages/Home/index.jsx';
import BlogPost from './pages/BlogPost/index.jsx';
import NotFound from './pages/_404.jsx';

import './style.css';

export function App() {
    return (
        <LocationProvider>
            <Header />
            <main>
                <Router>
                    <Route path="/" component={Home} />
                    <Route path="/blog/:slug" component={BlogPost} />
                    <Route default component={NotFound} />
                </Router>
            </main>
        </LocationProvider>
    );
}

if (typeof window !== 'undefined') {
    hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
    const res = await ssr(<App {...data} />);
    const headElements = new Set([
        { type: 'meta', props: { name: 'description', content: globalThis.description } },
        {
            type: 'meta',
            props: { property: 'og:url', content: `https://my-blog${location.pathname}` },
        },
        { type: 'meta', props: { property: 'og:title', content: globalThis.title } },
        { type: 'meta', props: { property: 'og:description', content: globalThis.description } },
    ]);

    return {
        ...res,
        head: {
            lang: 'en',
            title: globalThis.title,
            elements: headElements,
        },
    };
}
