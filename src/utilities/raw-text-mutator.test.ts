import { describe, it, expect } from 'bun:test';
import { RawTextMutator } from './raw-text-mutator';

describe('RawTextMutator', () => {
    it('should replace emoji names with corresponding emojis', () => {
        const text = new RawTextMutator('Hello :grin: :heart: :rocket:');
        const expectedOutput = 'Hello 😁 ❤️ 🚀';
        expect(text.replaceEmoji().toString()).toBe(expectedOutput);
    });

    it('should not replace emoji names that do not exist in the emoji map', () => {
        const text = new RawTextMutator('Hello :grin: :unknown_emoji:');
        const expectedOutput = 'Hello 😁 :unknown_emoji:';
        expect(text.replaceEmoji().toString()).toBe(expectedOutput);
    });

    it('should not replace emoji names if no emoji names are found', () => {
        const text = new RawTextMutator('Hello world!');
        const expectedOutput = 'Hello world!';
        expect(text.replaceEmoji().toString()).toBe(expectedOutput);
    });
});
