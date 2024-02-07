import { Composer, type ComposerNodeCompatible } from './Composer';
import { ComposerNode } from './nodes/ComposerNode';
import { BreakComposerNode } from './nodes/BreakComposerNode';
import { ListItemComposerNode } from './nodes/ListItemComposerNode';
import { MarkupComponentNode } from './nodes/MarkupComponentNode';
import { defaultTheme, type AnsieStyle, type AnsieTheme } from '../themes';
import { BodyComposerNode } from './nodes/BodyComposerNode';
import { DivComposerNode } from './nodes/DivComposerNode';
import { H1ComposerNode } from './nodes/H1ComposerNode';
import { H2ComposerNode } from './nodes/H2ComposerNode';
import { H3ComposerNode } from './nodes/H3ComposerNode';
import { ParagraphComposerNode } from './nodes/ParagraphComposerNode';
import { RawTextComposerNode } from './nodes/RawTextComposerNode';
import { SpanComposerNode } from './nodes/SpanComposerNode';

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
