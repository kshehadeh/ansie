import type { CompilerFormat } from './types';
import { type AnsieTheme } from '../themes/themes';
/**
 * Compiles the markup into a string.
 * @param optionsOrMarkup Options or the markup to compile (with default options)
 * @returns
 */
export declare function compile(optionsOrMarkup: string | {
    markup: string;
    theme?: AnsieTheme;
    inputIncludesMarkdown?: boolean;
    output?: CompilerFormat;
}): string;
