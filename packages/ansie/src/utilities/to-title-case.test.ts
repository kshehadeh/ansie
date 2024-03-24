import { describe, expect, it } from 'bun:test';
import { toTitleCase } from './to-title-case';

describe('toTitleCase', () => {
    it('should convert the first character of a string to uppercase', () => {
        const input = 'hello world';
        const expectedOutput = 'Hello world';
        const output = toTitleCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle empty string', () => {
        const input = '';
        const expectedOutput = '';
        const output = toTitleCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle single word', () => {
        const input = 'hello';
        const expectedOutput = 'Hello';
        const output = toTitleCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle multiple words', () => {
        const input = 'hello world';
        const expectedOutput = 'Hello world';
        const output = toTitleCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle uppercase letters', () => {
        const input = 'HELLO WORLD';
        const expectedOutput = 'HELLO WORLD';
        const output = toTitleCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle string with first character already in uppercase', () => {
        const input = 'Hello world';
        const expectedOutput = 'Hello world';
        const output = toTitleCase(input);
        expect(output).toEqual(expectedOutput);
    });
});
