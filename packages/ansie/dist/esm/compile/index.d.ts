import type { CompilerFormat } from './types';
import { AnsieTheme } from '../themes';
/**
 * Compiles the markup into a string.
 * @param optionsOrMarkup Options or the markup to compile (with default options)
 * @returns
 */
declare const _default: (
    optionsOrMarkup:
        | string
        | {
              markup: string;
              theme?: AnsieTheme;
              output?: CompilerFormat;
          }
) => string;
export default _default;
