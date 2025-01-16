# Buildless Spreadsheet

<h2 align="center">
  <img height="256" width="256" src="./src/assets/preact.svg">
</h2>

Example for a tiny buildless Preact app. Taken largely from Surma's blog post ["My approach to coding interviews: Optimize for iteration"](https://surma.dev/things/spreadsheet/) with a few modifications as I worked through it myself. It's a great post and I recommend giving it a read.

As we don't have a real build step, all that's needed to run this is a simple static file server to provide our HTML, CSS, and JS files to the browser.

~27kb of client side JS.

## Getting Started

-   `npm run serve:dev` - Starts a dev server at http://localhost:3000/

-   `npm run build` - Not really a build step, just copies `src/` to `dist/` and strips out a `preact/debug` import

-   `npm run serve:prod` - Starts a server at http://localhost:3000/ to test production "build" locally

## Key Ideas

-   **Import Maps**

    -   Import maps are a newer feature in browsers and are a great tool in avoiding a build step. They allow us to map module specifiers like `preact` to a URL that the browser understands like `https://esm.sh/preact`. While many do prefer the aesthetics import maps can provide in their modules, there are also some objective advantages to the centralization of dependency management such as easier versioning, reduced/removed duplication, and better access to more powerful CDN features.
    -   We do generally recommend using import maps for those choosing to forgo build tooling as they work around some issues you may encounter using bare CDN URLs with Preact.

-   **devDependencies**
    -   Very minor, but I feel like it's worth mentioning: whilst our `package.json` has `preact`, `htm`, and `@preact/signals` listed as dependencies, we don't actually make use of them in the browser. We install them in the project solely for TS support in our editor as TS lacks the ability to ergonomically provide types in any other way. It's a bit silly, and you'll need to ensure your versions in your `package.json` match the ones in your import map, but it works well enough.

## Tools of Note

Some tools worth mentioning that support this workflow:

-   [`esm.sh`](https://esm.sh) - Brilliant, ESM-focused CDN that's a bit more flexible & powerful than some alternatives
-   [`htm`](https://npm.im/htm) - JSX-like syntax that doesn't require a build step
-   [`sirv-cli`](https://npm.im/sirv-cli) - Super simple static file server

Please feel free to open an issue if there are any questions!

## License

The concept & some of the code is adopted from Surma's blog post ["My approach to coding interviews: Optimize for iteration"](https://surma.dev/things/spreadsheet/), the license for which can be found here: [MIT](https://github.com/surma/surma.dev/blob/master/LICENSE.md)

[MIT](../../LICENSE)
