import { toKebabCase } from './to-kebab-case';

describe('toKebabeCase', () => {
    it('from camel', () => {
        const input = 'helloWorld';
        const expectedOutput = 'hello-world';
        expect(toKebabCase(input)).toBe(expectedOutput);
    });

    it('from snake', () => {
        const input = 'hello_world';
        const expectedOutput = 'hello-world';
        expect(toKebabCase(input)).toBe(expectedOutput);
    });

    it('from pascal', () => {
        const input = 'HelloWorld';
        const expectedOutput = 'hello-world';
        expect(toKebabCase(input)).toBe(expectedOutput);
    });

    it('should handle empty string', () => {
        const input = '';
        const expectedOutput = '';
        expect(toKebabCase(input)).toBe(expectedOutput);
    });
});
