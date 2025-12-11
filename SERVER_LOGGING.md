# 🖥️ Server-Side Logging

O `ServerLogger` foi projetado especificamente para logging no lado do servidor, similar ao que você tem no Spring Boot. Os logs aparecem no **terminal do servidor** (VS Code terminal onde você roda `npm run dev`), não no navegador.

## ✨ Características do ServerLogger

- 🎨 **Cores no Terminal**: Diferentes cores para cada nível de log (azul=INFO, amarelo=WARN, vermelho=ERROR, cyan=DEBUG)
- 📝 **Timestamps Automáticos**: Cada log inclui timestamp ISO 8601
- 🔍 **Dados Estruturados**: Suporte para objetos e dados complexos
- 🐛 **Error Handling**: Formatação automática de objetos Error com stack trace
- 🎯 **Console Methods**: Usa `console.log`, `console.warn`, `console.error`, `console.debug` apropriadamente
- ⚙️ **Níveis Configuráveis**: DEBUG, INFO, WARN, ERROR

## 📍 Onde os Logs Aparecem

### ✅ Terminal do Servidor (VS Code)
```
[2025-12-10T13:45:23.123Z] [SERVER] [INFO] API /api/users chamada
[2025-12-10T13:45:23.456Z] [SERVER] [INFO] Usuários retornados { count: 10 }
```

### ❌ NÃO no Console do Navegador
O ServerLogger **detecta automaticamente** se está rodando no servidor e mostra um aviso se você tentar usar no cliente.

## 🚀 Uso Básico

### 1. Server Actions (Next.js 13+ App Router)

```tsx
'use server';

import { ServerLogger, createServerLogger } from 'react-nextjs-logger/server';

// LogLevel configurado automaticamente via env (RNL_LOG_LEVEL ou NODE_ENV)
const logger = createServerLogger({ context: { service: 'actions' } });

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  
  logger.info('Criando usuário', { name });
  
  try {
    const user = await db.user.create({ data: { name } });
    logger.info('Usuário criado com sucesso', { userId: user.id, name });
    return { success: true, user };
  } catch (error) {
    logger.error('Erro ao criar usuário', error as Error);
    return { success: false };
  }
}
```

**Output no Terminal:**
```
[2025-12-10T13:45:23.123Z] [SERVER] [INFO] Criando usuário { name: 'João' }
[2025-12-10T13:45:23.456Z] [SERVER] [INFO] Usuário criado com sucesso { userId: 1, name: 'João' }
```

### 2. API Routes (App Router)

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ServerLogger, LogLevel, createServerLogger } from 'react-nextjs-logger/server';

const logger = createServerLogger({ level: LogLevel.DEBUG, context: { service: 'api' } });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  
  logger.debug('Request params', { page });
  logger.info('Buscando usuários', { page });
  
  try {
    const users = await fetchUsers(parseInt(page));
    logger.info('Usuários encontrados', { count: users.length, page });
    return NextResponse.json(users);
  } catch (error) {
    logger.error('Erro ao buscar usuários', error as Error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

**Output no Terminal:**
```
[2025-12-10T13:45:23.123Z] [SERVER] [DEBUG] Request params { page: '1' }
[2025-12-10T13:45:23.234Z] [SERVER] [INFO] Buscando usuários { page: '1' }
[2025-12-10T13:45:23.567Z] [SERVER] [INFO] Usuários encontrados { count: 10, page: '1' }
```

### 3. Middleware

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ServerLogger, createServerLogger } from 'react-nextjs-logger/server';

const logger = createServerLogger({ context: { service: 'middleware' } });

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname, search } = request.nextUrl;
  
  logger.info('Request recebida', {
    method: request.method,
    path: pathname,
    query: search,
  });
  
  const response = NextResponse.next();
  
  // Log após processamento
  const duration = Date.now() - startTime;
  logger.info('Request processada', {
    method: request.method,
    path: pathname,
    status: response.status,
    duration: `${duration}ms`,
  });
  
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
```

### 4. Server Components

```tsx
// app/dashboard/page.tsx
import { ServerLogger, createServerLogger } from 'react-nextjs-logger/server';

const logger = createServerLogger({ context: { page: 'dashboard' } });

async function getData() {
  logger.info('Carregando dados do dashboard');
  const data = await fetch('https://api.example.com/data');
  logger.info('Dados carregados', { status: data.status });
  return data.json();
}

export default async function DashboardPage() {
  const data = await getData();
  
  logger.debug('Renderizando dashboard', { itemCount: data.length });
  
  return <div>{/* seu componente */}</div>;
}
```

## 🎨 Cores no Terminal

Por padrão, o ServerLogger usa cores ANSI para melhor legibilidade:

- 🔵 **DEBUG**: Cyan
- 🔵 **INFO**: Azul
- 🟡 **WARN**: Amarelo
- 🔴 **ERROR**: Vermelho

Para desabilitar cores (útil em ambientes CI/CD):

```tsx
const logger = new ServerLogger(LogLevel.INFO, false); // false = sem cores
```

## 📊 Níveis de Log

**Configuração automática (recomendado):**

```tsx
import { createServerLogger } from 'react-nextjs-logger/server';

// LogLevel detectado automaticamente via env
const logger = createServerLogger({ context: { service: 'my-api' } });
```

**Variáveis de ambiente:**
```env
# Prioridade 1: Level customizado
RNL_LOG_LEVEL=DEBUG  # DEBUG | INFO | WARN | ERROR

# Prioridade 2: Fallback
LOG_LEVEL=INFO

# Prioridade 3: Mapeamento automático do NODE_ENV
NODE_ENV=production  # → WARN
NODE_ENV=development # → DEBUG
NODE_ENV=test        # → ERROR
```

**Configuração manual (quando necessário):**

```tsx
import { ServerLogger, LogLevel } from 'react-nextjs-logger/server';

// Usando constructor direto
const manualLogger = new ServerLogger(LogLevel.WARN);

// Ou alterando em runtime
const logger = createServerLogger();
logger.setLogLevel(LogLevel.DEBUG);
```

## 🐛 Tratamento de Erros

O ServerLogger trata automaticamente objetos Error, extraindo mensagem, nome e stack trace:

```tsx
const logger = new ServerLogger();

try {
  throw new Error('Algo deu errado');
} catch (error) {
  // Automaticamente formata o Error
  logger.error('Falha na operação', error as Error);
}
```

**Output no Terminal:**
```
[2025-12-10T13:45:23.123Z] [SERVER] [ERROR] Falha na operação {
  error: 'Algo deu errado',
  name: 'Error',
  stack: 'Error: Algo deu errado\n    at ...'
}
```

## 📦 Dados Estruturados

Você pode passar qualquer objeto como segundo parâmetro:

```tsx
logger.info('Operação concluída', {
  userId: 123,
  action: 'update',
  timestamp: Date.now(),
  metadata: {
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
  },
});
```

## 🔧 Configuração por Ambiente

```tsx
// lib/logger.ts
import { ServerLogger, LogLevel } from 'react-nextjs-logger';

const getLogLevel = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return LogLevel.DEBUG;
    case 'test':
      return LogLevel.WARN;
    case 'production':
      return LogLevel.ERROR;
    default:
      return LogLevel.INFO;
  }
};

export const serverLogger = new ServerLogger(
  getLogLevel(),
  process.env.NODE_ENV !== 'test' // Cores apenas fora de testes
);
```

Use em toda a aplicação:

```tsx
import { serverLogger } from '@/lib/logger';

export async function myServerAction() {
  serverLogger.info('Executando ação');
}
```

## 🎯 Comparação com Spring Boot

Se você vem do Spring Boot, vai se sentir em casa:

| Spring Boot | react-nextjs-logger |
|-------------|---------------------|
| `logger.info("msg")` | `logger.info('msg')` |
| `logger.error("msg", ex)` | `logger.error('msg', error)` |
| `logger.debug("msg")` | `logger.debug('msg')` |
| `@Slf4j` | `const logger = new ServerLogger()` |
| application.properties | `LogLevel.DEBUG/INFO/WARN/ERROR` |

## ⚠️ Importante

- ✅ Use `ServerLogger` apenas em código que roda no servidor
- ✅ Os logs aparecem no **terminal**, não no navegador
- ✅ Ideal para Server Actions, API Routes, Middleware, Server Components
- ❌ Não use `ServerLogger` em componentes client ('use client')
- ❌ Para client-side, use `ClientLogger` ou `useLogger`

## 🔍 Troubleshooting

**Não vejo os logs?**
- Verifique se está olhando o terminal do servidor (onde roda `npm run dev`)
- Confirme que o código está rodando no servidor (Server Actions, API Routes, etc.)
- Verifique o nível de log configurado

**Logs aparecem no navegador?**
- Você provavelmente está usando em um componente client
- Use `ClientLogger` ou `useLogger` para client-side
- Adicione `'use server'` se for Server Action

**Como salvar logs em arquivo?**
- Para produção, considere usar ferramentas como Winston, Pino ou integrar com serviços de logging
- Este logger é focado em desenvolvimento, similar ao console do Spring Boot

## 📄 Modo JSON

Para integrar com agregadores de logs (Datadog, Loki, Stackdriver, etc.), você pode habilitar o modo JSON no servidor:

```env
RNL_SERVER_LOG_JSON=true
```

Exemplo de saída:

```json
{"ts":"2025-12-11T12:34:56.789Z","level":"INFO","message":"Operação concluída","context":{"service":"api","requestId":"abc-123"},"source":"server"}
```
