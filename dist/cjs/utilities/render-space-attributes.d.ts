import { type CompilerFormat } from '../compile/types';
import { type AnsieNode, type SpaceNodeBase } from '../compile/types';
import type { AnsieStyle } from '@/themes';
/**
 * Renders the space attributes for a node prepending the appropriate spacing escape codes.
 * @param attributes
 * @param format
 * @returns
 */
export declare function renderSpaceAttributesStart({
    node,
    format,
    style
}: {
    node: SpaceNodeBase;
    format: CompilerFormat;
    style?: AnsieStyle;
}): string;
/**
 * Renders the space attributes for a node appending the appropriate spacing escape codes.
 * @param attributes
 * @param format
 * @returns
 */
export declare function renderSpaceAttributesEnd({
    style,
    attributes,
    format
}: {
    attributes: AnsieNode;
    style?: AnsieStyle;
    format: CompilerFormat;
}): string;
