import { CompilerError, type CompilerFormat } from '../types';
import { AnsieNodeImpl, type AnsieNode } from '../types';

//// Break Node - This is a node that represents a line break

export class BreakNodeImpl extends AnsieNodeImpl implements AnsieNode {
    renderStart(stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return '\n';
        } else if (format === 'markup') {
            return '<br/>';
        } 

        throw new CompilerError(`Invalid format: ${format}`, this._raw, stack, false);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderEnd() {
        return '';
    }
}
