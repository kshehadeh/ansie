import { ValidTags } from '../../compiler/types';
import { TextComposerNode } from './TextComposerNode';

export class SpanComposerNode extends TextComposerNode {
    node = ValidTags.span;
}
