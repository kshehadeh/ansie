import { CompilerError, type CompilerFormat } from '../types';
import {
    type AnsieNode,
    AnsieNodeImpl,
    type TextNodeBase,
    type SpaceNodeBase
} from '../types';

import {
    renderSpaceAttributesStart,
    renderSpaceAttributesEnd
} from '../../utilities/render-space-attributes';
import {
    renderTextAttributesStart,
    renderTextAttributesEnd
} from '../../utilities/render-text-attributes';
import {
    renderNodeAsMarkupStart,
    renderNodeAsMarkupEnd
} from '../../utilities/render-node-as-markup';

export class BlockTextNodeImpl
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
