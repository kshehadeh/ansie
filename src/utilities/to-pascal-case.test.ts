import { toPascalCase } from './to-pascal-case';

describe('toPascalCase', () => {
    it('should handle kebab case', () => {
        const input = 'hello-world';
        const expectedOutput = 'HelloWorld';
        const output = toPascalCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle snake case', () => {
        const input = 'hello_world';
        const expectedOutput = 'HelloWorld';
        const output = toPascalCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle single word', () => {
        const input = 'hello';
        const expectedOutput = 'Hello';
        const output = toPascalCase(input);
        expect(output).toEqual(expectedOutput);
    });

    it('should handle camelcase', () => {
        const input = 'helloWorld';
        const expectedOutput = 'HelloWorld';
        const output = toPascalCase(input);
        expect(output).toEqual(expectedOutput);
    });
});
