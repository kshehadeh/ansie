import { parseString } from '../parser';

import { AnsieNodeImpl, type AnsieNode, type Ast, ValidTags } from './types';
import { CompilerError, type CompilerFormat } from './types';
import { BlockTextNodeImpl } from './node/block';
import { BreakNodeImpl } from './node/break';
import { RawTextNodeImpl } from './node/raw';
import { ListItemNodeImpl } from './node/list';
import { InlineTextNodeImpl } from './node/inline';

class Compiler {
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
        const strings = [];

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

            strings.push(this._pop(format));
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

export function compile(markup: string, format: CompilerFormat = 'ansi') {
    const ast = parseString(markup);
    if (ast) {
        const compiler = new Compiler(ast);
        return compiler.compile(format);
    } else {
        return '';
    }
}

if (process.argv[1].includes('compiler')) {
    // console.log(compile(`<body>
    // <h1 fg="red" marginBottom="1">H1 RED FOREGROUND</h1>
    //     <h2 fg="red" bg="blue" margin="5">RED FOREGROUND AND BLUE BACKGROUND</h2>
    //     <p fg="blue" marginTop="1">This is a paragraph</p>
    //     <p underline="single" marginTop="1" marginBottom="1">Underlined text with newline</p>
    //     <p underline="double" bold marginTop="2" marginBottom="1">Underlined text with newline</p>
    // </body>`));

    // console.log(compile(`
    // <h1 bold marginBottom="1">My Console App</h1>
    // <h2 fg="gray" marginBottom="1">A little something I wrote</h2>
    // <p marginBottom="1">
    //     In order to used this app, do the following:
    //     <li bullet="*" marginBottom="1"> Create a config file</li>
    //     <li bullet="*" marginBottom="1"> Run the utility with the -h flag</li>
    //     <li bullet="*" marginBottom="1"> etc...</li>
    // </p>

    console.log(
        compile(`    
    <h1 bold fg="blue" underline="double">My Console App</h1>
    <h2 bold fg="gray">A little something I wrote</h2>
    <br/>
    <p marginBottom="1">
        In order to used this app, do the following:
        <li>Create a config file</li>
        <li>Run the utility with the -h flag</li>
        <li>etc...</li>
    </p>
    `),
    );
}
