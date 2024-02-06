import { ValidTags } from '../../compiler/types';
import { TextComposerNode } from './TextComposerNode';

export class BodyComposerNode extends TextComposerNode {
    node = ValidTags.body;
}
