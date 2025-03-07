import { search } from '@inquirer/prompts';
declare const _default: {
    text: typeof askSingleLineText;
    selectEx: typeof askSelectEx;
    select: typeof askSelect;
    password: typeof askPassword;
    confirm: typeof askYesNo;
    multiline: typeof askMultilineText;
    search: typeof askSearch;
};
export default _default;
declare function askMultilineText(
    prompt: string,
    defaultValue?: string
): Promise<string>;
declare function askSingleLineText(
    prompt: string,
    defaultValue?: string
): Promise<string>;
declare function askPassword(prompt: string, mask?: string): Promise<string>;
declare function askYesNo(
    prompt: string,
    defaulValue: boolean,
    trueFalse?: {
        trueValue: string;
        falseValue: string;
    }
): Promise<boolean>;
declare function askSearch(
    prompt: string,
    searchFn: (
        term: string | undefined,
        opt: {
            signal: AbortSignal;
        }
    ) => ReturnType<Parameters<typeof search<string | undefined>>[0]['source']>
): Promise<string | undefined>;
declare function askSelectEx<T = string>(
    prompt: string,
    choices: {
        name: string;
        value: T;
    }[],
    defaultValue?: T,
    loop?: boolean
): Promise<T | undefined>;
declare function askSelect(
    prompt: string,
    choices: string[],
    defaultValue?: string,
    loop?: boolean
): Promise<string | undefined>;
