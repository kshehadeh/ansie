import { type NodeParams, ComposerNode } from ".";
import { ValidTags } from "../../compiler/types";

export type BreakNodeParams = NodeParams;
export class BreakComposerNode extends ComposerNode {
    node = ValidTags.br;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_params: NodeParams = {}) {
        // Intentionally do not allow any contained nodes here because it's a self-terminated
        //  node.
        super();
    }

    toString() {
        return '<br/>';
    }
}