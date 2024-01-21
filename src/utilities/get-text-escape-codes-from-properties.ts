import type { TextNodeBase } from "../compiler/types";
import { TerminalStyle, escapeCodeFromName } from "./escape-code-from-name";
import { toTitleCase } from "./to-title-case";

/**
 * Retrieves the escape codes for the given text attributes.  It will return both the escape codes for turning 
 * on and off the text attributes.
 * @param properties The text attributes.
 * @returns An object containing the escape codes for turning on and off the specified text attributes.
 */
export function getTextEscapeCodesFromProperties(properties: TextNodeBase): {on: string, off: string} {
    const on: TerminalStyle[] = [];
    const off: TerminalStyle[] = [];
    if (properties.fg) {
        on.push(colorToTerminalStyle(properties.fg, true));
        off.push(TerminalStyle.fgDefault);
    }
    if (properties.bg) {
        on.push(colorToTerminalStyle(properties.bg, false));
        off.push(TerminalStyle.bgDefault);
    }
    if (properties.bold) {
        on.push(TerminalStyle.bold);
        off.push(TerminalStyle.boldOff);
    }
    if (properties.underline) {
        if (properties.underline === 'single') {
            on.push(TerminalStyle.underline);
        } else if (properties.underline === 'double') {
            on.push(TerminalStyle.doubleunderline);
        }        
        off.push(TerminalStyle.underlineOff);
    }
    if (properties.italics) {
        on.push(TerminalStyle.italic);
        off.push(TerminalStyle.italicOff);
    }
    return {
        on: on.length > 0 ? escapeCodeFromName(on): '',
        off: off.length > 0 ? escapeCodeFromName(off) : '',
    };
}

export function colorToTerminalStyle(color: string, foreground: boolean): TerminalStyle {
    if (foreground) {                
        return TerminalStyle[`fg${toTitleCase(color)}` as keyof typeof TerminalStyle];
    } else {
        return TerminalStyle[`bg${toTitleCase(color)}` as keyof typeof TerminalStyle];
    }
}
