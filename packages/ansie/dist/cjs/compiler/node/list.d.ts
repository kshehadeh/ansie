import { type CompilerFormat } from '../types';
import { AnsieNodeImpl, type AnsieNode } from '../types';
export declare class ListItemNodeImpl extends AnsieNodeImpl implements AnsieNode {
    renderStart({ stack, format }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }): string;
    renderEnd({ format }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }): string;
}
