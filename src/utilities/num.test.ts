import { describe, expect, it } from 'bun:test';
import { num } from "./num";

describe('num', () => {
    it('should return the number if input is already a number', () => {
        const input = 42;
        const expectedOutput = 42;
        expect(num(input)).toBe(expectedOutput);
    });

    it('should convert a string to a number', () => {
        const input = '42';
        const expectedOutput = 42;
        expect(num(input)).toBe(expectedOutput);
    });

    it('should convert a boolean to 1 if true', () => {
        const input = true;
        const expectedOutput = 1;
        expect(num(input)).toBe(expectedOutput);
    });

    it('should convert a boolean to 0 if false', () => {
        const input = false;
        const expectedOutput = 0;
        expect(num(input)).toBe(expectedOutput);
    });

    it('should return 0 for any other input type', () => {
        const input = null;
        const expectedOutput = 0;
        expect(num(input)).toBe(expectedOutput);
    });
});