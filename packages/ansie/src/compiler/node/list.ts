import { CompilerError, type AnsieWriter, type CompilerFormat } from '../types';
import { AnsieNodeImpl, type AnsieNode } from '../types';
import {
    renderListAttributesEnd,
    renderListAttributesStart
} from '../../utilities/render-list-attributes';
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

export class ListItemNodeImpl extends AnsieNodeImpl implements AnsieNode {
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
                renderListAttributesStart({
                    node: this._raw,
                    format,
                    style: this._style
                }) +
                renderTextAttributesStart({
                    attributes: this._raw,
                    format,
                    style: this._style
                })
            );
        } else if (format === 'markup') {
            return out.write(renderNodeAsMarkupStart(this._raw));
        }

        throw new CompilerError(
            `Invalid format: ${format}`,
            this._raw,
            stack,
            false
        );
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
            return out.write(
                renderTextAttributesEnd({
                    style: this._style,
                    attributes: this._raw,
                    format
                }) +
                renderListAttributesEnd({
                    node: this._raw,
                    format,
                    style: this._style
                }) +
                renderSpaceAttributesEnd({
                    attributes: this._raw,
                    format,
                    style: this._style
                })
            );
        } else if (format === 'markup') {
            return out.write(renderNodeAsMarkupEnd(this._raw));
        }

        throw new CompilerError(
            `Invalid format: ${format}`,
            this._raw,
            stack,
            false
        );
    }
}
