import { LogLevel } from '../core/LogLevel';
import { maskSensitiveData } from '../utils/mask';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
};

interface LogData {
    [key: string]: any;
}

export class ServerLogger {
    private logLevel: LogLevel;
    private enableColors: boolean;
    private forceServerMode: boolean;

    constructor(logLevel: LogLevel = LogLevel.INFO, enableColors: boolean = true, forceServerMode: boolean = false) {
        this.logLevel = logLevel;
        this.forceServerMode = forceServerMode;
        this.enableColors = enableColors && this.isServer();
    }

    private isServer(): boolean {
        return this.forceServerMode || typeof window === 'undefined';
    }

    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    log(level: LogLevel, message: string, data?: LogData) {
        if (!this.isServer() && !this.forceServerMode) {
            console.warn('[ServerLogger] Warning: ServerLogger should only be used on the server side');
            return;
        }

        if (level >= this.logLevel) {
            this.transport(level, message, data);
        }
    }

    info(message: string, data?: LogData) {
        this.log(LogLevel.INFO, message, data);
    }

    warn(message: string, data?: LogData) {
        this.log(LogLevel.WARN, message, data);
    }

    error(message: string, data?: LogData | Error) {
        if (data instanceof Error) {
            this.log(LogLevel.ERROR, message, {
                error: data.message,
                stack: data.stack,
                name: data.name,
            });
        } else {
            this.log(LogLevel.ERROR, message, data);
        }
    }

    debug(message: string, data?: LogData) {
        this.log(LogLevel.DEBUG, message, data);
    }

    private getColorForLevel(level: LogLevel): string {
        if (!this.enableColors) return '';

        switch (level) {
            case LogLevel.DEBUG:
                return colors.cyan;
            case LogLevel.INFO:
                return colors.blue;
            case LogLevel.WARN:
                return colors.yellow;
            case LogLevel.ERROR:
                return colors.red;
            default:
                return colors.reset;
        }
    }

    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        const color = this.getColorForLevel(level);
        const reset = this.enableColors ? colors.reset : '';
        const gray = this.enableColors ? colors.gray : '';
        const bright = this.enableColors ? colors.bright : '';

        return `${gray}[${timestamp}]${reset} ${bright}[SERVER]${reset} ${color}[${level}]${reset} ${message}`;
    }

    private transport(level: LogLevel, message: string, data?: LogData): void {
        const formattedMessage = this.formatMessage(level, message);
        
        // Mask sensitive data before logging
        const maskedData = data ? maskSensitiveData(data) : undefined;

        // Use console methods based on log level
        switch (level) {
            case LogLevel.ERROR:
                if (maskedData) {
                    console.error(formattedMessage, maskedData);
                } else {
                    console.error(formattedMessage);
                }
                break;
            case LogLevel.WARN:
                if (maskedData) {
                    console.warn(formattedMessage, maskedData);
                } else {
                    console.warn(formattedMessage);
                }
                break;
            case LogLevel.DEBUG:
                if (maskedData) {
                    console.debug(formattedMessage, maskedData);
                } else {
                    console.debug(formattedMessage);
                }
                break;
            case LogLevel.INFO:
            default:
                if (maskedData) {
                    console.log(formattedMessage, maskedData);
                } else {
                    console.log(formattedMessage);
                }
                break;
        }
    }
}

export default ServerLogger;