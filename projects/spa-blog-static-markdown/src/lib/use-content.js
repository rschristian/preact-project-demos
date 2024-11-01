const cache = new Map();

/**
 * @param {string} slug
 * @returns {Promise<void>}
 */
export const prefetchContent = (slug) => _prefetch(slug, fetchWrapper);

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
    let data = cache.get(url);
    if (!data) {
        data = cb(url);
        cache.set(url, data);
        data.then(
            (res) => (data.res = res),
            (err) => (data.err = err),
        );
    }

    if (data.res) return data.res;
    if (data.err) {
        console.error(data.err);
        throw data.err;
    }
    throw data;
}

/**
 * @param {string} url
 * @returns {Promise<void>}
 */
async function _prefetch(url, cb) {
    if (cache.has(url)) return;

    const data = cb(url);
    cache.set(url, data);
    data.then(
        (res) => (data.res = res),
        (err) => (data.err = err),
    );
}
