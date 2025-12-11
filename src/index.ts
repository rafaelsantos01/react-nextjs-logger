// Client exports
export { default as ClientLogger } from './client/ClientLogger';
export { default as useLogger } from './client/hooks/useLogger';

// Server exports
export { default as ServerLogger, createServerLogger } from './server/ServerLogger';

// Core exports
export { LogLevel } from './core/LogLevel';
export { default as Logger } from './core/Logger';
export * from './core/types';

// Mask utilities
export { maskSensitiveData, maskValue, initializeMaskConfig, resetMaskConfig } from './utils/mask';

// Default logger instance for convenience
import ClientLogger from './client/ClientLogger';
export const logger = new ClientLogger();