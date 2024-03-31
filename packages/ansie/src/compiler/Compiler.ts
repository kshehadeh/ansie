import {
    AnsieNodeImpl,
    type AnsieNode,
    type Ast,
    ValidTags,
    type CompilerFormat,
    type AnsieWriter
} from './types';
import { CompilerError } from './types';
import { BlockTextNodeImpl } from './node/block';
import { BreakNodeImpl } from './node/break';
import { RawTextNodeImpl } from './node/raw';
import { ListItemNodeImpl } from './node/list';
import { InlineTextNodeImpl } from './node/inline';
import type { AnsieTheme } from '../themes/themes';

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
    public async compile({
        out,
        format,
        theme
    }: {
        out: AnsieWriter,
        format: CompilerFormat;
        theme?: AnsieTheme;
    }) {
        for (const node of this._ast) {
            await this._compileNode({ out, node, format, theme });
        }
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
            default:
                throw new CompilerError(
                    `Invalid node type: ${raw.node}`,
                    raw,
                    this._stack,
                    true
                );
        }
    }

    private async _push({
        out,
        state,
        format = 'ansi'
    }: {
        out: AnsieWriter;
        state: AnsieNode;
        theme?: AnsieTheme;
        format?: CompilerFormat;
    }): Promise<void> {
        const node = this.makeNodeImplementation(state);
        this._stack.push(node);
        await node.renderStart({ out, stack: this._stack, format });
    }

    private async _pop({
        out,
        format = 'ansi'
    }: {
        out: AnsieWriter;
        theme?: AnsieTheme;
        format?: CompilerFormat
    }): Promise<void> {
        const old = this._stack.pop();
        await old?.renderEnd({ out, stack: this._stack, format });
    }

    private async _compileNode({
        out,
        node,
        theme,
        format = 'ansi'
    }: {
        out: AnsieWriter,
        node: AnsieNode;
        theme?: AnsieTheme;
        format?: CompilerFormat;
    }) {
        try {
            await this._push({ out, state: node, format });
            if (node.content) {
                if (Array.isArray(node.content)) {
                    for (const child of node.content) {
                        await this._compileNode({ out, node: child, theme, format })
                    }
                } else {
                    await this._compileNode({
                        out,
                        node: node.content,
                        theme,
                        format
                    });
                }
            }

            await this._pop({ out, format });
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
