# Kodi — Agente de Padronização de Código com Documentação Ativa

<p align="center">
  <img src="./logo_semfundo.png" alt="Logo Kodi" width="180" />
</p>

## Visão Geral

Kodi é um agente inteligente que analisa projetos, aprende os padrões existentes no codebase e garante que todo código novo ou refatorado siga essas convenções. O diferencial é o conceito de "Documentação Ativa": um conjunto de regras vivas que o agente consulta obrigatoriamente antes de executar qualquer rotina.

---

## Prompt do Agente (LLM)

Texto pronto para uso em um sistema de IA (campo "system" ou equivalente). Este prompt define a persona, objetivos, regras e estilo do Kodi.

```text
Você é Kodi, um agente de engenharia que garante que todo código gerado ou refatorado siga a Documentação Ativa do projeto.

Princípios e objetivos:
- Priorize consistência e conformidade: aplique as regras em .kodi/patterns/* antes de qualquer ação.
- Preserve o estilo existente do codebase: nomes, estrutura, comentários, testes e organização.
- Minimize mudanças desnecessárias: foque em correções e melhorias alinhadas às regras.

Fluxo de trabalho obrigatório:
1) Carregue e consulte as regras da Documentação Ativa (.kodi/patterns/*) relevantes ao arquivo/área.
2) Identifique padrões aplicáveis e restrições (naming, estrutural, estilo, testes, interfaces, listeners, etc.).
3) Explique rapidamente como cada regra influencia a solução.
4) Produza a saída mantendo o padrão do projeto. Se faltar contexto, peça informação objetiva.

Regras de segurança e ética:
- Recuse solicitações de conteúdo nocivo, ilegal, odioso, violento, sexualmente explícito ou discriminatório.
- Não viole direitos autorais. Evite copiar código externo não autorizado.
- Proteja credenciais e dados sensíveis. Não exiba segredos.

Estilo de resposta:
- Seja direto e conciso. Forneça exemplos curtos quando útil.
- Use o idioma do projeto/usuário (pt-br por padrão).
- Para código, utilize blocos com cercas (```lang). Evite comentários em linha, a menos que solicitado.
- Quando modificar arquivos, apresente difs claros ou instruções de aplicação.

Quando gerar ou refatorar código:
- Aplique convenções de nomenclatura, estrutura de pacotes/módulos, padrões de interfaces, listeners Swing (quando aplicável), Javadoc/comentários e testes.
- Mantenha invariantes existentes, APIs públicas e compatibilidade.
- Se uma regra tiver conflito, explique e proponha a resolução minimalista.

Saída preferida:
- Para múltiplos arquivos, liste cada mudança por arquivo, com difs compactos.
- Para operações de terminal/CLI, liste comandos claros em passos.

Se algo não puder ser feito com o contexto disponível, explique o motivo e solicite a informação mínima necessária.
```

## Problema que Resolve

- Novos desenvolvedores não conhecem os padrões do projeto
- Padrões existem apenas na cabeça dos devs seniores
- IAs generativas (Copilot, ChatGPT) geram código inconsistente com o projeto
- Code reviews repetitivos corrigindo sempre os mesmos problemas
- Documentação de padrões existe mas ninguém consulta

Kodi resolve isso sendo o "guardião" que conhece profundamente os padrões e os aplica automaticamente.

---

## Stack Técnica

| Camada | Tecnologia |
|--------|------------|
| Frontend/Dashboard | Next.js 14, Tailwind CSS, HeroUI |
| Aplicação Desktop | Electron |
| Backend/Auth | Java Spring Boot, JWT, PostgreSQL |
| Motor do Agente | AST Parser, LLM API, Vector DB |

---

## Conceito: Documentação Ativa

Diferente de documentação tradicional (estática, ignorada), a Documentação Ativa é:

1. Estruturada em arquivos YAML/JSON no repositório (.kodi/patterns/)
2. Versionada junto com o código
3. Consultada obrigatoriamente pelo agente antes de qualquer ação
4. Validada automaticamente contra o codebase

### Exemplo de Regra

```yaml
# .kodi/patterns/java-naming.yaml
id: service-class-naming
language: java
type: naming-convention
scope: class
rule: "Classes de serviço devem terminar com 'Service'"
pattern: "^[A-Z][a-zA-Z]*Service$"
examples:
  valid: ["UserService", "PaymentService"]
  invalid: ["ServiceUser", "UserSvc"]
severity: error
auto_fix: true
```

### Exemplo de Regra para Swing Listeners

```yaml
# .kodi/patterns/java-swing-listeners.yaml
id: swing-listener-pattern
language: java
type: structural-pattern
scope: class
rule: "Listeners de Swing devem seguir o padrão Observer"
detection:
  implements: ["ActionListener", "MouseListener", "KeyListener", "EventListener"]
  method_prefix: "on"
template: |
  public class ${Name}Listener implements ${Event}Listener {
      @Override
      public void ${eventMethod}(${Event}Event e) {
          // implementation
      }
  }
examples:
  valid:
    - "ButtonClickListener implements ActionListener"
    - "MouseHoverListener implements MouseListener"
  invalid:
    - "ButtonHandler implements ActionListener"
    - "ClickManager implements ActionListener"
severity: warning
auto_fix: true
```

### Exemplo de Regra para Interfaces

```yaml
# .kodi/patterns/java-interfaces.yaml
id: interface-naming
language: java
type: naming-convention
scope: interface
rule: "Interfaces devem usar prefixo 'I' ou sufixo descritivo"
pattern: "^I[A-Z][a-zA-Z]*$|^[A-Z][a-zA-Z]*(able|ible|Handler|Listener|Factory|Repository|Service)$"
examples:
  valid: ["IUserRepository", "Printable", "Serializable", "EventHandler"]
  invalid: ["User", "DataClass", "Manager"]
severity: warning
auto_fix: suggest
```

---

## Funcionalidades Principais

### 1. Pattern Discovery (Scan)

Kodi analisa o codebase e identifica automaticamente:

**Para Java:**
- Convenções de nomenclatura (classes, métodos, variáveis, constantes)
- Estrutura de pacotes e organização de módulos
- Padrões de interfaces e implementações
- Uso de Swing: listeners, events, componentes customizados
- Padrões de annotations customizadas
- Estilo de Javadoc e comentários
- Padrões de exceções e tratamento de erros
- Estrutura de testes (JUnit, Mockito)

**Para qualquer linguagem:**
- Estrutura de pastas e arquivos
- Padrões de imports/exports
- Formatação e estilo de código
- Padrões de testes
- Convenções de commits

### 2. Modos de Operação

| Modo | Comando | Descrição |
|------|---------|-----------|
| **Scan** | `kodi scan` | Analisa o projeto e descobre padrões existentes |
| **Check** | `kodi check` | Verifica conformidade e gera relatório |
| **Watch** | `kodi watch` | Monitora mudanças em tempo real |
| **Generate** | `kodi generate` | Gera código novo seguindo os padrões |
| **Refactor** | `kodi refactor` | Aplica padrões em código existente |
| **Sync** | `kodi sync` | Sincroniza padrões com o dashboard |

### 3. CLI Completa

```bash
# Inicialização
kodi init                           # Inicializa Kodi no projeto
kodi init --language java           # Inicializa com preset Java
kodi init --template spring-boot    # Usa template específico

# Descoberta de Padrões
kodi scan                           # Escaneia todo o projeto
kodi scan --discover                # Descobre e salva padrões automaticamente
kodi scan src/main/java             # Escaneia diretório específico
kodi scan --output report.json      # Exporta resultado

# Verificação
kodi check                          # Verifica todo o projeto
kodi check src/UserService.java     # Verifica arquivo específico
kodi check --fix                    # Aplica correções automáticas
kodi check --severity error         # Filtra por severidade
kodi check --pattern naming         # Verifica padrão específico

# Geração de Código
kodi generate service --name Payment
kodi generate listener --event Click --class MainFrame
kodi generate interface --name Repository --type crud
kodi generate test --for UserService

# Refatoração
kodi refactor src/legacy/           # Refatora diretório
kodi refactor --apply naming        # Aplica padrão específico
kodi refactor --dry-run             # Preview sem aplicar
kodi refactor --interactive         # Confirma cada mudança

# Watch Mode
kodi watch                          # Monitora mudanças
kodi watch --pre-commit             # Integra com git hooks
kodi watch --notify                 # Notificações desktop

# Configuração
kodi config set llm.provider openai
kodi config set llm.model gpt-4
kodi config get --all

# Padrões
kodi patterns list                  # Lista padrões ativos
kodi patterns add naming.yaml       # Adiciona padrão
kodi patterns disable service-naming # Desativa padrão
kodi patterns export --format yaml  # Exporta padrões
kodi patterns import team-patterns.yaml # Importa padrões
```

---

## Dashboard Web

### Tela: Visão Geral

- Score de conformidade do projeto (0-100%)
- Gráfico de evolução ao longo do tempo
- Top 10 violações mais recorrentes
- Arquivos com mais problemas
- Atividade recente do agente

### Tela: Editor de Padrões

- Interface visual para criar/editar regras
- Syntax highlighting para YAML/JSON
- Validação em tempo real
- Templates por linguagem/framework
- Import/export de padrões entre projetos
- Marketplace de padrões da comunidade

### Tela: Análise de Código

- Tree view do projeto com indicadores visuais
- Código fonte com highlighting de violações
- Diff view com sugestões de correção
- Bulk fix para correções em massa
- Filtros por severidade, tipo, arquivo

### Tela: Histórico e Métricas

- Log de todas as verificações
- Métricas de melhoria ao longo do tempo
- Comparativo entre branches
- Relatórios exportáveis (PDF, JSON)
- Integração com CI/CD

### Tela: Configurações

- Conexão com repositórios Git
- Configuração de LLM provider
- Webhooks e integrações
- Gerenciamento de usuários e times
- API keys e tokens

---

## Fluxo do Agente

```
┌─────────────────────────────────────────────────────────────────┐
│                         KODI AGENT                              │
│                                                                 │
│  ┌───────────┐     ┌────────────────────────────────────────┐   │
│  │  TRIGGER  │     │       DOCUMENTAÇÃO ATIVA               │   │
│  │           │     │                                        │   │
│  │ • generate│────▶│  1. Carregar .kodi/patterns/*          │   │
│  │ • refactor│     │  2. Identificar regras aplicáveis      │   │
│  │ • check   │     │  3. Carregar contexto do arquivo       │   │
│  │ • watch   │     │  4. Montar prompt com restrições       │   │
│  └───────────┘     │                                        │   │
│                    └──────────────────┬─────────────────────┘   │
│                                       │                         │
│                                       ▼                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  EXECUTION ENGINE                        │   │
│  │                                                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │   │
│  │  │ AST Parser  │  │ Rule Engine │  │ LLM Integration │   │   │
│  │  │             │  │             │  │                 │   │   │
│  │  │ Analisa     │─▶│ Aplica      │─▶│ Gera/Valida     │   │   │
│  │  │ estrutura   │  │ regras      │  │ código          │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │   │
│  │                                                          │   │
│  └────────────────────────────┬─────────────────────────────┘   │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      OUTPUT                              │   │
│  │                                                          │   │
│  │  • Código gerado/refatorado                              │   │
│  │  • Relatório de conformidade                             │   │
│  │  • Sugestões de melhoria                                 │   │
│  │  • Métricas e logs                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Estrutura do Projeto

```
kodi/
├── apps/
│   ├── web/                      # Dashboard Next.js
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── overview/
│   │   │   │   ├── patterns/
│   │   │   │   ├── analysis/
│   │   │   │   ├── history/
│   │   │   │   └── settings/
│   │   │   └── api/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui
│   │   │   ├── patterns/
│   │   │   ├── analysis/
│   │   │   └── charts/
│   │   └── lib/
│   │
│   ├── desktop/                  # App Electron
│   │   ├── main/
│   │   │   ├── index.ts
│   │   │   ├── ipc/
│   │   │   └── services/
│   │   ├── renderer/
│   │   │   └── (integra web app)
│   │   └── preload/
│   │
│   └── api/                      # Backend Spring Boot
│       ├── src/main/java/com/kodi/
│       │   ├── auth/
│       │   │   ├── AuthController.java
│       │   │   ├── AuthService.java
│       │   │   └── JwtTokenProvider.java
│       │   ├── projects/
│       │   ├── patterns/
│       │   ├── analysis/
│       │   └── users/
│       └── src/main/resources/
│           └── application.yml
│
├── packages/
│   ├── cli/                      # CLI do Kodi (Node.js)
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   ├── init.ts
│   │   │   │   ├── scan.ts
│   │   │   │   ├── check.ts
│   │   │   │   ├── generate.ts
│   │   │   │   ├── refactor.ts
│   │   │   │   └── watch.ts
│   │   │   ├── core/
│   │   │   └── utils/
│   │   └── package.json
│   │
│   ├── core/                     # Engine de análise
│   │   ├── src/
│   │   │   ├── parsers/          # AST parsers por linguagem
│   │   │   ├── rules/            # Rule engine
│   │   │   ├── llm/              # Integração LLM
│   │   │   └── patterns/         # Pattern matching
│   │   └── package.json
│   │
│   └── shared/                   # Types e utils compartilhados
│       ├── src/
│       │   ├── types/
│       │   └── utils/
│       └── package.json
│
├── templates/                    # Templates de padrões
│   ├── java/
│   │   ├── spring-boot.yaml
│   │   ├── swing.yaml
│   │   └── general.yaml
│   ├── typescript/
│   └── python/
│
└── docs/
    ├── getting-started.md
    ├── patterns.md
    ├── cli-reference.md
    └── api-reference.md
```

---

## Exemplo de Uso Completo

### 1. Inicializar em projeto Java existente

```bash
cd meu-projeto-java
kodi init --language java
```

Output:
```
Kodi initialized successfully.

Created:
  .kodi/
  .kodi/config.yaml
  .kodi/patterns/

Next steps:
  1. Run 'kodi scan --discover' to detect existing patterns
  2. Run 'kodi check' to verify compliance
  3. Run 'kodi watch' to monitor changes
```

### 2. Descobrir padrões automaticamente

```bash
kodi scan --discover
```

Output:
```
Scanning project...

Analyzed:
  • 47 Java files
  • 12 packages
  • 156 classes
  • 892 methods

Discovered 15 patterns:

  Naming Conventions:
    ✓ Classes Service terminam com "Service" (23 matches)
    ✓ Classes Repository terminam com "Repository" (8 matches)
    ✓ Interfaces começam com "I" (12 matches)
    ✓ Constantes em UPPER_SNAKE_CASE (45 matches)

  Structural Patterns:
    ✓ Listeners implementam EventListener (7 matches)
    ✓ Métodos de evento começam com "on" (15 matches)
    ✓ Factories seguem padrão Factory Method (3 matches)

  Code Style:
    ✓ Javadoc em classes públicas (34 matches)
    ✓ Métodos públicos documentados (78 matches)

Patterns saved to .kodi/patterns/discovered/

Run 'kodi check' to verify full compliance.
```

### 3. Verificar conformidade

```bash
kodi check
```

Output:
```
Checking compliance...

Results:
  ✓ 142 files passed
  ✗ 5 files with violations

Violations:

  src/utils/DataManager.java
    Line 12: [error] Class name should end with appropriate suffix
             Found: DataManager
             Expected: DataService, DataRepository, or DataHandler

  src/ui/ButtonHandler.java
    Line 1: [warning] Listener class should follow naming pattern
            Found: ButtonHandler
            Expected: ButtonListener or ButtonActionListener

  src/models/user.java
    Line 1: [error] Class name should be PascalCase
            Found: user
            Expected: User

Score: 87/100

Run 'kodi check --fix' to auto-fix 3 violations.
```

### 4. Gerar código seguindo padrões

```bash
kodi generate listener --event Mouse --class Canvas
```

Output:
```
Consulting Active Documentation...

Applied patterns:
  • swing-listener-pattern
  • interface-naming
  • method-naming-events

Generated: src/ui/listeners/CanvasMouseListener.java

  public class CanvasMouseListener implements MouseListener {

      private final Canvas canvas;

      public CanvasMouseListener(Canvas canvas) {
          this.canvas = canvas;
      }

      @Override
      public void onMouseClicked(MouseEvent e) {
          // TODO: implement
      }

      @Override
      public void onMousePressed(MouseEvent e) {
          // TODO: implement
      }

      @Override
      public void onMouseReleased(MouseEvent e) {
          // TODO: implement
      }

      @Override
      public void onMouseEntered(MouseEvent e) {
          // TODO: implement
      }

      @Override
      public void onMouseExited(MouseEvent e) {
          // TODO: implement
      }
  }

File created successfully.
```

---

---

## Interface e Design System

### Stack de UI

| Camada | Tecnologia |
|--------|------------|
| Design System | HeroUI (antigo NextUI v2) |
| Estilização | Tailwind CSS |
| Ícones | Lucide React |
| Gráficos | Recharts |
| Code Highlighting | Shiki |
| Animações | Framer Motion |

### Paleta de Cores

Baseada na cor principal da logo (#2A8F9D):

```css
:root {
  /* Primary - Teal */
  --kodi-50: #f0fdfb;
  --kodi-100: #ccfbf4;
  --kodi-200: #99f6ea;
  --kodi-300: #5eeadb;
  --kodi-400: #2dd4c4;
  --kodi-500: #2A8F9D;  /* Logo color */
  --kodi-600: #1a7a87;
  --kodi-700: #19626d;
  --kodi-800: #194f58;
  --kodi-900: #19424a;
  --kodi-950: #0a282f;

  /* Semantic */
  --success: #17c964;
  --warning: #f5a524;
  --error: #f31260;

  /* Neutral (Dark Theme) */
  --background: #09090b;
  --surface: #18181b;
  --surface-hover: #27272a;
  --border: #3f3f46;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
}
```

### Configuração do HeroUI Theme

```typescript
// tailwind.config.ts
import { heroui } from "@heroui/react";

export default {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            primary: {
              50: "#f0fdfb",
              100: "#ccfbf4",
              200: "#99f6ea",
              300: "#5eeadb",
              400: "#2dd4c4",
              500: "#2A8F9D",
              600: "#1a7a87",
              700: "#19626d",
              800: "#194f58",
              900: "#19424a",
              DEFAULT: "#2A8F9D",
              foreground: "#ffffff",
            },
            background: "#09090b",
          },
        },
      },
    }),
  ],
};
```

---

## Especificação das Telas

### Layout Principal

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ┌────────┐                                                    ┌──────┐  │
│  │  LOGO  │  Kodi                                              │ User │  │
│  └────────┘                                                    └──────┘  │
├────────────────┬─────────────────────────────────────────────────────────┤
│                │                                                         │
│   SIDEBAR      │                    CONTENT AREA                         │
│                │                                                         │
│   ┌──────────┐ │                                                         │
│   │ Overview │ │                                                         │
│   └──────────┘ │                                                         │
│   ┌──────────┐ │                                                         │
│   │ Patterns │ │                                                         │
│   └──────────┘ │                                                         │
│   ┌──────────┐ │                                                         │
│   │ Analysis │ │                                                         │
│   └──────────┘ │                                                         │
│   ┌──────────┐ │                                                         │
│   │ History  │ │                                                         │
│   └──────────┘ │                                                         │
│   ┌──────────┐ │                                                         │
│   │ Settings │ │                                                         │
│   └──────────┘ │                                                         │
│                │                                                         │
├────────────────┴─────────────────────────────────────────────────────────┤
│  Status: Watching · Last scan: 2 min ago · 3 violations found            │
└──────────────────────────────────────────────────────────────────────────┘
```

**Componentes HeroUI utilizados:**
- `Navbar` para header
- `Listbox` para sidebar navigation
- `User` para avatar dropdown
- `Chip` para status indicators

---

### Tela: Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Overview                                                               │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │                 │  │                 │  │                 │          │
│  │  SCORE          │  │  FILES          │  │  VIOLATIONS     │          │
│  │                 │  │                 │  │                 │          │
│  │     87%         │  │     142         │  │      12         │          │
│  │                 │  │                 │  │                 │          │
│  │  ▲ 3% vs last   │  │  Analyzed       │  │  ▼ 5 fixed      │          │
│  │                 │  │                 │  │                 │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
│                                                                         │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐ │
│  │                                  │  │                              │ │
│  │  Compliance Over Time            │  │  Top Violations              │ │
│  │                                  │  │                              │ │
│  │  ┌────────────────────────────┐  │  │  1. Naming conventions  (5)  │ │
│  │  │                         ╱  │  │  │  2. Missing Javadoc     (3)  │ │
│  │  │                      ╱     │  │  │  3. Listener pattern    (2)  │ │
│  │  │                   ╱        │  │  │  4. Interface naming    (2)  │ │
│  │  │              ╱             │  │  │                              │ │
│  │  │         ╱                  │  │  │                              │ │
│  │  └────────────────────────────┘  │  │                              │ │
│  │  Jan  Feb  Mar  Apr  May  Jun    │  │                              │ │
│  │                                  │  │                              │ │
│  └──────────────────────────────────┘  └──────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  Recent Activity                                                 │   │
│  │                                                                  │   │
│  │  ┌────┐  kodi check completed · 12 violations found              │   │
│  │  │ ✓  │  2 minutes ago                                           │   │
│  │  └────┘                                                          │   │
│  │                                                                  │   │
│  │  ┌────┐  Pattern "service-naming" auto-fixed 3 files             │   │
│  │  │ ⚡ │  15 minutes ago                                          │   │
│  │  └────┘                                                          │   │
│  │                                                                  │   │
│  │  ┌────┐  New pattern discovered: "repository-pattern"           │   │
│  │  │ 🔍 │  1 hour ago                                              │   │
│  │  └────┘                                                          │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Componentes HeroUI utilizados:**
- `Card` para metric cards
- `Progress` para score visualization
- `Table` para recent activity
- `Chip` para status badges
- `Tooltip` para informações extras

---

### Tela: Patterns (Editor de Padrões)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Patterns                                            ┌───────────────┐  │
│  15 active patterns                                  │ + New Pattern │  │
│                                                      └───────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ 🔍 Search patterns...                             Filter ▼      │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐  │
│  │                               │  │                                │  │
│  │  PATTERN LIST                 │  │  PATTERN EDITOR                │  │
│  │                               │  │                                │  │
│  │  ┌─────────────────────────┐  │  │  service-class-naming          │  │
│  │  │ ● service-class-naming  │  │  │                                │  │
│  │  │   Naming · Error        │  │  │  ┌────────────────────────┐    │  │
│  │  └─────────────────────────┘  │  │  │ id: service-class-nami │    │  │
│  │                               │  │  │ language: java         │    │  │
│  │  ┌─────────────────────────┐  │  │  │ type: naming-conventio │    │  │
│  │  │ ○ interface-naming      │  │  │  │ scope: class           │    │  │
│  │  │   Naming · Warning      │  │  │  │ rule: "Classes de serv │    │  │
│  │  └─────────────────────────┘  │  │  │ pattern: "^[A-Z][a-zA- │    │  │
│  │                               │  │  │ examples:              │    │  │
│  │  ┌─────────────────────────┐  │  │  │   valid:               │    │  │
│  │  │ ○ swing-listener        │  │  │  │     - "UserService"    │    │  │
│  │  │   Structural · Warning  │  │  │  │     - "PaymentService" │    │  │
│  │  └─────────────────────────┘  │  │  │   invalid:             │    │  │
│  │                               │  │  │     - "ServiceUser"    │    │  │
│  │  ┌─────────────────────────┐  │  │  │ severity: error        │    │  │
│  │  │ ○ javadoc-required      │  │  │  │ auto_fix: true         │    │  │
│  │  │   Documentation · Info  │  │  │  └────────────────────────┘    │  │
│  │  └─────────────────────────┘  │  │                                │  │
│  │                               │  │  ┌──────────┐  ┌────────────┐  │  │
│  │  ┌─────────────────────────┐  │  │  │  Test    │  │  Save      │  │  │
│  │  │ ○ constant-naming       │  │  │  └──────────┘  └────────────┘  │  │
│  │  │   Naming · Error        │  │  │                                │  │
│  │  └─────────────────────────┘  │  │                                │  │
│  │                               │  │                                │  │
│  └───────────────────────────────┘  └────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Componentes HeroUI utilizados:**
- `Input` com search icon
- `Select` para filtros
- `Listbox` para lista de patterns
- `Card` para containers
- `Badge` para severity indicators
- `Button` para ações
- `Code` para editor (integrado com Shiki)
- `Tabs` para alternar entre visual/YAML editor

---

### Tela: Analysis

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Analysis                                            ┌───────────────┐  │
│  Last scan: 2 min ago                                │ Run Check     │  │
│                                                      └───────────────┘  │
│                                                                         │
│  ┌──────────────────────────┐  ┌────────────────────────────────────┐   │
│  │                          │  │                                    │   │
│  │  FILE TREE               │  │  CODE VIEW                         │   │
│  │                          │  │                                    │   │
│  │  ▼ src/                  │  │  src/utils/DataManager.java        │   │
│  │    ▼ main/               │  │                                    │   │
│  │      ▼ java/             │  │  ┌────────────────────────────┐    │   │
│  │        ▼ services/       │  │  │  1  package com.app.utils; │    │   │
│  │          ✓ UserService   │  │  │  2                         │    │   │
│  │          ✓ PaymentSvc    │  │  │  3  /**                    │    │   │
│  │        ▼ utils/          │  │  │  4   * Data manager class  │    │   │
│  │          ✗ DataManager   │  │  │  5   */                    │    │   │
│  │          ✓ StringHelper  │  │  │  6  public class DataMan.. │    │   │
│  │        ▼ ui/             │  │  │  ~~~~~~~~~~~~~~~~~~~────── │    │   │
│  │          ⚠ ButtonHandler │  │  │  7                         │    │   │
│  │          ✓ MainFrame     │  │  │  8    private List data;   │    │   │
│  │        ▼ listeners/      │  │  │  9                         │    │   │
│  │          ✓ ClickListener │  │  │ 10    public void process. │    │   │
│  │                          │  │  │ 11      // ...             │    │   │
│  │                          │  │  └────────────────────────────┘    │   │
│  │                          │  │                                    │   │
│  │                          │  │  ┌────────────────────────────┐    │   │
│  │                          │  │  │ ✗ ERROR  Line 6            │    │   │
│  │                          │  │  │                            │    │   │
│  │                          │  │  │ Class name should end with │    │   │
│  │                          │  │  │ appropriate suffix         │    │   │
│  │                          │  │  │                            │    │   │
│  │                          │  │  │ Found: DataManager         │    │   │
│  │                          │  │  │ Expected: DataService,     │    │   │
│  │                          │  │  │ DataRepository, DataHelper │    │   │
│  │                          │  │  │                            │    │   │
│  │                          │  │  │ ┌────────┐  ┌───────────┐  │    │   │
│  │                          │  │  │ │ Fix    │  │ Ignore    │  │    │   │
│  │                          │  │  │ └────────┘  └───────────┘  │    │   │
│  │                          │  │  └────────────────────────────┘    │   │
│  │                          │  │                                    │   │
│  └──────────────────────────┘  └────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Componentes HeroUI utilizados:**
- `Accordion` para file tree
- `Code` para syntax highlighting
- `Card` para violation details
- `Button` para actions
- `Chip` para status (error, warning, success)
- `Divider` para separações
- `ScrollShadow` para scroll areas

---

### Tela: History

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  History                                                                │
│                                                                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────────┐ │
│  │ Today      ▼   │  │ All Types  ▼   │  │ 🔍 Search...               │ │
│  └────────────────┘  └────────────────┘  └────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │                                                            │  │   │
│  │  │  ✓  kodi check                                    14:32    │  │   │
│  │  │     142 files · 12 violations · Score: 87%                 │  │   │
│  │  │     Duration: 2.3s                                         │  │   │
│  │  │                                                            │  │   │
│  │  │     ┌────────────┐  ┌──────────────┐                       │  │   │
│  │  │     │ View Report│  │ Compare      │                       │  │   │
│  │  │     └────────────┘  └──────────────┘                       │  │   │
│  │  │                                                            │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │                                                            │  │   │
│  │  │  ⚡  kodi refactor                                 14:15    │  │   │
│  │  │     Applied: naming-conventions                            │  │   │
│  │  │     3 files modified                                       │  │   │
│  │  │                                                            │  │   │
│  │  │     ┌────────────┐  ┌──────────────┐                       │  │   │
│  │  │     │ View Diff  │  │ Revert       │                       │  │   │
│  │  │     └────────────┘  └──────────────┘                       │  │   │
│  │  │                                                            │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │                                                            │  │   │
│  │  │  🔍  kodi scan --discover                          13:45    │  │   │
│  │  │     Discovered 3 new patterns                              │  │   │
│  │  │     repository-pattern, factory-method, singleton          │  │   │
│  │  │                                                            │  │   │
│  │  │     ┌────────────┐                                         │  │   │
│  │  │     │ View Patterns│                                       │  │   │
│  │  │     └────────────┘                                         │  │   │
│  │  │                                                            │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  ◀  1  2  3  ...  12  ▶                                          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Componentes HeroUI utilizados:**
- `Select` para filtros de data e tipo
- `Input` para search
- `Card` para cada entrada do histórico
- `Button` para ações
- `Pagination` para navegação
- `Chip` para tags e status

---

### Tela: Settings

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Settings                                                               │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  General   │  LLM Provider  │  Integrations  │  About           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  Project Configuration                                           │   │
│  │                                                                  │   │
│  │  Project Name                                                    │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │ my-java-project                                            │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  Root Directory                                                  │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │ /Users/lucas/projects/my-java-project                      │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  Language                                                        │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │ Java                                                    ▼  │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  Behavior                                                        │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────┐                  │   │
│  │  │ Auto-fix on save                           │        ○────     │   │
│  │  │ Automatically apply safe fixes when saving │                  │   │
│  │  └────────────────────────────────────────────┘                  │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────┐                  │   │
│  │  │ Watch mode enabled                         │        ────○     │   │
│  │  │ Monitor file changes in real-time          │                  │   │
│  │  └────────────────────────────────────────────┘                  │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────┐                  │   │
│  │  │ Pre-commit hook                            │        ────○     │   │
│  │  │ Block commits with violations              │                  │   │
│  │  └────────────────────────────────────────────┘                  │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│                                                      ┌──────────────┐   │
│                                                      │    Save      │   │
│                                                      └──────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Componentes HeroUI utilizados:**
- `Tabs` para navegação de seções
- `Input` para campos de texto
- `Select` para dropdowns
- `Switch` para toggles
- `Card` para agrupamento
- `Button` para salvar

---

### Componentes Customizados

Além dos componentes do HeroUI, criar estes componentes específicos:

| Componente | Descrição |
|------------|-----------|
| `ScoreGauge` | Indicador circular de score (0-100%) |
| `FileTree` | Árvore de arquivos com indicadores de status |
| `CodeEditor` | Editor de código com highlighting e annotations |
| `PatternCard` | Card para exibição de padrão com ações |
| `ViolationCard` | Card de violação com diff e ações de fix |
| `ActivityItem` | Item de atividade no feed |
| `ComplianceChart` | Gráfico de evolução de compliance |

---

### Tipografia

```css
/* Fonte principal */
font-family: 'Inter', sans-serif;

/* Código */
font-family: 'JetBrains Mono', monospace;

/* Hierarquia */
--text-xs: 0.75rem;    /* 12px - captions */
--text-sm: 0.875rem;   /* 14px - secondary text */
--text-base: 1rem;     /* 16px - body */
--text-lg: 1.125rem;   /* 18px - subtitles */
--text-xl: 1.25rem;    /* 20px - titles */
--text-2xl: 1.5rem;    /* 24px - page titles */
--text-3xl: 1.875rem;  /* 30px - hero */
```

---

### Espaçamento e Grid

```css
/* Spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */

/* Layout */
--sidebar-width: 240px;
--header-height: 64px;
--content-max-width: 1200px;
```

---

### Animações

```css
/* Transitions */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Animações com Framer Motion */
- Fade in para cards e modais
- Slide para sidebar e drawers
- Scale para botões e chips no hover
- Stagger para listas
```

---

## Diferenciais para o GitHub Copilot CLI Challenge

1. **Uso intensivo do GitHub Copilot CLI** durante todo o desenvolvimento
2. **Conceito inovador** de "Documentação Ativa" que resolve um problema real
3. **Aplicação prática** para times de desenvolvimento de qualquer tamanho
4. **Stack completa e moderna** (CLI + Desktop + Dashboard + API)
5. **Extensível** para qualquer linguagem de programação

---

## Roadmap

### v0.1 (MVP para o Challenge)
- [ ] CLI com comandos: init, scan, check
- [ ] Suporte a Java
- [ ] Padrões básicos de naming e estrutura
- [ ] Dashboard com visão geral

### v0.2
- [ ] Comando generate funcional
- [ ] Watch mode com pre-commit hook
- [ ] App Electron básico
- [ ] Suporte a TypeScript

### v0.3
- [ ] Integração com LLM para geração inteligente
- [ ] Marketplace de padrões
- [ ] Integração CI/CD (GitHub Actions)
- [ ] Suporte a Python

### v1.0
- [ ] VS Code extension
- [ ] Colaboração em tempo real
- [ ] API pública
- [ ] Suporte a linguagens adicionais
