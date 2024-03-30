import { compile } from './compiler/compile';
import { tpl } from './template';
import { ansieConsole } from './console/console';
import { getGlobalTheme, setGlobalTheme } from './themes/themes';
import { parseAnsieMarkdown } from './parser';
import { ask, askSingleLineText, askMultilineText, askSelect, askPassword, askConfirm } from './ask';
export default {

    // Prompts
    ask,
    askSingleLineText,
    askMultilineText,
    askSelect,
    askPassword,
    askConfirm,

    // Compiler
    compile,
    tpl,
    console: ansieConsole,

    // Themes
    setGlobalTheme,
    getGlobalTheme,

    // Parser
    parseAnsieMarkdown
};
