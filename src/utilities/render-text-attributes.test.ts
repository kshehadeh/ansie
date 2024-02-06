import {
    renderTextAttributesEnd,
    renderTextAttributesStart,
} from './render-text-attributes';
import { ValidTags } from '../compiler/types';
import {
    renderSpaceAttributesStart,
    renderSpaceAttributesEnd,
} from './render-space-attributes';

describe('renderTextAttributesEnd', () => {
    it('should return the ANSI escape code for resetting a color attribute', () => {
        const node = { node: ValidTags.h1, fg: 'blue' as const, content: [] };
        const format = 'ansi';
        const expectedOutput = '\x1b[39m';
        expect(renderTextAttributesEnd(node, format)).toBe(expectedOutput);
    });

    it('should return the ANSIE escape codes for multiple attributes', () => {
        const attributes = {
            node: ValidTags.h1,
            fg: 'blue' as const,
            bg: 'red' as const,
            bold: 'true',
        };
        const format = 'ansi';
        const expectedOutput = '\x1b[39;49;22m';
        expect(renderTextAttributesEnd(attributes, format)).toBe(
            expectedOutput,
        );
    });

    it('should return an empty string for text attributes in markup format', () => {
        const attributes = { node: ValidTags.h1, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = '';
        expect(renderTextAttributesEnd(attributes, format)).toBe(
            expectedOutput,
        );
    });
});

describe('renderTextAttributesStart', () => {
    it('should return the ANSI escape code for setting a color attribute', () => {
        const attributes = { node: ValidTags.h1, fg: 'blue' as const };
        const format = 'ansi';
        const expectedOutput = '\x1b[34m';
        expect(renderTextAttributesStart(attributes, format)).toBe(
            expectedOutput,
        );
    });

    it('should return the markup attribute for setting a color attribute', () => {
        const attributes = { node: ValidTags.h1, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = 'fg="blue"';
        expect(renderTextAttributesStart(attributes, format)).toBe(
            expectedOutput,
        );
    });

    it('should return an empty string for text attributes in markup format', () => {
        const attributes = { node: ValidTags.h1, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = 'fg="blue"';
        expect(renderTextAttributesStart(attributes, format)).toBe(
            expectedOutput,
        );
    });

    it('should return the proper ansi string for multiple attributes', () => {
        const attributes = {
            node: ValidTags.h1,
            fg: 'blue' as const,
            bg: 'red' as const,
            bold: 'true',
        };
        const format = 'ansi';
        const expectedOutput = '\x1b[34;41;1m';
        expect(renderTextAttributesStart(attributes, format)).toBe(
            expectedOutput,
        );
    });
});

describe('renderSpaceAttributesStart', () => {
    it('should return the ANSI escape code for setting spacing attributes', () => {
        const attributes = { node: ValidTags.h1, margin: '2' };
        const format = 'ansi';
        const expectedOutput = '\n\n\n  ';
        expect(
            renderSpaceAttributesStart(attributes, format, { isBlock: true }),
        ).toBe(expectedOutput);
    });

    it('should return the ANSI codes for specific marginXXX attributes over margin when there is contention', () => {
        const attributes = {
            node: ValidTags.h1,
            margin: '2',
            marginLeft: '1',
            marginRight: '3',
            marginTop: '4',
            marginBottom: '5',
        };
        const format = 'ansi';
        const expectedOutput = '\n\n\n\n\n ';
        expect(
            renderSpaceAttributesStart(attributes, format, { isBlock: true }),
        ).toBe(expectedOutput);
    });

    it('should return the markup attributes for setting spacing attributes', () => {
        const attributes = { node: ValidTags.h1, margin: '2' };
        const format = 'markup';
        const expectedOutput = 'margin="2"';
        expect(
            renderSpaceAttributesStart(attributes, format, { isBlock: true }),
        ).toBe(expectedOutput);
    });
});

describe('renderSpaceAttributesEnd', () => {
    it('should return the ANSI escape code for setting spacing attributes', () => {
        const attributes = { node: ValidTags.h1, margin: '2' };
        const format = 'ansi';
        const expectedOutput = '  \n\n';
        expect(
            renderSpaceAttributesEnd(attributes, format, { isBlock: true }),
        ).toBe(expectedOutput);
    });

    it('should return the ANSI codes for specific marginXXX attributes over margin when there is contention', () => {
        const attributes = {
            node: ValidTags.h1,
            margin: '2',
            marginLeft: '1',
            marginRight: '3',
            marginTop: '4',
            marginBottom: '5',
        };
        const format = 'ansi';
        const expectedOutput = '   \n\n\n\n\n';
        expect(
            renderSpaceAttributesEnd(attributes, format, { isBlock: true }),
        ).toBe(expectedOutput);
    });

    it('should return the markup attributes for setting spacing attributes', () => {
        const attributes = { node: ValidTags.h1, margin: '2' };
        const format = 'markup';
        const expectedOutput = '';
        expect(
            renderSpaceAttributesEnd(attributes, format, { isBlock: true }),
        ).toBe(expectedOutput);
    });
});
