import type { AnsieStyle } from '../themes';
/**
 * Builds a set of attributes from a style object.  This is used to build the attributes for a node tag.  It will
 * only include attributes that are defined in the style object.
 * @param style
 * @returns
 */
export declare function buildAttributesFromStyle(
    style: AnsieStyle
): Record<string, string | number | boolean | undefined>;
