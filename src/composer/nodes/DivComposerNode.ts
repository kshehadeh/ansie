import { ValidTags } from '../../compiler/types';
import { TextComposerNode } from './TextComposerNode';

export class DivComposerNode extends TextComposerNode {
    node = ValidTags.div;
}
