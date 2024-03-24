import { describe, expect, it } from 'bun:test';
import { TerminalStyle, escapeCodeFromName } from './escape-code-from-name';
import {
    colorToTerminalStyle,
    getTextEscapeCodesFromProperties,
} from './get-text-escape-codes-from-properties';
import { ValidTags, type TextNodeBase } from '../compiler/types';

describe('colorToTerminalStyle', () => {
    it('should return foreground terminal style for valid color', () => {
        const color = 'red';
        const foreground = true;
        const expectedOutput = TerminalStyle.fgRed;
        expect(colorToTerminalStyle(color, foreground)).toBe(expectedOutput);
    });

    it('should return background terminal style for valid color', () => {
        const color = 'blue';
        const foreground = false;
        const expectedOutput = TerminalStyle.bgBlue;
        expect(colorToTerminalStyle(color, foreground)).toBe(expectedOutput);
    });
});

describe('getTextEscapeCodesFromProperties', () => {
    it('should return the correct escape codes for text attributes', () => {
        const node: TextNodeBase = {
            node: ValidTags.h1,
            fg: 'red' as const,
            bg: 'blue' as const,
            bold: 'true',
            underline: 'single',
            italics: 'true',
        };
        const expectedOutput = {
            on: escapeCodeFromName([
                TerminalStyle.fgRed,
                TerminalStyle.bgBlue,
                TerminalStyle.bold,
                TerminalStyle.underline,
                TerminalStyle.italic,
            ]),
            off: escapeCodeFromName([
                TerminalStyle.fgDefault,
                TerminalStyle.bgDefault,
                TerminalStyle.boldOff,
                TerminalStyle.underlineOff,
                TerminalStyle.italicOff,
            ]),
        };
        expect(getTextEscapeCodesFromProperties(node)).toEqual(expectedOutput);
    });

    it('should return the correct escape codes when some attributes are missing', () => {
        const node: TextNodeBase = {
            node: ValidTags.h1,
            fg: 'green' as const,
            bold: 'true',
        };
        const expectedOutput = {
            on: escapeCodeFromName([TerminalStyle.fgGreen, TerminalStyle.bold]),
            off: escapeCodeFromName([
                TerminalStyle.fgDefault,
                TerminalStyle.boldOff,
            ]),
        };
        expect(getTextEscapeCodesFromProperties(node)).toEqual(expectedOutput);
    });

    it('should return empty escape codes when no attributes are provided', () => {
        const node: TextNodeBase = {} as TextNodeBase;
        const expectedOutput = {
            on: '',
            off: '',
        };
        expect(getTextEscapeCodesFromProperties(node)).toEqual(expectedOutput);
    });
});
