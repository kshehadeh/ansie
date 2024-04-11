import { merge } from 'ts-deepmerge';

export interface AnsieStyle {
    font?: {
        color?: {
            fg?: string;
            bg?: string;
        };
        bold?: boolean;
        underline?: 'single' | 'double' | 'none' | boolean;
        italics?: boolean;
    };

    spacing?: {
        margin?: number;
        marginLeft?: number;
        marginRight?: number;
        marginTop?: number;
        marginBottom?: number;
    };

    list?: {
        bullet?: string;
        indent?: number;
    };
}

const cleanStyle: AnsieStyle = {
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

export const body: AnsieStyle = {
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

export const text: AnsieStyle = body;

export const br: AnsieStyle = {
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0
    }
};

export const h1: AnsieStyle = {
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

export const h2: AnsieStyle = {
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

export const h3: AnsieStyle = {
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

export const p: AnsieStyle = {
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0
    }
};

export const span: AnsieStyle = {};

export const li: AnsieStyle = {
    list: {
        bullet: '* ',
        indent: 1
    },
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0
    }
};

export const div: AnsieStyle = {
    spacing: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 0
    }
};

export interface AnsieTheme {
    h1?: AnsieStyle;
    h2?: AnsieStyle;
    h3?: AnsieStyle;
    body?: AnsieStyle;
    div?: AnsieStyle;
    span?: AnsieStyle;
    li?: AnsieStyle;
    p?: AnsieStyle;
    text?: AnsieStyle;
    br?: AnsieStyle;
}

export const defaultTheme: AnsieTheme = {
    h1: { ...cleanStyle, ...h1 },
    h2: { ...cleanStyle, ...h2 },
    h3: { ...cleanStyle, ...h3 },
    body: { ...cleanStyle, ...body },
    p: { ...cleanStyle, ...p },
    li: { ...cleanStyle, ...li },
    span: { ...cleanStyle, ...span },
    div: { ...cleanStyle, ...div },
    br: { ...cleanStyle, ...br },
    text: { ...cleanStyle, ...text }
};

export const cleanTheme: AnsieTheme = {
    h1: cleanStyle,
    h2: cleanStyle,
    h3: cleanStyle,
    body: cleanStyle,
    p: cleanStyle,
    li: cleanStyle,
    span: cleanStyle,
    div: cleanStyle,
    br: cleanStyle,
    text: cleanStyle
};

let _globalTheme: AnsieTheme = defaultTheme;

/**
 * This will set the global theme which is used whenever a theme is
 * not given explicitly.
 * @param theme
 */
export function setGlobalTheme(theme: AnsieTheme) {
    _globalTheme = theme;
}

/**
 * Gets the globally set theme.
 * @returns
 */
export function getGlobalTheme() {
    return _globalTheme;
}

/**
 * Sets the global theme to the default theme.
 */
setGlobalTheme(defaultTheme);

export function buildTheme(
    themeFragment: Partial<AnsieTheme>,
    originTheme: AnsieTheme
): AnsieTheme {
    return merge<AnsieTheme[]>(originTheme, themeFragment);
}
