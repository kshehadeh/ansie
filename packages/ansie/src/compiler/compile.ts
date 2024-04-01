import { parseAnsieMarkdown, parseAnsieMarkup } from '../parser';
import type { CompilerFormat } from './types';
import { Compiler } from './Compiler';
import {
    defaultTheme,
    type AnsieTheme,
    getGlobalTheme
} from '../themes/themes';
import { AnsieBuffer } from './AnsieBuffer';
import makeSynchronous from 'make-synchronous';

export type CompileConfig = {
    markup: string;
    theme?: AnsieTheme;
    inputIncludesMarkdown?: boolean;
    output?: CompilerFormat;
};

/**
 * Compiles the markup into a string.
 * @param optionsOrMarkup Options or the markup to compile (with default options)
 * @returns
 */
export async function compileAsync(
    optionsOrMarkup: string | CompileConfig
): Promise<string> {
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
        const buffer = new AnsieBuffer();
        await compiler.compile({ out: buffer, format: output, theme });
        return buffer.asText();
    } else {
        return '';
    }
}

export function compile(
    optionsOrMarkup: string | CompileConfig
) {

    const fn = makeSynchronous(async (url, optionsOrMarkup: string | CompileConfig) => {
        const { default: ansie } = await import(url);
        return await ansie.compileAsync(optionsOrMarkup);
    });

    return fn(import.meta.url, optionsOrMarkup);
}