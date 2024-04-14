import type { CompilerFormat } from '../compile/types';
import { ListAttributes, type ListItemNodeBase } from '../compile/types';
import type { AnsieStyle } from '../themes';
import { getListItemFromProperties } from './get-list-prefix-from-properties';

export function renderListAttributesStart({
    node,
    style,
    format = 'ansi'
}: {
    node: ListItemNodeBase;
    style?: AnsieStyle;
    format?: CompilerFormat;
}): string {
    if (format === 'ansi') {
        return getListItemFromProperties(node, style).on;
    } else if (format === 'markup') {
        return Object.entries(node)
            .filter(([key]) => Object.keys(ListAttributes).includes(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    } else {
        return '';
    }
}

export function renderListAttributesEnd({
    node,
    style,
    format = 'ansi'
}: {
    node: ListItemNodeBase;
    style?: AnsieStyle;
    format?: CompilerFormat;
}): string {
    if (format === 'ansi') {
        return getListItemFromProperties(node, style).off;
    } else if (format === 'markup') {
        return '';
    } else {
        return '';
    }
}
