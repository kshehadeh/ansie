import type { AnsieStyle } from "../composer/styles";

/**
 * Builds a set of attributes from a style object.  This is used to build the attributes for a node tag.  It will
 * only include attributes that are defined in the style object.
 * @param style
 * @returns
 */
export function buildAttributesFromStyle(style: AnsieStyle): Record<string, string | number | boolean | undefined> {
    const attributes: Record<string, string | number | boolean | undefined> = {};
    if (style.font?.italics) {
        attributes["italics"] = style.font.italics;
    }
    if (style.font?.underline) {
        attributes["underline"] = style.font.underline;
    }
    if (style.font?.bold) {
        attributes["bold"] = style.font.bold;
    }
    if (style.font?.color?.fg) {
        attributes["fg"] = style.font.color.fg;
    }
    if (style.font?.color?.bg) {
        attributes["bg"] = style.font.color.bg;
    }

    if (style.spacing?.margin) {
        attributes["margin"] = style.spacing.margin;
    }
    if (style.spacing?.marginLeft) {
        attributes["marginLeft"] = style.spacing.marginLeft;
    }
    if (style.spacing?.marginRight) {
        attributes["marginRight"] = style.spacing.marginRight;
    }
    if (style.spacing?.marginTop) {
        attributes["marginTop"] = style.spacing.marginTop;
    }
    if (style.spacing?.marginBottom) {
        attributes["marginBottom"] = style.spacing.marginBottom;
    }

    if (style.list?.bullet) {
        attributes["bullet"] = style.list.bullet;
    }
    if (style.list?.indent) {
        attributes["indent"] = style.list.indent;
    }

    return attributes;

}
