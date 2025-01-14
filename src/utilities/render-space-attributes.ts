import { type CompilerFormat } from '../compile/types';
import { getSpacingFromProperties } from './get-spacing-from-properties';
import {
    type AnsieNode,
    type SpaceNodeBase,
    SpaceAttributes
} from '../compile/types';
import type { AnsieStyle } from '../themes';

/**
 * Renders the space attributes for a node prepending the appropriate spacing escape codes.
 * @param attributes
 * @param format
 * @returns
 */
export function renderSpaceAttributesStart({
    node,
    format,
    style
}: {
    node: SpaceNodeBase;
    format: CompilerFormat;
    style?: AnsieStyle;
}): string {
    if (format === 'ansi') {
        return getSpacingFromProperties(node, style).on;
    } else if (format === 'markup') {
        return Object.entries(node)
            .filter(([key]) => Object.keys(SpaceAttributes).includes(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    } else {
        return '';
    }
}
/**
 * Renders the space attributes for a node appending the appropriate spacing escape codes.
 * @param attributes
 * @param format
 * @returns
 */
export function renderSpaceAttributesEnd({
    style,
    attributes,
    format
}: {
    attributes: AnsieNode;
    style?: AnsieStyle;
    format: CompilerFormat;
}) {
    if (format === 'ansi') {
        return getSpacingFromProperties(attributes, style).off;
    } else if (format === 'markup') {
        return '';
    } else {
        return '';
    }
}
