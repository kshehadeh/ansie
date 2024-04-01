import { CompilerError, type AnsieWriter, type CompilerFormat } from '../types';
import { AnsieNodeImpl, type AnsieNode } from '../types';

//// Break Node - This is a node that represents a line break

export class BreakNodeImpl extends AnsieNodeImpl implements AnsieNode {
    renderStart({
        out,
        stack,
        format
    }: {
        out: AnsieWriter,
        stack: AnsieNode[];
        format: CompilerFormat;
    }): Promise<void> {
        if (format === 'ansi') {
            return out.write('\n'.repeat(this._style?.spacing?.marginBottom || 1));
        } else if (format === 'markup') {
            return out.write('<br/>');
        }

        throw new CompilerError(
            `Invalid format: ${format}`,
            this._raw,
            stack,
            false
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async renderEnd(): Promise<void> { }
}
