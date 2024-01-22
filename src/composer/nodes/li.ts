import {
    ComposerNode,
    type ListNodeParams,
    type SpaceNodeParams,
    type TextNodeParams,
} from '.';
import { ValidTags } from '../../compiler/types';
import { opt } from '../../utilities/opt';
import { buildAttributesFromStyle } from '../../utilities/build-attributes-from-style';
import { DivComposerNode } from './text';

export class ListItemComposerNode extends ComposerNode {
    node = ValidTags.li;
    _bullet: string | undefined;
    _indent: number | undefined;

    constructor(params: TextNodeParams & SpaceNodeParams & ListNodeParams) {
        const finalNodes =
            params?.nodes?.map(n => new DivComposerNode({ nodes: [n] })) ?? [];
        super({ ...params, nodes: finalNodes });

        // Override the style bullet with the passed in bullet.
        this.style = {
            ...this.style,
            list: {
                ...this.style.list,
                ...opt({
                    bullet: params.bullet,
                    indent: params.indent,
                }),
            },
            font: {
                ...this.style.font,
                ...opt({
                    italics: params.italics,
                    underline: params.underline,
                    bold: params.bold,
                }),
                color: {
                    ...this.style.font?.color,
                    ...opt({
                        fg: params.fg,
                        bg: params.bg,
                    }),
                },
            },
            spacing: {
                ...this.style.spacing,
                ...opt({
                    margin: params['margin'],
                    marginLeft: params['marginLeft'],
                    marginRight: params['marginRight'],
                    marginTop: params['marginTop'],
                    marginBottom: params['marginBottom'],
                }),
            },
        };
    }

    toString() {
        const attributes = buildAttributesFromStyle(this.attrib) || {};
        const attributesString = Object.entries(attributes)
            .map(([key, value]) => `${key}${value ? `="${value}` : ''}"`)
            .join(' ');
        return `<${this.node} ${attributesString}>${super.toString()}</${this.node}>`;
    }
}
