import { tpl } from './index';

describe('ansie template tagging', () => {
    it('should interpolate values correctly', () => {
        const result = tpl`<h1>Hello ${'world'}! The answer is ${42}.</h1>`;
        expect(result).toBe(
            '\n\u001B[34;1;21mHello world! The answer is 42.\u001B[39;22;24m\n');
    });

    it('should handle empty strings', () => {
        const result = tpl``;
        expect(result).toBe('');
    });

    it('should handle numbers as values', () => {
        const result = tpl`<body>The number is ${123}.</body>`;
        expect(result).toBe('\u001B[39;49mThe number is 123.\u001B[39;49;24m');
    });
});
