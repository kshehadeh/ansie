import {
    AnsieNodeImpl,
    type AnsieNode,
    type Ast,
    ValidTags,
    type CompilerFormat,
} from './types';
import { CompilerError } from './types';
import { BlockTextNodeImpl } from './node/block';
import { BreakNodeImpl } from './node/break';
import { RawTextNodeImpl } from './node/raw';
import { ListItemNodeImpl } from './node/list';
import { InlineTextNodeImpl } from './node/inline';

/**
 * The compiler takes the AST from the parser and compiles it into a string
 * @param ast Takes the AST from the compiled markup and stores for future operations.
 * @internal
 */
export class Compiler {
    private _ast: Ast;
    private _stack: AnsieNodeImpl[] = [];

    /**
     * The compiler takes the AST from the parser and compiles it into a string
     * @param ast Takes the AST from the compiled markup and stores for future operations.
     */
    constructor(ast: Ast) {
        this._ast = ast;
    }

    /**
     * The compile function takes the AST and compiles it into a string.
     * @returns A string that is the compiled markup.
     */
    public compile(format: CompilerFormat = 'ansi') {
        return this._ast.reduce((finalString, node) => {
            finalString += this._compileNode(node, format);
            return finalString;
        }, '');
    }

    private makeNodeImplementation(raw: AnsieNode): AnsieNodeImpl {
        switch (raw.node) {
            case ValidTags.body:
            case ValidTags.h1:
            case ValidTags.h2:
            case ValidTags.h3:
            case ValidTags.div:
            case ValidTags.p:
                return new BlockTextNodeImpl(raw);
            case ValidTags.text:
                return new RawTextNodeImpl(raw);
            case ValidTags.br:
                return new BreakNodeImpl(raw);
            case ValidTags.span:
                return new InlineTextNodeImpl(raw);
            case ValidTags.li:
                return new ListItemNodeImpl(raw);
            default:
                throw new CompilerError(
                    `Invalid node type: ${raw.node}`,
                    raw,
                    this._stack,
                    true,
                );
        }
    }

    private _push(state: AnsieNode, format: CompilerFormat = 'ansi') {
        const node = this.makeNodeImplementation(state);
        this._stack.push(node);
        return node.renderStart(this._stack, format);
    }

    private _pop(format: CompilerFormat = 'ansi') {
        const old = this._stack.pop();
        return old?.renderEnd(this._stack, format);
    }

    private _compileNode(
        node: AnsieNode,
        format: CompilerFormat = 'ansi',
    ): string {
        const strings: string[] = [];

        try {
            strings.push(this._push(node, format));

            if (node.content) {
                if (Array.isArray(node.content)) {
                    node.content.forEach(node =>
                        strings.push(this._compileNode(node)),
                    );
                } else {
                    strings.push(this._compileNode(node.content));
                }
            }

            const n = this._pop(format);
            if (n) {
                strings.push(n);
            }

            return strings.join('');
        } catch (e) {
            if (e instanceof CompilerError) {
                console.error(e.toString());
                if (!e.continue) {
                    throw e;
                }
            }
        }

        return '';
    }
}
