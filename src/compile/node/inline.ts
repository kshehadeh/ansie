import {
    renderNodeAsMarkupEnd,
    renderNodeAsMarkupStart
} from '../../utilities/render-node-as-markup';
import {
    renderSpaceAttributesEnd,
    renderSpaceAttributesStart
} from '../../utilities/render-space-attributes';
import {
    renderTextAttributesEnd,
    renderTextAttributesStart
} from '../../utilities/render-text-attributes';
import { CompilerError, type CompilerFormat } from '../types';
import {
    AnsieNodeImpl,
    type TextNodeBase,
    type SpaceNodeBase,
    type AnsieNode
} from '../types';

export class InlineTextNodeImpl
    extends AnsieNodeImpl
    implements TextNodeBase, SpaceNodeBase
{
    renderStart({
        stack,
        format
    }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }) {
        if (format === 'ansi') {
            return (
                renderSpaceAttributesStart({
                    node: this._raw,
                    format,
                    style: this._style
                }) +
                renderTextAttributesStart({
                    style: this._style,
                    attributes: this._raw,
                    format
                })
            );
        } else if (format === 'markup') {
            return renderNodeAsMarkupStart(this._raw);
        } else {
            throw new CompilerError(
                `Invalid format: ${format}`,
                this._raw,
                stack,
                false
            );
        }
    }

    renderEnd({
        stack,
        format = 'ansi'
    }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }) {
        if (format === 'ansi') {
            return `${renderTextAttributesEnd({
                style: this._style,
                attributes: this._raw,
                format
            })}${renderSpaceAttributesEnd({
                attributes: this._raw,
                format,
                style: this._style
            })}`;
        } else if (format === 'markup') {
            return renderNodeAsMarkupEnd(this._raw);
        } else {
            throw new CompilerError(
                `Invalid format: ${format}`,
                this._raw,
                stack,
                false
            );
        }
    }
}
