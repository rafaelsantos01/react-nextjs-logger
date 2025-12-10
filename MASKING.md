# 🔒 Mascaramento de Dados Sensíveis

O `react-nextjs-logger` possui um sistema inteligente de mascaramento automático de dados sensíveis para proteger informações confidenciais nos logs.

## ✨ Características

- 🔐 **Mascaramento Automático**: Detecta e mascara campos sensíveis automaticamente
- 🎯 **Campos Padrão**: Lista pré-configurada de campos comuns (senha, email, CPF, etc.)
- ⚙️ **Personalizável**: Adicione seus próprios campos via variáveis de ambiente
- 🌍 **Multi-idioma**: Suporta campos em português e inglês
- 🔍 **Smart Masking**: Mostra primeiros e últimos 3 caracteres para debugging

## 🎯 Como Funciona

Quando você loga um objeto com dados sensíveis, a biblioteca automaticamente:

1. Identifica campos sensíveis pelo nome
2. Mascara os valores mostrando apenas início e fim
3. Preserva campos não-sensíveis intactos

### Exemplo

```tsx
'use server';
import { ServerLogger } from 'react-nextjs-logger';

const logger = new ServerLogger();

export async function loginUser(data: any) {
  logger.info('Tentativa de login', {
    userId: 123,
    email: 'user@example.com',
    password: 'mySecretPassword',
    ip: '192.168.1.1',
  });
}
```

**Output no terminal:**
```
[2025-12-10T14:00:00.000Z] [SERVER] [INFO] Tentativa de login {
  userId: 123,                          // ✅ Não sensível - mantido
  email: 'use***com',                   // 🔒 Mascarado
  password: 'myS***ord',                // 🔒 Mascarado
  ip: '192.168.1.1'                     // ✅ Não sensível - mantido
}
```

## 📋 Campos Mascarados por Padrão

### Autenticação
- `password`, `senha`, `pass`, `pwd`
- `secret`, `token`, `accessToken`, `refreshToken`
- `apiKey`, `api_key`, `authorization`

### Dados Pessoais
- `email`, `e-mail`
- `cpf`, `cnpj`, `document`, `documento`, `ssn`

### Dados Financeiros
- `creditCard`, `credit_card`, `cartao`
- `cvv`, `cvc`
- `pin`

### Contato
- `phone`, `telefone`, `celular`, `mobile`

## ⚙️ Configuração

### 1. Desabilitar Mascaramento Padrão

Se você não quiser o mascaramento padrão, adicione no `.env`:

```env
NEXT_PUBLIC_DEFAULT_MASK=false
```

### 2. Adicionar Campos Customizados

Adicione campos específicos do seu projeto:

```env
# Campos separados por vírgula
NEXT_PUBLIC_MASK_FIELDS=customField,secretKey,internalId,companyData
```

### 3. Combinar Padrão + Custom

```env
# Usa campos padrão + seus campos custom
NEXT_PUBLIC_DEFAULT_MASK=true
NEXT_PUBLIC_MASK_FIELDS=customField,secretKey
```

### 4. Apenas Campos Custom

```env
# Desabilita padrão, usa apenas seus campos
NEXT_PUBLIC_DEFAULT_MASK=false
NEXT_PUBLIC_MASK_FIELDS=onlyTheseFields,andThisOne
```

## 📝 Exemplos de Uso

### Exemplo 1: Registro de Usuário

```tsx
'use server';
import { ServerLogger } from 'react-nextjs-logger';

const logger = new ServerLogger();

export async function registerUser(data: any) {
  logger.info('Novo usuário', {
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'SuperSecret123',
    cpf: '123.456.789-00',
    age: 25,
  });
}
```

**Output:**
```
[SERVER] [INFO] Novo usuário {
  name: 'João Silva',      // ✅ Mantido
  email: 'joa***com',      // 🔒 Mascarado
  password: 'Sup***123',   // 🔒 Mascarado
  cpf: '123***-00',        // 🔒 Mascarado
  age: 25                  // ✅ Mantido
}
```

### Exemplo 2: Chamada de API Externa

```tsx
'use server';
import { ServerLogger } from 'react-nextjs-logger';

const logger = new ServerLogger();

export async function callExternalAPI() {
  logger.debug('Chamando API', {
    url: 'https://api.example.com',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer abc123xyz789',
    },
    body: {
      userId: 123,
      action: 'update',
    },
  });
}
```

**Output:**
```
[SERVER] [DEBUG] Chamando API {
  url: 'https://api.example.com',    // ✅ Mantido
  method: 'POST',                    // ✅ Mantido
  headers: {
    'Content-Type': 'application/json',  // ✅ Mantido
    'Authorization': 'Bea***789'         // 🔒 Mascarado
  },
  body: {
    userId: 123,                     // ✅ Mantido
    action: 'update'                 // ✅ Mantido
  }
}
```

### Exemplo 3: Erro com Dados Sensíveis

```tsx
'use server';
import { ServerLogger } from 'react-nextjs-logger';

const logger = new ServerLogger();

export async function processPayment(data: any) {
  try {
    // Processar pagamento
  } catch (error) {
    logger.error('Erro no pagamento', {
      creditCard: '1234 5678 9012 3456',
      cvv: '123',
      error: error.message,
    });
  }
}
```

**Output:**
```
[SERVER] [ERROR] Erro no pagamento {
  creditCard: '123***456',   // 🔒 Mascarado
  cvv: '***',                // 🔒 Mascarado
  error: 'Payment failed'    // ✅ Mantido
}
```

## 🎨 Padrão de Mascaramento

O mascaramento segue este padrão:

| Tamanho | Exemplo Original | Mascarado | Padrão |
|---------|-----------------|-----------|---------|
| ≤ 3 chars | `abc` | `***` | Tudo oculto |
| 4-6 chars | `abcdef` | `abc***` | Início visível |
| > 6 chars | `user@example.com` | `use***com` | Início + fim |

```typescript
maskValue('abc')              // '***'
maskValue('secret')           // 'sec***'
maskValue('mypassword123')    // 'myp***123'
maskValue('user@example.com') // 'use***com'
```

## 🔧 API Programática

Se você precisar mascarar dados manualmente:

```typescript
import { maskSensitiveData, maskValue } from 'react-nextjs-logger';

// Mascarar um objeto completo
const data = {
  name: 'John',
  password: 'secret123',
  email: 'john@example.com',
};

const masked = maskSensitiveData(data);
console.log(masked);
// {
//   name: 'John',
//   password: 'sec***123',
//   email: 'joh***com'
// }

// Mascarar um valor específico
const maskedEmail = maskValue('user@example.com');
console.log(maskedEmail); // 'use***com'
```

## 📚 Integração com Outras Ferramentas

### Com Winston

```typescript
import winston from 'winston';
import { maskSensitiveData } from 'react-nextjs-logger';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const maskedMeta = maskSensitiveData(meta);
      return `${timestamp} [${level}] ${message} ${JSON.stringify(maskedMeta)}`;
    })
  ),
  transports: [new winston.transports.Console()],
});
```

### Com Pino

```typescript
import pino from 'pino';
import { maskSensitiveData } from 'react-nextjs-logger';

const logger = pino({
  hooks: {
    logMethod(inputArgs, method) {
      if (inputArgs.length >= 2) {
        const obj = inputArgs[0];
        inputArgs[0] = maskSensitiveData(obj);
      }
      return method.apply(this, inputArgs);
    },
  },
});
```

## ⚠️ Importante

### ✅ Boas Práticas

- Use mascaramento sempre em produção
- Configure campos sensíveis específicos do seu domínio
- Não desabilite o mascaramento padrão a menos que necessário
- Teste seus logs para garantir que dados sensíveis estão mascarados

### ❌ O que NÃO fazer

- Não logue dados sensíveis sem necessidade
- Não armazene logs com dados não-mascarados
- Não desabilite mascaramento em produção
- Não assuma que apenas o mascaramento é suficiente para segurança

## 🔍 Verificando Mascaramento

Para verificar se o mascaramento está funcionando:

```tsx
'use server';
import { ServerLogger } from 'react-nextjs-logger';

const logger = new ServerLogger();

export async function testMasking() {
  logger.info('Teste de mascaramento', {
    // Devem ser mascarados:
    password: 'secret123',
    email: 'test@example.com',
    token: 'abc123xyz',
    
    // NÃO devem ser mascarados:
    userId: 123,
    action: 'test',
    timestamp: Date.now(),
  });
}
```

Verifique no terminal se password, email e token aparecem mascarados!

## 🌍 Exemplo de Configuração Completa

**`.env.local`:**
```env
# Habilitar mascaramento padrão (password, email, cpf, etc.)
NEXT_PUBLIC_DEFAULT_MASK=true

# Adicionar campos específicos do projeto
NEXT_PUBLIC_MASK_FIELDS=customSecret,internalKey,companyId,contractNumber

# NODE_ENV automaticamente define o nível de log
NODE_ENV=development
```

**Server Action:**
```tsx
'use server';
import { ServerLogger, LogLevel } from 'react-nextjs-logger';

const logger = new ServerLogger(LogLevel.DEBUG);

export async function createContract(data: any) {
  logger.info('Criando contrato', {
    userId: data.userId,              // ✅ Não mascarado
    email: data.email,                // 🔒 Mascarado (padrão)
    contractNumber: data.contractNumber, // 🔒 Mascarado (custom)
    customSecret: data.secret,        // 🔒 Mascarado (custom)
    amount: data.amount,              // ✅ Não mascarado
  });
}
```

## 🎯 Conclusão

O sistema de mascaramento do `react-nextjs-logger` é:

- ✅ **Automático**: Funciona out-of-the-box
- ✅ **Inteligente**: Detecta campos sensíveis por nome
- ✅ **Flexível**: Configurável via variáveis de ambiente
- ✅ **Seguro**: Protege dados sensíveis por padrão
- ✅ **Debugável**: Mostra parcialmente valores para debugging

Use-o para manter seus logs informativos sem expor dados sensíveis! 🔒
