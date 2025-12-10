# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o **react-nextjs-logger**! Este documento fornece diretrizes para tornar o processo de contribuição o mais suave possível.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)

## 📜 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, você deve manter um ambiente respeitoso e acolhedor para todos.

### Nossas Promessas

- Usar linguagem acolhedora e inclusiva
- Respeitar diferentes pontos de vista e experiências
- Aceitar críticas construtivas com elegância
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros da comunidade

## 🎯 Como Posso Contribuir?

### Tipos de Contribuições

1. **Reportar Bugs** - Encontrou um problema? Nos avise!
2. **Sugerir Melhorias** - Tem ideias? Compartilhe conosco!
3. **Corrigir Bugs** - Escolha uma issue e resolva!
4. **Adicionar Funcionalidades** - Implemente novas features
5. **Melhorar Documentação** - Documentação nunca é demais
6. **Escrever Testes** - Aumentar cobertura de testes
7. **Revisar PRs** - Ajude a revisar pull requests

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js >= 16.x
- npm >= 8.x ou yarn >= 1.22.x
- Git

### Configuração Inicial

```bash
# 1. Fork o repositório no GitHub

# 2. Clone seu fork
git clone https://github.com/SEU-USUARIO/react-nextjs-logger.git
cd react-nextjs-logger

# 3. Adicione o repositório original como upstream
git remote add upstream https://github.com/ORIGINAL/react-nextjs-logger.git

# 4. Instale as dependências
npm install

# 5. Crie uma branch para sua feature
git checkout -b feature/minha-feature
```

### Verificar Instalação

```bash
# Execute os testes
npm test

# Build da biblioteca
npm run build

# Verificação de tipos
npm run lint
```

Se tudo passar, você está pronto! ✅

## 🔄 Processo de Desenvolvimento

### 1. Antes de Começar

- Verifique se já não existe uma issue ou PR relacionado
- Crie ou comente na issue relevante
- Discuta a abordagem antes de começar grandes mudanças

### 2. Durante o Desenvolvimento

```bash
# Mantenha sua branch atualizada
git fetch upstream
git rebase upstream/main

# Execute testes frequentemente
npm test

# Execute testes em watch mode durante desenvolvimento
npm run test:watch

# Verifique tipos TypeScript
npm run lint
```

### 3. Estrutura de Diretórios

```
react-nextjs-logger/
├── src/
│   ├── client/          # Código client-side
│   ├── server/          # Código server-side
│   ├── core/            # Lógica compartilhada
│   ├── utils/           # Utilitários
│   └── index.ts         # Exportações principais
├── tests/
│   ├── client/          # Testes client-side
│   └── server/          # Testes server-side
├── dist/                # Build output (gerado)
└── ...
```

### 4. Escrevendo Código

#### Adicionar Nova Funcionalidade

```typescript
// 1. Adicione o código em src/
// src/utils/newFeature.ts

export function newFeature(param: string): string {
    // Implemente aqui
    return param;
}

// 2. Adicione testes
// tests/utils/newFeature.test.ts

import { newFeature } from '../../src/utils/newFeature';

describe('newFeature', () => {
    it('should do something', () => {
        expect(newFeature('test')).toBe('test');
    });
});

// 3. Exporte se necessário
// src/index.ts
export { newFeature } from './utils/newFeature';
```

#### Corrigir Bug

```typescript
// 1. Escreva um teste que falha (reproduz o bug)
it('should handle edge case', () => {
    expect(buggyFunction()).toBe(expectedResult);
});

// 2. Corrija o código

// 3. Verifique se o teste passa
npm test

// 4. Execute todos os testes
npm run test:coverage
```

## 📏 Padrões de Código

### TypeScript

- Use TypeScript para todo código
- Defina tipos explicitamente
- Evite `any` quando possível
- Use interfaces para objetos públicos

```typescript
// ✅ Bom
interface LoggerOptions {
    level: LogLevel;
    transport?: (message: string) => void;
}

function createLogger(options: LoggerOptions): Logger {
    // ...
}

// ❌ Ruim
function createLogger(options: any) {
    // ...
}
```

### Nomenclatura

- **Classes**: PascalCase (`ClientLogger`, `ServerLogger`)
- **Funções/Métodos**: camelCase (`formatMessage`, `setLogLevel`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_LOG_SIZE`)
- **Interfaces**: PascalCase com prefixo I opcional (`LoggerOptions`)
- **Tipos**: PascalCase (`LogLevel`)

### Formatação

- Indentação: 4 espaços
- Ponto e vírgula: opcional (siga o padrão do projeto)
- Aspas: simples `'` preferencial
- Linha máxima: 100 caracteres

### Comentários

```typescript
/**
 * Cria um novo logger com as opções especificadas
 * @param options - Opções de configuração do logger
 * @returns Uma instância de Logger configurada
 * @example
 * ```ts
 * const logger = createLogger({ level: LogLevel.INFO });
 * logger.info('Hello');
 * ```
 */
export function createLogger(options: LoggerOptions): Logger {
    // Comentários inline para lógica complexa
    return new Logger(options);
}
```

## 📝 Commits

### Conventional Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Apenas documentação
- `style`: Formatação, sem mudança de código
- `refactor`: Refatoração sem adicionar feature ou corrigir bug
- `test`: Adicionar ou modificar testes
- `chore`: Tarefas de manutenção

### Exemplos

```bash
# Feature
feat(client): add support for custom log formatters

# Bug fix
fix(server): resolve memory leak in ServerLogger

# Documentation
docs(readme): add examples for middleware usage

# Tests
test(client): add tests for ClientLogger edge cases

# Refactor
refactor(core): simplify log level comparison logic
```

### Boas Práticas

- Use imperativos ("add" não "added")
- Primeira linha com max 72 caracteres
- Corpo opcional com mais detalhes
- Referencie issues: `Closes #123`

## 🔀 Pull Requests

### Antes de Submeter

- [ ] Código está funcionando
- [ ] Testes adicionados/atualizados
- [ ] Todos os testes passam (`npm test`)
- [ ] Build funciona (`npm run build`)
- [ ] Documentação atualizada se necessário
- [ ] Commits seguem o padrão
- [ ] Branch está atualizada com `main`

### Processo de PR

1. **Push sua branch**
   ```bash
   git push origin feature/minha-feature
   ```

2. **Abra o PR no GitHub**
   - Título claro e descritivo
   - Descrição completa do que foi feito
   - Referencie issues relacionadas
   - Adicione screenshots se aplicável

3. **Template de PR**
   ```markdown
   ## Descrição
   Breve descrição das mudanças
   
   ## Tipo de Mudança
   - [ ] Bug fix
   - [ ] Nova feature
   - [ ] Breaking change
   - [ ] Documentação
   
   ## Como Testar
   1. Passo 1
   2. Passo 2
   
   ## Checklist
   - [ ] Testes passam localmente
   - [ ] Documentação atualizada
   - [ ] Sem breaking changes (ou documentado)
   
   ## Issues Relacionadas
   Closes #123
   ```

4. **Code Review**
   - Responda aos comentários
   - Faça as mudanças solicitadas
   - Mantenha discussões construtivas

5. **Merge**
   - Mantenedor fará o merge quando aprovado
   - Squash commits se solicitado

## 🐛 Reportar Bugs

### Antes de Reportar

- Verifique se o bug já foi reportado
- Use a versão mais recente
- Teste em um ambiente limpo

### Template de Bug Report

```markdown
**Descrição do Bug**
Uma descrição clara do que é o bug.

**Como Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
 - OS: [e.g. Windows, macOS, Linux]
 - Node version: [e.g. 18.0.0]
 - React version: [e.g. 18.3.1]
 - Next.js version: [e.g. 14.0.0]
 - Library version: [e.g. 1.0.0]

**Contexto Adicional**
Qualquer outra informação relevante.
```

## 💡 Sugerir Funcionalidades

### Template de Feature Request

```markdown
**O problema que você quer resolver**
Uma descrição clara do problema.

**Solução Proposta**
Como você gostaria que funcionasse.

**Alternativas Consideradas**
Outras soluções que você pensou.

**Contexto Adicional**
Qualquer outra informação relevante.
```

## 🎓 Recursos para Contribuidores

### Documentação Útil

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Jest Testing](https://jestjs.io/docs/getting-started)

### Ferramentas Recomendadas

- **Editor**: VS Code com extensões TypeScript e Jest
- **Git Client**: GitKraken, SourceTree, ou linha de comando
- **Node Version Manager**: nvm (Linux/Mac) ou nvm-windows

## 🏆 Reconhecimento

Todos os contribuidores serão adicionados ao arquivo CONTRIBUTORS.md!

## ❓ Dúvidas?

- Abra uma [Discussion](https://github.com/SEU-REPO/react-nextjs-logger/discussions)
- Comente em uma issue existente
- Entre em contato com os mantenedores

---

**Obrigado por contribuir! 🎉**

Sua ajuda torna este projeto melhor para todos!
