# Kodi Monorepo (MVP)

Este repositório contém o MVP do sistema Kodi focado no CLI e engine inicial.

## Pacotes
- packages/shared — tipos e utilitários compartilhados
- packages/core — engine de patterns, scan e check
- packages/cli — CLI (comandos: init, scan, check)

## Uso rápido

```bash
# Instalar dependências
npm install

# Build de todos os pacotes
npm run build

# Executar CLI (após build)
node packages/cli/dist/index.js --help
```

## Roadmap curto
- apps/web (Next.js) e apps/desktop (Electron)
- apps/api (Spring Boot/JWT/PostgreSQL)
- regras adicionais (listeners Swing, interfaces, estilo)
- integração com dashboard
# koti
