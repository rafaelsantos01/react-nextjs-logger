import { NextApiRequest, NextApiResponse } from 'next';
import { ServerLogger } from './ServerLogger';

const logger = new ServerLogger();

export const loggingMiddleware = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    logger.info(`Request: ${req.method} ${req.url}`);
    
    res.on('finish', () => {
        logger.info(`Response: ${res.statusCode} ${req.method} ${req.url}`);
    });

    next();
};