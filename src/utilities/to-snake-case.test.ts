import { describe, expect, it } from 'bun:test';
import { toSnakeCase } from './to-snake-case';

describe('toSnakeCase', () => {
    it('from camel', () => {
        const input = 'helloWorld';
        const expectedOutput = 'hello_world';
        const output = toSnakeCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('from pascal', () => {
        const input = 'HelloWorld';
        const expectedOutput = 'hello_world';
        const output = toSnakeCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('from kebab', () => {
        const input = 'hello-world';
        const expectedOutput = 'hello_world';
        const output = toSnakeCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle empty string', () => {
        const input = '';
        const expectedOutput = '';
        const output = toSnakeCase(input);
        expect(output).toEqual(expectedOutput);
    });
});
