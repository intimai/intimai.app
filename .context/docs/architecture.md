---
status: unfilled
generated: 2026-03-14
---

# Architecture Notes

Describe how the system is assembled and why the current design exists.

## System Architecture Overview

Summarize the top-level topology (monolith, modular service, microservices) and deployment model. Highlight how requests traverse the system and where control pivots between layers.

## Architectural Layers
### Repositories
Data access and persistence
- **Directories**: `supabase\functions\encrypt-existing-data`, `src\data`
- **Symbols**: 1 total, 0 exported

### Config
Configuration and constants
- **Directories**: `.`, `src\constants`, `src\config`, `plugins\visual-editor`
- **Symbols**: 1 total, 1 exported
- **Key exports**:
  - [`getPopupHTMLTemplate`](plugins\visual-editor\visual-editor-config.js#L79) (function)

### Services
Business logic and orchestration
- **Directories**: `src\lib`, `src\lib\__tests__`
- **Symbols**: 6 total, 4 exported
- **Key exports**:
  - [`encryptSensitiveData`](src\lib\encryptionService.js#L7) (function)
  - [`decryptSensitiveData`](src\lib\encryptionService.js#L30) (function)
  - [`isEncrypted`](src\lib\encryptionService.js#L140) (function)
  - [`maskSensitiveData`](src\lib\encryptionService.js#L161) (function)

### Utils
Shared utilities and helpers
- **Directories**: `src\lib`
- **Symbols**: 1 total, 1 exported
- **Key exports**:
  - [`cn`](src\lib\utils.js#L4) (function)

### Controllers
Request handling and routing
- **Directories**: `src\hooks`, `src\api`, `src\routes`, `src\components\session`
- **Symbols**: 1 total, 0 exported → depends on: Components

### Components
UI components and views
- **Directories**: `src\components\ui`, `src\pages`, `src\components`, `src\components\session`, `src\components\dashboard`, `src\components\auth`, `src\components\dashboard\intimacao`, `src\components\dashboard\agenda`
- **Symbols**: 11 total, 9 exported
- **Key exports**:
  - [`useToast`](src\components\ui\use-toast.js#L68) (function)
  - [`PerfilPage`](src\pages\PerfilPage.jsx#L10) (function)
  - [`AgendaPage`](src\pages\AgendaPage.jsx#L9) (function)
  - [`ThemeToggle`](src\components\ThemeToggle.jsx#L6) (function)
  - [`InstallPWA`](src\components\InstallPWA.jsx#L13) (function)
  - [`AgendaCalendar`](src\components\dashboard\AgendaCalendar.jsx#L8) (function)
  - [`UpdatePasswordPage`](src\components\auth\UpdatePasswordPage.jsx#L12) (function)
  - [`LoginForm`](src\components\auth\LoginForm.jsx#L12) (function)
  - [`IntimacaoItemContent`](src\components\dashboard\intimacao\IntimacaoItemContent.jsx#L6) (function)


## Detected Design Patterns
- *No design patterns detected yet.*

## Entry Points
- [`..\..\..\supabase\functions\manage-evolution-instance\index.ts`](..\..\..\supabase\functions\manage-evolution-instance\index.ts)
- [`..\..\..\supabase\functions\lgpd-webhook\index.ts`](..\..\..\supabase\functions\lgpd-webhook\index.ts)
- [`..\..\..\supabase\functions\handle-webhook\index.ts`](..\..\..\supabase\functions\handle-webhook\index.ts)
- [`..\..\..\supabase\functions\get-decrypted-intimacao-details\index.ts`](..\..\..\supabase\functions\get-decrypted-intimacao-details\index.ts)
- [`..\..\..\supabase\functions\encrypt-existing-data\index.ts`](..\..\..\supabase\functions\encrypt-existing-data\index.ts)
- [`..\..\..\supabase\functions\dynamic-action\index.ts`](..\..\..\supabase\functions\dynamic-action\index.ts)
- [`..\..\..\supabase\functions\create-intimacao-with-check\index.ts`](..\..\..\supabase\functions\create-intimacao-with-check\index.ts)
- [`..\..\..\supabase\functions\check-telefone\index.ts`](..\..\..\supabase\functions\check-telefone\index.ts)
- [`..\..\..\supabase\functions\cancel-expired-intimations\index.ts`](..\..\..\supabase\functions\cancel-expired-intimations\index.ts)
- [`..\..\..\src\constants\index.js`](..\..\..\src\constants\index.js)
- [`..\..\..\src\main.jsx`](..\..\..\src\main.jsx)

## Public API
| Symbol | Type | Location |
| --- | --- | --- |
| [`AgendaCalendar`](src\components\dashboard\AgendaCalendar.jsx#L8) | function | src\components\dashboard\AgendaCalendar.jsx:8 |
| [`AgendaPage`](src\pages\AgendaPage.jsx#L9) | function | src\pages\AgendaPage.jsx:9 |
| [`cn`](src\lib\utils.js#L4) | function | src\lib\utils.js:4 |
| [`decryptSensitiveData`](src\lib\encryptionService.js#L30) | function | src\lib\encryptionService.js:30 |
| [`encryptSensitiveData`](src\lib\encryptionService.js#L7) | function | src\lib\encryptionService.js:7 |
| [`getPopupHTMLTemplate`](plugins\visual-editor\visual-editor-config.js#L79) | function | plugins\visual-editor\visual-editor-config.js:79 |
| [`inlineEditDevPlugin`](plugins\visual-editor\vite-plugin-edit-mode.js#L9) | function | plugins\visual-editor\vite-plugin-edit-mode.js:9 |
| [`inlineEditPlugin`](plugins\visual-editor\vite-plugin-react-inline-editor.js#L49) | function | plugins\visual-editor\vite-plugin-react-inline-editor.js:49 |
| [`InstallPWA`](src\components\InstallPWA.jsx#L13) | function | src\components\InstallPWA.jsx:13 |
| [`IntimacaoItemContent`](src\components\dashboard\intimacao\IntimacaoItemContent.jsx#L6) | function | src\components\dashboard\intimacao\IntimacaoItemContent.jsx:6 |
| [`isEncrypted`](src\lib\encryptionService.js#L140) | function | src\lib\encryptionService.js:140 |
| [`LoginForm`](src\components\auth\LoginForm.jsx#L12) | function | src\components\auth\LoginForm.jsx:12 |
| [`maskSensitiveData`](src\lib\encryptionService.js#L161) | function | src\lib\encryptionService.js:161 |
| [`PerfilPage`](src\pages\PerfilPage.jsx#L10) | function | src\pages\PerfilPage.jsx:10 |
| [`ThemeProvider`](src\contexts\ThemeContext.jsx#L5) | function | src\contexts\ThemeContext.jsx:5 |
| [`ThemeToggle`](src\components\ThemeToggle.jsx#L6) | function | src\components\ThemeToggle.jsx:6 |
| [`UpdatePasswordPage`](src\components\auth\UpdatePasswordPage.jsx#L12) | function | src\components\auth\UpdatePasswordPage.jsx:12 |
| [`useConfirmationModal`](src\hooks\useConfirmationModal.js#L11) | function | src\hooks\useConfirmationModal.js:11 |
| [`useDebounce`](src\hooks\useDebounce.js#L11) | function | src\hooks\useDebounce.js:11 |
| [`useIntimacoes`](src\hooks\useIntimacoes.js#L8) | function | src\hooks\useIntimacoes.js:8 |
| [`useMultipleModals`](src\hooks\useConfirmationModal.js#L52) | function | src\hooks\useConfirmationModal.js:52 |
| [`useToast`](src\components\ui\use-toast.js#L68) | function | src\components\ui\use-toast.js:68 |

## Internal System Boundaries

Document seams between domains, bounded contexts, or service ownership. Note data ownership, synchronization strategies, and shared contract enforcement.

## External Service Dependencies

List SaaS platforms, third-party APIs, or infrastructure services the system relies on. Describe authentication methods, rate limits, and failure considerations for each dependency.

## Key Decisions & Trade-offs

Summarize architectural decisions, experiments, or ADR outcomes that shape the current design. Reference supporting documents and explain why selected approaches won over alternatives.

## Diagrams

Link architectural diagrams or add mermaid definitions here.

## Risks & Constraints

Document performance constraints, scaling considerations, or external system assumptions.

## Top Directories Snapshot
- `ANALISE_TECNICA.md/` — approximately 1 files
- `backup_supabase_guide.md/` — approximately 1 files
- `configurar_email_confirmacao.sql/` — approximately 1 files
- `configurar_templates_email_supabase.sql/` — approximately 1 files
- `consulta_duplicada_edgeFunction.ts/` — approximately 1 files
- `criar_tabela_email_templates.sql/` — approximately 1 files
- `CRIPTOGRAFIA_SETUP.md/` — approximately 1 files
- `dev-dist/` — approximately 2 files
- `er.name/` — approximately 1 files
- `handle-webhook-corrected.ts/` — approximately 1 files
- `index.html/` — approximately 1 files
- `INSTALL_CHAT_FEATURE.md/` — approximately 1 files
- `LGPD_E_SEGURANCA.md/` — approximately 1 files
- `LOGS_CONFIRMACAO_IDENTIDADE.md/` — approximately 1 files
- `N8N/` — approximately 3 files
- `package-lock.json/` — approximately 1 files
- `package.json/` — approximately 1 files
- `plugins/` — approximately 4 files
- `postcss.config.js/` — approximately 1 files
- `Prd App Intimacoes.pdf/` — approximately 1 files
- `preparar_ambiente_testes.sql/` — approximately 1 files
- `public/` — approximately 14 files
- `rc/` — approximately 1 files
- `REGRAS_DE_NEGOCIO.md/` — approximately 1 files
- `ROADMAP_E_ANALISE_DE_ESCALABILIDADE.md/` — approximately 1 files
- `scripts_consolidado_supabase.sql/` — approximately 1 files
- `SETUP_CONEXAO_WHATSAPP.md/` — approximately 1 files
- `src/` — approximately 97 files
- `supabase/` — approximately 9 files
- `supabase_cron_job.sql/` — approximately 1 files
- `supabase-schema-utqtxfgmartcznacksnm.png/` — approximately 1 files
- `tailwind.config.js/` — approximately 1 files
- `tools/` — approximately 1 files
- `vercel.json/` — approximately 1 files
- `verificar_rls_supabase.sql/` — approximately 1 files
- `vite.config.js/` — approximately 1 files
- `vitest.config.js/` — approximately 1 files

## Related Resources

- [Project Overview](./project-overview.md)
- Update [agents/README.md](../agents/README.md) when architecture changes.
