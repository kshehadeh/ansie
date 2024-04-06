import confirmInput from './confirm-input';
import passwordInput from './password-input';
import selectInput from './select-input';
import textInput from './text-input';
import { renderPrompt } from './util';

function upperIfTrue(value: string, isTrue: boolean) {
    return isTrue ? value.toUpperCase() : value.toLowerCase();
}

/**
 * Ask the user for a multiline text input
 * @param prompt
 * @returns
 */
export async function askMultilineText(prompt: string) {
    renderPrompt(prompt);
    return textInput(true, '');
}

/**
 * Ask the user for a single line text input
 * @param prompt
 * @returns
 */
export async function askSingleLineText(prompt: string, def: string = '') {
    renderPrompt(prompt, def);
    return textInput(false, def);
}

/**
 * Ask the user to select an option from a list
 * @param prompt
 * @param choices
 * @returns
 */
export async function askSelect(
    prompt: string,
    choices: string[],
    def: string = ''
) {
    if (def && choices.find(c => c === def) === undefined) {
        throw new Error('Default value not found in choices');
    }

    renderPrompt(prompt, def);
    return (await selectInput(choices, def)).choice || '';
}

/**
 * Ask the user for a password
 * @param prompt
 * @param mask
 * @returns
 */
export async function askPassword(prompt: string, mask: string = '\u{25CF}') {
    renderPrompt(prompt);
    return passwordInput(mask);
}

/**
 * Ask the user for a confirmation
 * @param prompt
 * @param options
 * @returns
 */
export async function askConfirm(
    prompt: string,
    options: {
        default: boolean;
        isContinue: boolean;
        trueValue: string;
        falseValue: string;
    }
): Promise<boolean> {
    const trueValue = options.trueValue || 'y';
    const falseValue = options.falseValue || 'n';

    // If the default value is true, render the prompt with the true value in caps, otherwise render
    //  the prompt with the false value in caps.  If def is not provided, render the prompt with both
    //  values in lower case.
    renderPrompt(
        prompt,
        `${upperIfTrue(options.trueValue, options.default)}/${upperIfTrue(
            options.falseValue,
            !options.default
        )}`
    );

    return confirmInput({
        defaultValue: options.default,
        isContinue: options.isContinue || false,
        trueValue: trueValue,
        falseValue: falseValue
    });
}
