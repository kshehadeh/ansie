'use strict';

var marked = require('marked');
var acorn = require('acorn');
var jsx = require('acorn-jsx');
var util = require('util');
var tsDeepmerge = require('ts-deepmerge');
var prompts = require('@inquirer/prompts');
var node_async_hooks = require('node:async_hooks');
var externalEditor = require('external-editor');
var core = require('@inquirer/core');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(
                    n,
                    k,
                    d.get
                        ? d
                        : {
                              enumerable: true,
                              get: function () {
                                  return e[k];
                              }
                          }
                );
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var acorn__namespace = /*#__PURE__*/ _interopNamespaceDefault(acorn);

/**
 * This file contains all the types used by the parser and compiler.
 *
 * ‼️ IMPORTANT ‼️
 * IT'S IMPORTANT THAT THIS FILE IS NOT DEPENDENT ON ANY OTHER FILES IN THE PROJECT.
 *
 * This file is used by the parser and compiler.  It should not be dependent on any other
 * files in the project.  This is to avoid circular dependencies and any complexities that
 * may arise from them.
 *
/**
 * The canonical list of supported tags.  We should never be referring
 * to tags as raw strings.  Instead, we should be using this enum.  This
 * will help us avoid typos and make it easier to refactor later.
 */
var ValidTags;
(function (ValidTags) {
    ValidTags['h1'] = 'h1';
    ValidTags['h2'] = 'h2';
    ValidTags['h3'] = 'h3';
    ValidTags['body'] = 'body';
    ValidTags['span'] = 'span';
    ValidTags['p'] = 'p';
    ValidTags['div'] = 'div';
    ValidTags['text'] = 'text';
    ValidTags['li'] = 'li';
    ValidTags['ul'] = 'ul';
    ValidTags['br'] = 'br';
})(ValidTags || (ValidTags = {}));
/**
 * @internal
 */
const ColorAttributeValues = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'default',
    'brightblack',
    'brightred',
    'brightgreen',
    'brightyellow',
    'brightblue',
    'brightmagenta',
    'brightcyan',
    'gray'
];
/**
 * A list of all the valid boolean attribute values.  This is used by the parser to validate
 * the attributes for each tag before returning the AST.
 * @internal
 */
const booleanValues = ['true', 'false', 'yes', 'no', 'y', 'n', '1', '0'];
////// Space Attributes - These are the attributes that can be associated with semantic elements that have a concept of spacing such as <div> and <p>
/**
 * @internal
 */
const SpaceAttributes = {
    margin: ['number'],
    marginTop: ['number'],
    marginBottom: ['number'],
    marginLeft: ['number'],
    marginRight: ['number']
};
///// Text Attributes - These are the attributes that can be associated with text-based semantic elements such as <span> and <p>
const TextAttributes = {
    fg: ColorAttributeValues,
    bg: ColorAttributeValues,
    bold: [...booleanValues],
    italics: [...booleanValues],
    underline: [...booleanValues, 'single', 'double', 'none']
};
///////
///// List Attributes - These are the attributes that can be associated with text-based semantic elements such as <span> and <p>
/**
 * @internal
 */
const ListAttributes = {
    bullet: ['*', '-', '+'],
    indent: ['number']
};
///////
///// Raw Attributes - These are the attributes that can be associated with text-based semantic elements such as <span> and <p>
/**
 * @internal
 */
const RawTextAttributes = {
    value: ['string']
};
///////
/**
 * A list of all the valid attribute keys.  This is used by the parser to validate
 * the attributes for each tag before returning the AST.
 * @internal
 */
const AllAttributeKeysList = [
    ...Object.keys(SpaceAttributes),
    ...Object.keys(TextAttributes),
    ...Object.keys(ListAttributes),
    ...Object.keys(RawTextAttributes)
];
/**
 * A type guard to determine if a given key is a valid attribute.
 * @param key
 * @returns
 * @internal
 */
function isAttribute(key) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return AllAttributeKeysList.includes(key);
}
/**
 * This is a map of all the valid attributes for each tag.  This is used by the parser to
 * validate the attributes for each tag before returning the AST.
 * @internal
 */
const TagAttributeMap = {
    [ValidTags.h1]: {
        ...TextAttributes,
        ...SpaceAttributes
    },
    [ValidTags.h2]: {
        ...TextAttributes,
        ...SpaceAttributes
    },
    [ValidTags.h3]: {
        ...TextAttributes,
        ...SpaceAttributes
    },
    [ValidTags.body]: {
        ...TextAttributes,
        ...SpaceAttributes
    },
    [ValidTags.span]: {
        ...TextAttributes
    },
    [ValidTags.p]: {
        ...TextAttributes,
        ...SpaceAttributes
    },
    [ValidTags.div]: {
        ...TextAttributes,
        ...SpaceAttributes
    },
    [ValidTags.li]: {
        ...TextAttributes,
        ...SpaceAttributes,
        ...ListAttributes
    },
    [ValidTags.text]: {},
    [ValidTags.br]: {
        ...SpaceAttributes
    },
    [ValidTags.ul]: {
        ...SpaceAttributes
    }
};
/**
 * Wrap a node in the AST to provide rendering overridable methods.  It takes
 * a raw node from the AST produced by the parser.  This is then overridden by
 * the various node implementations to provide specialized rendering for each
 * node type.  For example, a <p> tag will render differently than a <span> tag.
 *
 * The _raw property is the original AST node.  It also provides
 * @internal
 */
class AnsieNodeImpl {
    _raw;
    _style;
    constructor(node, style) {
        this._raw = node;
        this._style = style;
    }
    get node() {
        return this._raw.node;
    }
    /**
     * Returns the attributes for this node.  This is a subset of the raw node
     * that only contains the attributes.  Attributes are anything that is not
     * "node" or "content".
     */
    get attributes() {
        return Object.entries(this._raw).reduce((acc, [key, value]) => {
            if (isAttribute(key) && typeof value === 'string') {
                acc[key] = value;
            }
            return acc;
        }, {});
    }
    /**
     * Returns a specific attribute value.
     * @param key
     * @returns
     */
    attr(key) {
        return this._raw[key];
    }
}
/**
 * Represents a compiler error.
 * @internal
 */
class CompilerError {
    name = 'CompilerError';
    message;
    fatal;
    markupNode;
    markupStack;
    /**
     * Creates a new instance of CompilerError.
     * @param message The error message.
     * @param markupNode The markup node associated with the error.
     * @param markupStack The stack of markup nodes leading to the error.
     * @param fatal Indicates whether the error is fatal or not. Default is false.
     */
    constructor(message, markupNode, markupStack, fatal = false) {
        this.message = message;
        this.markupNode = markupNode;
        this.markupStack = markupStack;
        this.fatal = fatal;
    }
    /**
     * Returns a string representation of the CompilerError.
     * @returns The string representation of the CompilerError.
     */
    toString() {
        return `${this.name}: ${this.message} (${this.markupNode.node}, ${this.markupStack.map(node => node.node).join(', ')})`;
    }
    /**
     * Determines whether the error can be continued or not.
     * @returns True if the error can be continued, false otherwise.
     */
    continue() {
        return !this.fatal;
    }
}

class AnsieRenderer extends marked.Renderer {
    simplified;
    constructor(simplified = false) {
        super();
        this.simplified = simplified;
    }
    code({ text }) {
        return `<p marginLeft="4" fg="gray">${text}</p>`;
    }
    blockquote({ text }) {
        return `<p marginLeft="4">${text}</p>`;
    }
    html({ text }) {
        // This html might contain markdown itself so split into lines, parse each line and then join
        //  back together
        const result = text
            .split('\n')
            .map(line => {
                // Remove surrounding html tags and then parse the contents of the inner text between the tags
                const withoutHtml = line
                    .replace(/^<[^>]+>/, '')
                    .replace(/<\/[^>]+>$/, '');
                const parsedContent = marked.parse(withoutHtml, {
                    async: false,
                    breaks: false,
                    gfm: true,
                    renderer: new AnsieRenderer(true)
                });
                return line.replace(withoutHtml, parsedContent);
            })
            .join('\n');
        return result;
    }
    heading(heading) {
        return super.heading(heading);
    }
    hr() {
        return '----';
    }
    list(list) {
        return list.raw;
    }
    listitem(item) {
        if (item.task) {
            return `<li>${this.checkbox({
                checked: item.checked || false
            })} ${item.text}</li>`;
        }
        return `<li>${item.text}</li>`;
    }
    checkbox(checkbox) {
        return checkbox.checked ? '[x]' : '[ ]';
    }
    paragraph(paragraph) {
        return this.simplified ? paragraph.text : `<p>${paragraph.text}</p>`;
    }
    table() {
        return '';
    }
    tablerow() {
        return '';
    }
    tablecell() {
        return '';
    }
    /**
     * span level renderer
     */
    strong(strong) {
        return `<span bold>${strong.text}</span>`;
    }
    em(em) {
        return `<span italics>${em.text}</span>`;
    }
    codespan(codespan) {
        return codespan.text;
    }
    br() {
        return '<br>';
    }
    del(del) {
        return `<span>\x1B[9m${del.text}\x1B[0m</span>`;
    }
    link(link) {
        const titleOrText = link.title || link.text;
        if (titleOrText === link.href) {
            return `🔗 <span fg="blue" underline="single">${link.href}</span>`;
        } else {
            return `🔗 ${titleOrText} (<span fg="blue" underline="single">${link.href}</span>)`;
        }
    }
    image(image) {
        const titleOrText = image.title || image.text;
        if (titleOrText === image.href) {
            return `📷 <span fg="blue" underline="single">${image.href}</span>`;
        } else {
            return `📷 ${titleOrText} (<span fg="blue" underline="single">${image.href}</span>)`;
        }
    }
    text(text) {
        return text.text;
    }
}
function containsMultipleTopLevelTags(htmlString) {
    // Match all tags that don't appear nested
    const topLevelTagPattern =
        /<(\w+)[^>]*>(?:(?!<\/\1>).)*<\/\1>|<(\w+)[^>]*\/>/g;
    const matches = htmlString.match(topLevelTagPattern);
    // Check if there are multiple top-level tags
    return !!matches && matches.length > 1;
}
function convertMarkdownToAnsie(input) {
    // Check to see if this uses HTML tags.  If it does, then opt out of
    //  doing the markdown parsing as there are too many conflicts with the
    //  markdown parsing and the HTML parsing
    let markup = input;
    if (!/<[^>]+>/.test(input)) {
        markup = marked.parse(input, {
            async: false,
            breaks: false,
            gfm: true,
            renderer: new AnsieRenderer()
        });
    }
    // If the input is not surrounded with a tag then surround with a
    //  span tag to ensure that the output is a valid ANSIE document
    if (/^<[^>]+>/.test(markup) === false) {
        return `<span>${markup}</span>`;
    }
    if (containsMultipleTopLevelTags(markup)) {
        return `<body>${markup}</body>`;
    }
    return markup;
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
function parse(input) {
    if (!input) {
        return null;
    }
    // Parse Markdown
    const preParse = convertMarkdownToAnsie(input);
    // Parse JSX
    try {
        const parsedJsx = acorn__namespace.Parser.extend(jsx()).parse(
            preParse,
            {
                sourceType: 'module',
                ecmaVersion: 2020
            }
        );
        // Convert to Ansie
        return convertAcornAstToAnsieAst(parsedJsx);
    } catch (e) {
        throw new Error(`Error parsing "${input}": ${e.message}`);
    }
}
const isJsxNode = node => {
    return node.type.startsWith('JSX');
};
/**
 * Takes the Acorn AST and converts it to an Ansie AST
 * @param node The JSX expression to convert
 * @returns An AnsieNode that represents the JSX expression
 */
function convertAcornNodeToAnsieNode(node) {
    if (node.type === 'JSXElement') {
        const tagRaw = node.openingElement.name.name;
        if (tagRaw in ValidTags) {
            const tag = tagRaw;
            const validAttributes = TagAttributeMap[tag];
            // Simplify attributes
            const attributes = node.openingElement.attributes.reduce(
                (acc, att) => (
                    (acc[att.name.name.toString()] =
                        att.value?.value?.toString() || true.toString()),
                    acc
                ),
                {}
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
                    .filter(n => isJsxNode(n))
                    // Convert to Ansie nodes
                    .map(convertAcornNodeToAnsieNode)
                    // Filter out any that were not processed properly
                    .filter(n => !!n)
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
function convertAcornAstToAnsieAst(node) {
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

function num(n) {
    if (typeof n === 'number') {
        return n;
    }
    if (typeof n === 'string') {
        return Number(n);
    }
    if (typeof n === 'boolean') {
        return n ? 1 : 0;
    }
    return 0;
}

function getSpacingFromProperties(node, style) {
    const left = num(
        node.marginLeft ?? node.margin ?? style?.spacing?.marginLeft ?? 0
    );
    const right = num(
        node.marginRight ?? node.margin ?? style?.spacing?.marginRight ?? 0
    );
    const top = num(
        node.marginTop ?? node.margin ?? style?.spacing?.marginTop ?? 0
    );
    const bottom = num(
        node.marginBottom ?? node.margin ?? style?.spacing?.marginBottom ?? 0
    );
    const vpre = top ? '\n'.repeat(top) : '';
    const vpost = bottom ? '\n'.repeat(bottom) : '';
    const hpre = left ? ' '.repeat(left) : '';
    const hpost = right ? ' '.repeat(right) : '';
    return {
        on: `${vpre}${hpre}`,
        off: `${hpost}${vpost}`
    };
}

/**
 * Renders the space attributes for a node prepending the appropriate spacing escape codes.
 * @param attributes
 * @param format
 * @returns
 */
function renderSpaceAttributesStart({ node, format, style }) {
    if (format === 'ansi') {
        return getSpacingFromProperties(node, style).on;
    } else if (format === 'markup') {
        return Object.entries(node)
            .filter(([key]) => Object.keys(SpaceAttributes).includes(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    } else {
        return '';
    }
}
/**
 * Renders the space attributes for a node appending the appropriate spacing escape codes.
 * @param attributes
 * @param format
 * @returns
 */
function renderSpaceAttributesEnd({ style, attributes, format }) {
    if (format === 'ansi') {
        return getSpacingFromProperties(attributes, style).off;
    } else if (format === 'markup') {
        return '';
    } else {
        return '';
    }
}

// A set of variables that map to the ANSI escape codes for terminal manipulation
// and colorization.  See https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
// for more information.
var TerminalStyle;
(function (TerminalStyle) {
    // Reset all styles
    TerminalStyle[(TerminalStyle['reset'] = 0)] = 'reset';
    // Text Styles
    TerminalStyle[(TerminalStyle['bold'] = 1)] = 'bold';
    TerminalStyle[(TerminalStyle['boldOff'] = 22)] = 'boldOff';
    TerminalStyle[(TerminalStyle['italic'] = 3)] = 'italic';
    TerminalStyle[(TerminalStyle['italicOff'] = 23)] = 'italicOff';
    TerminalStyle[(TerminalStyle['underline'] = 4)] = 'underline';
    TerminalStyle[(TerminalStyle['doubleunderline'] = 21)] = 'doubleunderline';
    TerminalStyle[(TerminalStyle['underlineOff'] = 24)] = 'underlineOff';
    TerminalStyle[(TerminalStyle['inverse'] = 7)] = 'inverse';
    TerminalStyle[(TerminalStyle['inverseOff'] = 27)] = 'inverseOff';
    TerminalStyle[(TerminalStyle['hidden'] = 8)] = 'hidden';
    TerminalStyle[(TerminalStyle['hiddenOff'] = 28)] = 'hiddenOff';
    TerminalStyle[(TerminalStyle['strikethrough'] = 9)] = 'strikethrough';
    TerminalStyle[(TerminalStyle['strikethroughOff'] = 29)] =
        'strikethroughOff';
    // *** Foreground Colors
    TerminalStyle[(TerminalStyle['fgBlack'] = 30)] = 'fgBlack';
    TerminalStyle[(TerminalStyle['fgRed'] = 31)] = 'fgRed';
    TerminalStyle[(TerminalStyle['fgGreen'] = 32)] = 'fgGreen';
    TerminalStyle[(TerminalStyle['fgYellow'] = 33)] = 'fgYellow';
    TerminalStyle[(TerminalStyle['fgBlue'] = 34)] = 'fgBlue';
    TerminalStyle[(TerminalStyle['fgMagenta'] = 35)] = 'fgMagenta';
    TerminalStyle[(TerminalStyle['fgCyan'] = 36)] = 'fgCyan';
    TerminalStyle[(TerminalStyle['fgWhite'] = 37)] = 'fgWhite';
    TerminalStyle[(TerminalStyle['fgBrightred'] = 91)] = 'fgBrightred';
    TerminalStyle[(TerminalStyle['fgBrightgreen'] = 92)] = 'fgBrightgreen';
    TerminalStyle[(TerminalStyle['fgBrightyellow'] = 93)] = 'fgBrightyellow';
    TerminalStyle[(TerminalStyle['fgBrightblue'] = 94)] = 'fgBrightblue';
    TerminalStyle[(TerminalStyle['fgBrightmagenta'] = 95)] = 'fgBrightmagenta';
    TerminalStyle[(TerminalStyle['fgBrightcyan'] = 96)] = 'fgBrightcyan';
    TerminalStyle[(TerminalStyle['fgBrightwhite'] = 97)] = 'fgBrightwhite';
    TerminalStyle[(TerminalStyle['fgGray'] = 90)] = 'fgGray';
    // Resets foreground color to default
    TerminalStyle[(TerminalStyle['fgDefault'] = 39)] = 'fgDefault';
    // *** Background Colors
    TerminalStyle[(TerminalStyle['bgBlack'] = 40)] = 'bgBlack';
    TerminalStyle[(TerminalStyle['bgRed'] = 41)] = 'bgRed';
    TerminalStyle[(TerminalStyle['bgGreen'] = 42)] = 'bgGreen';
    TerminalStyle[(TerminalStyle['bgYellow'] = 43)] = 'bgYellow';
    TerminalStyle[(TerminalStyle['bgBlue'] = 44)] = 'bgBlue';
    TerminalStyle[(TerminalStyle['bgMagenta'] = 45)] = 'bgMagenta';
    TerminalStyle[(TerminalStyle['bgCyan'] = 46)] = 'bgCyan';
    TerminalStyle[(TerminalStyle['bgWhite'] = 47)] = 'bgWhite';
    TerminalStyle[(TerminalStyle['bgBrightred'] = 101)] = 'bgBrightred';
    TerminalStyle[(TerminalStyle['bgBrightgreen'] = 102)] = 'bgBrightgreen';
    TerminalStyle[(TerminalStyle['bgBrightyellow'] = 103)] = 'bgBrightyellow';
    TerminalStyle[(TerminalStyle['bgBrightblue'] = 104)] = 'bgBrightblue';
    TerminalStyle[(TerminalStyle['bgBrightmagenta'] = 105)] = 'bgBrightmagenta';
    TerminalStyle[(TerminalStyle['bgBrightcyan'] = 106)] = 'bgBrightcyan';
    TerminalStyle[(TerminalStyle['bgBrightwhite'] = 107)] = 'bgBrightwhite';
    TerminalStyle[(TerminalStyle['bgGray'] = 100)] = 'bgGray';
    // Resets background color to default
    TerminalStyle[(TerminalStyle['bgDefault'] = 49)] = 'bgDefault';
    // *** Containers
    TerminalStyle[(TerminalStyle['framed'] = 51)] = 'framed';
    TerminalStyle[(TerminalStyle['encircled'] = 52)] = 'encircled';
    TerminalStyle[(TerminalStyle['overline'] = 53)] = 'overline';
})(TerminalStyle || (TerminalStyle = {}));
// Given a name or array of names, return the ANSI escape code for that name.
function escapeCodeFromName(names) {
    if (names.length === 0) {
        return '';
    }
    const codeString = names.join(';');
    return `\x1b[${codeString}m`;
}

function toTitleCase(str) {
    return str ? str[0].toUpperCase() + str.slice(1) : '';
}

/**
 * Retrieves the escape codes for the given text attributes.  It will return both the escape codes for turning
 * on and off the text attributes.
 * @param properties The text attributes.
 * @returns An object containing the escape codes for turning on and off the specified text attributes.
 */
function getTextEscapeCodesFromProperties(properties, style) {
    const on = [];
    const off = [];
    const fg = properties.fg ?? style?.font?.color?.fg;
    const bg = properties.bg ?? style?.font?.color?.bg;
    const bold = properties.bold ?? style?.font?.bold;
    const underline = properties.underline ?? style?.font?.underline;
    const italics = properties.italics ?? style?.font?.italics;
    if (fg) {
        on.push(colorToTerminalStyle(fg, true));
        off.push(TerminalStyle.fgDefault);
    }
    if (bg) {
        on.push(colorToTerminalStyle(bg, false));
        off.push(TerminalStyle.bgDefault);
    }
    if (bold) {
        on.push(TerminalStyle.bold);
        off.push(TerminalStyle.boldOff);
    }
    if (underline) {
        if (typeof underline === 'string' && underline === 'single') {
            on.push(TerminalStyle.underline);
        } else if (typeof underline === 'string' && underline === 'double') {
            on.push(TerminalStyle.doubleunderline);
        } else if (typeof underline === 'boolean' && underline) {
            on.push(TerminalStyle.underline);
        }
        off.push(TerminalStyle.underlineOff);
    }
    if (italics) {
        on.push(TerminalStyle.italic);
        off.push(TerminalStyle.italicOff);
    }
    return {
        on: on.length > 0 ? escapeCodeFromName(on) : '',
        off: off.length > 0 ? escapeCodeFromName(off) : ''
    };
}
function colorToTerminalStyle(color, foreground) {
    if (foreground) {
        return TerminalStyle[`fg${toTitleCase(color)}`];
    } else {
        return TerminalStyle[`bg${toTitleCase(color)}`];
    }
}

/**
 * Renders the text attributes for a node prepending the appropriate text escape codes.
 * @param attributes
 * @param format
 * @returns
 */
function renderTextAttributesStart({ style, attributes, format = 'ansi' }) {
    if (format === 'ansi') {
        return getTextEscapeCodesFromProperties(attributes, style).on;
    } else if (format === 'markup') {
        return Object.entries(attributes)
            .filter(([key]) => isAttribute(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    }
}
/**
 * Renders the text attributes for a node appending the appropriate text escape codes.
 * @param attributes
 * @param format
 * @returns
 */
function renderTextAttributesEnd({ style, attributes, format = 'ansi' }) {
    if (format === 'ansi') {
        return getTextEscapeCodesFromProperties(attributes, style).off;
    } else if (format === 'markup') {
        return '';
    }
}

function renderNodeAsMarkupStart(node) {
    const attribs = Object.entries(node)
        .filter(([key]) => isAttribute(key))
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    return `<${node.node}${attribs ? ` ${attribs}` : ''}>`;
}
function renderNodeAsMarkupEnd(node) {
    return `</${node.node}>`;
}

class BlockTextNodeImpl extends AnsieNodeImpl {
    renderStart({ stack, format }) {
        if (format === 'ansi') {
            return (
                renderSpaceAttributesStart({
                    node: this._raw,
                    format,
                    style: this._style
                }) +
                renderTextAttributesStart({
                    style: this._style,
                    attributes: this._raw,
                    format
                })
            );
        } else if (format === 'markup') {
            return renderNodeAsMarkupStart(this._raw);
        } else {
            throw new CompilerError(
                `Invalid format: ${format}`,
                this._raw,
                stack,
                false
            );
        }
    }
    renderEnd({ stack, format = 'ansi' }) {
        if (format === 'ansi') {
            return `${renderTextAttributesEnd({
                style: this._style,
                attributes: this._raw,
                format
            })}${renderSpaceAttributesEnd({
                attributes: this._raw,
                format,
                style: this._style
            })}`;
        } else if (format === 'markup') {
            return renderNodeAsMarkupEnd(this._raw);
        } else {
            throw new CompilerError(
                `Invalid format: ${format}`,
                this._raw,
                stack,
                false
            );
        }
    }
}

//// Break Node - This is a node that represents a line break
class BreakNodeImpl extends AnsieNodeImpl {
    renderStart({ stack, format }) {
        if (format === 'ansi') {
            return '\n'.repeat(this._style?.spacing?.marginBottom || 1);
        } else if (format === 'markup') {
            return '<br/>';
        }
        throw new CompilerError(
            `Invalid format: ${format}`,
            this._raw,
            stack,
            false
        );
    }
    renderEnd() {
        return '';
    }
}

class RawTextMutator {
    _str;
    static EmojiMap = {
        ':exclamation:': '❗',
        ':warning:': '⚠️',
        ':no_entry:': '⛔',
        ':heavy_check_mark:': '✔️',
        ':x:': '❌',
        ':info:': 'ℹ️',
        ':question:': '❓',
        ':prompt:': '💬',
        ':check:': '✅',
        ':bangbang:': '‼️',
        ':triangular_flag_on_post:': '🚩',
        ':fire:': '🔥',
        ':sos:': '🆘',
        ':lock:': '🔒',
        ':key:': '🔑',
        ':heart:': '❤️',
        ':broken_heart:': '💔',
        ':skull_and_crossbones:': '☠️',
        ':grin:': '😁',
        ':joy:': '😂',
        ':heart_eyes:': '😍',
        ':smirk:': '😏',
        ':sunglasses:': '😎',
        ':thumbsup:': '👍',
        ':thumbsdown:': '👎',
        ':clap:': '👏',
        ':pray:': '🙏',
        ':cry:': '😢',
        ':sob:': '😭',
        ':rocket:': '🚀',
        ':sunny:': '☀️',
        ':umbrella:': '☔',
        ':camera:': '📷',
        ':book:': '📖',
        ':moneybag:': '💰',
        ':gift:': '🎁',
        ':bell:': '🔔',
        ':hammer:': '🔨',
        ':thumbsup::skin-tone-2:': '👍🏻',
        ':thumbsup::skin-tone-3:': '👍🏼',
        ':thumbsup::skin-tone-4:': '👍🏽',
        ':thumbsup::skin-tone-5:': '👍🏾',
        ':thumbsup::skin-tone-6:': '👍🏿'
    };
    constructor(str) {
        this._str = str;
    }
    get str() {
        return this.toString();
    }
    replaceEmoji() {
        const emojiMatches = this._str.match(/:[a-z_]+:/g);
        if (emojiMatches) {
            emojiMatches.forEach(match => {
                const emoji = RawTextMutator.EmojiMap[match];
                if (emoji) {
                    this._str = this._str.replace(match, emoji);
                }
            });
        }
        return this;
    }
    trimSpaces(options) {
        // Construct a regex pattern based on the options
        const whiteSpacePattern = options.allowNewLines
            ? '[ \\t\\v\\v]'
            : '\\s';
        const leftPattern = options.left ? `^${whiteSpacePattern}+` : '';
        const rightPattern = options.right ? `${whiteSpacePattern}+$` : '';
        const pattern = new RegExp(`${leftPattern}|${rightPattern}`, 'g');
        this._str = this._str.replace(
            pattern,
            options.replaceWithSingleSpace ? ' ' : ''
        );
        return this;
    }
    toString() {
        return this._str;
    }
}

class RawTextNodeImpl extends AnsieNodeImpl {
    renderStart({ format }) {
        const text = this.attr('value') ?? '';
        if (format === 'markup') {
            return text;
        } else {
            return new RawTextMutator(text)
                .replaceEmoji()
                .trimSpaces({
                    left: true,
                    right: true,
                    allowNewLines: false,
                    replaceWithSingleSpace: true
                })
                .toString();
        }
    }
    renderEnd() {
        return '';
    }
}

function getListItemFromProperties(node, style) {
    const bullet = node.bullet ? node.bullet : (style?.list?.bullet ?? '');
    const indent = node.indent
        ? ' '.repeat(num(node.indent))
        : ' '.repeat(style?.list?.indent ?? 0);
    return {
        on: `${bullet}${indent}`,
        off: ''
    };
}

function renderListAttributesStart({ node, style, format = 'ansi' }) {
    if (format === 'ansi') {
        return getListItemFromProperties(node, style).on;
    } else if (format === 'markup') {
        return Object.entries(node)
            .filter(([key]) => Object.keys(ListAttributes).includes(key))
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    } else {
        return '';
    }
}
function renderListAttributesEnd({ node, style, format = 'ansi' }) {
    if (format === 'ansi') {
        return getListItemFromProperties(node, style).off;
    } else if (format === 'markup') {
        return '';
    } else {
        return '';
    }
}

class ListItemNodeImpl extends AnsieNodeImpl {
    renderStart({ stack, format }) {
        if (format === 'ansi') {
            return (
                renderSpaceAttributesStart({
                    node: this._raw,
                    format,
                    style: this._style
                }) +
                renderListAttributesStart({
                    node: this._raw,
                    format,
                    style: this._style
                }) +
                renderTextAttributesStart({
                    attributes: this._raw,
                    format,
                    style: this._style
                })
            );
        } else if (format === 'markup') {
            return renderNodeAsMarkupStart(this._raw);
        }
        throw new CompilerError(
            `Invalid format: ${format}`,
            this._raw,
            stack,
            false
        );
    }
    renderEnd({ format = 'ansi' }) {
        if (format === 'ansi') {
            return (
                renderTextAttributesEnd({
                    style: this._style,
                    attributes: this._raw,
                    format
                }) +
                renderListAttributesEnd({
                    node: this._raw,
                    format,
                    style: this._style
                }) +
                renderSpaceAttributesEnd({
                    attributes: this._raw,
                    format,
                    style: this._style
                })
            );
        } else if (format === 'markup') {
            return renderNodeAsMarkupEnd(this._raw);
        } else {
            return '';
        }
    }
}
class ListNodeImpl extends AnsieNodeImpl {
    renderStart({ stack, format }) {
        if (format === 'ansi') {
            return renderSpaceAttributesStart({
                node: this._raw,
                format,
                style: this._style
            });
        } else if (format === 'markup') {
            return renderNodeAsMarkupStart(this._raw);
        }
        throw new CompilerError(
            `Invalid format: ${format}`,
            this._raw,
            stack,
            false
        );
    }
    renderEnd({ format = 'ansi' }) {
        if (format === 'ansi') {
            return renderSpaceAttributesEnd({
                attributes: this._raw,
                format,
                style: this._style
            });
        } else if (format === 'markup') {
            return renderNodeAsMarkupEnd(this._raw);
        } else {
            return '';
        }
    }
}

class InlineTextNodeImpl extends AnsieNodeImpl {
    renderStart({ stack, format }) {
        if (format === 'ansi') {
            return (
                renderSpaceAttributesStart({
                    node: this._raw,
                    format,
                    style: this._style
                }) +
                renderTextAttributesStart({
                    style: this._style,
                    attributes: this._raw,
                    format
                })
            );
        } else if (format === 'markup') {
            return renderNodeAsMarkupStart(this._raw);
        } else {
            throw new CompilerError(
                `Invalid format: ${format}`,
                this._raw,
                stack,
                false
            );
        }
    }
    renderEnd({ stack, format = 'ansi' }) {
        if (format === 'ansi') {
            return `${renderTextAttributesEnd({
                style: this._style,
                attributes: this._raw,
                format
            })}${renderSpaceAttributesEnd({
                attributes: this._raw,
                format,
                style: this._style
            })}`;
        } else if (format === 'markup') {
            return renderNodeAsMarkupEnd(this._raw);
        } else {
            throw new CompilerError(
                `Invalid format: ${format}`,
                this._raw,
                stack,
                false
            );
        }
    }
}

/**
 * The compiler takes the AST from the parser and compiles it into a string
 * @param ast Takes the AST from the compiled markup and stores for future operations.
 * @internal
 */
class Compiler {
    _ast;
    _stack = [];
    _theme;
    /**
     * The compiler takes the AST from the parser and compiles it into a string
     * @param ast Takes the AST from the compiled markup and stores for future operations.
     */
    constructor(ast, theme) {
        this._ast = ast;
        this._theme = theme;
    }
    /**
     * The compile function takes the AST and compiles it into a string.
     * @returns A string that is the compiled markup.
     */
    compile({ format, theme }) {
        return this._ast.reduce((finalString, node) => {
            finalString += this._compileNode({ node, format, theme });
            return finalString;
        }, '');
    }
    makeNodeImplementation(raw) {
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
    _push({ state, format = 'ansi' }) {
        const node = this.makeNodeImplementation(state);
        this._stack.push(node);
        return node.renderStart({ stack: this._stack, format });
    }
    _pop({ format = 'ansi' } = {}) {
        const old = this._stack.pop();
        return old?.renderEnd({ stack: this._stack, format });
    }
    _compileNode({ node, theme, format = 'ansi' }) {
        const strings = [];
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

var themes = {
    set: setGlobalTheme,
    get: getGlobalTheme,
    reset: resetGlobalTheme,
    build: buildTheme
};
const cleanStyle = {
    font: {
        color: {
            fg: 'default',
            bg: 'default'
        },
        bold: false,
        underline: 'none',
        italics: false
    },
    list: {
        bullet: '* ',
        indent: 1
    },
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0
    }
};
const body = {
    font: {
        color: {
            fg: 'default',
            bg: 'default'
        },
        bold: false,
        underline: 'none',
        italics: false
    },
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0
    }
};
const text = body;
const br = {
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0
    }
};
const h1 = {
    font: {
        color: {
            fg: 'blue'
        },
        bold: true,
        underline: 'double',
        italics: false
    },
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 1
    }
};
const h2 = {
    font: {
        color: {
            fg: 'default'
        },
        bold: true,
        underline: 'single',
        italics: false
    },
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 1
    }
};
const h3 = {
    font: {
        color: {
            fg: 'gray'
        },
        bold: true,
        underline: 'none',
        italics: false
    },
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 1
    }
};
const p = {
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0
    }
};
const span = {};
const li = {
    list: {
        bullet: '* ',
        indent: 1
    },
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 1
    }
};
const div = {
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0
    }
};
const ul = {
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0
    }
};
const defaultTheme = {
    h1: { ...cleanStyle, ...h1 },
    h2: { ...cleanStyle, ...h2 },
    h3: { ...cleanStyle, ...h3 },
    body: { ...cleanStyle, ...body },
    p: { ...cleanStyle, ...p },
    li: { ...cleanStyle, ...li },
    ul: { ...cleanStyle, ...ul },
    span: { ...cleanStyle, ...span },
    div: { ...cleanStyle, ...div },
    br: { ...cleanStyle, ...br },
    text: { ...cleanStyle, ...text }
};
let _globalTheme = defaultTheme;
/**
 * This will set the global theme which is used whenever a theme is
 * not given explicitly.
 * @param theme
 */
function setGlobalTheme(theme) {
    _globalTheme = buildTheme(theme, _globalTheme);
}
/**
 * Resets the global theme to the default theme.
 */
function resetGlobalTheme() {
    _globalTheme = defaultTheme;
}
/**
 * Gets the globally set theme.
 * @returns
 */
function getGlobalTheme() {
    return _globalTheme;
}
function buildTheme(themeFragment, originTheme) {
    return tsDeepmerge.merge(originTheme, themeFragment);
}
/**
 * Sets the global theme to the default theme.
 */
setGlobalTheme(defaultTheme);

/**
 * Compiles the markup into a string.
 * @param optionsOrMarkup Options or the markup to compile (with default options)
 * @returns
 */
var compile = optionsOrMarkup => {
    let theme = themes.get();
    let markup = '';
    let output = 'ansi';
    if (typeof optionsOrMarkup === 'string') {
        markup = optionsOrMarkup;
    } else {
        markup = optionsOrMarkup.markup;
        theme = optionsOrMarkup.theme ?? theme;
        output = optionsOrMarkup.output ?? 'ansi';
    }
    const ast = parse(markup);
    if (ast) {
        const compiler = new Compiler(ast, theme);
        return compiler.compile({ format: output, theme });
    } else {
        return '';
    }
};

var index$1 = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log: (message, ...optionalParams) => {
        const logWithMarkup = util.format(message, ...optionalParams);
        console.log(compile(logWithMarkup));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (message, ...optionalParams) => {
        const logWithMarkup = util.format(message, ...optionalParams);
        console.error(compile(logWithMarkup));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (message, ...optionalParams) => {
        const logWithMarkup = util.format(message, ...optionalParams);
        console.info(compile(logWithMarkup));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (message, ...optionalParams) => {
        const logWithMarkup = util.format(message, ...optionalParams);
        console.warn(compile(logWithMarkup));
    }
};

var editor = core.createPrompt((config, done) => {
    const { waitForUseInput = true, validate = () => true } = config;
    const theme = core.makeTheme(config.theme);
    const [status, setStatus] = core.useState('pending');
    const [value, setValue] = core.useState(config.default || '');
    const [errorMsg, setError] = core.useState(undefined);
    const hasDefault = typeof config.default !== 'undefined';
    const prefix = core.usePrefix({ status, theme });
    function startEditor(rl) {
        rl.pause();
        externalEditor.editAsync(
            value,
            // Note: The bind call isn't strictly required. But we need it for our mocks to work as expected.
            node_async_hooks.AsyncResource.bind(async (error, answer) => {
                rl.resume();
                if (error) {
                    setError(error.toString());
                } else {
                    setStatus('loading');
                    const isValid = await validate(answer);
                    if (isValid === true) {
                        setError(undefined);
                        setStatus('done');
                        done(answer);
                    } else {
                        setValue(answer);
                        setError(isValid || 'You must provide a valid value');
                        setStatus('pending');
                    }
                }
            }),
            {
                postfix: config.postfix || '.txt'
            }
        );
    }
    core.useEffect(rl => {
        if (!waitForUseInput) {
            startEditor(rl);
        }
    }, []);
    core.useKeypress((key, rl) => {
        // Ignore keypress while our prompt is doing other processing.
        if (status !== 'pending') {
            return;
        }
        if (key.name === 'e') {
            startEditor(rl);
        } else {
            if (core.isEnterKey(key) && hasDefault) {
                done(value);
            }
        }
    });
    const message = theme.style.message(config.message, 'done');
    let helpTip = '';
    if (status === 'loading') {
        helpTip = theme.style.help('Received');
    } else if (status === 'pending') {
        const enterKey = theme.style.key('enter');
        const eKey = theme.style.key('e');
        if (hasDefault) {
            helpTip = theme.style.help(
                `Press ${eKey} to begin editing or ${enterKey} to use default('${value}').`
            );
        } else {
            helpTip = theme.style.help(`Press ${eKey} to begin editing.`);
        }
    }
    let error = '';
    if (errorMsg) {
        error = theme.style.error(errorMsg);
    }
    return [[prefix, message, helpTip].filter(Boolean).join(' '), error];
});

var confirm = core.createPrompt((config, done) => {
    const { short: trueShort = 'Y', long: trueLong = 'Yes' } =
        config.trueValue || {};
    const { short: falseShort = 'N', long: falseLong = 'No' } =
        config.falseValue || {};
    const trueRegExp = new RegExp(`^(${trueShort}|${trueLong})$`, 'i');
    const falseRegExp = new RegExp(`^(${falseShort}|${falseLong})$`, 'i');
    const { transformer = answer => (answer ? trueLong : falseLong) } = config;
    const [status, setStatus] = core.useState('pending');
    const [value, setValue] = core.useState('');
    const theme = core.makeTheme(config.theme);
    const prefix = core.usePrefix({ theme });
    core.useKeypress((key, rl) => {
        if (core.isEnterKey(key)) {
            let answer = config.default !== false;
            if (trueRegExp.test(value)) answer = true;
            else if (falseRegExp.test(value)) answer = false;
            setValue(transformer(answer));
            setStatus('done');
            done(answer);
        } else {
            setValue(rl.line);
        }
    });
    let formattedValue = value;
    let defaultValue = '';
    if (status === 'done') {
        formattedValue = theme.style.answer(value);
    } else {
        defaultValue = ` ${theme.style.defaultAnswer(
            config.default === false
                ? `${trueShort.toLowerCase()}/${falseShort.toUpperCase()}`
                : `${trueShort.toUpperCase()}/${falseShort.toLowerCase()}`
        )}`;
    }
    const message = theme.style.message(config.message, 'done');
    return `${prefix} ${message}${defaultValue} ${formattedValue}`;
});

const SEPARATOR_LINE = '----';
var index = {
    text: askSingleLineText,
    selectEx: askSelectEx,
    select: askSelect,
    password: askPassword,
    confirm: askYesNo,
    multiline: askMultilineText,
    search: askSearch
};
const promptTheme = themes.build(
    {
        p: {
            spacing: {
                margin: 0,
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0
            }
        }
    },
    themes.get()
);
function compileForPrompt(prompt) {
    if (prompt === SEPARATOR_LINE) {
        // This is a separator - don't do any preprocessing
        return prompt;
    }
    const compiledPrompt = compile({ markup: prompt, theme: promptTheme });
    // Remove any newlines at the beginning and end
    return compiledPrompt.replaceAll(/^\n+|\n+$/g, '');
}
async function askMultilineText(prompt, defaultValue) {
    return editor({
        message: compileForPrompt(prompt),
        default: defaultValue
    });
}
async function askSingleLineText(prompt, defaultValue) {
    return prompts.input({
        message: compileForPrompt(prompt),
        default: defaultValue
    });
}
async function askPassword(prompt, mask = '\u{25CF}') {
    return prompts.password({
        message: compileForPrompt(prompt),
        mask: mask
    });
}
async function askYesNo(prompt, defaulValue, trueFalse) {
    const tf = trueFalse || { trueValue: 'Yes', falseValue: 'No' };
    return confirm({
        default: defaulValue,
        message: compileForPrompt(prompt),
        trueValue: {
            short: tf.trueValue[0],
            long: tf.trueValue
        },
        falseValue: {
            short: tf.falseValue[0],
            long: tf.falseValue
        }
    });
}
async function askSearch(prompt, searchFn) {
    return prompts.search({
        message: compileForPrompt(prompt),
        source: searchFn
    });
}
async function askSelectEx(prompt, choices, defaultValue = '', loop = false) {
    if (
        defaultValue &&
        choices.find(c => c.value === defaultValue) === undefined
    ) {
        throw new Error('Default value not found in choices');
    }
    return prompts.select({
        message: compileForPrompt(prompt),
        choices: choices.map(c =>
            c.value === SEPARATOR_LINE
                ? {
                      type: 'separator',
                      separator: '------'
                  }
                : { name: compileForPrompt(c.name), value: c.value }
        ),
        default: defaultValue || undefined,
        loop
    });
}
async function askSelect(prompt, choices, defaultValue = '', loop = false) {
    return askSelectEx(
        prompt,
        choices.map(c => ({ name: c, value: c })),
        defaultValue,
        loop
    );
}

exports.ask = index;
exports.console = index$1;
exports.parser = parse;
