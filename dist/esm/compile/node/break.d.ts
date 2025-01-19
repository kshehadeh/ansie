import { type CompilerFormat } from '../types';
import { AnsieNodeImpl, type AnsieNode } from '../types';
export declare class BreakNodeImpl extends AnsieNodeImpl implements AnsieNode {
    renderStart({
        stack,
        format
    }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }): string;
    renderEnd(): string;
}
