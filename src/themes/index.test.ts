import themes from '.';
import compile from '../compile';

describe('buildTheme', () => {
    beforeEach(() => {
        themes.reset();
    });

    it('should merge themeFragment with originTheme', () => {
        const themeFragment = {
            h3: {
                font: {
                    color: {
                        fg: 'red',
                        bg: 'white'
                    }
                }
            }
        };

        const originTheme = themes.get();

        const result = themes.build(themeFragment, originTheme);

        expect(result.h3?.font?.color?.fg).toEqual('red');
        expect(result.h3?.font?.color?.bg).toEqual('white');
    });
});

describe('setTheme', () => {
    beforeEach(() => {
        themes.reset();
    });

    it('should merge themeFragment with currently active theme', () => {
        const themeFragment = {
            h3: {
                font: {
                    color: {
                        fg: 'blue',
                        bg: 'green'
                    }
                }
            }
        };

        themes.set(themeFragment);

        const result = themes.get();

        expect(result.h3?.font?.color?.fg).toEqual('blue');
        expect(result.h3?.font?.color?.bg).toEqual('green');

        const parseResult = compile('<h3>test</h3>');

        console.log(JSON.stringify(parseResult, null, 2));
    });
});

describe('resetTheme', () => {
    beforeEach(() => {
        themes.reset();
    });

    it('should reset theme to default', () => {
        const originalTheme = themes.get();

        const themeFragment = {
            h3: {
                font: {
                    color: {
                        fg: 'blue',
                        bg: 'green'
                    }
                },
                spacing: {
                    margin: 0,
                    marginTop: 0,
                    marginBottom: 0
                }
            }
        };

        themes.set(themeFragment);

        const modifiedTheme = themes.get();

        expect(modifiedTheme.h3?.font?.color?.fg).toEqual('blue');
        expect(modifiedTheme.h3?.font?.color?.bg).toEqual('green');

        const compileResult1 = compile('<h3>test</h3>');
        expect(compileResult1).toEqual(
            `\u001b[34;42;1mtest\u001b[39;49;22;24m`
        );

        themes.reset();

        const afterResetTheme = themes.get();
        expect(afterResetTheme.h3?.font?.color?.fg).toEqual(
            originalTheme.h3?.font?.color?.fg
        );
        expect(afterResetTheme.h3?.font?.color?.bg).toEqual(
            originalTheme.h3?.font?.color?.bg
        );

        const compileResult2 = compile('<h3>test</h3>');
        expect(compileResult2).toEqual(`\n\u001B[90;1mtest\u001B[39;22;24m\n`);
    });
});
