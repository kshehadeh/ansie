import { describe, expect, it } from 'bun:test';
import fixtures from '../../test/generated/compiler-fixtures.json';
import { compile } from './compile';

describe('Compiler', () => {
    fixtures.forEach(
        (fixture: { input: string; ast: unknown; output: string }) => {
            it(fixture.input, () => {
                const output = compile({ markup: fixture.input });
                expect(output).toEqual(fixture.output);
            });
        }
    );
});
