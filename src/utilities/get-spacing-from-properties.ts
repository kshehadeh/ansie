import type { SpaceNodeBase } from '../compile/types';
import type { AnsieStyle } from '@/themes';
import { num } from './num';

export function getSpacingFromProperties(
    node: SpaceNodeBase,
    style?: AnsieStyle
): {
    on: string;
    off: string;
} {
    const left = num(
        node.marginLeft ?? node.margin ?? style?.spacing?.marginLeft ?? 0
    );
    const right = num(
        node.marginRight ?? node.margin ?? style?.spacing?.marginRight ?? 0
    );
    const top = num(
        node.marginTop ?? node.margin ?? style?.spacing?.marginTop ?? 0
    );
    const bottom = num(
        node.marginBottom ?? node.margin ?? style?.spacing?.marginBottom ?? 0
    );

    const vpre = top ? '\n'.repeat(top) : '';
    const vpost = bottom ? '\n'.repeat(bottom) : '';
    const hpre = left ? ' '.repeat(left) : '';
    const hpost = right ? ' '.repeat(right) : '';

    return {
        on: `${vpre}${hpre}`,
        off: `${hpost}${vpost}`
    };
}
