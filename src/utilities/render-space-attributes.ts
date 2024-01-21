import { type CompilerFormat } from '../compiler/types';
import { getSpacingFromProperties } from './get-spacing-from-properties';
import {
    type AnsieNode, type SpaceNodeBase,    
    SpaceAttributes
} from '../compiler/types';

/**
 * Renders the space attributes for a node prepending the appropriate spacing escape codes.
 * @param attributes
 * @param format
 * @returns
 */
export function renderSpaceAttributesStart(
    node: SpaceNodeBase,
    format: CompilerFormat,
    options: {
        isBlock?: boolean
    }
): string {
    if (format === 'ansi') {
        return (options.isBlock ? '\n' : '') + getSpacingFromProperties(node).on;
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
export function renderSpaceAttributesEnd(
    attributes: AnsieNode,
    format: CompilerFormat,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options: {
        isBlock?: boolean
    }
) {
    if (format === 'ansi') {
        return getSpacingFromProperties(attributes).off;
    } else if (format === 'markup') {
        return '';
    } else {
        return '';
    }
}

