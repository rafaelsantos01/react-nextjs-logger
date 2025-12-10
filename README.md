# 🪵 React Next.js Logger

Uma biblioteca de logging moderna e completa para aplicações React e Next.js, com suporte tanto para client-side quanto server-side.

[![npm version](https://badge.fury.io/js/react-nextjs-logger.svg)](https://badge.fury.io/js/react-nextjs-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Características

- 🎯 **Dual Environment**: Funciona tanto no client quanto no server
- 🪝 **React Hooks**: Hook `useLogger` para componentes React
- 🔧 **Configurável**: Níveis de log customizáveis
- 📝 **TypeScript**: Totalmente tipado
- 🚀 **Next.js Ready**: Middleware para logging de requisições
- 📦 **Zero Config**: Funciona out-of-the-box
- 🎨 **Formatação**: Timestamps automáticos e formatação de mensagens
- 🔌 **Extensível**: Sistema de transporte customizável

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
import { useLogger } from 'react-nextjs-logger';

function MyComponent() {
  const logger = useLogger();

  const handleClick = () => {
    logger.info('Botão clicado!');
    logger.warn('Aviso importante');
    logger.error('Erro ocorreu');
  };

  return <button onClick={handleClick}>Clique aqui</button>;
}
```

### Server-Side (Next.js API Routes)

```typescript
// pages/api/users.ts
import { ServerLogger, LogLevel } from 'react-nextjs-logger';
import type { NextApiRequest, NextApiResponse } from 'next';

const logger = new ServerLogger(LogLevel.INFO);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  logger.info(`[${req.method}] ${req.url}`);

  try {
    const users = await getUsers();
    logger.info(`Retornando ${users.length} usuários`);
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Erro: ${error.message}`);
    res.status(500).json({ error: 'Erro interno' });
  }
}
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
import { ServerLogger, LogLevel } from 'react-nextjs-logger';

const logger = new ServerLogger(LogLevel.INFO);

// Alterar nível em runtime
logger.setLogLevel(LogLevel.DEBUG);

// Logs com prefixo [SERVER]
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

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

### Logging Condicional

```typescript
const logger = new ServerLogger(
  process.env.NODE_ENV === 'production' 
    ? LogLevel.WARN 
    : LogLevel.DEBUG
);
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

- [ ] Suporte para Winston/Pino integrado
- [ ] Logging para diferentes ambientes (file, console, remote)
- [ ] Integração com serviços de logging (Datadog, Sentry)
- [ ] Performance monitoring
- [ ] Log rotation
- [ ] Structured logging (JSON)
- [ ] Log filtering e sanitização
- [ ] Context/correlation IDs

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