# 🧪 Guia de Teste Local

Este guia mostra como testar sua biblioteca localmente **ANTES** de publicar no npm.

## Método 1: npm link (Recomendado)

O `npm link` cria um symlink da sua biblioteca para uso local.

### Passo 1: Preparar a biblioteca

```bash
# No diretório da biblioteca
cd react-nextjs-logger

# Instale as dependências
npm install

# Build a biblioteca
npm run build

# Crie o link global
npm link
```

### Passo 2: Usar em um projeto de teste

```bash
# Crie um novo projeto Next.js para testar
npx create-next-app@latest test-logger-app
cd test-logger-app

# Link a biblioteca
npm link react-nextjs-logger

# Agora você pode importar normalmente!
```

### Passo 3: Testar no projeto

**Exemplo: `pages/index.tsx`**

```tsx
import { useLogger } from 'react-nextjs-logger';

export default function Home() {
  const logger = useLogger();

  const handleTest = () => {
    logger.info('Testando a biblioteca!');
    logger.warn('Isso é um aviso');
    logger.error('Isso é um erro');
  };

  return (
    <div>
      <h1>Testando React Next.js Logger</h1>
      <button onClick={handleTest}>Testar Logger</button>
    </div>
  );
}
```

**Exemplo API: `pages/api/test.ts`**

```typescript
import { ServerLogger, LogLevel } from 'react-nextjs-logger';
import type { NextApiRequest, NextApiResponse } from 'next';

const logger = new ServerLogger(LogLevel.DEBUG);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info('API chamada!');
  logger.debug('Debug info');
  logger.warn('Aviso importante');
  
  res.status(200).json({ message: 'Logger funcionando!' });
}
```

### Passo 4: Desfazer o link (quando terminar)

```bash
# No projeto de teste
npm unlink react-nextjs-logger

# Na biblioteca
npm unlink -g
```

---

## Método 2: npm pack + install local

Este método cria um arquivo `.tgz` como se fosse publicado no npm.

### Passo 1: Criar o pacote

```bash
# No diretório da biblioteca
cd react-nextjs-logger

# Build
npm run build

# Criar o pacote
npm pack
# Isso cria: react-nextjs-logger-1.0.0.tgz
```

### Passo 2: Instalar no projeto de teste

```bash
# No projeto de teste
npm install /caminho/completo/para/react-nextjs-logger-1.0.0.tgz

# Ou se estiver no mesmo diretório pai:
npm install ../react-nextjs-logger/react-nextjs-logger-1.0.0.tgz
```

### Passo 3: Testar normalmente

A biblioteca será instalada como se fosse do npm!

### Passo 4: Atualizar após mudanças

```bash
# Na biblioteca, após fazer mudanças:
npm run build
npm pack

# No projeto de teste, reinstale:
npm install /caminho/para/react-nextjs-logger-1.0.0.tgz --force
```

---

## Método 3: Yalc (Alternativa moderna)

Yalc é uma ferramenta moderna que simula o npm registry localmente.

### Passo 1: Instalar Yalc

```bash
npm install -g yalc
```

### Passo 2: Publicar localmente

```bash
# No diretório da biblioteca
cd react-nextjs-logger

# Build
npm run build

# Publicar no yalc store
yalc publish
```

### Passo 3: Adicionar ao projeto de teste

```bash
# No projeto de teste
cd test-logger-app

# Adicionar a biblioteca
yalc add react-nextjs-logger

# Instalar dependências
npm install
```

### Passo 4: Atualizar após mudanças

```bash
# Na biblioteca:
npm run build
yalc push

# Isso atualiza automaticamente todos os projetos linkados!
```

### Passo 5: Remover

```bash
# No projeto de teste
yalc remove react-nextjs-logger
npm install
```

---

## 📝 Checklist de Testes

Antes de publicar, teste os seguintes cenários:

### ✅ Client-Side

- [ ] `useLogger` hook funciona em componentes funcionais
- [ ] Logs aparecem no console do browser
- [ ] Diferentes níveis de log funcionam
- [ ] `ClientLogger` direto funciona

### ✅ Server-Side

- [ ] `ServerLogger` funciona em API routes
- [ ] Logs aparecem no terminal do servidor
- [ ] Prefixo `[SERVER]` aparece
- [ ] Diferentes níveis de log funcionam

### ✅ Build & Types

- [ ] Build completa sem erros (`npm run build`)
- [ ] Arquivos `.d.ts` são gerados
- [ ] TypeScript reconhece os tipos
- [ ] Intellisense funciona no editor

### ✅ Importações

- [ ] Import named: `import { useLogger } from 'react-nextjs-logger'`
- [ ] Import default: `import ClientLogger from 'react-nextjs-logger/dist/...'`
- [ ] Imports de tipos: `import type { LogLevel } from 'react-nextjs-logger'`

### ✅ Compatibilidade

- [ ] Funciona com React 17
- [ ] Funciona com React 18
- [ ] Funciona com Next.js 12+
- [ ] Funciona com Next.js 13+
- [ ] Funciona com Next.js 14+

---

## 🎯 Exemplo Completo de Teste

### 1. Criar estrutura de teste

```bash
mkdir test-react-nextjs-logger
cd test-react-nextjs-logger
npx create-next-app@latest app --typescript --tailwind --app --src-dir
```

### 2. Linkar a biblioteca

```bash
# Na biblioteca
cd ../react-nextjs-logger
npm run build
npm link

# No app de teste
cd ../test-react-nextjs-logger/app
npm link react-nextjs-logger
```

### 3. Criar testes completos

**`app/page.tsx`**
```tsx
'use client';

import { useLogger } from 'react-nextjs-logger';
import { useState } from 'react';

export default function Home() {
  const logger = useLogger();
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(c => c + 1);
    logger.info(`Botão clicado ${count + 1} vezes`);
  };

  const handleWarn = () => {
    logger.warn('Isso é um aviso!');
  };

  const handleError = () => {
    logger.error('Isso é um erro!');
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Teste React Next.js Logger</h1>
      
      <div className="space-x-2">
        <button 
          onClick={handleClick}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Info ({count})
        </button>
        
        <button 
          onClick={handleWarn}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Warn
        </button>
        
        <button 
          onClick={handleError}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Error
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Abra o console do navegador para ver os logs
      </p>
    </main>
  );
}
```

**`app/api/test/route.ts`**
```typescript
import { ServerLogger, LogLevel } from 'react-nextjs-logger';
import { NextResponse } from 'next/server';

const logger = new ServerLogger(LogLevel.DEBUG);

export async function GET() {
  logger.debug('Debug: API route chamada');
  logger.info('Info: Processando requisição');
  logger.warn('Warn: Exemplo de aviso');
  
  return NextResponse.json({ 
    message: 'Verifique o terminal para ver os logs do servidor' 
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  logger.info(`POST recebido: ${JSON.stringify(body)}`);
  
  return NextResponse.json({ success: true });
}
```

### 4. Executar e verificar

```bash
npm run dev
```

1. Abra `http://localhost:3000`
2. Clique nos botões e veja o console do browser
3. Acesse `http://localhost:3000/api/test` e veja o terminal
4. Faça um POST para `/api/test` e veja os logs

---

## 🔍 Debugging

### Problemas comuns

**1. "Cannot find module 'react-nextjs-logger'"**
```bash
# Reconstrua e relinke
npm run build
npm link
```

**2. "Types não encontrados"**
```bash
# Verifique se os .d.ts foram gerados
ls dist/*.d.ts

# Se não, adicione no tsconfig.json:
"declaration": true,
"declarationDir": "./dist"
```

**3. "Mudanças não aparecem"**
```bash
# Sempre rebuild após mudanças
npm run build

# Se usar npm link, pode precisar:
npm unlink react-nextjs-logger
npm link react-nextjs-logger
```

**4. "Module not found no Next.js 13+ (app dir)"**
```bash
# Adicione ao next.config.js:
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-nextjs-logger'],
}

module.exports = nextConfig
```

---

## ✅ Pronto para Publicar?

Quando todos os testes passarem:

```bash
# 1. Atualize a versão
npm version patch  # ou minor, ou major

# 2. Build final
npm run build

# 3. Execute os testes
npm test

# 4. Publique
npm publish
```

**Importante**: Após publicar, teste instalando do npm real:

```bash
# Em um novo projeto
npm install react-nextjs-logger

# Teste para garantir que funciona igual ao teste local
```

---

## 📚 Recursos Adicionais

- [npm link documentation](https://docs.npmjs.com/cli/v8/commands/npm-link)
- [npm pack documentation](https://docs.npmjs.com/cli/v8/commands/npm-pack)
- [Yalc GitHub](https://github.com/wclr/yalc)
- [Testing Node.js modules locally](https://www.npmjs.com/package/yalc)

---

**Boa sorte com sua biblioteca! 🚀**
