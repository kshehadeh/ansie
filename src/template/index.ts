import { compile } from '../compiler/compile';

/**
 * This is a template tag function that will compile the template string into ansi code from
 * a template string that uses ansie markup.
 * @returns A string of ansi-compatible text.
 */
export function ansie(
    strings: TemplateStringsArray,
    ...keys: (number | string)[]
) {
    const final = strings.reduce((result, string, i) => {
        const value = keys[i] || '';
        if (typeof value === 'number') {
            return result + string + value;
        }
        return result + string + value;
    }, '');

    return compile(final);
}
