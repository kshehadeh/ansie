import fixtures from '../../test/generated/compiler-fixtures.json';
import parse from '.';

describe('Parser', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fixtures.forEach((fixture: { input: string; ast: any; output: string }) => {
        it(fixture.input, () => {
            const ast = parse(fixture.input);
            expect(ast).toEqual(fixture.ast);
        });
    });
});
