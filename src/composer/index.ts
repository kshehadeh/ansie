import { compile } from '../compiler';
import type { CompilerFormat } from '../compiler/types';
import { ComposerNode } from './nodes';
import { BreakComposerNode } from './nodes/break';
import { ListItemComposerNode } from './nodes/li';
import { MarkupComponentNode } from './nodes/markup';
import {
    ParagraphComposerNode,
    H1ComposerNode,
    H2ComposerNode,
    H3ComposerNode,
    BodyComposerNode,
    RawTextComposerNode,
    SpanComposerNode,
    DivComposerNode,
} from './nodes/text';
import { defaultTheme, type AnsieTheme, type AnsieStyle } from './styles';
export class Composer {
    private _body: BodyComposerNode;
    private _theme: AnsieTheme;

    constructor(theme: AnsieTheme) {
        this._theme = theme;
        this._body = new BodyComposerNode({ theme });
    }

    public add(node: ComposerNode | ComposerNode[]) {
        const nodeArr = Array.isArray(node) ? node : [node];
        nodeArr.forEach(n => {
            n.theme = this._theme;
            this._body.add(n);
        });
    }

    toString() {
        return this._body.toString();
    }

    get theme() {
        return this._theme;
    }

    compile() {
        return this.compileTo('ansi');
    }

    compileTo(format: CompilerFormat) {
        return compile(this.toString(), format);
    }
}

function generateNodeFromAnyCompatibleType(
    node: ComposerNodeCompatible,
): ComposerNode {
    if (typeof node === 'string') {
        return text(node);
    } else if (typeof node === 'number') {
        return text(node.toString());
    } else if (typeof node === 'boolean') {
        return text(node.toString());
    } else if (node instanceof ComposerNode) {
        return node;
    } else {
        return text(`${node}`);
    }
}

type ComposerNodeCompatible = ComposerNode | string | number | boolean;

export function br() {
    return new BreakComposerNode();
}

export function markup(markup: string) {
    return new MarkupComponentNode({ content: markup });
}

export function text(text: string, style?: AnsieStyle) {
    return new RawTextComposerNode({ text, style });
}

export function li(
    nodes: ComposerNodeCompatible | ComposerNodeCompatible[],
    style?: AnsieStyle,
) {
    const n = Array.isArray(nodes) ? nodes : [nodes];
    return new ListItemComposerNode({
        nodes: n.map(generateNodeFromAnyCompatibleType),
        style,
    });
}

export function p(
    nodes: ComposerNodeCompatible | ComposerNodeCompatible[],
    style?: AnsieStyle,
) {
    const n = Array.isArray(nodes) ? nodes : [nodes];
    return new ParagraphComposerNode({
        nodes: n.map(generateNodeFromAnyCompatibleType),
        style,
    });
}

export function h1(
    nodes: ComposerNodeCompatible | ComposerNodeCompatible[],
    style?: AnsieStyle,
) {
    const n = Array.isArray(nodes) ? nodes : [nodes];
    return new H1ComposerNode({
        nodes: n.map(generateNodeFromAnyCompatibleType),
        style,
    });
}

export function h2(
    nodes: ComposerNodeCompatible | ComposerNodeCompatible[],
    style?: AnsieStyle,
) {
    const n = Array.isArray(nodes) ? nodes : [nodes];
    return new H2ComposerNode({
        nodes: n.map(generateNodeFromAnyCompatibleType),
        style,
    });
}

export function h3(
    nodes: ComposerNodeCompatible | ComposerNodeCompatible[],
    style?: AnsieStyle,
) {
    const n = Array.isArray(nodes) ? nodes : [nodes];
    return new H3ComposerNode({
        nodes: n.map(generateNodeFromAnyCompatibleType),
        style,
    });
}

export function body(
    nodes: ComposerNodeCompatible | ComposerNodeCompatible[],
    style?: AnsieStyle,
) {
    const n = Array.isArray(nodes) ? nodes : [nodes];
    return new BodyComposerNode({
        nodes: n.map(generateNodeFromAnyCompatibleType),
        style,
    });
}

export function div(
    nodes: ComposerNodeCompatible | ComposerNodeCompatible[],
    style?: AnsieStyle,
) {
    const n = Array.isArray(nodes) ? nodes : [nodes];
    return new DivComposerNode({
        nodes: n.map(generateNodeFromAnyCompatibleType),
        style,
    });
}

export function span(
    nodes: ComposerNodeCompatible | ComposerNodeCompatible[],
    style?: AnsieStyle,
) {
    const n = Array.isArray(nodes) ? nodes : [nodes];
    return new SpanComposerNode({
        nodes: n.map(generateNodeFromAnyCompatibleType),
        style,
    });
}

/**
 * Build a composer object out of a set of nodes and a theme.
 * @param composition
 * @param theme
 * @returns
 */
export function compose(
    composition: ComposerNode[] = [],
    theme: AnsieTheme = defaultTheme,
) {
    const c = new Composer(theme);
    c.add(composition);
    return c;
}

/////////////// FOR TESTING ONLY ///////////////

if (process.argv[1].includes('composer')) {
    // const result = compose([div('Hello World')]);

    // const result = compose([
    //     h1('Title'),
    //     h2('A subtitle'),
    //     p('Paragraph'),
    //     text('This is some text that is not formatted'),
    //     bundle(['Text', span('injected'), 'more text']),
    //     markup('<h1>Raw Markup</h1>')
    // ]).toString()

    // console.log(compose(([h1('Title'), h2('A subtitle'), p('Paragraph')])).toString())
    console.log(
        compose([h1('Title'), h2('A subtitle'), p('Paragraph')]).toString(),
    );
    // console.log(compose([
    //     h1('Title'),
    //     h2('A subtitle'),
    //     p('Paragraph'),
    // ]).compile())

    // const result = compose([
    //     bold(['Title', br()]),
    //     italics(['Subtitle', br()]),
    //     text('This is some text that is not formatted'),
    //     color('red', undefined, 'Some red text'),
    //     list('* ', ['One', 'Two', 'Three']),
    // ])

    // console.log(compile(result.toString()));

    // <color fg=red bg=green><bold>Hello World</bold></color>
}
