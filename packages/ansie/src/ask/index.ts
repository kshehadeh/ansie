import { input, password, select } from '@inquirer/prompts';
import editor from './ansie-editor';
import confirm from './ansie-confirm';
import compile from '@/compile';
import themes from '@/themes';

export default {
    text: askSingleLineText,
    select: askSelect,
    password: askPassword,
    confirm: askYesNo,
    multiline: askMultilineText
};

const promptTheme = themes.build(
    {
        p: {
            spacing: {
                margin: 0,
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0
            }
        }
    },
    themes.get()
);

function compileForPrompt(prompt: string): string {
    const compiledPrompt = compile({ markup: prompt, theme: promptTheme });
    // Remove any newlines at the beginning and end
    return compiledPrompt.replaceAll(/^\n+|\n+$/g, '');
}

async function askMultilineText(prompt: string, defaultValue?: string) {
    return editor({
        message: compileForPrompt(prompt),
        default: defaultValue
    });
}

async function askSingleLineText(prompt: string, defaultValue?: string) {
    return input({
        message: compileForPrompt(prompt),
        default: defaultValue
    });
}

async function askSelect(
    prompt: string,
    choices: string[],
    defaultValue: string = ''
) {
    if (defaultValue && choices.find(c => c === defaultValue) === undefined) {
        throw new Error('Default value not found in choices');
    }

    return select({
        message: compileForPrompt(prompt),
        choices: choices.map(c => ({ name: compileForPrompt(c), value: c })),
        default: defaultValue || undefined
    });
}

async function askPassword(prompt: string, mask: string = '\u{25CF}') {
    return password({
        message: compileForPrompt(prompt),
        mask: mask
    });
}

async function askYesNo(
    prompt: string,
    defaulValue: boolean,
    trueFalse?: {
        trueValue: string;
        falseValue: string;
    }
): Promise<boolean> {
    const tf = trueFalse || { trueValue: 'Yes', falseValue: 'No' };
    return confirm({
        default: defaulValue,
        message: compileForPrompt(prompt),
        trueValue: {
            short: tf.trueValue[0],
            long: tf.trueValue
        },
        falseValue: {
            short: tf.falseValue[0],
            long: tf.falseValue
        }
    });
}
