import { type CompilerFormat } from '../types';
import { type AnsieNode, AnsieNodeImpl, type TextNodeBase, type SpaceNodeBase } from '../types';
export declare class BlockTextNodeImpl extends AnsieNodeImpl implements TextNodeBase, SpaceNodeBase {
    renderStart({ stack, format }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }): string;
    renderEnd({ stack, format }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }): string;
}
