import { LogLevel } from '../core/LogLevel';

export class ServerLogger {
    private logLevel: LogLevel;

    constructor(logLevel: LogLevel = LogLevel.INFO) {
        this.logLevel = logLevel;
    }

    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    log(level: LogLevel, message: string) {
        if (level >= this.logLevel) {
            const formattedMessage = this.formatMessage(level, message);
            this.transport(formattedMessage);
        }
    }

    info(message: string) {
        this.log(LogLevel.INFO, message);
    }

    warn(message: string) {
        this.log(LogLevel.WARN, message);
    }

    error(message: string) {
        this.log(LogLevel.ERROR, message);
    }

    debug(message: string) {
        this.log(LogLevel.DEBUG, message);
    }

    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [SERVER] [${level}] ${message}`;
    }

    private transport(message: string): void {
        console.log(message);
    }
}

export default ServerLogger;