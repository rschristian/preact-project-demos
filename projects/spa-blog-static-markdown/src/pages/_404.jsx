import { useTitle } from '../lib/utils.js';

export default function NotFound() {
    useTitle('Home');

    return (
        <section>
            <h1>404: Not Found</h1>
            <p>It's gone :(</p>
        </section>
    );
}
