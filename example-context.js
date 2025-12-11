import { createServerLogger } from './dist/server.esm.js';

// Exemplo 1: Com contexto completo
console.log('\n=== Exemplo 1: Context completo ===');
const logger1 = createServerLogger({
  context: {
    service: 'users-api',
    env: 'production',
    version: '1.2.0'
  }
});

logger1.info('Teste Server Logger', { user: 'Rafael', action: 'login' });

// Exemplo 2: Apenas service
console.log('\n=== Exemplo 2: Apenas service ===');
const logger2 = createServerLogger({
  context: {
    service: 'payments-api'
  }
});

logger2.warn('Processando pagamento', { amount: 100, currency: 'BRL' });

// Exemplo 3: Sem contexto
console.log('\n=== Exemplo 3: Sem contexto ===');
const logger3 = createServerLogger();

logger3.error('Erro genérico', { code: 500, message: 'Internal Server Error' });

// Exemplo 4: JSON mode
console.log('\n=== Exemplo 4: JSON mode ===');
process.env.RNL_SERVER_LOG_JSON = 'true';
const logger4 = createServerLogger({
  context: {
    service: 'orders-api',
    env: 'staging',
    version: '2.1.0'
  }
});

logger4.info('Pedido criado', { orderId: 123, items: 5 });
