// Teste completo Server + Client
import { createServerLogger } from './dist/server.esm.js';
import { ClientLogger } from './dist/client.esm.js';

console.log('\n========================================');
console.log('🔥 TESTE COMPLETO - SERVER + CLIENT');
console.log('========================================\n');

// ============================================
// SERVER LOGGER TESTS
// ============================================
console.log('📦 SERVER LOGGER:');
console.log('----------------------------------------\n');

// Teste 1: Context completo
const serverLogger1 = createServerLogger({
  context: {
    service: 'users-api',
    env: 'production',
    version: '1.2.0'
  }
});

serverLogger1.info('User login', { userId: 123, username: 'john_doe' });
serverLogger1.warn('High memory usage', { usage: '85%' });
serverLogger1.error('Database connection failed', { error: 'ETIMEDOUT' });
serverLogger1.debug('Query executed', { query: 'SELECT * FROM users', time: '45ms' });

console.log('\n');

// Teste 2: Sem context
const serverLogger2 = createServerLogger();
serverLogger2.info('Generic log without context');

console.log('\n');

// Teste 3: Context parcial
const serverLogger3 = createServerLogger({
  context: {
    service: 'payments-api'
  }
});
serverLogger3.info('Payment processed', { amount: 100, currency: 'BRL' });

console.log('\n');

// Teste 4: JSON mode
process.env.RNL_SERVER_LOG_JSON = 'true';
const serverLogger4 = createServerLogger({
  context: {
    service: 'orders-api',
    env: 'staging',
    version: '2.0.0'
  }
});
serverLogger4.info('Order created', { orderId: 456, items: 3 });
process.env.RNL_SERVER_LOG_JSON = 'false';

console.log('\n');

// Teste 5: Masking de dados sensíveis
const serverLogger5 = createServerLogger({
  context: { service: 'auth-api' }
});
serverLogger5.info('Login attempt', {
  email: 'user@example.com',
  password: 'supersecret123',
  cpf: '123.456.789-00',
  userId: 789
});

console.log('\n========================================\n');

// ============================================
// CLIENT LOGGER TESTS
// ============================================
console.log('💻 CLIENT LOGGER:');
console.log('----------------------------------------\n');

const clientLogger = new ClientLogger();

// Teste 1: Logs básicos
clientLogger.info('Page loaded', { page: 'home', loadTime: '1.2s' });
clientLogger.warn('Slow API response', { endpoint: '/api/users', time: '3s' });
clientLogger.error('Failed to fetch data', { status: 500 });
clientLogger.debug('Component rendered', { component: 'UserList', props: { count: 10 } });

console.log('\n');

// Teste 2: Masking no client
clientLogger.info('User data', {
  email: 'client@example.com',
  password: 'clientpass',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  userId: 999
});

console.log('\n========================================');
console.log('✅ TESTES CONCLUÍDOS');
console.log('========================================\n');
