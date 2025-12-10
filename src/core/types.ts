import { LogLevel } from "./LogLevel";

export interface LogMessage {
    level: LogLevel;
    message: string;
    timestamp: Date;
    context?: Record<string, any>;
}

export interface LoggerOptions {
    level?: LogLevel;
    transport?: (log: LogMessage) => void;
}

export interface LoggerConfig {
    logLevel: LogLevel;
    enableConsole?: boolean;
}