import { useState } from 'preact/hooks';

const CACHE = new Map();

/**
 * @param {string} slug
 */
export function prefetchContent(slug) {
    if (CACHE.has(slug)) return;
    setupCacheEntry(fetchWrapper, slug);
}

/**
 * @param {string} slug
 * @returns {{ html: string, meta: any }}
 */
export const useContent = (slug) => useResource(slug, fetchWrapper);

/**
 * This is a pretty silly example! In a real app, you'd likely
 * have a generic `useFetch` of some description, perhaps with
 * a different wrapper to the content fetch, but here we only
 * need a single file so a generic interface would be waste.
 *
 * @returns {{ slug: string; title: string; excerpt: string; date: string; }[]}
 */
export const useBlogManifest = () => useResource('/content/blog-manifest.json', fetchWrapper);

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
async function fetchWrapper(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}!\n${res.statusText}`);
    return await res.json();
}

/**
 * @param {string} url
 * @param {(url: string) => Promise<any>} cb
 */
function useResource(url, cb) {
    const update = useState({})[1];

    let data = CACHE.get(url);
    if (!data) data = setupCacheEntry(cb, url, update);

    if (data.res) return data.res;
    if (data.err) {
        console.error(data.err);
        throw data.err;
    }
    throw data;
}

/**
 * @param {(url: string) => Promise<any>} fn
 * @param {string} cacheKey
 * @param {(state: any) => void} [update]
 * @returns {Promise<any> | { res?: any, err?: any }}
 */
function setupCacheEntry(fn, cacheKey, update) {
    const data = fn(cacheKey);

    CACHE.set(cacheKey, data);
    data.then(
        (res) => (data.res = res),
        (err) => (data.err = err),
    ).finally(() => update && update(data));

    return data;
}
