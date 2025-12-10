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

    test('should log with additional data', () => {
        const data = { userId: 123, action: 'click' };
        logger.info('User action', data);
        
        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('User action'),
            data
        );
    });

    test('should log debug messages', () => {
        logger.debug('Debug message');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('DEBUG'));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Debug message'));
    });

    test('should change log level dynamically', () => {
        const dynamicLogger = new ClientLogger(LogLevel.INFO);
        const spy = jest.spyOn(console, 'log').mockImplementation();
        
        dynamicLogger.debug('Should not appear');
        expect(spy).not.toHaveBeenCalled();
        
        dynamicLogger.setLogLevel(LogLevel.DEBUG);
        dynamicLogger.debug('Should appear now');
        expect(spy).toHaveBeenCalled();
        
        spy.mockRestore();
    });

    test('should include timestamp in log messages', () => {
        logger.info('Test message');
        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
        );
    });

    test('should include CLIENT identifier in log messages', () => {
        logger.info('Test message');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[CLIENT]'));
    });
});