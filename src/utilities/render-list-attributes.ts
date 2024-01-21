import type { CompilerFormat } from '../compiler/types';
import { ListAttributes, type ListItemNodeBase } from "../compiler/types";
import { getListItemFromProperties } from "./get-list-prefix-from-properties";

export function renderListAttributesStart(
    node: ListItemNodeBase,
    format: CompilerFormat = 'ansi'
): string {
    if (format === 'ansi') {
        return getListItemFromProperties(node).on;
    } else if (format === 'markup') {
        return Object.entries(node)
            .filter(([key]) => Object.keys(ListAttributes).includes(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    } else {
        return '';
    }
}

export function renderListAttributesEnd(
    node: ListItemNodeBase,
    format: CompilerFormat = 'ansi'
): string {
    if (format === 'ansi') {
        return getListItemFromProperties(node).off;
    } else if (format === 'markup') {
        return '';
    } else {
        return '';
    }
}