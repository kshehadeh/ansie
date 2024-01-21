/**
 * Returns a string if the boolean is true, otherwise returns an empty string.
 * @param b 
 * @param s 
 * @returns 
 */
export function condStr(b: boolean, s?: string) {
    return b ? s ?? '' : '';
}
