import { type Ast } from '../compile/types';
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
export default function parse(input: string): Ast | null;
