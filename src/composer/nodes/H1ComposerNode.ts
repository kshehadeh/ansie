import { ValidTags } from '../../compiler/types';
import { TextComposerNode } from './TextComposerNode';

export class H1ComposerNode extends TextComposerNode {
    node = ValidTags.h1;
}
