import { LogLevel } from "./LogLevel";

class Logger {
    private logLevel: LogLevel;

    constructor(logLevel: LogLevel = LogLevel.INFO) {
        this.logLevel = logLevel;
    }

    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    public log(level: LogLevel, message: string): void {
        if (level >= this.logLevel) {
            const formattedMessage = this.formatMessage(level, message);
            this.transport(formattedMessage);
        }
    }

    public debug(message: string): void {
        this.log(LogLevel.DEBUG, message);
    }

    public info(message: string): void {
        this.log(LogLevel.INFO, message);
    }

    public warn(message: string): void {
        this.log(LogLevel.WARN, message);
    }

    public error(message: string): void {
        this.log(LogLevel.ERROR, message);
    }

    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${LogLevel[level]}] ${message}`;
    }

    private transport(message: string): void {
        console.log(message);
    }
}

export default Logger;