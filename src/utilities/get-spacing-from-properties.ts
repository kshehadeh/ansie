import type { SpaceNodeBase } from '../compiler/types';
import { num } from './num';

export function getSpacingFromProperties(node: SpaceNodeBase): {
    on: string;
    off: string;
} {
    const left = num(node.marginLeft ?? node.margin ?? 0);
    const right = num(node.marginRight ?? node.margin ?? 0);
    const top = num(node.marginTop ?? node.margin ?? 0);
    const bottom = num(node.marginBottom ?? node.margin ?? 0);

    const vpre = top ? '\n'.repeat(top) : '';
    const vpost = bottom ? '\n'.repeat(bottom) : '';
    const hpre = left ? ' '.repeat(left) : '';
    const hpost = right ? ' '.repeat(right) : '';

    return {
        on: `${vpre}${hpre}`,
        off: `${hpost}${vpost}`,
    };
}
