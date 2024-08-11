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
export declare const body: AnsieStyle;
export declare const text: AnsieStyle;
export declare const br: AnsieStyle;
export declare const h1: AnsieStyle;
export declare const h2: AnsieStyle;
export declare const h3: AnsieStyle;
export declare const p: AnsieStyle;
export declare const span: AnsieStyle;
export declare const li: AnsieStyle;
export declare const div: AnsieStyle;
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
export declare const defaultTheme: AnsieTheme;
export declare const cleanTheme: AnsieTheme;
/**
 * This will set the global theme which is used whenever a theme is
 * not given explicitly.
 * @param theme
 */
export declare function setGlobalTheme(theme: AnsieTheme): void;
/**
 * Gets the globally set theme.
 * @returns
 */
export declare function getGlobalTheme(): AnsieTheme;
export declare function buildTheme(themeFragment: Partial<AnsieTheme>, originTheme: AnsieTheme): AnsieTheme;
