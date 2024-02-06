import { ValidTags } from '../../compiler/types';
import { TextComposerNode } from './TextComposerNode';

export class H3ComposerNode extends TextComposerNode {
    node = ValidTags.h3;
}
