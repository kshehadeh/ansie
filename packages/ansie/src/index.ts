import { compile } from './compiler/compile';
import { tpl } from './template';
import { ansieConsole } from './console/console';
import { getGlobalTheme, setGlobalTheme } from './themes/themes';
import { parseAnsieMarkdown } from './parser';

export default {
    compile,
    tpl,
    console: ansieConsole,
    setGlobalTheme,
    getGlobalTheme,
    parseAnsieMarkdown
};
