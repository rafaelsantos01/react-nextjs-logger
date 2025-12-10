import ServerLogger from '../../src/server/ServerLogger';
import { LogLevel } from '../../src/core/LogLevel';

describe('ServerLogger', () => {
    let logger: ServerLogger;
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;
    let consoleDebugSpy: jest.SpyInstance;

    beforeEach(() => {
        logger = new ServerLogger(LogLevel.DEBUG, false, true); // Disable colors, force server mode for testing
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
        consoleDebugSpy.mockRestore();
    });

    it('should log messages at the INFO level', () => {
        logger.info('Info message');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[SERVER]'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('INFO'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Info message'));
    });

    it('should log messages at the WARN level', () => {
        logger.warn('Warning message');
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('[SERVER]'));
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('WARN'));
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Warning message'));
    });

    it('should log messages at the ERROR level', () => {
        logger.error('Error message');
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[SERVER]'));
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error message'));
    });

    it('should log messages at the DEBUG level', () => {
        logger.debug('Debug message');
        expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('[SERVER]'));
        expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('DEBUG'));
        expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('Debug message'));
    });

    it('should respect log level settings', () => {
        const warnLogger = new ServerLogger(LogLevel.WARN, false, true);
        const spyLog = jest.spyOn(console, 'log').mockImplementation();
        const spyWarn = jest.spyOn(console, 'warn').mockImplementation();
        
        warnLogger.info('This should not appear');
        expect(spyLog).not.toHaveBeenCalled();
        
        warnLogger.warn('This should appear');
        expect(spyWarn).toHaveBeenCalled();
        
        spyLog.mockRestore();
        spyWarn.mockRestore();
    });

    it('should log with additional data', () => {
        const data = { userId: 123, action: 'create' };
        logger.info('User action', data);
        
        // Data should be masked, userId is not sensitive so stays the same
        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('User action'),
            expect.objectContaining({ userId: 123, action: 'create' })
        );
    });

    it('should handle Error objects', () => {
        const error = new Error('Test error');
        logger.error('An error occurred', error);
        
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('An error occurred'),
            expect.objectContaining({
                error: 'Test error',
                name: expect.any(String), // name might be masked or not
                stack: expect.any(String),
            })
        );
    });

    it('should use console.warn for WARN level', () => {
        logger.warn('Warning message');
        expect(consoleWarnSpy).toHaveBeenCalled();
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should use console.error for ERROR level', () => {
        logger.error('Error message');
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should use console.debug for DEBUG level', () => {
        logger.debug('Debug message');
        expect(consoleDebugSpy).toHaveBeenCalled();
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should change log level dynamically', () => {
        const dynamicLogger = new ServerLogger(LogLevel.INFO, false, true);
        const spyDebug = jest.spyOn(console, 'debug').mockImplementation();
        
        dynamicLogger.debug('Should not appear');
        expect(spyDebug).not.toHaveBeenCalled();
        
        dynamicLogger.setLogLevel(LogLevel.DEBUG);
        dynamicLogger.debug('Should appear now');
        expect(spyDebug).toHaveBeenCalled();
        
        spyDebug.mockRestore();
    });
});