import { type CompilerFormat } from '../types';
import {
    AnsieNodeImpl,
    type TextNodeBase,
    type SpaceNodeBase,
    type AnsieNode
} from '../types';
export declare class InlineTextNodeImpl
    extends AnsieNodeImpl
    implements TextNodeBase, SpaceNodeBase
{
    renderStart({
        stack,
        format
    }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }): string;
    renderEnd({
        stack,
        format
    }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }): string;
}
