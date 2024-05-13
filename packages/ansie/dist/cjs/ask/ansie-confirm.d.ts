import { type Theme } from '@inquirer/core';
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
declare const _default: import("@inquirer/type").Prompt<boolean, ConfirmConfig>;
export default _default;
