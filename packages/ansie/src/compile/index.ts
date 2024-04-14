import parser from '../parse';
import type { CompilerFormat } from './types';
import { Compiler } from './Compiler';
import themes, { AnsieTheme } from '../themes';

/**
 * Compiles the markup into a string.
 * @param optionsOrMarkup Options or the markup to compile (with default options)
 * @returns
 */
export default (
    optionsOrMarkup:
        | string
        | {
              markup: string;
              theme?: AnsieTheme;
              inputIncludesMarkdown?: boolean;
              output?: CompilerFormat;
          }
) => {
    let theme = themes.get();
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
        ? parser.markdown(markup)
        : parser.markup(markup);
    if (ast) {
        const compiler = new Compiler(ast, theme);
        return compiler.compile({ format: output, theme });
    } else {
        return '';
    }
};
