import { Root, Main, Header, Footer } from '@rschristian/intrepid-design';
import { withTwind } from '@rschristian/twind-preact-iso';

function App() {
    return (
        <Root>
            <Header>
                <Header.NavItem
                    href="https://github.com/rschristian/preact-project-demos"
                    label="GitHub Repo"
                    iconId="github"
                />
                <Header.NavItem
                    href="https://twitter.com/_rschristian"
                    label="Twitter Account"
                    iconId="twitter"
                />
                <Header.NavItem
                    href="https://bsky.app/profile/rschristian.dev"
                    label="Bluesky Account"
                    iconId="bluesky"
                />
                <Header.ThemeToggle />
            </Header>
            <Main>
                <h1 class="mb-4 text(4xl center lg:left)">Preact Demos</h1>
                <p class="mb-16">
                    A set of example apps showing how you may build in an approachable "Preact way". This is not a set of best practices or a prescribed way to build apps, nor will they be hyper-optimized, but hopefully it will serves as a source of inspiration
                    <br />
                    <br />
                    As such, we'll tend to take an idea, like a blog, and show a couple variations of it to represent some of the variations you might need in the real world.
                    <br />
                    <br />
                    Time permitting, we'll add to this list over time.
                </p>

                <Subsection title="Blogs">
                    <Entry
                        title="SPA Blog with Static Precompiled Markdown"
                        description="A simple blog that uses precompiled markdown files for authoring content. The markdown content is completely static at runtime, injected as an HTML string into the page."
                        projectSlug="/spa-blog-static-markdown"
                        subdomain="spa-blog-static-markdown"
                    />

                    <Entry
                        title="SPA Blog with Precompiled Markdown"
                        description="A simple blog that uses precompiled markdown files for authoring content and preact-markup on the client to support referencing components from within said markdown."
                        projectSlug="/spa-blog-markdown"
                        subdomain="spa-blog-markdown"
                    />
                </Subsection>

                <Subsection title="Buildless Apps">
                    <Entry
                        title="Buildless Spreadsheet"
                        description="A spreadsheet app utilizing signals and a buildless approach, allowing you to import Preact from a CDN and use it directly in the browser. Taken largely from Surma's excellent 'My approach to coding interviews: Optimize for iteration' blog post."
                        projectSlug="/buildless-spreadsheet"
                        subdomain="buildless-spreadsheet"
                    />
                </Subsection>
            </Main>
            <Footer year={2025} />
        </Root>
    );
}

/**
 * @param {object} props
 * @param {string} props.title
 * @param {import('preact').ComponentChildren} props.children
 */
function Subsection({ title, children }) {
    return (
        <section class="mb-16">
            <h2 class="mb-4 text(3xl center lg:left)">{title}</h2>
            <div class="ml-8 text-lg">{children}</div>
        </section>
    )
}

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.subdomain
 * @param {string} [props.projectSlug]
 */
function Entry({ title, description, subdomain, projectSlug }) {
    return (
        <>
            <h3 class="text(primary(& dark:dark) 3xl)">{title}</h3>
            <div class="ml-4">
                <div class="mt-2 mb-4">{description}</div>
                <div class="flex mb-10">
                    {projectSlug && (
                        <Link
                            href={`https://github.com/rschristian/preact-project-demos/tree/master/projects/${projectSlug}`}
                            label="Source Code"
                            iconId="github"
                        />
                    )}
                    <Link
                        href={`https://${subdomain}.preact-demos.rschristian.dev`}
                        label="Live Demo"
                        iconId="link"
                    />
                </div>
            </div>
        </>
    );
}

/**
 * @param {object} props
 * @param {string} props.href
 * @param {string} props.label
 * @param {string} props.iconId
 */
function Link({ href, label, iconId }) {
    return (
        <a
            class="mr-2 last:mr-0 hover:text-primary(& dark:dark)"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
        >
            <svg role="img">
                <title>{label}</title>
                <use href={`/assets/icons.svg#${iconId}`} />
            </svg>
        </a>
    );
}

const { hydrate, prerender } = withTwind(
    () => import('./styles/twind.config.js'),
    () => <App />,
);

hydrate(<App />);

export { prerender };
