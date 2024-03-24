import util from 'util';
import { compile } from '../compiler/compile';

export const ansieConsole = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log: (message?: any, ...optionalParams: any[]) => {
        const logWithMarkup = util.format(message, ...optionalParams);
        console.log(compile(logWithMarkup));
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (message?: any, ...optionalParams: any[]) => {
        const logWithMarkup = util.format(message, ...optionalParams);
        console.error(compile(logWithMarkup));
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (message?: any, ...optionalParams: any[]) => {
        const logWithMarkup = util.format(message, ...optionalParams);
        console.info(compile(logWithMarkup));
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (message?: any, ...optionalParams: any[]) => {
        const logWithMarkup = util.format(message, ...optionalParams);
        console.warn(compile(logWithMarkup));
    },
};
