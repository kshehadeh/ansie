import { parse as rawParse } from './generated-parser.js';
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
export function parseAnsieMarkdown(input: string): Ast | null {
    // Unified regex for bold, italics, and color. Headers are handled separately.
    const regex = /\*\*(.*?)\*\*|\*(.*?)\*|\[c=(.*?)\](.*?)\[\/c\]/g;

    let translated = input.replace(
        regex,
        (match, boldText, italicText, color, colorText) => {
            if (boldText !== undefined) {
                return `<span bold>${boldText}</span>`;
            } else if (italicText !== undefined) {
                return `<span italics>${italicText}</span>`;
            } else if (color !== undefined) {
                return `<span fg="${color}">${colorText}</span>`;
            }
            return match; // Fallback, should never reach here.
        },
    );

    // Handle headers as a special case, due to the need for multiline matching
    translated = translated
        .split('\n')
        .map(line => line.trim()) // Remove leading/trailing whitespace
        .filter(line => line.length > 0) // Remove empty lines
        .map(line => {
            if (line.trim().startsWith('###')) {
                return line.replace(/^\s*###\s(.*?)$/, '<h3>$1</h3>');
            } else if (line.trim().startsWith('##')) {
                return line.replace(/^\s*##\s(.*?)$/, '<h2>$1</h2>');
            } else if (line.trim().startsWith('#')) {
                return line.replace(/^#\s(.*?)$/, '<h1>$1</h1>');
            }
            return line;
        })
        .join('\n'); // Rejoin the lines back into a single string

    return parseAnsieMarkup(translated); // Assuming parseAnsieMarkup is defined elsewhere
}

export function parseAnsieMarkup(input: string): Ast | null {
    return rawParse(input) as Ast;
}

if (process.argv[1].includes('parser')) {
    console.log(
        JSON.stringify(
            parseAnsieMarkdown(`
    # Title
    ## [c=blue]Subtitle goes here[/c]
    
    A description use the default text will appear here.  But you can
    also include **embedded markup**
    
    <span underline="single">Footnote</span>    
    `),
            null,
            2,
        ),
    );
    // console.log(JSON.stringify(parseAnsieMarkup('Test <h1>Test</h1> Test'), null, 2))
    // console.log(JSON.stringify(parseString('<h1 underline="double" bold="true" fg="blue" marginTop="1" marginBottom="1">Title</h1><h2 underline="single" bold="true" fg="default" marginTop="1" marginBottom="1">A subtitle</h2><p marginTop="1" marginBottom="1">Paragraph</p>'), null, 2))
    // console.log(JSON.stringify(parseString('<body><h1 underline="double" bold="true" fg="blue" marginTop="1" marginBottom="1">Title</h1><h2 underline="single" bold="true" fg="default" marginTop="1" marginBottom="1">A subtitle</h2><p marginTop="1" marginBottom="1">Paragraph</p></body>'), null, 2))
    // console.log(JSON.stringify(parseString('<body bold italics underline fg="red" bg="white">Hello</body>'), null, 2))
    // console.log(JSON.stringify(parseString('<h1 margin="12" fg="red">HELLO</h1>'), null, 2))
    // console.log(JSON.stringify(parseString('<body bold=true>Hello</body>'), null, 2))
    // console.log(JSON.stringify(parseString('<color name="red">Hello</color>'), null, 2))
    // console.log(JSON.stringify(parseString('<bold>Hello</bold>'), null, 2))
    // console.log(JSON.stringify(parseString('Hello'), null, 2))
}
