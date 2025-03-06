# SPA Blog with Precompiled Markdown

<h2 align="center">
  <img height="256" width="256" src="./public/preact.svg">
</h2>

Template for a blog site that uses precompiled & static markdown files for content. The site is then prerendered at build so you get all the lovely benefits of SSR'd content.

~10kb of client side JS.

## Getting Started

- `npm run serve:dev` - Starts a dev server at http://localhost:3000/

- `npm run build` - Builds for production, emitting to `dist/`. Prerenders all found routes in app to static HTML

- `npm run serve:prod` - Starts a server at http://localhost:3000/ to test production build locally

## Key Ideas

- **Precompiled Markdown**
  - Markdown is a lovely authoring format but unfortunately it's not web-native. We need to compile our markdown into HTML and the libraries to facilitate this aren't tiny -- `yaml` for frontmatter & `marked` for parsing the markdown into HTML results in ~43kb of JS which is _a lot_. Luckily for us, however, this can be completely avoided. Instead of parsing & converting on the client, we can do this ahead of time on our build server where the cost is minimal & unlikely to be an issue. We precompile our markdown into JSON objects containing the metadata for our posts as well as the corresponding HTML content which will be used during prerendering & by the client via `fetch()` calls.

- **Suspense-based Data Fetching**
  - This project utilizes suspense for data fetching which may be an unfamiliar pattern for most developers; while the React team still actively discourages users interfacing with Suspense directly for data fetching, it's a pattern some Preact users have been happily using over the last few years to great benefit. The internal details aren't set in stone (in Preact or React), and there's a couple of known issues, but we (the Preact team) consider it stable enough to use in production if you wish.
  - The general idea is that our fetch mechanism will throw a promise and Preact will wait for it to resolve before continuing to render the component. This subjectively provides better ergonomics compared to a more typical `useEffect`-based approach. `preact-iso`'s `Router` acts as an implicit (and somewhat hidden) suspense boundary, catching the promises thrown by the data fetcher. You absolutely could use `<Suspense>` yourself from `preact/compat` but this method saves a bit of bundle size and it's unlikely you'd want a page-level spinner or the like.

- **Prerendering**
  - When done right, prerendering is a pain-free addition to a typical SPA that improves the user experience greatly. Facilitated by `@preact/preset-vite`, prerendering generates HTML for every page in our app at build time, ensuring the user gets a full page of content right off the bat -- no need to wait for JS to download, parse, and render.
  - Our implementation in preset-vite tries to be as additive as possible, taking your existing, normal SPA and prerendering it without requiring sweeping changes to your app. One little trick is that it's async-aware and patches `fetch()` during the prerendering process to read off the file system via `fs.readFile(...)` -- this is what allows us to have isomorphic (same API on the client & the server) data fetching in our app.

## Plugins

We use a couple plugins to facilitate the behavior we're after:

- [`vite-plugin-static-copy`](https://npm.im/vite-plugin-static-copy)
  - Copies our markdown files to `./dist` (or keeps them in-memory in dev) and runs our transformer which converts markdown content to a JSON object containing the metadata & HTML content.
- [`@preact/preset-vite`](https://npm.im/@preact/preset-vite)
  - Obviously provides Preact support, but also facilitates the prerendering

- `blog-manifest-plugin`
  - Written for this repo, it simply generates a manifest JSON file containing the metadata for all of our blog posts. This helps avoid the need to manually create & maintain such a file. It's a simple plugin but completely optional, you can do away with it if you please.

## Libraries

Some libraries of note in the process:

- [`marked`](https://npm.im/marked) - For parsing markdown content
- [`shiki`](https://npm.im/shiki) - For syntax highlighting markdown code blocks

Please feel free to open an issue if there are any questions!

## License

[MIT](../../LICENSE)
