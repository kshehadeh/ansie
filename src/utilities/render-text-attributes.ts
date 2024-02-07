import { type CompilerFormat } from '../compiler/types';
import { getTextEscapeCodesFromProperties } from './get-text-escape-codes-from-properties';
import { type AnsieNode, isAttribute } from '../compiler/types';
import type { AnsieStyle } from '../themes';

/**
 * Renders the text attributes for a node prepending the appropriate text escape codes.
 * @param attributes
 * @param format
 * @returns
 */
export function renderTextAttributesStart({
    style,
    attributes,
    format = 'ansi',
}: {
    style?: AnsieStyle;
    attributes: AnsieNode;
    format?: CompilerFormat;
}) {
    if (format === 'ansi') {
        return getTextEscapeCodesFromProperties(attributes, style).on;
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
export function renderTextAttributesEnd({
    style,
    attributes,
    format = 'ansi',
}: {
    style?: AnsieStyle;
    attributes: AnsieNode;
    format?: CompilerFormat;
}) {
    if (format === 'ansi') {
        return getTextEscapeCodesFromProperties(attributes, style).off;
    } else if (format === 'markup') {
        return '';
    }
}
