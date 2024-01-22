import {
    ComposerNode,
    type NodeParams,
    type SpaceNodeParams,
    type TextNodeParams,
} from '.';
import { ValidTags } from '../../compiler/types';
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

// NODE: BODY

export class BodyComposerNode extends TextComposerNode {
    node = ValidTags.body;
}

// NODE: H1
export class H1ComposerNode extends TextComposerNode {
    node = ValidTags.h1;
}

// NODE: H2

export class H2ComposerNode extends TextComposerNode {
    node = ValidTags.h2;
}

// NODE: H3

export class H3ComposerNode extends TextComposerNode {
    node = ValidTags.h3;
}

// NODE: P

export class ParagraphComposerNode extends TextComposerNode {
    node = ValidTags.p;
}

// NODE: SPAN

export class SpanComposerNode extends TextComposerNode {
    node = ValidTags.span;
}

// NODE: DIV

export class DivComposerNode extends TextComposerNode {
    node = ValidTags.div;
}

// NODE: RAW TEXT
export interface RawTextNodeParams extends NodeParams {
    text: string;
}

export class RawTextComposerNode extends ComposerNode {
    node = ValidTags.text;
    value: string;

    constructor(params: RawTextNodeParams) {
        super(params);
        this.value = params.text;
    }

    toString() {
        return this.value;
    }
}
