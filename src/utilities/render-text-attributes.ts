import { type CompilerFormat } from '../compiler/types';
import { getTextEscapeCodesFromProperties } from './get-text-escape-codes-from-properties';
import { type AnsieNode, isAttribute } from '../compiler/types';

/**
 * Renders the text attributes for a node prepending the appropriate text escape codes.
 * @param attributes
 * @param format
 * @returns
 */
export function renderTextAttributesStart(
    attributes: AnsieNode,
    format: CompilerFormat = 'ansi'
) {
    if (format === 'ansi') {
        return getTextEscapeCodesFromProperties(attributes).on;
    } else if (format === 'markup') {
        return Object.entries(attributes)
            .filter(([key]) => isAttribute(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    }
}
/**
 * Renders the text attributes for a node appending the appropriate text escape codes.
 * @param attributes
 * @param format
 * @returns
 */
export function renderTextAttributesEnd(
    attributes: AnsieNode,
    format: CompilerFormat = 'ansi',
) {
    if (format === 'ansi') {
        return getTextEscapeCodesFromProperties(attributes).off;
    } else if (format === 'markup') {
        return '';
    }
}
