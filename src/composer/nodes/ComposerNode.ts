import type { ValidTags } from '../../compiler/types';
import { type AnsieTheme, type AnsieStyle } from '../../themes';

export interface NodeParams {
    nodes?: ComposerNode[];
    theme?: AnsieTheme;
    style?: AnsieStyle;
    [key: string]: unknown;
}

export interface TextNodeParams extends NodeParams {
    italics?: boolean;
    underline?: ('single' | 'double' | 'none') | boolean;
    bold?: boolean;
    fg?: string;
    bg?: string;
}

export interface SpaceNodeParams extends NodeParams {
    margin?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
}

export interface ListNodeParams extends NodeParams {
    bullet?: string;
    indent?: number;
}

/**
 * The base class for all composition nodes.  This store information about the theme, style and
 * content of the node.  It also provides methods for adding content to the node and
 * converting the node to a string.
 *
 * ## Differences between a styling and themes
 *
 * A theme is a set of styles that are applied to a set of nodes.  A theme is applied to a node
 * by the composer when the node is created.  A style is a subset of styling attributes to apply
 * to this specific node.  The assigned styling properties will always take precedence over the
 * theme properties.
 *
 * ## Creating a node
 *
 * A node can be created by calling the constructor directly or by calling the `create` method.
 * The `create` method will handle the proper instantiation of a node from a node or an array of
 * nodes.
 *
 * ## Adding content to a node
 *
 * Content can be added to a node by calling the `add` method.  This method will handle the creation
 * of a node from a node, string or an array of either.
 */
export abstract class ComposerNode {
    abstract node: ValidTags;
    private _content: ComposerNode[];
    private _style: AnsieStyle;

    constructor(params: NodeParams = {}) {
        this._content = params.nodes ? ComposerNode.create(params.nodes) : [];
        this._style = params.style ?? {};
    }

    toString(): string {
        return this._content?.map(c => c.toString()).join('') || '';
    }

    set style(style: AnsieStyle) {
        this._style = style;
    }

    get style() {
        return this._style;
    }

    /**
     * Get the attributes for this node.  This will merge the theme attributes with the style attributes.
     * Override to include additional attributes.
     * @returns
     */
    get attrib() {
        return {
            ...(this._style ? this._style : {}),
        };
    }

    /**
     * Add a node or array of nodes to the content of this node.
     * @param node
     */
    add(node: ComposerNode | ComposerNode[]) {
        this._content = this._content.concat(ComposerNode.create(node));
    }

    /**
     * This will handle the creation of a node object from a node, string or an array of either.
     * @param node
     * @returns
     */
    static create(node: ComposerNode | ComposerNode[]): ComposerNode[] {
        if (Array.isArray(node)) {
            // If we got an array then call this function recursively
            return node
                .map(n => ComposerNode.create(n).at(0))
                .filter((n): n is ComposerNode => !!n);
        } else if (node instanceof ComposerNode) {
            // If we got a node then just return it as is
            return [node];
        } else {
            // If we got anything else then we can't create a node from it.  .
            return [];
        }
    }
}
