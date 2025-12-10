# 📚 Exemplos de Uso

## Client-Side (React/Next.js)

### 1. Hook useLogger Básico

```tsx
'use client';

import { useLogger } from 'react-nextjs-logger';

export default function MyComponent() {
  const logger = useLogger();

  const handleClick = () => {
    logger.info('Botão clicado!');
    logger.warn('Aviso importante');
    logger.error('Erro ocorreu');
  };

  return <button onClick={handleClick}>Clique aqui</button>;
}
```

### 2. Hook useLogger com Dados

```tsx
'use client';

import { useLogger } from 'react-nextjs-logger';

export default function UserProfile({ userId }: { userId: string }) {
  const logger = useLogger();

  const handleSave = async () => {
    try {
      logger.info('Salvando perfil', { userId });
      // API call
      logger.info('Perfil salvo com sucesso', { userId, timestamp: Date.now() });
    } catch (error) {
      logger.error('Erro ao salvar perfil', { userId, error });
    }
  };

  return <button onClick={handleSave}>Salvar</button>;
}
```

### 3. Hook useLogger com Prefixo

```tsx
'use client';

import { useLogger } from 'react-nextjs-logger';
import { LogLevel } from 'react-nextjs-logger';

export default function Dashboard() {
  const logger = useLogger({ 
    prefix: 'DASHBOARD',
    logLevel: LogLevel.DEBUG 
  });

  logger.info('Dashboard carregado'); // [DASHBOARD] Dashboard carregado

  return <div>Dashboard</div>;
}
```

### 4. Usando ClientLogger Diretamente

```tsx
'use client';

import { ClientLogger, LogLevel } from 'react-nextjs-logger';

const logger = new ClientLogger(LogLevel.DEBUG);

export default function MyComponent() {
  const handleAction = () => {
    logger.debug('Debug info', { detail: 'algo' });
    logger.info('Informação');
    logger.warn('Aviso');
    logger.error('Erro');
  };

  return <button onClick={handleAction}>Ação</button>;
}
```

### 5. Instância Global do Logger

```tsx
'use client';

import { logger } from 'react-nextjs-logger';

export default function SimpleComponent() {
  const handleClick = () => {
    logger.info('Usando logger global');
  };

  return <button onClick={handleClick}>Clique</button>;
}
```

## Server-Side (Next.js)

### 1. Server Actions (Next.js 13+)

```tsx
'use server';

import { ServerLogger, LogLevel } from 'react-nextjs-logger';

const logger = new ServerLogger(LogLevel.INFO);

export async function saveUser(formData: FormData) {
  const name = formData.get('name');
  
  logger.info('Salvando usuário', { name });
  
  try {
    // Database operation
    logger.info('Usuário salvo com sucesso', { name });
    return { success: true };
  } catch (error) {
    logger.error('Erro ao salvar usuário', { name, error });
    return { success: false };
  }
}
```

### 2. API Routes (Next.js)

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { ServerLogger } from 'react-nextjs-logger';

const logger = new ServerLogger();

export async function GET(request: NextRequest) {
  logger.info('API /api/users chamada');
  
  try {
    const users = await fetchUsers();
    logger.info('Usuários retornados', { count: users.length });
    return NextResponse.json(users);
  } catch (error) {
    logger.error('Erro na API', { error });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

### 3. Middleware (Next.js)

```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ServerLogger } from 'react-nextjs-logger';

const logger = new ServerLogger();

export function middleware(request: NextRequest) {
  const start = Date.now();
  
  logger.info('Request recebida', {
    path: request.nextUrl.pathname,
    method: request.method,
  });
  
  const response = NextResponse.next();
  
  const duration = Date.now() - start;
  logger.info('Request processada', {
    path: request.nextUrl.pathname,
    duration: `${duration}ms`,
  });
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### 4. Server Components

```tsx
import { ServerLogger } from 'react-nextjs-logger';

const logger = new ServerLogger();

export default async function ServerComponent() {
  logger.info('Server component renderizado');
  
  const data = await fetchData();
  logger.info('Dados carregados', { count: data.length });
  
  return <div>{/* conteúdo */}</div>;
}
```

## Níveis de Log

```tsx
import { LogLevel } from 'react-nextjs-logger';

// LogLevel.DEBUG - 0 (mais verboso)
// LogLevel.INFO  - 1
// LogLevel.WARN  - 2
// LogLevel.ERROR - 3 (menos verboso)

// Exemplo: Logger que só mostra WARN e ERROR
const logger = new ClientLogger(LogLevel.WARN);

logger.debug('Não será exibido'); // ❌
logger.info('Não será exibido');  // ❌
logger.warn('Será exibido');       // ✅
logger.error('Será exibido');      // ✅
```

## Mudando Nível de Log Dinamicamente

```tsx
import { ClientLogger, LogLevel } from 'react-nextjs-logger';

const logger = new ClientLogger(LogLevel.INFO);

// Em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  logger.setLogLevel(LogLevel.DEBUG);
}

// Em produção
if (process.env.NODE_ENV === 'production') {
  logger.setLogLevel(LogLevel.ERROR);
}
```

## TypeScript

A biblioteca é totalmente tipada:

```tsx
import type { LogLevel } from 'react-nextjs-logger';

interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
}

const config: LoggerConfig = {
  level: LogLevel.INFO,
  prefix: 'APP',
};
```
