import { describe, it, expect } from 'bun:test';
import { ansie } from '../template/index';

describe('ansie template tagging', () => {
    it('should interpolate values correctly', () => {
        const result = ansie`<h1>Hello ${'world'}! The answer is ${42}.</h1>`;
        expect(result).toBe('\nHello world! The answer is 42.');
    });

    it('should handle empty strings', () => {
        const result = ansie``;
        expect(result).toBe('');
    });

    it('should handle numbers as values', () => {
        const result = ansie`<body>The number is ${123}.</body>`;
        expect(result).toBe('\nThe number is 123.');
    });
});
