import { maskValue, maskSensitiveData, resetMaskConfig } from '../../src/utils/mask';

describe('Mask Utilities', () => {
    beforeEach(() => {
        // Reset configuration before each test
        resetMaskConfig();
    });

    describe('maskValue', () => {
        it('should mask short strings (3 chars or less)', () => {
            expect(maskValue('abc')).toBe('***');
            expect(maskValue('ab')).toBe('***');
            expect(maskValue('a')).toBe('***');
        });

        it('should mask medium strings (4-6 chars)', () => {
            expect(maskValue('abcd')).toBe('abc***');
            expect(maskValue('abcdef')).toBe('abc***');
        });

        it('should mask long strings showing first and last 3 chars', () => {
            expect(maskValue('user@example.com')).toBe('use***com');
            expect(maskValue('mypassword123')).toBe('myp***123');
            expect(maskValue('1234567890')).toBe('123***890');
        });

        it('should handle empty or invalid input', () => {
            expect(maskValue('')).toBe('***');
            expect(maskValue(null as any)).toBe('***');
            expect(maskValue(undefined as any)).toBe('***');
        });
    });

    describe('maskSensitiveData', () => {
        it('should mask password fields', () => {
            const data = {
                userId: 123,
                password: 'secret123',
                age: 30,
            };

            const masked = maskSensitiveData(data);

            expect(masked.userId).toBe(123); // userId não deve ser mascarado
            expect(masked.password).toBe('sec***123');
            expect(masked.age).toBe(30);
        });

        it('should mask email fields', () => {
            const data = {
                name: 'John',
                email: 'john@example.com',
            };

            const masked = maskSensitiveData(data);

            expect(masked.name).toBe('John');
            expect(masked.email).toBe('joh***com');
        });

        it('should mask CPF and document fields', () => {
            const data = {
                cpf: '123.456.789-00',
                document: '987654321',
                name: 'John Doe',
            };

            const masked = maskSensitiveData(data);

            expect(masked.cpf).toBe('123***-00');
            expect(masked.document).toBe('987***321');
            expect(masked.name).toBe('John Doe');
        });

        it('should mask nested objects', () => {
            const data = {
                userData: {
                    name: 'John',
                    email: 'john@example.com',
                    credentials: {
                        password: 'secret123',
                        token: 'abc123xyz',
                    },
                },
            };

            const masked = maskSensitiveData(data);

            expect(masked.userData.name).toBe('John');
            expect(masked.userData.email).toBe('joh***com');
            expect(masked.userData.credentials.password).toBe('sec***123');
            expect(masked.userData.credentials.token).toBe('abc***xyz');
        });

        it('should mask arrays of objects', () => {
            const data = {
                userList: [
                    { name: 'John', password: 'pass1' },
                    { name: 'Jane', password: 'pass2' },
                ],
            };

            const masked = maskSensitiveData(data);

            expect(masked.userList[0].name).toBe('John');
            expect(masked.userList[0].password).toBe('pas***');
            expect(masked.userList[1].name).toBe('Jane');
            expect(masked.userList[1].password).toBe('pas***');
        });

        it('should handle Error objects', () => {
            const error = new Error('Test error');
            const data = { error };

            const masked = maskSensitiveData(data);

            expect(masked.error.error).toBe('Test error');
            expect(masked.error.name).toBe('Error');
            expect(masked.error.stack).toBeDefined();
        });

        it('should handle null and undefined values', () => {
            const data = {
                name: 'John',
                email: null,
                password: undefined,
            };

            const masked = maskSensitiveData(data);

            expect(masked.name).toBe('John');
            expect(masked.email).toBeNull();
            expect(masked.password).toBeUndefined();
        });

        it('should mask various sensitive field names', () => {
            const data = {
                senha: 'mypass',          // Portuguese
                secret: 'topsecret',
                apiKey: 'key123',
                api_key: 'key456',
                accessToken: 'token789',
                credit_card: '1234567890123456',
                cvv: '123',
                phone: '1234567890',
            };

            const masked = maskSensitiveData(data);

            expect(masked.senha).toBe('myp***');
            expect(masked.secret).toBe('top***ret');
            expect(masked.apiKey).toBe('key***');
            expect(masked.api_key).toBe('key***');
            expect(masked.accessToken).toBe('tok***789');
            expect(masked.credit_card).toBe('123***456');
            expect(masked.cvv).toBe('***');
            expect(masked.phone).toBe('123***890');
        });

        it('should handle Date objects', () => {
            const date = new Date('2025-12-10');
            const data = {
                createdAt: date,
                password: 'secret',
            };

            const masked = maskSensitiveData(data);

            expect(masked.createdAt).toBe(date);
            expect(masked.password).toBe('sec***');
        });

        it('should mask number values in sensitive fields', () => {
            const data = {
                userId: 123,
                pin: 1234,
                cvv: 456,
            };

            const masked = maskSensitiveData(data);

            expect(masked.userId).toBe(123);
            expect(masked.pin).toBe('***');
            expect(masked.cvv).toBe('***');
        });

        it('should handle primitive types', () => {
            expect(maskSensitiveData('string')).toBe('string');
            expect(maskSensitiveData(123)).toBe(123);
            expect(maskSensitiveData(true)).toBe(true);
            expect(maskSensitiveData(null)).toBeNull();
            expect(maskSensitiveData(undefined)).toBeUndefined();
        });

        it('should mask fields with underscores and hyphens', () => {
            const data = {
                user_password: 'secret123',
                'user-email': 'john@example.com',
                credit_card_number: '1234567890',
            };

            const masked = maskSensitiveData(data);

            expect(masked.user_password).toBe('sec***123');
            expect(masked['user-email']).toBe('joh***com');
            expect(masked.credit_card_number).toBe('123***890');
        });
    });

    describe('Environment Variables', () => {
        it('should mask default fields when NEXT_PUBLIC_DEFAULT_MASK is not set', () => {
            const data = {
                name: 'John',
                password: 'secret',
            };

            const masked = maskSensitiveData(data);

            expect(masked.name).toBe('John');
            expect(masked.password).toBe('sec***');
        });
    });
});
