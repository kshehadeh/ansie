import type { AnsieWriter, CompilerFormat } from '../types';
import { AnsieNodeImpl, type AnsieNode } from '../types';
import { RawTextMutator } from '../../utilities/raw-text-mutator';

export class RawTextNodeImpl extends AnsieNodeImpl implements AnsieNode {
    renderStart({
        out,
        stack,
        format
    }: {
        out: AnsieWriter,
        stack: AnsieNode[];
        format: CompilerFormat;
    }): Promise<void> {
        const text = this.attr('value') ?? '';
        if (format === 'markup') {
            return out.write(text);
        } else {
            return out.write(new RawTextMutator(text)
                .replaceEmoji()
                .trimSpaces({
                    left: true,
                    right: true,
                    allowNewLines: false,
                    replaceWithSingleSpace: true
                })
                .toString());
        }
    }

    async renderEnd(): Promise<void> {

    }
}
