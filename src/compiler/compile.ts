import { parseAnsieMarkdown } from '../parser';
import type { CompilerFormat } from './types';
import { Compiler } from './Compiler';
import { defaultTheme, type AnsieTheme } from '../themes';

export function compile({
    markup,
    theme,
    output = 'ansi',
}: {
    markup: string;
    theme?: AnsieTheme;
    output?: CompilerFormat;
}) {
    const ast = parseAnsieMarkdown(markup);
    if (ast) {
        const compiler = new Compiler(ast, theme || defaultTheme);
        return compiler.compile({ format: output, theme });
    } else {
        return '';
    }
}
