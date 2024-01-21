import { CompilerError, type CompilerFormat } from '../types';
import {
    type AnsieNode,
    AnsieNodeImpl,
    type TextNodeBase,
    type SpaceNodeBase,
} from '../types';

import {
    renderSpaceAttributesStart,
    renderSpaceAttributesEnd,
} from '../../utilities/render-space-attributes';
import {
    renderTextAttributesStart,
    renderTextAttributesEnd,
} from '../../utilities/render-text-attributes';
import {
    renderNodeAsMarkupStart,
    renderNodeAsMarkupEnd,
} from '../../utilities/render-node-as-markup';


export class BlockTextNodeImpl
    extends AnsieNodeImpl
    implements TextNodeBase, SpaceNodeBase
{
    renderStart(stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return (
                renderSpaceAttributesStart(this._raw, format, { isBlock: true }) +
                renderTextAttributesStart(this._raw, format)
            );
        } else if (format === 'markup') {
            return renderNodeAsMarkupStart(this._raw);
        } else {
            throw new CompilerError(
                `Invalid format: ${format}`,
                this._raw,
                stack,
                false,
            );
        }
    }

    renderEnd(stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return `${renderTextAttributesEnd(this._raw, format)}${renderSpaceAttributesEnd(this._raw, format, { isBlock: true })}`;
        } else if (format === 'markup') {
            return renderNodeAsMarkupEnd(this._raw);
        } else {
            throw new CompilerError(
                `Invalid format: ${format}`,
                this._raw,
                stack,
                false,
            );
        }
    }
}
