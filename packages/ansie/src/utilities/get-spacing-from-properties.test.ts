import { describe, expect, it } from 'bun:test';
import { getSpacingFromProperties } from './get-spacing-from-properties';
import { ValidTags } from '../compiler/types';

describe('getSpacingFromProperties', () => {
    it('should return correct spacing when all properties are provided', () => {
        const props = {
            node: ValidTags.div,
            marginLeft: '2',
            marginRight: '3',
            marginTop: '1',
            marginBottom: '4',
            margin: '0'
        };
        const expectedOutput = {
            on: '\n  ',
            off: '   \n\n\n\n'
        };
        expect(getSpacingFromProperties(props)).toEqual(expectedOutput);
    });

    it('should return correct spacing when only margin property is provided', () => {
        const props = {
            node: ValidTags.div,
            margin: '2'
        };
        const expectedOutput = {
            on: '\n\n  ',
            off: '  \n\n'
        };
        expect(getSpacingFromProperties(props)).toEqual(expectedOutput);
    });

    it('should return correct spacing when no properties are provided', () => {
        const props = {
            node: ValidTags.div
        };
        const expectedOutput = {
            on: '',
            off: ''
        };
        expect(getSpacingFromProperties(props)).toEqual(expectedOutput);
    });
});
