import { ValidTags } from '../../compiler/types';
import { ComposerNode, type NodeParams } from './ComposerNode';

export interface RawTextNodeParams extends NodeParams {
    text: string;
}

export class RawTextComposerNode extends ComposerNode {
    node = ValidTags.text;
    value: string;

    constructor(params: RawTextNodeParams) {
        super(params);
        this.value = params.text;
    }

    toString() {
        return this.value;
    }
}
