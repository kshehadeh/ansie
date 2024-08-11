import { type Ast } from '../compiler/types';
/**
 * Parses a string into an AST using a simplified markdown syntax
 * The syntax supported is:
 *
 * - # text -> h1
 * - ## text -> h2
 * - ### text -> h3
 * - **text** -> bold
 * - *text* -> italics
 * - [c=red]text[/c] -> color
 *
 * @param input
 * @returns
 */
export declare function parseAnsieMarkdown(input: string): Ast | null;
/**
 * Assumes that the input string is using the simplified ansie markup syntax - use
 * `parseAnsieMarkdown` if you are unsure if the input is using mixed markdown.
 * @param input
 * @returns
 */
export declare function parseAnsieMarkup(input: string): Ast | null;
