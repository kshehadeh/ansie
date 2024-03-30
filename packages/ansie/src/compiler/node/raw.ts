import type { CompilerFormat } from '../types';
import { AnsieNodeImpl, type AnsieNode } from '../types';
import { RawTextMutator } from '../../utilities/raw-text-mutator';

export class RawTextNodeImpl extends AnsieNodeImpl implements AnsieNode {
    renderStart({ format }: { stack: AnsieNode[]; format: CompilerFormat }) {
        const text = this.attr('value') ?? '';
        if (format === 'markup') {
            return text;
        } else {            
            return new RawTextMutator(text)
                .replaceEmoji()
                .trimSpaces({
                    left: true,
                    right: true,
                    allowNewLines: false,
                    replaceWithSingleSpace: true,
                })
                .toString();
        }
    }

    renderEnd() {
        return '';
    }
}
