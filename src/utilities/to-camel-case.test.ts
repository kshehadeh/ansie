import { describe, expect, it } from "bun:test";
import { toCamelCase } from "./to-camel-case";

describe('toCamelCase', () => {
    it('should convert a string to camel case', () => {
        const input = 'hello world';
        const expectedOutput = 'helloWorld';
        const output = toCamelCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle empty string', () => {
        const input = '';
        const expectedOutput = '';
        const output = toCamelCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle single word', () => {
        const input = 'hello';
        const expectedOutput = 'hello';
        const output = toCamelCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle multiple spaces', () => {
        const input = '  hello   world  ';
        const expectedOutput = 'helloWorld';
        const output = toCamelCase(input);
        expect(output).toEqual(expectedOutput);
    });
});
