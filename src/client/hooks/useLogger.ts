import { useEffect } from 'react';
import ClientLogger from '../ClientLogger';

const useLogger = () => {
    const logger = new ClientLogger();

    const info = (message: string) => {
        logger.info(message);
    };

    const warn = (message: string) => {
        logger.warn(message);
    };

    const error = (message: string) => {
        logger.error(message);
    };

    useEffect(() => {
        logger.info('Logger initialized');
    }, []);

    return {  info, warn, error };
};

export default useLogger;