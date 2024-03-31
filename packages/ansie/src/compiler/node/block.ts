import { CompilerError, type AnsieWriter, type CompilerFormat } from '../types';
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
    implements TextNodeBase, SpaceNodeBase {
    renderStart({
        out,
        stack,
        format
    }: {
        out: AnsieWriter,
        stack: AnsieNode[];
        format: CompilerFormat;
    }): Promise<void> {
        if (format === 'ansi') {
            return out.write(
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
            return out.write(renderNodeAsMarkupStart(this._raw));
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
        out,
        stack,
        format = 'ansi'
    }: {
        out: AnsieWriter,
        stack: AnsieNode[];
        format: CompilerFormat;
    }): Promise<void> {
        if (format === 'ansi') {
            return out.write(`${renderTextAttributesEnd({
                style: this._style,
                attributes: this._raw,
                format
            })}${renderSpaceAttributesEnd({
                attributes: this._raw,
                format,
                style: this._style
            })}`);
        } else if (format === 'markup') {
            return out.write(renderNodeAsMarkupEnd(this._raw));
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
