import {
    AnsieNodeImpl,
    type AnsieNode,
    type Ast,
    ValidTags,
    type CompilerFormat
} from './types';
import { CompilerError } from './types';
import { BlockTextNodeImpl } from './node/block';
import { BreakNodeImpl } from './node/break';
import { RawTextNodeImpl } from './node/raw';
import { ListItemNodeImpl, ListNodeImpl } from './node/list';
import { InlineTextNodeImpl } from './node/inline';
import type { AnsieTheme } from '@/themes';

/**
 * The compiler takes the AST from the parser and compiles it into a string
 * @param ast Takes the AST from the compiled markup and stores for future operations.
 * @internal
 */
export class Compiler {
    private _ast: Ast;
    private _stack: AnsieNodeImpl[] = [];
    private _theme: AnsieTheme;

    /**
     * The compiler takes the AST from the parser and compiles it into a string
     * @param ast Takes the AST from the compiled markup and stores for future operations.
     */
    constructor(ast: Ast, theme: AnsieTheme) {
        this._ast = ast;
        this._theme = theme;
    }

    /**
     * The compile function takes the AST and compiles it into a string.
     * @returns A string that is the compiled markup.
     */
    public compile({
        format,
        theme
    }: {
        format: CompilerFormat;
        theme?: AnsieTheme;
    }): string {
        return this._ast.reduce((finalString, node) => {
            finalString += this._compileNode({ node, format, theme });
            return finalString;
        }, '');
    }

    private makeNodeImplementation(raw: AnsieNode): AnsieNodeImpl {
        switch (raw.node) {
            case ValidTags.body:
                return new BlockTextNodeImpl(raw, this._theme.body || {});
            case ValidTags.h1:
                return new BlockTextNodeImpl(raw, this._theme.h1 || {});
            case ValidTags.h2:
                return new BlockTextNodeImpl(raw, this._theme.h2 || {});
            case ValidTags.h3:
                return new BlockTextNodeImpl(raw, this._theme.h3 || {});
            case ValidTags.div:
                return new BlockTextNodeImpl(raw, this._theme.div || {});
            case ValidTags.p:
                return new BlockTextNodeImpl(raw, this._theme.p || {});
            case ValidTags.text:
                return new RawTextNodeImpl(raw, this._theme.text || {});
            case ValidTags.br:
                return new BreakNodeImpl(raw, this._theme.br || {});
            case ValidTags.span:
                return new InlineTextNodeImpl(raw, this._theme.span || {});
            case ValidTags.li:
                return new ListItemNodeImpl(raw, this._theme.li || {});
            case ValidTags.ul:
                return new ListNodeImpl(raw, this._theme.ul || {});
            default:
                throw new CompilerError(
                    `Invalid node type: ${raw.node}`,
                    raw,
                    this._stack,
                    true
                );
        }
    }

    private _push({
        state,
        format = 'ansi'
    }: {
        state: AnsieNode;
        theme?: AnsieTheme;
        format?: CompilerFormat;
    }) {
        const node = this.makeNodeImplementation(state);
        this._stack.push(node);
        return node.renderStart({ stack: this._stack, format });
    }

    private _pop({
        format = 'ansi'
    }: { theme?: AnsieTheme; format?: CompilerFormat } = {}) {
        const old = this._stack.pop();
        return old?.renderEnd({ stack: this._stack, format });
    }

    private _compileNode({
        node,
        theme,
        format = 'ansi'
    }: {
        node: AnsieNode;
        theme?: AnsieTheme;
        format?: CompilerFormat;
    }): string {
        const strings: string[] = [];

        try {
            strings.push(this._push({ state: node, format }));

            if (node.content) {
                if (Array.isArray(node.content)) {
                    node.content.forEach(node =>
                        strings.push(this._compileNode({ node, theme, format }))
                    );
                } else {
                    strings.push(
                        this._compileNode({
                            node: node.content,
                            theme,
                            format
                        })
                    );
                }
            }

            const n = this._pop({ format });
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
