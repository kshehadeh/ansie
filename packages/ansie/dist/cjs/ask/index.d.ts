declare const _default: {
    text: typeof askSingleLineText;
    select: typeof askSelect;
    password: typeof askPassword;
    confirm: typeof askYesNo;
    multiline: typeof askMultilineText;
};
export default _default;
declare function askMultilineText(prompt: string, defaultValue?: string): Promise<string>;
declare function askSingleLineText(prompt: string, defaultValue?: string): Promise<string>;
declare function askSelect(prompt: string, choices: string[] | {
    name: string;
    value: string;
}[], defaultValue?: string, loop?: boolean): Promise<string>;
declare function askPassword(prompt: string, mask?: string): Promise<string>;
declare function askYesNo(prompt: string, defaulValue: boolean, trueFalse?: {
    trueValue: string;
    falseValue: string;
}): Promise<boolean>;
