import type { TextNodeBase } from '../compiler/types';
import type { AnsieStyle } from '../themes/themes';
import { TerminalStyle, escapeCodeFromName } from './escape-code-from-name';
import { toTitleCase } from './to-title-case';

/**
 * Retrieves the escape codes for the given text attributes.  It will return both the escape codes for turning
 * on and off the text attributes.
 * @param properties The text attributes.
 * @returns An object containing the escape codes for turning on and off the specified text attributes.
 */
export function getTextEscapeCodesFromProperties(
    properties: TextNodeBase,
    style?: AnsieStyle,
): {
    on: string;
    off: string;
} {
    const on: TerminalStyle[] = [];
    const off: TerminalStyle[] = [];

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
        if (underline === 'single') {
            on.push(TerminalStyle.underline);
        } else if (underline === 'double') {
            on.push(TerminalStyle.doubleunderline);
        }
        off.push(TerminalStyle.underlineOff);
    }
    if (italics) {
        on.push(TerminalStyle.italic);
        off.push(TerminalStyle.italicOff);
    }
    return {
        on: on.length > 0 ? escapeCodeFromName(on) : '',
        off: off.length > 0 ? escapeCodeFromName(off) : '',
    };
}

export function colorToTerminalStyle(
    color: string,
    foreground: boolean,
): TerminalStyle {
    if (foreground) {
        return TerminalStyle[
            `fg${toTitleCase(color)}` as keyof typeof TerminalStyle
        ];
    } else {
        return TerminalStyle[
            `bg${toTitleCase(color)}` as keyof typeof TerminalStyle
        ];
    }
}
