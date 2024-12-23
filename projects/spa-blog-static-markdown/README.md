# SPA Blog with Precompiled Markdown

<h2 align="center">
  <img height="256" width="256" src="./public/preact.svg">
</h2>

Template for a blog site that uses precompiled & static markdown files for content. The site is then prerendered at build so you get all the lovely benefits of SSR'd content.

~10kb of client side JS.

## Getting Started

-   `npm run serve:dev` - Starts a dev server at http://localhost:3000/

-   `npm run build` - Builds for production, emitting to `dist/`. Prerenders all found routes in app to static HTML

-   `npm run serve:prod` - Starts a server at http://localhost:3000/ to test production build locally

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
