import type { ListItemNodeBase } from '../compiler/types';
import { num } from './num';

export function getListItemFromProperties(node: ListItemNodeBase): {
    on: string;
    off: string;
} {
    const bullet = node.bullet ? node.bullet : '*';
    const indent = node.indent ? ' '.repeat(num(node.indent)) : ' ';

    return {
        on: `${bullet}${indent}`,
        off: '',
    };
}
