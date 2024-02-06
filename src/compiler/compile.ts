import { parseAnsieMarkdown } from '../parser';
import type { CompilerFormat } from './types';
import { Compiler } from './Compiler';

export function compile(markup: string, output: CompilerFormat = 'ansi') {
    const ast = parseAnsieMarkdown(markup);
    if (ast) {
        const compiler = new Compiler(ast);
        return compiler.compile(output);
    } else {
        return '';
    }
}
