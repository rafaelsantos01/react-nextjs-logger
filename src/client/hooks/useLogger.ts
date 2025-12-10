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

    const info = (message: string, data?: any) => {
        const fullMessage = options?.prefix ? `[${options.prefix}] ${message}` : message;
        logger.info(data ? `${fullMessage} ${JSON.stringify(data)}` : fullMessage);
    };

    const warn = (message: string, data?: any) => {
        const fullMessage = options?.prefix ? `[${options.prefix}] ${message}` : message;
        logger.warn(data ? `${fullMessage} ${JSON.stringify(data)}` : fullMessage);
    };

    const error = (message: string, data?: any) => {
        const fullMessage = options?.prefix ? `[${options.prefix}] ${message}` : message;
        logger.error(data ? `${fullMessage} ${JSON.stringify(data)}` : fullMessage);
    };

    return { info, warn, error };
};

export default useLogger;