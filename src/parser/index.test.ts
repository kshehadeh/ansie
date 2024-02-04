import { describe, it, expect } from 'bun:test';
import fixtures from '../../test/generated/compiler-fixtures.json';
import { parseString } from '.';

describe('Parser', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fixtures.forEach((fixture: { input: string; ast: any; output: string }) => {
        it(fixture.input, () => {
            const ast = parseString(fixture.input);
            expect(ast).toEqual(fixture.ast);
        });
    });
});
