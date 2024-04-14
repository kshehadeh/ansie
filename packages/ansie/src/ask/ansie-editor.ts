import { AsyncResource } from 'node:async_hooks';
import { editAsync } from 'external-editor';
import {
    createPrompt,
    useEffect,
    useState,
    useKeypress,
    usePrefix,
    isEnterKey,
    makeTheme,
    type InquirerReadline,
    type Theme
} from '@inquirer/core';
import type { PartialDeep } from '@inquirer/type';

type EditorConfig = {
    message: string;
    default?: string;
    postfix?: string;
    waitForUseInput?: boolean;
    validate?: (value: string) => boolean | string | Promise<string | boolean>;
    theme?: PartialDeep<Theme>;
};

export default createPrompt<string, EditorConfig>((config, done) => {
    const { waitForUseInput = true, validate = () => true } = config;
    const theme = makeTheme(config.theme);

    const [status, setStatus] = useState<string>('pending');
    const [value, setValue] = useState<string>(config.default || '');
    const [errorMsg, setError] = useState<string | undefined>(undefined);

    const isLoading = status === 'loading';
    const hasDefault = typeof config.default !== 'undefined';
    const prefix = usePrefix({ isLoading, theme });

    function startEditor(rl: InquirerReadline) {
        rl.pause();
        editAsync(
            value,
            // Note: The bind call isn't strictly required. But we need it for our mocks to work as expected.
            AsyncResource.bind(async (error, answer) => {
                rl.resume();
                if (error) {
                    setError(error.toString());
                } else {
                    setStatus('loading');
                    const isValid = await validate(answer);
                    if (isValid === true) {
                        setError(undefined);
                        setStatus('done');
                        done(answer);
                    } else {
                        setValue(answer);
                        setError(isValid || 'You must provide a valid value');
                        setStatus('pending');
                    }
                }
            }),
            {
                postfix: config.postfix || '.txt'
            }
        );
    }

    useEffect(rl => {
        if (!waitForUseInput) {
            startEditor(rl);
        }
    }, []);

    useKeypress((key, rl) => {
        // Ignore keypress while our prompt is doing other processing.
        if (status !== 'pending') {
            return;
        }

        if (key.name === 'e') {
            startEditor(rl);
        } else {
            if (isEnterKey(key) && hasDefault) {
                done(value);
            }
        }
    });

    const message = theme.style.message(config.message);
    let helpTip = '';
    if (status === 'loading') {
        helpTip = theme.style.help('Received');
    } else if (status === 'pending') {
        const enterKey = theme.style.key('enter');
        const eKey = theme.style.key('e');

        if (hasDefault) {
            helpTip = theme.style.help(
                `Press ${eKey} to begin editing or ${enterKey} to use default('${value}').`
            );
        } else {
            helpTip = theme.style.help(`Press ${eKey} to begin editing.`);
        }
    }

    let error = '';
    if (errorMsg) {
        error = theme.style.error(errorMsg);
    }

    return [[prefix, message, helpTip].filter(Boolean).join(' '), error];
});
