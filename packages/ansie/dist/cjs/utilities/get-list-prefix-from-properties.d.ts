import type { ListItemNodeBase } from '../compile/types';
import type { AnsieStyle } from '../themes';
export declare function getListItemFromProperties(node: ListItemNodeBase, style?: AnsieStyle): {
    on: string;
    off: string;
};
