import { ansieConsole } from '@/console/console';

export interface AskOptions {
    format: 'ansie' | 'plain';
    theme: string;
    default: string;
    typeOptions:
        | {
              type: 'select';
              choices: string[];
          }
        | {
              type: 'text';
              multiline: boolean;
          }
        | {
              type: 'password';
              mask?: string;
          }
        | {
              type: 'confirm';
              isContinue: boolean;
              trueValue: string;
              falseValue: string;
          };
}

export function renderPrompt(prompt?: string, def?: string) {
    if (prompt !== '') {
        let finalPrompt = prompt;

        // See if we can find `[default]` in the prompt and replace it with the default value.  Otherwise
        //  just render the prompt as is with the default after it.
        const richDefault = def ? `[c=gray](${def})[/c]` : '';
        if (richDefault && finalPrompt?.indexOf('[default]') !== -1) {
            finalPrompt = finalPrompt?.replace('[default]', richDefault);
        } else if (richDefault) {
            finalPrompt = `${finalPrompt} ${richDefault}`;
        }

        ansieConsole.info(finalPrompt);
    }
}
