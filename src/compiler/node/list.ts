import { CompilerError, type CompilerFormat } from '../types';
import { AnsieNodeImpl, type AnsieNode } from '../types';
import { renderListAttributesEnd, renderListAttributesStart } from '../../utilities/render-list-attributes';
import { renderNodeAsMarkupEnd, renderNodeAsMarkupStart } from '../../utilities/render-node-as-markup';
import { renderSpaceAttributesEnd, renderSpaceAttributesStart } from '../../utilities/render-space-attributes';
import { renderTextAttributesEnd, renderTextAttributesStart } from '../../utilities/render-text-attributes';

export class ListItemNodeImpl extends AnsieNodeImpl implements AnsieNode {
    renderStart(stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return `${renderSpaceAttributesStart(this._raw, format, { isBlock: true})}${renderListAttributesStart(this._raw, format)}${renderTextAttributesStart(this._raw, format)}`;
        } else if (format === 'markup') {
            return renderNodeAsMarkupStart(this._raw);
        }
    
        throw new CompilerError(`Invalid format: ${format}`, this._raw, stack, false);    
    }

    renderEnd(_stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'ansi') {
            return `${renderTextAttributesEnd(this._raw, format)}${renderListAttributesEnd(this._raw, format)}${renderSpaceAttributesEnd(this._raw, format, { isBlock: true})}`;
        } else if (format === 'markup') {
            return renderNodeAsMarkupEnd(this._raw);
        } else {
            return '';
        }
    }
}