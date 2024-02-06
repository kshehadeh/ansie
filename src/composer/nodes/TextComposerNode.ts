import {
    ComposerNode,
    type SpaceNodeParams,
    type TextNodeParams,
} from './ComposerNode';
import { opt } from '../../utilities/opt';
import { buildAttributesFromStyle } from '../../utilities/build-attributes-from-style';

export abstract class TextComposerNode extends ComposerNode {
    constructor(params: TextNodeParams & SpaceNodeParams) {
        super(params);

        // Override the built-in style with the given params
        this.style = {
            ...this.style,
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
