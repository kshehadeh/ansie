import {
    createPrompt,
    useState,
    useKeypress,
    isEnterKey,
    usePrefix,
    makeTheme,
    type Theme
} from '@inquirer/core';
import type { PartialDeep } from '@inquirer/type';

type ConfirmConfig = {
    message: string;
    default?: boolean;
    transformer?: (value: boolean) => string;
    trueValue?: {
        short: string;
        long: string;
    };
    falseValue?: {
        short: string;
        long: string;
    };
    theme?: PartialDeep<Theme>;
};

export default createPrompt<boolean, ConfirmConfig>((config, done) => {
    const { short: trueShort = 'Y', long: trueLong = 'Yes' } =
        config.trueValue || {};
    const { short: falseShort = 'N', long: falseLong = 'No' } =
        config.falseValue || {};

    const trueRegExp = new RegExp(`^(${trueShort}|${trueLong})$`, 'i');
    const falseRegExp = new RegExp(`^(${falseShort}|${falseLong})$`, 'i');

    const {
        transformer = (answer: boolean) => (answer ? trueLong : falseLong)
    } = config;

    const [status, setStatus] = useState('pending');
    const [value, setValue] = useState('');
    const theme = makeTheme(config.theme);
    const prefix = usePrefix({ theme });

    useKeypress((key, rl) => {
        if (isEnterKey(key)) {
            let answer = config.default !== false;
            if (trueRegExp.test(value)) answer = true;
            else if (falseRegExp.test(value)) answer = false;

            setValue(transformer(answer));
            setStatus('done');
            done(answer);
        } else {
            setValue(rl.line);
        }
    });

    let formattedValue = value;
    let defaultValue = '';
    if (status === 'done') {
        formattedValue = theme.style.answer(value);
    } else {
        defaultValue = ` ${theme.style.defaultAnswer(
            config.default === false
                ? `${trueShort.toLowerCase()}/${falseShort.toUpperCase()}`
                : `${trueShort.toUpperCase()}/${falseShort.toLowerCase()}`
        )}`;
    }

    const message = theme.style.message(config.message, 'done');
    return `${prefix} ${message}${defaultValue} ${formattedValue}`;
});
