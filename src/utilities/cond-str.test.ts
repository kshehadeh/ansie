import { describe, expect, it } from 'bun:test';
import { condStr } from './cond-str';

describe('condStr', () => {
    it('should return the string when the condition is true', () => {
        const condition = true;
        const str = 'Hello, World!';
        const expectedOutput = 'Hello, World!';
        expect(condStr(condition, str)).toBe(expectedOutput);
    });

    it('should return an empty string when the condition is false', () => {
        const condition = false;
        const str = 'Hello, World!';
        const expectedOutput = '';
        expect(condStr(condition, str)).toBe(expectedOutput);
    });

    it('should return an empty string when the condition is true but the string is not provided', () => {
        const condition = true;
        const expectedOutput = '';
        expect(condStr(condition)).toBe(expectedOutput);
    });

    it('should return an empty string when the condition is false and the string is not provided', () => {
        const condition = false;
        const expectedOutput = '';
        expect(condStr(condition)).toBe(expectedOutput);
    });
});
