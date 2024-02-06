import composerFixtures from '../generated/composer-fixtures';

describe('Composer >', () => {
    for (const command of composerFixtures) {
        it(command.cmd.toString(), () => {
            const result = command.cmd();
            expect(result.toString()).toBe(command.markup);
        });
    }
});