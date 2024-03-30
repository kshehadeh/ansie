import { ansieConsole } from '../console/console';
import confirmInput from './confirm-input';
import passwordInput from './password-input';
import selectInput from './select-input';
import textInput from './text-input';
import type { AskOptions } from './util';

/**
 * Ask the user a question and return the response.
 * @param prompt 
 * @param options 
 * @returns 
 */
export async function ask(prompt: string, options?: AskOptions): Promise<string | boolean> {
    const opt = options || {
        default: '',
        theme: 'default',
        typeOptions: { type: 'text', multiline: false, default: "" }
    }

    if (prompt !== '') {
        ansieConsole.info(prompt);
    }

    if (opt.typeOptions.type === 'select') {
        return (await selectInput(opt.typeOptions)).choice;
    } else if (opt.typeOptions.type === 'text') {
        return textInput(opt.typeOptions.multiline, opt.default);
    } else if (opt.typeOptions.type === 'password') {
        return passwordInput(opt.typeOptions.mask);
    } else if (opt.typeOptions.type === 'confirm') {
        return confirmInput({
            defaultValue: opt.default === opt.typeOptions.trueValue,
            isContinue: opt.typeOptions.isContinue,
            trueValue: opt.typeOptions.trueValue || 'y',
            falseValue: opt.typeOptions.falseValue || 'n',
        })
    } else {
        throw new Error('Unknown input type given');
    }
}

/**
 * Ask the user for a multiline text input
 * @param prompt 
 * @returns 
 */
export async function askMultilineText(prompt: string) {
    return ask(prompt, { format: 'ansie', theme: 'default', default: '', typeOptions: { type: 'text', multiline: true } });
}

/**
 * Ask the user for a single line text input 
 * @param prompt 
 * @returns 
 */
export async function askSingleLineText(prompt: string) {
    return ask(prompt, { format: 'ansie', theme: 'default', default: '', typeOptions: { type: 'text', multiline: false } });
}

/**
 * Ask the user to select an option from a list
 * @param prompt 
 * @param choices 
 * @returns 
 */
export async function askSelect(prompt: string, choices: string[]) {
    return ask(prompt, { format: 'ansie', theme: 'default', default: '', typeOptions: { type: 'select', choices } });
}

/**
 * Ask the user for a password
 * @param prompt 
 * @param mask 
 * @returns 
 */
export async function askPassword(prompt: string, mask: string = '\u{25CF}') {
    return ask(prompt, { format: 'ansie', theme: 'default', default: '', typeOptions: { type: 'password', mask } });
}

/**
 * Ask the user for a confirmation
 * @param prompt 
 * @param options 
 * @returns 
 */
export async function askConfirm(prompt: string, options: { default: boolean, isContinue: boolean, trueValue: string, falseValue: string }) {
    const trueValue = options.trueValue || 'y';
    const falseValue = options.falseValue || 'n';

    const resp = await ask(prompt, {
        format: 'ansie',
        theme: 'default',
        default: options.default ? trueValue : falseValue,
        typeOptions: {
            type: 'confirm',
            isContinue: options.isContinue || false,
            trueValue: trueValue,
            falseValue: falseValue
        }
    });

    return !!resp;
}


// ask(':grin: What is your name? ').then(name => {
//     console.log(`## Hello, ${name}!`);
//     process.exit();
// })