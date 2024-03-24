import type { ListItemNodeBase } from '../compiler/types';
import type { AnsieStyle } from '../themes/themes';
import { num } from './num';

export function getListItemFromProperties(
    node: ListItemNodeBase,
    style?: AnsieStyle,
): {
    on: string;
    off: string;
} {
    const bullet = node.bullet ? node.bullet : style?.list?.bullet ?? '';
    const indent = node.indent
        ? ' '.repeat(num(node.indent))
        : ' '.repeat(style?.list?.indent ?? 0);

    return {
        on: `${bullet}${indent}`,
        off: '',
    };
}
