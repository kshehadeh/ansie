import {
    AnsieNode,
    TagAttributeMap,
    ValidTags,
    type Ast
} from '../compile/types';
import { convertMarkdownToAnsie } from '../utilities/convert-markdown-to-ansie';

import * as acorn from 'acorn';
import jsx from 'acorn-jsx';

type JSXExpression =
    | JSXElement
    | JSXOpeningElement
    | JSXClosingElement
    | JSXAttribute
    | JSXIdentifier
    | JSXText;
interface JSXIdentifier extends acorn.Node {
    type: 'JSXIdentifier';
    name: string;
}

interface JSXAttribute extends acorn.Node {
    type: 'JSXAttribute';
    name: JSXIdentifier;
    value: acorn.Literal;
}

interface JSXOpeningElement extends acorn.Node {
    type: 'JSXOpeningElement';
    name: JSXIdentifier;
    attributes: JSXAttribute[];
}

interface JSXClosingElement extends acorn.Node {
    type: 'JSXClosingElement';
    name: acorn.Node;
}

interface JSXText extends acorn.Node {
    type: 'JSXText';
    value: string;
}

interface JSXElement extends acorn.Node {
    type: 'JSXElement';
    openingElement: JSXOpeningElement;
    closingElement: JSXClosingElement;
    children: acorn.Node[];
}

/**
 * Parses a string into an AST using a simplified markdown syntax
 * The syntax supported is:
 *
 * - # text -> h1
 * - ## text -> h2
 * - ### text -> h3
 * - **text** -> bold
 * - *text* -> italics
 * - [c=red]text[/c] -> color
 *
 * @param input
 * @returns
 */

export default function parse(input: string): Ast | null {
    if (!input) {
        return null;
    }

    // Parse Markdown
    const preParse = convertMarkdownToAnsie(input);

    // Parse JSX
    try {
        const parsedJsx = acorn.Parser.extend(jsx()).parse(preParse, {
            sourceType: 'module',
            ecmaVersion: 2020
        });

        // Convert to Ansie
        return convertAcornAstToAnsieAst(parsedJsx);

    } catch (e) {
        throw new Error(`Error parsing "${input}": ${(e as Error).message}`);
    }
}

const isJsxNode = (node: acorn.Node): node is JSXExpression => {
    return node.type.startsWith('JSX');
};

/**
 * Takes the Acorn AST and converts it to an Ansie AST
 * @param node The JSX expression to convert
 * @returns An AnsieNode that represents the JSX expression
 */
function convertAcornNodeToAnsieNode(node: JSXExpression): AnsieNode {
    if (node.type === 'JSXElement') {
        const tagRaw = node.openingElement.name.name;
        if (tagRaw in ValidTags) {
            const tag = tagRaw as ValidTags;
            const validAttributes = TagAttributeMap[tag];

            // Simplify attributes
            const attributes = node.openingElement.attributes.reduce(
                (acc, att) => (
                    (acc[att.name.name.toString()] =
                        att.value?.value?.toString() || true.toString()),
                    acc
                ),
                {} as Record<string, string | boolean>
            );

            // Validate attributes
            const invalidAttributes = Object.keys(attributes).filter(
                attr => !(attr in validAttributes)
            );

            if (invalidAttributes.length) {
                throw new Error(
                    `Invalid attributes ${invalidAttributes.join(',')} for tag ${tag}`
                );
            }

            return {
                node: tag,
                ...attributes,
                content: node.children
                    // Filter out any non-JSX nodes
                    .filter((n): n is JSXExpression => isJsxNode(n))
                    // Convert to Ansie nodes
                    .map(convertAcornNodeToAnsieNode)
                    // Filter out any that were not processed properly
                    .filter((n): n is AnsieNode => !!n)
            };
        } else {
            throw new Error(`Invalid tag ${tagRaw}`);
        }
    } else if (node.type === 'JSXText') {
        return {
            node: ValidTags.text,
            value: node.value
        };
    }

    throw new Error(`Invalid node type ${node.type}`);
}

function convertAcornAstToAnsieAst(node: acorn.Program) {
    if (node.body.length === 0) {
        return null;
    }

    const root = node.body[0];
    if (root.type === 'ExpressionStatement') {
        if (isJsxNode(root.expression)) {
            return [convertAcornNodeToAnsieNode(root.expression)];
        }
    }
    throw new Error('Incompatible AST structure for Ansie translation');
}

// const testString = '<h1>Test<span bold>Bold text</span></h1>';
// const testString = 'This is a <span>Test</span> test';
// const postMarkdownMarkup = convertMarkdownToAnsie(testString);

// const parsed = acorn.Parser.extend(jsx()).parse(postMarkdownMarkup, {
//     sourceType: 'module',
//     ecmaVersion: 2020
// });

// // console.log(JSON.stringify(parsed, null, 2));

// const ast = convertAcornAstToAnsieAst(parsed);
// const str1 = JSON.stringify(ast, null, 2);

// const originalAst = parseAnsieMarkup(postMarkdownMarkup);
// const str2 = JSON.stringify(originalAst, null, 2);

// if (str1 === str2) {
//     console.log('Success');
// } else {
//     console.log('Failure');
// }
// console.log(str1);
// console.log(str2);
