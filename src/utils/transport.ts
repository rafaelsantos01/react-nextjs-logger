import { LogLevel } from '../core/LogLevel';

export function sendLog(level: LogLevel, message: string, additionalData?: any) {
    const logEntry = formatLogEntry(level, message, additionalData);
    // Aqui você pode implementar a lógica para enviar os logs para diferentes destinos
    // Por exemplo, enviar para um serviço externo, salvar em um arquivo, ou apenas imprimir no console
    console.log(logEntry);
}

function formatLogEntry(level: LogLevel, message: string, additionalData?: any): string {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (additionalData) {
        return `${formattedMessage} - ${JSON.stringify(additionalData)}`;
    }
    
    return formattedMessage;
}