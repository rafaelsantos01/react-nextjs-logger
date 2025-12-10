import { LogLevel } from "../core/LogLevel";

class ClientLogger {
    private logLevel: LogLevel;

    constructor(logLevel: LogLevel = LogLevel.INFO) {
        this.logLevel = logLevel;
    }

    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    info(message: string, data?: any) {
        this.writeLog(LogLevel.INFO, message, data);
    }

    warn(message: string, data?: any) {
        this.writeLog(LogLevel.WARN, message, data);
    }

    error(message: string, data?: any) {
        this.writeLog(LogLevel.ERROR, message, data);
    }

    debug(message: string, data?: any) {
        this.writeLog(LogLevel.DEBUG, message, data);
    }

    private writeLog(level: LogLevel, message: string, data?: any) {
        if (this.shouldLog(level)) {
            const timestamp = new Date().toISOString();
            const formattedMessage = `[${timestamp}] [CLIENT] [${level}] ${message}`;
            
            if (data) {
                console.log(formattedMessage, data);
            } else {
                console.log(formattedMessage);
            }
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.logLevel;
    }
}

export default ClientLogger;