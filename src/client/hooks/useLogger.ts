import { useMemo } from 'react';
import ClientLogger from '../ClientLogger';
import { LogLevel } from '../../core/LogLevel';

interface UseLoggerOptions {
    logLevel?: LogLevel;
    prefix?: string;
}

const useLogger = (options?: UseLoggerOptions) => {
    const logger = useMemo(() => {
        return new ClientLogger(options?.logLevel);
    }, [options?.logLevel]);

    const debug = (message: string, data?: any) => {
        const fullMessage = options?.prefix ? `[${options.prefix}] ${message}` : message;
        logger.debug(fullMessage, data);
    };

    const info = (message: string, data?: any) => {
        const fullMessage = options?.prefix ? `[${options.prefix}] ${message}` : message;
        logger.info(fullMessage, data);
    };

    const warn = (message: string, data?: any) => {
        const fullMessage = options?.prefix ? `[${options.prefix}] ${message}` : message;
        logger.warn(fullMessage, data);
    };

    const error = (message: string, data?: any) => {
        const fullMessage = options?.prefix ? `[${options.prefix}] ${message}` : message;
        logger.error(fullMessage, data);
    };

    return { debug, info, warn, error, setLogLevel: logger.setLogLevel.bind(logger) };
};

export default useLogger;