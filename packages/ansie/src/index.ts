import { compile, compileAsync } from './compiler/compile';
import { tpl } from './template';
import { ansieConsole } from './console/console';
import { getGlobalTheme, setGlobalTheme } from './themes/themes';
import { parseAnsieMarkdown } from './parser';
import {
    askSingleLineText,
    askMultilineText,
    askSelect,
    askPassword,
    askConfirm
} from './ask';
export default {
    // Prompts
    askSingleLineText,
    askMultilineText,
    askSelect,
    askPassword,
    askConfirm,

    // Compiler
    compile,
    compileAsync,
    tpl,
    console: ansieConsole,

    // Themes
    setGlobalTheme,
    getGlobalTheme,

    // Parser
    parseAnsieMarkdown
};
