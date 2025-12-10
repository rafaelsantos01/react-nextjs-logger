import { LogLevel } from "../core/LogLevel";

class ClientLogger {
    private logLevel: LogLevel;

    constructor(logLevel: LogLevel = LogLevel.INFO) {
        this.logLevel = logLevel;
    }

    info(message: string) {
        this.writeLog(LogLevel.INFO, message);
    }

    warn(message: string) {
        this.writeLog(LogLevel.WARN, message);
    }

    error(message: string) {
        this.writeLog(LogLevel.ERROR, message);
    }

    private writeLog(level: LogLevel, message: string) {
        if (this.shouldLog(level)) {
            console.log(`[${level}] ${message}`);
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.logLevel;
    }
}

export default ClientLogger;