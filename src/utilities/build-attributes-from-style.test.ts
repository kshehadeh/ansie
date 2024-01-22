import { describe, expect, it } from 'bun:test';
import { buildAttributesFromStyle } from './build-attributes-from-style';

describe('buildAttributesFromStyle', () => {
    it('should build attributes object with italics', () => {
        const style = {
            font: {
                italics: true,
            },
        };
        const expectedOutput = {
            italics: true,
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with underline', () => {
        const style = {
            font: {
                underline: true,
            },
        };
        const expectedOutput = {
            underline: true,
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with bold', () => {
        const style = {
            font: {
                bold: true,
            },
        };
        const expectedOutput = {
            bold: true,
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with foreground color', () => {
        const style = {
            font: {
                color: {
                    fg: 'red',
                },
            },
        };
        const expectedOutput = {
            fg: 'red',
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with background color', () => {
        const style = {
            font: {
                color: {
                    bg: 'blue',
                },
            },
        };
        const expectedOutput = {
            bg: 'blue',
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with margin', () => {
        const style = {
            spacing: {
                margin: 10,
            },
        };
        const expectedOutput = {
            margin: 10,
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with left margin', () => {
        const style = {
            spacing: {
                marginLeft: 5,
            },
        };
        const expectedOutput = {
            marginLeft: 5,
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with right margin', () => {
        const style = {
            spacing: {
                marginRight: 5,
            },
        };
        const expectedOutput = {
            marginRight: 5,
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with top margin', () => {
        const style = {
            spacing: {
                marginTop: 5,
            },
        };
        const expectedOutput = {
            marginTop: 5,
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with bottom margin', () => {
        const style = {
            spacing: {
                marginBottom: 5,
            },
        };
        const expectedOutput = {
            marginBottom: 5,
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with bullet', () => {
        const style = {
            list: {
                bullet: '-',
            },
        };
        const expectedOutput = {
            bullet: '-',
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build attributes object with indent', () => {
        const style = {
            list: {
                indent: 2,
            },
        };
        const expectedOutput = {
            indent: 2,
        };
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });

    it('should build empty attributes object for empty style', () => {
        const style = {};
        const expectedOutput = {};
        expect(buildAttributesFromStyle(style)).toEqual(expectedOutput);
    });
});
