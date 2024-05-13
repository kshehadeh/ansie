import type { CompilerFormat } from '../types';
import { AnsieNodeImpl, type AnsieNode } from '../types';
export declare class RawTextNodeImpl extends AnsieNodeImpl implements AnsieNode {
    renderStart({ format }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }): string;
    renderEnd(): string;
}
