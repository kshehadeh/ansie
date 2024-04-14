import { parse as rawParse } from './generated-parser';
import { type Ast } from '../compile/types';
import { convertMarkdownToAnsie } from '../utilities/convert-markdown-to-ansie';

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

export default {
    markdown: parseAnsieMarkdown,
    markup: parseAnsieMarkup
};

function parseAnsieMarkdown(input: string): Ast | null {
    if (!input) {
        return null;
    }

    return parseAnsieMarkup(convertMarkdownToAnsie(input)); // Assuming parseAnsieMarkup is defined elsewhere
}

/**
 * Assumes that the input string is using the simplified ansie markup syntax - use
 * `parseAnsieMarkdown` if you are unsure if the input is using mixed markdown.
 * @param input
 * @returns
 */
function parseAnsieMarkup(input: string): Ast | null {
    if (!input) {
        return null;
    }

    return rawParse(input) as Ast;
}
