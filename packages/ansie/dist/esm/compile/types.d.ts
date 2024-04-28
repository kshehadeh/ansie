/**
 * This file contains all the types used by the parser and compiler.
 *
 * ‼️ IMPORTANT ‼️
 * IT'S IMPORTANT THAT THIS FILE IS NOT DEPENDENT ON ANY OTHER FILES IN THE PROJECT.
 *
 * This file is used by the parser and compiler.  It should not be dependent on any other
 * files in the project.  This is to avoid circular dependencies and any complexities that
 * may arise from them.
 *
/**
 * The canonical list of supported tags.  We should never be referring
 * to tags as raw strings.  Instead, we should be using this enum.  This
 * will help us avoid typos and make it easier to refactor later.
 */
export declare enum ValidTags {
    'h1' = "h1",
    'h2' = "h2",
    'h3' = "h3",
    'body' = "body",
    'span' = "span",
    'p' = "p",
    'div' = "div",
    'text' = "text",
    'li' = "li",
    'br' = "br"
}
export declare const TextAttributes: {
    fg: string[];
    bg: string[];
    bold: string[];
    italics: string[];
    underline: string[];
};
export type Ast = AnsieNode[];
export type CompilerFormat = 'ansi' | 'markup';
