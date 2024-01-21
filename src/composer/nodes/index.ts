import type { ValidTags } from '../../compiler/types';
import { defaultTheme, type AnsieTheme, type AnsieStyle } from '../styles';

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
 * 
 */
export abstract class ComposerNode {
    abstract node: ValidTags;

    _theme: AnsieTheme;
    _content: ComposerNode[];
    _style: AnsieStyle;
    constructor(params: NodeParams = {}) {
        this._content = params.nodes ? ComposerNode.create(params.nodes) : [];        
        this._theme = params.theme ?? defaultTheme;
        this._style = params.style ?? {};
    }

    toString(): string {
        return this._content?.map(c => c.toString()).join('') || '';
    }

    set theme(theme: AnsieTheme) {
        this._theme = theme;
    }

    get theme() {
        return this._theme;
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
            ...(this._theme[this.node] ? this._theme[this.node] : {}),
            ...(this._style ? this._style : {}),
        }
    }

    /**
     * Add a node or array of nodes to the content of this node.
     * @param node
     */
    add(node: ComposerNodeCompatible) {
        this._content = this._content.concat(ComposerNode.create(node));
    }

    /**
     * This will handle the creation of a node object from a node, string or an array of either.
     * @param node
     * @returns
     */
    static create(node: ComposerNodeCompatible): ComposerNode[] {
        if (Array.isArray(node)) {
            // If we got an array then call this function recursively
            return node.map(n => ComposerNode.create(n).at(0)).filter((n): n is ComposerNode => !!n);
        } else if (node instanceof ComposerNode) {
            // If we got a node then just return it as is
            return [node];
        } else {
            // If we got anything else then we can't create a node from it.  .
            return [];
        }
    }
}

export type ComposerNodeCompatible = ComposerNode | ComposerNode[];



///// HIGHER LEVEL NODES /////
// These nodes are used to create higher level constructs that are composed of other nodes.
//  For example, the `list` node is composed of sub-nodes and the raw node is composed of
//  a string that is compiled into a node.
/////////////////////////////

/**
 * Nest the nodes in the stack to create a hierarchical structure.
 * The first node in the stack will be the root node, and each subsequent node will be added as a child of the previous node.
 * @param stack - An array of ComposerNode objects representing the nodes to be nested.
 * @returns The root node of the nested structure.
 */
// function nest(stack: ComposerNode[]) {
//     const root = stack[0];
//     while (stack.length > 0) {
//         const node = stack.shift();
//         if (node && stack.length > 0) {
//             // Add the next node as a child of the current node
//             const nextNode = stack[0];
//             node.add(nextNode);
//         }
//     }
//     return root;
// }




// <doc theme="default"> 
//     <h1>Heading 1</h1>
//     <h2>Heading 2</h2>
//     <h3>Heading 3</h3>
//     <body>
//         <p>Paragraph 1</p>
//         <p>Paragraph 2</p>
//         <list bullet="-">
//             <text>Item 1</text>
//             <text>Item 2</text>
//             <text>Item 3</text>
//         </list>
//     </body>
// </doc>