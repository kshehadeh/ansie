import type { SpaceNodeBase } from '../compile/types';
import type { AnsieStyle } from '@/themes';
export declare function getSpacingFromProperties(
    node: SpaceNodeBase,
    style?: AnsieStyle
): {
    on: string;
    off: string;
};
