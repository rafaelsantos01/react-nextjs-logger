# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Planejado
- Suporte para Winston/Pino integrado
- Logging para diferentes destinos (file, console, remote)
- Integração com serviços de logging (Datadog, Sentry)
- Performance monitoring
- Log rotation
- Structured logging (JSON)
- Context/correlation IDs

## [1.0.0] - 2025-12-10

### Adicionado
- ✨ Logger client-side (`ClientLogger`) para aplicações React
- ✨ Logger server-side (`ServerLogger`) para Next.js API routes
- ✨ Hook `useLogger` para componentes React
- ✨ Logger core com níveis configuráveis (DEBUG, INFO, WARN, ERROR)
- ✨ Middleware para logging de requisições Next.js
- ✨ Sistema de formatação de mensagens com timestamps
- ✨ Sistema de transporte extensível
- ✨ Suporte completo para TypeScript
- ✨ Testes unitários com Jest
- 📝 Documentação completa
- 📝 Exemplos de uso
- 📝 Guia de contribuição

### Características Iniciais
- Dual environment (client + server)
- Zero config - funciona out-of-the-box
- TypeScript first
- Totalmente testado
- ESM e CommonJS support
- React 17+ e Next.js 12+ compatível

---

## Tipos de Mudanças

- `Added` (Adicionado) para novas funcionalidades.
- `Changed` (Modificado) para mudanças em funcionalidades existentes.
- `Deprecated` (Descontinuado) para funcionalidades que serão removidas.
- `Removed` (Removido) para funcionalidades removidas.
- `Fixed` (Corrigido) para correções de bugs.
- `Security` (Segurança) para vulnerabilidades corrigidas.

---

## Exemplo de Futuras Versões

<!--
## [1.1.0] - YYYY-MM-DD

### Added
- Nova funcionalidade X
- Suporte para Y

### Changed
- Comportamento de Z melhorado

### Fixed
- Bug em W corrigido

### Deprecated
- Feature A será removida na v2.0.0

## [1.0.1] - YYYY-MM-DD

### Fixed
- Correção de bug crítico
- Melhoria de performance

### Security
- Atualização de dependência vulnerável
-->

[Unreleased]: https://github.com/seu-usuario/react-nextjs-logger/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/seu-usuario/react-nextjs-logger/releases/tag/v1.0.0
