import { describe, it, expect } from 'bun:test';
import fixtures from '../../test/compiler-fixtures.json';
import { compile } from '.';

describe('Compiler', () => {
    fixtures.forEach((fixture: { input: string; ast: unknown; output: string }) => {
        it(fixture.input, () => {
            const output = compile(fixture.input);
            expect(output).toEqual(fixture.output);
        });
    });
});
