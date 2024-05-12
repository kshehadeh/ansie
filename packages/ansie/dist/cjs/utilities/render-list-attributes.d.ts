import type { CompilerFormat } from '../compile/types';
import { type ListItemNodeBase } from '../compile/types';
import type { AnsieStyle } from '../themes';
export declare function renderListAttributesStart({
    node,
    style,
    format
}: {
    node: ListItemNodeBase;
    style?: AnsieStyle;
    format?: CompilerFormat;
}): string;
export declare function renderListAttributesEnd({
    node,
    style,
    format
}: {
    node: ListItemNodeBase;
    style?: AnsieStyle;
    format?: CompilerFormat;
}): string;
