import { describe, expect, it } from 'bun:test';
import { convertMarkdownToAnsie } from './convert-markdown-to-ansie';

describe('convertMarkdownToAnsie', () => {
    it('should convert bold markdown to ANSIE escape codes', () => {
        const input = 'This is **bold** text.';
        const expectedOutput = 'This is <span bold>bold</span> text.';
        expect(convertMarkdownToAnsie(input)).toBe(expectedOutput);
    });

    it('should convert italics markdown to ANSIE escape codes', () => {
        const input = 'This is *italic* text.';
        const expectedOutput = 'This is <span italics>italic</span> text.';
        expect(convertMarkdownToAnsie(input)).toBe(expectedOutput);
    });

    it('should convert color markdown to ANSIE escape codes', () => {
        const input = 'This is [c=blue]blue[/c] text.';
        const expectedOutput = 'This is <span fg="blue">blue</span> text.';
        expect(convertMarkdownToAnsie(input)).toBe(expectedOutput);
    });

    it('should handle multiple markdown styles in the same input', () => {
        const input = 'This is **bold** and *italic* text.';
        const expectedOutput =
            'This is <span bold>bold</span> and <span italics>italic</span> text.';
        expect(convertMarkdownToAnsie(input)).toBe(expectedOutput);
    });

    it('should handle headers', () => {
        const input = '# Header 1\n## Header 2\n### Header 3';
        const expectedOutput =
            '<h1>Header 1</h1>\n<h2>Header 2</h2>\n<h3>Header 3</h3>';
        expect(convertMarkdownToAnsie(input)).toBe(expectedOutput);
    });

    it('should handle headers with leading/trailing whitespace', () => {
        const input = '   # Header 1   \n  ## Header 2  \n   ### Header 3   ';
        const expectedOutput =
            '<h1>Header 1</h1>\n<h2>Header 2</h2>\n<h3>Header 3</h3>';
        expect(convertMarkdownToAnsie(input)).toBe(expectedOutput);
    });

    it('should handle empty lines', () => {
        const input = 'This is some text.\n\nThis is another paragraph.';
        const expectedOutput = 'This is some text.\nThis is another paragraph.';
        expect(convertMarkdownToAnsie(input)).toBe(expectedOutput);
    });
});
