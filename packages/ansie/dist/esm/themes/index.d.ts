declare const _default: {
    set: typeof setGlobalTheme;
    get: typeof getGlobalTheme;
    reset: typeof resetGlobalTheme;
    build: typeof buildTheme;
};
export default _default;
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
    ul?: AnsieStyle;
}
/**
 * This will set the global theme which is used whenever a theme is
 * not given explicitly.
 * @param theme
 */
declare function setGlobalTheme(theme: Partial<AnsieTheme>): void;
/**
 * Resets the global theme to the default theme.
 */
declare function resetGlobalTheme(): void;
/**
 * Gets the globally set theme.
 * @returns
 */
declare function getGlobalTheme(): AnsieTheme;
declare function buildTheme(
    themeFragment: Partial<AnsieTheme>,
    originTheme: AnsieTheme
): AnsieTheme;
