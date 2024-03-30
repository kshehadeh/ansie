import type { AnsieStyle } from '../themes/themes';

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
export enum ValidTags {
    'h1' = 'h1',
    'h2' = 'h2',
    'h3' = 'h3',
    'body' = 'body',
    'span' = 'span',
    'p' = 'p',
    'div' = 'div',
    'text' = 'text',
    'li' = 'li',
    'br' = 'br'
}

/**
 * A list of all the valid tags.  This is used by the parser to validate
 * the tags before returning the AST.
 * @internal
 */
export const ValidTagsList = Object.keys(ValidTags);

/**
 * A type guard to determine if a given tag is a valid tag.
 * @param tag
 * @returns
 * @internal
 */
export type ValidTagsType = keyof typeof ValidTags;

/**
 * @internal
 */
export const ColorAttributeValues = [
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

/**
 * @internal
 */
export type BaseAnsieNode = {
    node: ValidTags;
    content?: AnsieNode | AnsieNode[];
};

////// Space Attributes - These are the attributes that can be associated with semantic elements that have a concept of spacing such as <div> and <p>

/**
 * @internal
 */
export const SpaceAttributes = {
    margin: ['number'],
    marginTop: ['number'],
    marginBottom: ['number'],
    marginLeft: ['number'],
    marginRight: ['number']
};

/**
 * @internal
 */
export type SpaceAttributesInterface = {
    [key in keyof typeof SpaceAttributes]?: string;
};

/**
 * @internal
 */
export type SpaceNodeBase = BaseAnsieNode & SpaceAttributesInterface;

///// Text Attributes - These are the attributes that can be associated with text-based semantic elements such as <span> and <p>
export const TextAttributes = {
    fg: ColorAttributeValues,
    bg: ColorAttributeValues,
    bold: [...booleanValues],
    italics: [...booleanValues],
    underline: [...booleanValues, 'single', 'double', 'none']
};

/**
 * @internal
 */
export type TextAttributesInterface = {
    [key in keyof typeof TextAttributes]?: string;
};

/**
 * @internal
 */
export type TextNodeBase = BaseAnsieNode & TextAttributesInterface;

///////

///// List Attributes - These are the attributes that can be associated with text-based semantic elements such as <span> and <p>
/**
 * @internal
 */
export const ListAttributes = {
    bullet: ['*', '-', '+'],
    indent: ['number']
};

/**
 * @internal
 */
export type ListAttributesKeysType = keyof typeof ListAttributes;

/**
 * @internal
 */
export type ListAttributesInterface = {
    [key in ListAttributesKeysType]?: string;
};

/**
 * @internal
 */
export type ListItemNodeBase = BaseAnsieNode & ListAttributesInterface;
///////

///// Raw Attributes - These are the attributes that can be associated with text-based semantic elements such as <span> and <p>
/**
 * @internal
 */
export const RawTextAttributes = {
    value: ['string']
};

/**
 * @internal
 */
export type RawTextAttributesKeysType = keyof typeof RawTextAttributes;

/**
 * @internal
 */
export type RawTextAttributesInterface = {
    [key in RawTextAttributesKeysType]?: string;
};
///////

/**
 * A union of all the valid attribute keys.
 * @internal
 */
export type AllAttributeKeys =
    | keyof typeof TextAttributes
    | keyof typeof SpaceAttributes
    | keyof typeof ListAttributes
    | keyof typeof RawTextAttributes;

///////

/**
 * A list of all the valid attribute keys.  This is used by the parser to validate
 * the attributes for each tag before returning the AST.
 * @internal
 */
export const AllAttributeKeysList = [
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
export function isAttribute(key: string): key is AllAttributeKeys {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return AllAttributeKeysList.includes(key as any);
}

/**
 * This is a map of all the valid attributes for each tag.  This is used by the parser to
 * validate the attributes for each tag before returning the AST.
 * @internal
 */
export const TagAttributeMap = {
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
    }
};

/**
 * A union of all the valid attribute values.
 * @internal
 */
export type AnsieNode = BaseAnsieNode &
    SpaceAttributesInterface &
    TextAttributesInterface &
    ListAttributesInterface &
    RawTextAttributesInterface;

export type Ast = AnsieNode[];

/**
 * Wrap a node in the AST to provide rendering overridable methods.  It takes
 * a raw node from the AST produced by the parser.  This is then overridden by
 * the various node implementations to provide specialized rendering for each
 * node type.  For example, a <p> tag will render differently than a <span> tag.
 *
 * The _raw property is the original AST node.  It also provides
 * @internal
 */
export abstract class AnsieNodeImpl {
    _raw: AnsieNode;
    _style: AnsieStyle;

    constructor(node: AnsieNode, style: AnsieStyle) {
        this._raw = node;
        this._style = style;
    }

    get node(): ValidTags {
        return this._raw.node;
    }

    /**
     * Returns the attributes for this node.  This is a subset of the raw node
     * that only contains the attributes.  Attributes are anything that is not
     * "node" or "content".
     */
    get attributes(): Record<AllAttributeKeys, string> {
        return Object.entries(this._raw).reduce((acc, [key, value]) => {
            if (isAttribute(key) && typeof value === 'string') {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<AllAttributeKeys, string>);
    }

    /**
     * Returns a specific attribute value.
     * @param key
     * @returns
     */
    attr(key: AllAttributeKeys): string | undefined {
        return this._raw[key];
    }

    abstract renderStart({
        stack,
        format
    }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }): string;
    abstract renderEnd({
        stack,
        format
    }: {
        stack: AnsieNode[];
        format: CompilerFormat;
    }): string;
}

/**
 * Represents a compiler error.
 * @internal
 */
export class CompilerError implements Error {
    name: string = 'CompilerError';
    message: string;
    fatal: boolean;

    markupNode: AnsieNode;
    markupStack: AnsieNode[];

    /**
     * Creates a new instance of CompilerError.
     * @param message The error message.
     * @param markupNode The markup node associated with the error.
     * @param markupStack The stack of markup nodes leading to the error.
     * @param fatal Indicates whether the error is fatal or not. Default is false.
     */
    constructor(
        message: string,
        markupNode: AnsieNode,
        markupStack: AnsieNode[],
        fatal: boolean = false
    ) {
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
        return `${this.name}: ${this.message} (${
            this.markupNode.node
        }, ${this.markupStack.map(node => node.node).join(', ')})`;
    }

    /**
     * Determines whether the error can be continued or not.
     * @returns True if the error can be continued, false otherwise.
     */
    continue() {
        return !this.fatal;
    }
}

export type CompilerFormat = 'ansi' | 'markup';
