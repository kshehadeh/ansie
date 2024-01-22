import { ComposerNode, type NodeParams } from '.';
import { compile } from '../../compiler';
import { CompilerError } from '../../compiler/types';
import { ValidTags } from '../../compiler/types';

export interface MarkupNodeParams extends NodeParams {
    content: string;
}

/**
 * This is a special node that allows for raw markup to be inserted into the output.
 * This does the work of validating that the raw markup is valid ansie markup before
 * storing.
 *
 * @returns
 */
export class MarkupComponentNode extends ComposerNode {
    // NOTE: Markup nodes are not represented in the AST.  They are only used in the composer.
    //     This is because the markup is already compiled and validated before it is passed
    //     to the composer.  This is a special case where we are allowing the composer to
    //     handle the markup directly.
    node = ValidTags.text;
    markup: string | undefined = '';

    constructor(params: MarkupNodeParams) {
        super(params);

        try {
            this.markup = compile(params.content, 'markup');
        } catch (e) {
            if (e instanceof CompilerError) {
                console.error(e.toString());
                if (!e.continue) {
                    throw e;
                }
            }
        }
    }

    toString() {
        return this.markup ?? '';
    }
}
