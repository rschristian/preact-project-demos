import { signal, computed } from '@preact/signals';

import { range, columnLabel } from './utils.js';

/**
 * @param {string} code
 */
function computeCell(code) {
    let result = '';
    try {
        result = eval(code);
    } catch (e) {
        result = `Err: ${e.message}`;
        console.error(result);
    }
    return result;
}

export class SpreadsheetData {
    rows = 0;
    cols = 0;
    cellLabels = [];
    // User input values, not calculated
    rawCells = [];
    // Computed/calculated values for display
    computedCells = [];

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.cellLabels = range(cols).map(columnLabel);
        this.rawCells = Array.from({ length: rows * cols }, () => signal('0'));
        this.computedCells = Array.from({ length: rows * cols }, (_, i) =>
            computed(() => computeCell(this.generateCode(this.rawCells[i]))),
        );
    }

    /**
     * @param {string} label - A1, B2, etc.
     * @returns {number} - Index of the cell in the arrays
     */
    cellLabelToIdx = (label) => {
        label = label.toUpperCase();
        const x = label.charCodeAt(0) - 65;
        const y = parseInt(label.slice(1), 10) - 1;
        return y * this.cols + x;
    };

    /**
     * @param {import('@preact/signals').Signal<string>} cell
     * @returns {string} - JS code to eval the cell
     */
    generateCode = (cell) => {
        const cellString = cell.value
            .replaceAll(/(?:^|\s)([a-zA-Z]\d+)\s?/g, (_, cellLabel) => {
                const cellIdx = this.cellLabelToIdx(cellLabel);
                return this.computedCells[cellIdx].value;
            })
            // Numbers with leading zeros are treated as octal literals
            .replace(/^0+(\d)/, '$1');

        return `(function() {
            return ${cellString};
        })()`;
    };

    getRawCell = (x, y) => this.rawCells[y * this.cols + x];
    getComputedCell = (x, y) => this.computedCells[y * this.cols + x];
}
