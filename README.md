# 🪵 React Next.js Logger

Uma biblioteca de logging moderna e completa para aplicações React e Next.js, com suporte tanto para client-side quanto server-side.

[![npm version](https://badge.fury.io/js/react-nextjs-logger.svg)](https://badge.fury.io/js/react-nextjs-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Características

- 🎯 **Dual Environment**: Funciona tanto no client quanto no server
- 🪝 **React Hooks**: Hook `useLogger` para componentes React
- 🔒 **Mascaramento Automático**: Protege dados sensíveis (senhas, emails, CPF, etc.) automaticamente
- 🔧 **Configurável**: Níveis de log e campos sensíveis customizáveis
- 📝 **TypeScript**: Totalmente tipado
- 🚀 **Next.js Ready**: Middleware para logging de requisições
- 📦 **Zero Config**: Funciona out-of-the-box
- 🎨 **Formatação**: Timestamps automáticos e cores no terminal (servidor)
- 🔌 **Extensível**: Sistema de transporte customizável
- ⚡ **Compatível**: React 17+, React 18, React 19 e Next.js 12-16

## 📦 Instalação

```bash
npm install react-nextjs-logger
```

ou

```bash
yarn add react-nextjs-logger
```

ou

```bash
pnpm add react-nextjs-logger
```

## 🚀 Uso Rápido

### Client-Side (React)

```tsx
'use client'; // Para Next.js 13+

import { useLogger } from 'react-nextjs-logger';

function MyComponent() {
  const logger = useLogger({ prefix: 'MyComponent' });

  const handleClick = () => {
    logger.info('Botão clicado!', { userId: 123 });
    logger.warn('Aviso importante');
    logger.error('Erro ocorreu');
  };

  return <button onClick={handleClick}>Clique aqui</button>;
}
```

### Server-Side (Next.js - logs no terminal do servidor)

```typescript
// app/api/users/route.ts
'use server';

import { ServerLogger, createServerLogger } from 'react-nextjs-logger/server';
import { NextRequest, NextResponse } from 'next/server';

// Logs aparecem no TERMINAL DO SERVIDOR (VS Code terminal)
// LogLevel configurado automaticamente via env (RNL_LOG_LEVEL ou NODE_ENV)
// Context extraído para o prefixo: [Context:service] [Host:hostname]
const logger = createServerLogger({ 
  context: { 
    service: 'users-api',
    env: 'production',
    version: '1.0.0'
  } 
});

export async function GET(request: NextRequest) {
  // Saída: [timestamp] [SERVER] [INFO] [Context:users-api] [Host:machine-name] [Env:production] [v1.0.0] API /api/users chamada
  logger.info('API /api/users chamada', { method: 'GET' });

  try {
    const users = await getUsers();
    logger.info('Usuários retornados', { count: users.length });
    return NextResponse.json(users);
  } catch (error) {
    logger.error('Erro ao buscar usuários', error as Error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

**🔍 Importante**: O `ServerLogger` imprime logs no **terminal do servidor** (onde você roda `npm run dev`), não no console do navegador. Similar ao logging do Spring Boot. [Veja documentação completa](./SERVER_LOGGING.md)

**📊 Formato de Saída com Context:**
- **Human-readable**: `[timestamp] [SERVER] [INFO] [Context:users-api] [Host:machine-name] [Env:production] [v1.0.0] Message`
- **JSON mode**: `{"service":"users-api","hostname":"machine-name","env":"production","version":"1.0.0",...}`
- Os campos `service/app/name`, `env`, `version` do context são automaticamente extraídos para o prefixo
- O hostname da máquina é detectado automaticamente via `os.hostname()`

### 📦 Exports Organizados

Você pode importar por subpaths para melhor DX e tree-shaking:

```ts
// Top-level (tudo disponível)
import { ClientLogger, ServerLogger, LogLevel, useLogger } from 'react-nextjs-logger';

// Subpaths (recomendado para melhor tree-shaking)
import { ServerLogger, createServerLogger } from 'react-nextjs-logger/server';
import { ClientLogger } from 'react-nextjs-logger/client';
import { useLogger } from 'react-nextjs-logger/hooks';
import { maskSensitiveData } from 'react-nextjs-logger/utils/mask';
```

Subpaths disponíveis:
- `react-nextjs-logger/server`
- `react-nextjs-logger/client`
- `react-nextjs-logger/hooks`
- `react-nextjs-logger/utils/mask`

### 🔒 Mascaramento Automático de Dados Sensíveis

```tsx
'use server';
import { createServerLogger } from 'react-nextjs-logger/server';

const logger = createServerLogger();

export async function loginUser(credentials: any) {
  // Dados sensíveis são mascarados automaticamente!
  logger.info('Login attempt', {
    email: 'user@example.com',     // → 'use***com'
    password: 'secret123',         // → 'sec***123'
    userId: 123,                   // → 123 (não mascarado)
  });
}
```

**Campos mascarados por padrão:** password, email, cpf, token, creditCard, phone, etc.

**Configuração opcional (`.env`):**
```env
# Desabilitar mascaramento padrão
NEXT_PUBLIC_DEFAULT_MASK=false

# Adicionar campos customizados
NEXT_PUBLIC_MASK_FIELDS=customField,secretKey,internalId

# Saída JSON no servidor (útil para agregadores)
RNL_SERVER_LOG_JSON=true
```

Quando `RNL_SERVER_LOG_JSON=true`, o `ServerLogger` passa a emitir linhas JSON com o formato:

```json
{"ts":"2025-12-11T12:34:56.789Z","level":"INFO","message":"API /api/users chamada","context":{"service":"users-api","method":"GET"},"source":"server"}
```

📖 **[Documentação completa de mascaramento](./MASKING.md)**

### ⚙️ Configuração de LogLevel por Ambiente

É recomendado configurar o nível de log baseado no ambiente:

### ⚡ Configuração Automática de LogLevel

O `createServerLogger` detecta automaticamente o LogLevel baseado em variáveis de ambiente:

**Prioridade:**
1. `RNL_LOG_LEVEL` (se definido)
2. `LOG_LEVEL` (fallback)
3. `NODE_ENV` (mapeamento automático):
   - `production` → `WARN`
   - `test` → `ERROR`
   - `development` → `DEBUG`

**Uso simples (recomendado):**
```typescript
// LogLevel configurado automaticamente pela env
const logger = createServerLogger({ 
  context: { service: 'my-api' } 
});
```

**Variáveis de ambiente disponíveis:**
```env
# Opção 1: Definir level customizado (sobrescreve NODE_ENV)
RNL_LOG_LEVEL=INFO  # DEBUG | INFO | WARN | ERROR

# Opção 2: Fallback (se RNL_LOG_LEVEL não existir)
LOG_LEVEL=DEBUG

# Opção 3: Deixar NODE_ENV fazer o mapeamento automático
NODE_ENV=production  # → WARN
NODE_ENV=development # → DEBUG

# Outras configs
SERVICE_NAME=my-api
RNL_SERVER_LOG_JSON=true
```

**Override manual (quando necessário):**
```typescript
import { LogLevel } from 'react-nextjs-logger';

// Forçar um level específico ignorando env
const logger = createServerLogger({ 
  level: LogLevel.ERROR,  // sempre ERROR independente da env
  context: { service: 'critical-service' } 
});
```
```

## 📚 Documentação

### Níveis de Log

```typescript
enum LogLevel {
    DEBUG = 'DEBUG',  // Mensagens de debug
    INFO = 'INFO',    // Informações gerais
    WARN = 'WARN',    // Avisos
    ERROR = 'ERROR',  // Erros
    LOG = 'LOG'       // Logs gerais
}
```

**Hierarquia**: `DEBUG < INFO < WARN < ERROR`

Quando você define um nível, apenas mensagens desse nível ou superior serão exibidas.

### ClientLogger

```tsx
import { ClientLogger, LogLevel } from 'react-nextjs-logger';

// Criar uma instância com nível INFO (padrão)
const logger = new ClientLogger();

// Ou especificar um nível
const debugLogger = new ClientLogger(LogLevel.DEBUG);

// Usar os métodos de log
logger.debug('Debug info');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### ServerLogger

```typescript
import { ServerLogger, LogLevel, createServerLogger } from 'react-nextjs-logger/server';

// LogLevel automático via env (recomendado)
// Context com service/env/version extraído para prefixo
const logger = createServerLogger({ 
  context: { 
    service: 'my-api',
    env: 'production',
    version: '2.1.0',
    requestId: 'abc-123'  // Campos adicionais ficam no objeto de dados
  } 
});

// Alterar nível em runtime
logger.setLogLevel(LogLevel.DEBUG);

// Logs com prefixo [SERVER] + context metadata
// Saída: [timestamp] [SERVER] [DEBUG] [Context:my-api] [Host:hostname] [Env:production] [v2.1.0] Debug message
logger.debug('Debug message');
logger.info('Info message', { userId: 123 });  // requestId não aparece no prefixo
logger.warn('Warning message');
logger.error('Error message');
```

**Context Metadata no Prefixo:**
- `service`, `app` ou `name` → `[Context:valor]`
- `env` → `[Env:valor]`
- `version` → `[vvalor]`
- Hostname automático → `[Host:machine-name]`
- Outros campos do context permanecem no objeto de dados

### useLogger Hook

```tsx
import { useLogger } from 'react-nextjs-logger';

function MyComponent() {
  const { info, warn, error } = useLogger();

  useEffect(() => {
    info('Component montado');
    
    return () => {
      info('Component desmontado');
    };
  }, []);

  return <div>Meu componente</div>;
}
```

### Logger Core

```typescript
import { Logger, LogLevel } from 'react-nextjs-logger';

const logger = new Logger(LogLevel.INFO);

logger.setLogLevel(LogLevel.WARN);
logger.info('Não será exibido');
logger.warn('Será exibido');
```

### Middleware (Next.js)

```typescript
// middleware.ts
import { loggingMiddleware } from 'react-nextjs-logger';

export { loggingMiddleware as middleware };

// Ou em API routes
import { loggingMiddleware } from 'react-nextjs-logger';

export default function handler(req, res) {
  loggingMiddleware(req, res, () => {
    // Sua lógica aqui
    res.status(200).json({ success: true });
  });
}
```

## 🔧 Exemplos Avançados

### Next.js 15 com App Router

```typescript
// app/api/users/route.ts (Next.js 15)
import { createServerLogger } from 'react-nextjs-logger/server';
import { NextResponse } from 'next/server';

// LogLevel configurado automaticamente via env
// Context extraído para prefixo com hostname automático
const logger = createServerLogger({ 
  context: { 
    service: 'users-api',
    env: process.env.NODE_ENV,
    version: '1.0.0'
  } 
});

export async function GET(request: Request) {
  // Saída: [timestamp] [SERVER] [INFO] [Context:users-api] [Host:hostname] [Env:production] [v1.0.0] [GET] /api/users
  logger.info(`[GET] ${request.url}`);
  
  try {
    const users = await fetchUsers();
    logger.info(`Returning ${users.length} users`);
    return NextResponse.json(users);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

```tsx
// app/page.tsx (Next.js 15)
'use client';

import { useLogger } from 'react-nextjs-logger';

export default function HomePage() {
  const logger = useLogger();

  const handleAction = async () => {
    logger.info('User action started');
    
    try {
      const response = await fetch('/api/users');
      logger.info('API call successful');
    } catch (error) {
      logger.error(`API call failed: ${error.message}`);
    }
  };

  return (
    <button onClick={handleAction}>
      Fetch Users
    </button>
  );
}
```

### Logging Condicional

**Usando env (recomendado):**
```typescript
import { createServerLogger } from 'react-nextjs-logger/server';

// LogLevel detectado automaticamente via RNL_LOG_LEVEL ou NODE_ENV
const logger = createServerLogger({ 
  context: { service: 'my-api' } 
});
```

**Override manual (quando necessário):**
```typescript
import { LogLevel } from 'react-nextjs-logger';
import { createServerLogger } from 'react-nextjs-logger/server';

const logger = createServerLogger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  context: { service: 'my-api' }
});
```

### Custom Transport

```typescript
// Estender a classe Logger para transporte customizado
class CustomLogger extends Logger {
  private transport(message: string): void {
    // Enviar para serviço externo
    fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
    
    // Também logar no console
    console.log(message);
  }
}
```

### Logging em Componentes

```tsx
import { useLogger } from 'react-nextjs-logger';

function UserProfile({ userId }) {
  const logger = useLogger();

  useEffect(() => {
    logger.info(`Carregando perfil do usuário: ${userId}`);
    
    fetchUserProfile(userId)
      .then(profile => {
        logger.info(`Perfil carregado com sucesso`);
      })
      .catch(error => {
        logger.error(`Erro ao carregar perfil: ${error.message}`);
      });
  }, [userId]);

  return <div>Profile</div>;
}
```

## 🔄 Compatibilidade

### Versões Suportadas

| Framework | Versões Suportadas | Status |
|-----------|-------------------|--------|
| **React** | 17.x, 18.x, 19.x | ✅ Testado |
| **Next.js** | 12.x, 13.x, 14.x, 15.x, 16.x | ✅ Testado |
| **TypeScript** | 5.0+ | ✅ Recomendado |
| **Node.js** | 18+ | ✅ Recomendado |

### Recursos por Versão do Next.js

#### Next.js 15 (App Router)
✅ Suporte completo para Server Components  
✅ Suporte completo para Client Components  
✅ API Routes no diretório `/app/api`  
✅ Server Actions  
✅ Middleware  

#### Next.js 14 (App Router)
✅ Server Components  
✅ Client Components  
✅ API Routes  
✅ Middleware  

#### Next.js 13 (Pages Router e App Router)
✅ Pages Router  
✅ App Router (experimental)  
✅ API Routes  
✅ Middleware  

#### Next.js 12 (Pages Router)
✅ Pages Router  
✅ API Routes  
✅ Middleware  

### Notas sobre React 19

A biblioteca é totalmente compatível com React 19, incluindo:
- ✅ Novo sistema de renderização
- ✅ Hooks atualizados
- ✅ Strict Mode aprimorado
- ✅ Concurrent Features

### ESM e CommonJS

A biblioteca fornece builds tanto em **ES Modules** quanto **CommonJS**:

```javascript
// ESM (Next.js 15, Vite, etc)
import { ClientLogger, useLogger } from 'react-nextjs-logger';

// CommonJS (Node.js tradicional)
const { ClientLogger, useLogger } = require('react-nextjs-logger');
```

## 🧪 Testando Localmente

Veja o arquivo [TESTING.md](./TESTING.md) para instruções detalhadas de como testar a biblioteca localmente antes de publicar.

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Escreva testes para novas funcionalidades
- Mantenha a cobertura de testes acima de 80%
- Siga o estilo de código existente
- Atualize a documentação quando necessário
- Use commits semânticos (feat:, fix:, docs:, etc.)

### Configurar o Ambiente de Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/react-nextjs-logger.git

# Instale as dependências
cd react-nextjs-logger
npm install

# Execute os testes
npm test

# Execute os testes em watch mode
npm run test:watch

# Verifique a cobertura
npm run test:coverage

# Build da biblioteca
npm run build

# Lint (verificação de tipos)
npm run lint
```

## 📋 Roadmap

- [ ] Logging para diferentes ambientes (file, console, remote)
- [ ] Performance monitoring
- [ ] Log filtering e sanitização

## 🐛 Bugs e Issues

Encontrou um bug? Por favor, abra uma [issue](https://github.com/seu-usuario/react-nextjs-logger/issues) com:

- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Versão da biblioteca
- Ambiente (Node.js version, React version, Next.js version)

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Rafael P. Santos - [@rafaelsantos01](https://github.com/rafaelsantos01)

## 🙏 Agradecimentos

- Comunidade React
- Comunidade Next.js
- Todos os contribuidores

---

**Feito com ❤️ por desenvolvedores, para desenvolvedores**