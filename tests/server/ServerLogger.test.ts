import ServerLogger from '../../src/server/ServerLogger';
import { LogLevel } from '../../src/core/LogLevel';

describe('ServerLogger', () => {
    let logger: ServerLogger;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        logger = new ServerLogger(LogLevel.DEBUG);
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    it('should log messages at the INFO level', () => {
        logger.info('Info message');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[SERVER]'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('INFO'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Info message'));
    });

    it('should log messages at the WARN level', () => {
        logger.warn('Warning message');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[SERVER]'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('WARN'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Warning message'));
    });

    it('should log messages at the ERROR level', () => {
        logger.error('Error message');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[SERVER]'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Error message'));
    });

    it('should log messages at the DEBUG level', () => {
        logger.debug('Debug message');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[SERVER]'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('DEBUG'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Debug message'));
    });

    it('should respect log level settings', () => {
        const warnLogger = new ServerLogger(LogLevel.WARN);
        const spy = jest.spyOn(console, 'log').mockImplementation();
        
        warnLogger.info('This should not appear');
        expect(spy).not.toHaveBeenCalled();
        
        warnLogger.warn('This should appear');
        expect(spy).toHaveBeenCalled();
        
        spy.mockRestore();
    });
});