import type { ValidTags } from "../compiler/types";

export interface AnsieStyle {
    font?: {
        color?: {
            fg?: string;
            bg?: string;    
        };    
        bold?: boolean;
        underline?: 'single' | 'double' | 'none' | boolean;
        italics?: boolean;        
    },

    spacing?: {
        margin?: number;
        marginLeft?: number;
        marginRight?: number;
        marginTop?: number;
        marginBottom?: number;
    }

    list?: {
        bullet?: string;
        indent?: number;
    },

}

export const body: AnsieStyle = {
    font: {
        color: {
            fg: 'default',
            bg: 'default'
        },
        bold: false,
        underline: 'none',
        italics: false,        
    },
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
    },
};

export const text: AnsieStyle = body;

export const br: AnsieStyle = {
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
    },
};

export const h1: AnsieStyle = {
    font: {
        color: {
            fg: 'blue',
        },
        bold: true,
        underline: 'double',
        italics: false,        
    },
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0,
    }
};

export const h2: AnsieStyle = {
    font: {
        color: {
            fg: 'default',
        },
        bold: true,
        underline: 'single',
        italics: false,        
    },
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0,
    }
};

export const h3: AnsieStyle = {
    font: {
        color: {
            fg: 'gray',
        },
        bold: true,
        underline: 'none',
        italics: false,        
    },
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0,
    }
};

export const p: AnsieStyle = {
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0,
    }
};

export const span: AnsieStyle = {
};

export const li: AnsieStyle = {
    list: {
        bullet: '* ',
        indent: 1,
    },
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0,
    }
};

export const div: AnsieStyle = {
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0,
    }
};

export interface AnsieTheme {
    [ValidTags.h1]: AnsieStyle;
    [ValidTags.h2]: AnsieStyle;
    [ValidTags.h3]: AnsieStyle;
    [ValidTags.body]: AnsieStyle;
    [ValidTags.div]: AnsieStyle;
    [ValidTags.span]: AnsieStyle;
    [ValidTags.li]: AnsieStyle;
    [ValidTags.p]: AnsieStyle
    [ValidTags.text]: AnsieStyle;
    [ValidTags.br]: AnsieStyle;
}

export const defaultTheme: AnsieTheme = {
    h1,
    h2,
    h3,
    body,
    p,
    li,
    span,
    div,
    br,
    text
};
