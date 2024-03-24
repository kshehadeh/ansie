import { type AnsieNode, isAttribute } from '../compiler/types';

export function renderNodeAsMarkupStart(node: AnsieNode) {
    const attribs = Object.entries(node)
        .filter(([key]) => isAttribute(key))
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');

    return `<${node.node}${attribs ? ` ${attribs}` : ''}>`;
}
export function renderNodeAsMarkupEnd(node: AnsieNode) {
    return `</${node.node}>`;
}
