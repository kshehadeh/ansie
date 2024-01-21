import { describe, expect, it } from 'bun:test';
import { escapeCodeFromName } from "./escape-code-from-name";

describe('escapeCodeFromName', () => {
    it('should return the escape code for a single name', () => {
        const names = [1];
        const expectedOutput = '\x1b[1m';
        expect(escapeCodeFromName(names)).toBe(expectedOutput);
    });

    it('should return the escape code for multiple names', () => {
        const names = [1, 2, 3];
        const expectedOutput = '\x1b[1;2;3m';
        expect(escapeCodeFromName(names)).toBe(expectedOutput);
    });

    it('should return an empty string for an empty array', () => {
        const names: number[] = [];
        const expectedOutput = '';
        expect(escapeCodeFromName(names)).toBe(expectedOutput);
    });
});