import { ValidTags } from '../../compiler/types';
import { TextComposerNode } from './TextComposerNode';

export class ParagraphComposerNode extends TextComposerNode {
    node = ValidTags.p;
}
