import { renderPrompt } from './util';
import { ansieConsole } from '../console/console';

jest.mock('../console/console');

describe('renderPrompt', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render prompt with default value', () => {
        const prompt = 'Enter your name [default]';
        const def = 'John Doe';

        renderPrompt(prompt, def);

        expect(ansieConsole.info).toHaveBeenCalledWith(
            `Enter your name [c=gray](${def})[/c]`
        );
    });

    it('should render prompt without default value', () => {
        const prompt = 'Enter your age';

        renderPrompt(prompt);

        expect(ansieConsole.info).toHaveBeenCalledWith(prompt);
    });

    it('should render prompt with default value when [default] is not found', () => {
        const prompt = 'Enter your email';
        const def = 'example@example.com';

        renderPrompt(prompt, def);

        expect(ansieConsole.info).toHaveBeenCalledWith(
            `${prompt} [c=gray](${def})[/c]`
        );
    });

    it('should not render prompt if prompt is empty', () => {
        const prompt = '';

        renderPrompt(prompt);

        expect(ansieConsole.info).not.toHaveBeenCalled();
    });
});
