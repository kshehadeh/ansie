/**
 * This is a template tag function that will compile the template string into ansi code from
 * a template string that uses ansie markup.
 * @returns A string of ansi-compatible text.
 */
export declare function tpl(strings: TemplateStringsArray, ...keys: (number | string)[]): string;
