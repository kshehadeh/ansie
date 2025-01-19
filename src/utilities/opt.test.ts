import { opt } from './opt';

describe('opt', () => {
    it('should return an empty object when called without arguments', () => {
        const result = opt();
        expect(result).toEqual({});
    });

    it('should return an empty object when called with an empty object', () => {
        const result = opt({});
        expect(result).toEqual({});
    });

    it('should return an object with non-undefined values when called with an object containing undefined values', () => {
        const input = { a: 1, b: undefined, c: 3 };
        const result = opt(input);
        expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should return an object with non-undefined values when called with an object containing null values', () => {
        const input = { a: 1, b: null, c: 3 };
        const result = opt(input);
        expect(result).toEqual({ a: 1, b: null, c: 3 });
    });

    it('should return an object with non-undefined values when called with an object containing both undefined and null values', () => {
        const input = { a: 1, b: undefined, c: null, d: 4 };
        const result = opt(input);
        expect(result).toEqual({ a: 1, c: null, d: 4 });
    });

    it('should return an object containing the correct properties and values when merged with a base object', () => {
        const input = { a: 1, b: undefined, c: null, d: 4 };
        const base = { a: 2, b: 'hello' };
        const result: unknown = { ...base, ...opt(input) };
        expect(result).toEqual({ a: 1, b: 'hello', c: null, d: 4 });
    });
});
