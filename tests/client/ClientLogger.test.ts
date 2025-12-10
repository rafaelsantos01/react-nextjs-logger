import ClientLogger from '../../src/client/ClientLogger';
import { LogLevel } from '../../src/core/LogLevel';

describe('ClientLogger', () => {
    let logger: ClientLogger;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        logger = new ClientLogger(LogLevel.DEBUG);
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    test('should log info messages', () => {
        logger.info('This is an info message');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('INFO'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('This is an info message'));
    });

    test('should log warning messages', () => {
        logger.warn('This is a warning message');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('WARN'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('This is a warning message'));
    });

    test('should log error messages', () => {
        logger.error('This is an error message');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('This is an error message'));
    });

    test('should respect log level', () => {
        const warnLogger = new ClientLogger(LogLevel.WARN);
        const spy = jest.spyOn(console, 'log').mockImplementation();
        
        warnLogger.info('This should not appear');
        expect(spy).not.toHaveBeenCalled();
        
        warnLogger.warn('This should appear');
        expect(spy).toHaveBeenCalled();
        
        spy.mockRestore();
    });
});