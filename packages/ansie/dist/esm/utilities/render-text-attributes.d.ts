import { type CompilerFormat } from '../compile/types';
import { type AnsieNode } from '../compile/types';
import type { AnsieStyle } from '../themes';
/**
 * Renders the text attributes for a node prepending the appropriate text escape codes.
 * @param attributes
 * @param format
 * @returns
 */
export declare function renderTextAttributesStart({
    style,
    attributes,
    format
}: {
    style?: AnsieStyle;
    attributes: AnsieNode;
    format?: CompilerFormat;
}): string | undefined;
/**
 * Renders the text attributes for a node appending the appropriate text escape codes.
 * @param attributes
 * @param format
 * @returns
 */
export declare function renderTextAttributesEnd({
    style,
    attributes,
    format
}: {
    style?: AnsieStyle;
    attributes: AnsieNode;
    format?: CompilerFormat;
}): string | undefined;
