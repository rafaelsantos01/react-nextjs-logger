// Utility functions for masking sensitive data in logs

interface MaskConfig {
    enableDefaultMask: boolean;
    customFields: string[];
}

// Default sensitive fields that should be masked
const DEFAULT_SENSITIVE_FIELDS = [
    'password',
    'senha',
    'pass',
    'pwd',
    'secret',
    'token',
    'accesstoken',
    'refreshtoken',
    'apikey',
    'api_key',
    'authorization',
    'email',
    'username',
    'e-mail',
    'cpf',
    'cnpj',
    'document',
    'documento',
    'ssn',
    'creditcard',
    'credit_card',
    'cartao',
    'cvv',
    'cvc',
    'pin',
    'phone',
    'telefone',
    'celular',
    'mobile',
];

let maskConfig: MaskConfig = {
    enableDefaultMask: true,
    customFields: [],
};

/**
 * Initialize mask configuration from environment variables
 */
export function initializeMaskConfig(): void {
    // Check if running in browser or server
    const isBrowser = typeof window !== 'undefined';
    
    // Read NEXT_PUBLIC_DEFAULT_MASK (default: true)
    const defaultMaskEnv = isBrowser 
        ? (window as any).NEXT_PUBLIC_DEFAULT_MASK 
        : process.env.NEXT_PUBLIC_DEFAULT_MASK;
    
    maskConfig.enableDefaultMask = defaultMaskEnv !== 'false' && defaultMaskEnv !== 'FALSE';
    
    // Read NEXT_PUBLIC_MASK_FIELDS (comma-separated list)
    const customFieldsEnv = isBrowser
        ? (window as any).NEXT_PUBLIC_MASK_FIELDS
        : process.env.NEXT_PUBLIC_MASK_FIELDS;
    
    if (customFieldsEnv && typeof customFieldsEnv === 'string') {
        maskConfig.customFields = customFieldsEnv
            .split(',')
            .map(field => field.trim().toLowerCase())
            .filter(field => field.length > 0);
    }
}

/**
 * Get all fields that should be masked (default + custom)
 */
function getSensitiveFields(): string[] {
    const fields = new Set<string>();
    
    // Add default fields if enabled
    if (maskConfig.enableDefaultMask) {
        DEFAULT_SENSITIVE_FIELDS.forEach(field => fields.add(field));
    }
    
    // Add custom fields
    maskConfig.customFields.forEach(field => fields.add(field));
    
    return Array.from(fields);
}

/**
 * Check if a field name is sensitive
 */
function isSensitiveField(fieldName: string): boolean {
    const normalizedField = fieldName.toLowerCase().replace(/[_-]/g, '');
    const sensitiveFields = getSensitiveFields();
    
    return sensitiveFields.some(sensitive => {
        const normalizedSensitive = sensitive.toLowerCase().replace(/[_-]/g, '');
        // Exact match or field contains the sensitive word
        return normalizedField === normalizedSensitive || normalizedField.includes(normalizedSensitive);
    });
}

/**
 * Mask a string value showing first 3 and last 3 characters
 * Examples:
 * - "user@example.com" -> "use***com"
 * - "mypassword123" -> "myp***123"
 * - "abc" -> "***" (too short)
 * - "abcdef" -> "abc***"
 */
export function maskValue(value: string): string {
    if (!value || typeof value !== 'string') {
        return '***';
    }
    
    const length = value.length;
    
    if (length <= 3) {
        return '***';
    }
    
    if (length <= 6) {
        return value.substring(0, 3) + '***';
    }
    
    return value.substring(0, 3) + '***' + value.substring(length - 3);
}

/**
 * Recursively mask sensitive data in an object
 */
export function maskSensitiveData(data: any): any {
    if (data === null || data === undefined) {
        return data;
    }
    
    // Handle primitive types
    if (typeof data !== 'object') {
        return data;
    }
    
    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => maskSensitiveData(item));
    }
    
    // Handle Error objects
    if (data instanceof Error) {
        return {
            error: data.message,
            name: data.name,
            stack: data.stack,
        };
    }
    
    // Handle Date objects
    if (data instanceof Date) {
        return data;
    }
    
    // Handle regular objects
    const masked: any = {};
    
    for (const [key, value] of Object.entries(data)) {
        if (isSensitiveField(key)) {
            // Mask sensitive field - don't recurse, just mask the value
            if (typeof value === 'string') {
                masked[key] = maskValue(value);
            } else if (typeof value === 'number') {
                masked[key] = '***';
            } else if (value === null || value === undefined) {
                masked[key] = value;
            } else if (typeof value === 'object') {
                // For objects in sensitive fields, just mask as ***
                masked[key] = '***';
            } else {
                masked[key] = '***';
            }
        } else {
            // Recursively process nested objects for non-sensitive fields
            masked[key] = maskSensitiveData(value);
        }
    }
    
    return masked;
}

/**
 * Reset mask configuration (useful for testing)
 */
export function resetMaskConfig(): void {
    maskConfig = {
        enableDefaultMask: true,
        customFields: [],
    };
    initializeMaskConfig();
}

// Initialize on module load
initializeMaskConfig();
