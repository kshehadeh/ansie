import type { TextNodeBase } from '../compile/types';
import type { AnsieStyle } from '../themes';
import { TerminalStyle } from './escape-code-from-name';
/**
 * Retrieves the escape codes for the given text attributes.  It will return both the escape codes for turning
 * on and off the text attributes.
 * @param properties The text attributes.
 * @returns An object containing the escape codes for turning on and off the specified text attributes.
 */
export declare function getTextEscapeCodesFromProperties(properties: TextNodeBase, style?: AnsieStyle): {
    on: string;
    off: string;
};
export declare function colorToTerminalStyle(color: string, foreground: boolean): TerminalStyle;
