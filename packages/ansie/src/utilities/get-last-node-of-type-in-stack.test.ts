import { describe, expect, it } from 'bun:test';
import { getLastNodeOfTypeFromStack } from './get-last-node-of-type-in-stack';
import { ValidTags, type AnsieNode } from '../compiler/types';

describe('getLastNodeOfTypeFromStack', () => {
    it('should return the last node of the specified type from the stack', () => {
        const stack = [
            { node: ValidTags.div },
            { node: ValidTags.span },
            { node: ValidTags.h1 },
            { node: ValidTags.div },
            { node: ValidTags.h2 }
        ];
        const expectedOutput = { node: ValidTags.div };
        expect(getLastNodeOfTypeFromStack(ValidTags.div, stack)).toEqual(
            expectedOutput
        );
    });

    it('should return null if the specified type is not found in the stack', () => {
        const stack = [
            { node: ValidTags.div },
            { node: ValidTags.span },
            { node: ValidTags.h1 }
        ];
        const expectedOutput = null;
        expect(getLastNodeOfTypeFromStack(ValidTags.h2, stack)).toEqual(
            expectedOutput
        );
    });

    it('should return null if the stack is empty', () => {
        const stack: AnsieNode[] = [];
        const expectedOutput = null;
        expect(getLastNodeOfTypeFromStack(ValidTags.h2, stack)).toEqual(
            expectedOutput
        );
    });
});
