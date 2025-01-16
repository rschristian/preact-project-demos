/**
 * @param {number} length
 * @returns {number[]}
 */
export const range = (length) => Array.from({ length }, (_, i) => i);

/**
 * Only works up to 26 columns, enough for our demo though
 *
 * @param {number} id
 * @returns {string}
 */
export const columnLabel = (id) => String.fromCharCode('A'.charCodeAt(0) + id);
