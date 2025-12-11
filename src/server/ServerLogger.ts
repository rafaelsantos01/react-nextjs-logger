import os from 'os';
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
    private context: Record<string, any> | undefined;
    private jsonOutput: boolean;
    private hostname: string;

    constructor(
        logLevel: LogLevel = LogLevel.INFO,
        enableColors: boolean = true,
        forceServerMode: boolean = false,
        context?: Record<string, any>
    ) {
        this.logLevel = logLevel;
        this.forceServerMode = forceServerMode;
        this.hostname = os.hostname();
        this.enableColors = enableColors && this.isServer();
        this.context = context;
        const envJson = process.env.RNL_SERVER_LOG_JSON || process.env.LOG_JSON;
        this.jsonOutput = envJson === '1' || envJson === 'true';
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

        const contextPrefix = this.formatContextPrefix();
        const levelName = LogLevel[level];

        return `${gray}[${timestamp}]${reset} ${bright}[SERVER]${reset} ${color}[${levelName}]${reset}${contextPrefix} ${message}`;
    }

    private formatContextPrefix(): string {
        if (!this.context) return '';

        const parts: string[] = [];
        const gray = this.enableColors ? colors.gray : '';
        const reset = this.enableColors ? colors.reset : '';

        // Extract service/app/name
        const serviceName = this.context.service || this.context.app || this.context.name;
        if (serviceName) {
            parts.push(`${gray}[Context:${serviceName}]${reset}`);
        }

        // Add hostname
        parts.push(`${gray}[Host:${this.hostname}]${reset}`);

        // Extract environment
        if (this.context.env) {
            parts.push(`${gray}[Env:${this.context.env}]${reset}`);
        }

        // Extract version
        if (this.context.version) {
            parts.push(`${gray}[v${this.context.version}]${reset}`);
        }

        return parts.length > 0 ? ' ' + parts.join(' ') : '';
    }

    private transport(level: LogLevel, message: string, data?: LogData): void {
        const formattedMessage = this.formatMessage(level, message);

        // Combine context with provided data
        const combined = this.context ? { ...this.context, ...(data || {}) } : data;

        // Extract context fields that are shown in prefix
        let contextForData = combined;
        if (combined && this.context) {
            const { service, app, name, env, version, ...rest } = combined;
            // Only remove the fields if they came from context, not from data
            const hasService = this.context.service || this.context.app || this.context.name;
            const hasEnv = this.context.env;
            const hasVersion = this.context.version;

            if (hasService || hasEnv || hasVersion) {
                contextForData = { ...rest };
            }
        }

        // Mask sensitive data before logging
        const maskedData = contextForData ? maskSensitiveData(contextForData) : undefined;

        if (this.jsonOutput) {
            const payload: any = {
                ts: new Date().toISOString(),
                level: LogLevel[level],
                message,
                source: 'server',
                hostname: this.hostname
            };

            // Add context metadata to JSON
            if (this.context) {
                const serviceName = this.context.service || this.context.app || this.context.name;
                if (serviceName) payload.service = serviceName;
                if (this.context.env) payload.env = this.context.env;
                if (this.context.version) payload.version = this.context.version;
            }

            // Add remaining data
            if (maskedData && Object.keys(maskedData).length > 0) {
                payload.data = maskedData;
            }

            const json = JSON.stringify(payload);
            switch (level) {
                case LogLevel.ERROR:
                    console.error(json);
                    return;
                case LogLevel.WARN:
                    console.warn(json);
                    return;
                case LogLevel.DEBUG:
                    console.debug(json);
                    return;
                case LogLevel.INFO:
                default:
                    console.log(json);
                    return;
            }
        }

        // Use console methods based on log level in human-readable format
        switch (level) {
            case LogLevel.ERROR:
                if (maskedData && Object.keys(maskedData).length > 0) {
                    console.error(formattedMessage, maskedData);
                } else {
                    console.error(formattedMessage);
                }
                break;
            case LogLevel.WARN:
                if (maskedData && Object.keys(maskedData).length > 0) {
                    console.warn(formattedMessage, maskedData);
                } else {
                    console.warn(formattedMessage);
                }
                break;
            case LogLevel.DEBUG:
                if (maskedData && Object.keys(maskedData).length > 0) {
                    console.debug(formattedMessage, maskedData);
                } else {
                    console.debug(formattedMessage);
                }
                break;
            case LogLevel.INFO:
            default:
                if (maskedData && Object.keys(maskedData).length > 0) {
                    console.log(formattedMessage, maskedData);
                } else {
                    console.log(formattedMessage);
                }
                break;
        }
    }
}

/**
 * Get LogLevel from environment variables
 * Priority: RNL_LOG_LEVEL > LOG_LEVEL > NODE_ENV mapping
 */
function getLogLevelFromEnv(): LogLevel {
    // Check custom log level env vars
    const customLevel = process.env.RNL_LOG_LEVEL || process.env.LOG_LEVEL;
    
    if (customLevel) {
        const upperLevel = customLevel.toUpperCase();
        if (upperLevel in LogLevel) {
            return LogLevel[upperLevel as keyof typeof LogLevel];
        }
    }
    
    // Fallback to NODE_ENV mapping
    const nodeEnv = process.env.NODE_ENV;
    switch (nodeEnv) {
        case 'production':
            return LogLevel.WARN;
        case 'test':
            return LogLevel.ERROR;
        case 'development':
        default:
            return LogLevel.DEBUG;
    }
}

export function createServerLogger(options?: { level?: LogLevel; colors?: boolean; forceServerMode?: boolean; context?: Record<string, any>; }) {
    const level = options?.level ?? getLogLevelFromEnv();
    const colors = options?.colors ?? true;
    const forceServerMode = options?.forceServerMode ?? false;
    const context = options?.context;
    return new ServerLogger(level, colors, forceServerMode, context);
}

export default ServerLogger;