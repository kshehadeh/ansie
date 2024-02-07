import { CompilerError, type CompilerFormat } from '../types';
import { AnsieNodeImpl, type AnsieNode } from '../types';

//// Break Node - This is a node that represents a line break

export class BreakNodeImpl extends AnsieNodeImpl implements AnsieNode {
    renderStart({
        stack,
        format,
    }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }) {
        if (format === 'ansi') {
            return '\n'.repeat(this._style?.spacing?.marginBottom || 1);
        } else if (format === 'markup') {
            return '<br/>';
        }

        throw new CompilerError(
            `Invalid format: ${format}`,
            this._raw,
            stack,
            false,
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderEnd() {
        return '';
    }
}
