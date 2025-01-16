import { useMemo, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { html } from 'htm/preact';

import { SpreadsheetData } from './spreadsheet-data.js';
import { range, columnLabel } from './utils.js';

export function SpreadSheet({ rows, cols }) {
    const spreadsheetData = useMemo(() => new SpreadsheetData(rows, cols), [rows, cols]);

    return html`
        <a href="https://preactjs.com" target="_blank">
            <img src="./assets/preact.svg" alt="Preact logo" height="160" width="160" />
        </a>
        <h1>Buildless Spreadsheet App Using Preact</h1>
        <hr />
        <p>
            <span class="bold">Instructions:</span> click on any cell to edit it. You can insert
            arbitrary JS statements (<code>Math.sin(123)</code>) and reference other cells (<code
                >A1 + b1</code
            >).
        </p>
        <table>
            <thead>
                <tr>
                    <th />
                    ${range(cols).map((x) => html`<th>${columnLabel(x)}</th>`)}
                </tr>
            </thead>
            <tbody>
                ${range(rows).map(
                    (y) => html`
                        <tr>
                            <th scope="row">${y + 1}</th>
                            ${range(cols).map(
                                (x) => html`
                                    <${Cell}
                                        rawCell=${spreadsheetData.getRawCell(x, y)}
                                        computedCell=${spreadsheetData.getComputedCell(x, y)}
                                    />
                                `,
                            )}
                        </tr>
                    `,
                )}
            </tbody>
        </table>
    `;
}

function Cell({ rawCell, computedCell }) {
    const editing = useSignal(false);
    const formRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        editing.value = false;

        const formData = new FormData(formRef.current);
        rawCell.value = formData.get('value');
    };

    if (editing.value) {
        return html`
            <td>
                <form ref=${formRef} onSubmit=${submit}>
                    <input
                        name="value"
                        ref=${(el) => el && el.focus()}
                        value=${rawCell.value}
                        onInput=${(e) => (rawCell.value = e.currentTarget.value)}
                        onBlur=${submit}
                    />
                </form>
            </td>
        `;
    }

    return html`
        <td onClick=${() => (editing.value = true)}>
            <span>${computedCell.value}</span>
        </td>
    `;
}
