import { describe, it, expect, spyOn } from 'bun:test';
import { ansieConsole } from './console';

spyOn(console, 'log');
spyOn(console, 'warn');
spyOn(console, 'error');
spyOn(console, 'info');

// NOTE: bun test's toHaveBeenCalledWith is not working properly and neither is clearAllMocks.

describe('ansie console', () => {
    it('should log a message', () => {
        expect(() =>
            ansieConsole.log('Test message with %s', 'markup'),
        ).not.toThrow();

        expect(console.log).toHaveBeenCalledTimes(1);
    });

    it('should warn a message', () => {
        expect(() =>
            ansieConsole.warn('Test message with %s', 'markup'),
        ).not.toThrow();

        expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it('should error a message', () => {
        expect(() =>
            ansieConsole.error('Test message with %s', 'markup'),
        ).not.toThrow();

        expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should info a message', () => {
        expect(() =>
            ansieConsole.info('Test message with %s', 'markup'),
        ).not.toThrow();

        expect(console.info).toHaveBeenCalledTimes(1);
    });
});
