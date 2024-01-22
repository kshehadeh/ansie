import {
    renderNodeAsMarkupEnd,
    renderNodeAsMarkupStart,
} from '../../utilities/render-node-as-markup';
import {
    renderSpaceAttributesEnd,
    renderSpaceAttributesStart,
} from '../../utilities/render-space-attributes';
import {
    renderTextAttributesEnd,
    renderTextAttributesStart,
} from '../../utilities/render-text-attributes';
import { CompilerError, type CompilerFormat } from '../types';
import {
    AnsieNodeImpl,
    type TextNodeBase,
    type SpaceNodeBase,
    type AnsieNode,
} from '../types';

export class InlineTextNodeImpl
    extends AnsieNodeImpl
    implements TextNodeBase, SpaceNodeBase
{
    renderStart(stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return (
                renderSpaceAttributesStart(this._raw, format, {
                    isBlock: false,
                }) + renderTextAttributesStart(this._raw, format)
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
            return `${renderTextAttributesEnd(this._raw, format)}${renderSpaceAttributesEnd(this._raw, format, { isBlock: false })}`;
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
