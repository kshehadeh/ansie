import { parseAnsieMarkdown, parseAnsieMarkup } from '../parser';
import type { CompilerFormat } from './types';
import { Compiler } from './Compiler';
import {
    defaultTheme,
    type AnsieTheme,
    getGlobalTheme,
} from '../themes/themes';

/**
 * Compiles the markup into a string.
 * @param optionsOrMarkup Options or the markup to compile (with default options)
 * @returns
 */
export function compile(
    optionsOrMarkup:
        | string
        | {
              markup: string;
              theme?: AnsieTheme;
              inputIncludesMarkdown?: boolean;
              output?: CompilerFormat;
          },
) {
    let theme = getGlobalTheme();
    let markup = '';
    let output: CompilerFormat = 'ansi';
    let inputIncludesMarkdown = true;
    if (typeof optionsOrMarkup === 'string') {
        markup = optionsOrMarkup;
    } else {
        markup = optionsOrMarkup.markup;
        theme = optionsOrMarkup.theme ?? theme;
        output = optionsOrMarkup.output ?? 'ansi';
        inputIncludesMarkdown = optionsOrMarkup.inputIncludesMarkdown ?? true;
    }

    const ast = inputIncludesMarkdown
        ? parseAnsieMarkdown(markup)
        : parseAnsieMarkup(markup);
    if (ast) {
        const compiler = new Compiler(ast, theme || defaultTheme);
        return compiler.compile({ format: output, theme });
    } else {
        return '';
    }
}
