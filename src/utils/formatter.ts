export  function formatLogMessage(level: string, message: string, timestamp: Date = new Date()): string {
    return `[${timestamp.toISOString()}] [${level}] ${message}`;
}

export  function formatErrorMessage(error: Error, context?: string): string {
    const errorMessage = context ? `${context}: ${error.message}` : error.message;
    return formatLogMessage('ERROR', errorMessage);
}