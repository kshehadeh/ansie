import { ValidTags } from '../../compiler/types';
import { TextComposerNode } from './TextComposerNode';

export class H2ComposerNode extends TextComposerNode {
    node = ValidTags.h2;
}
