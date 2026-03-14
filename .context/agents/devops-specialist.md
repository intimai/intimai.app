---
name: Devops Specialist
description: Design and maintain CI/CD pipelines
status: unfilled
generated: 2026-03-14
---

# Devops Specialist Agent Playbook

## Mission
Describe how the devops specialist agent supports the team and when to engage it.

## Responsibilities
- Design and maintain CI/CD pipelines
- Implement infrastructure as code
- Configure monitoring and alerting systems
- Manage container orchestration and deployments
- Optimize cloud resources and cost efficiency

## Best Practices
- Automate everything that can be automated
- Implement infrastructure as code for reproducibility
- Monitor system health proactively
- Design for failure and implement proper fallbacks
- Keep security and compliance in every deployment

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `N8N/` — TODO: Describe the purpose of this directory.
- `dev-dist/` — TODO: Describe the purpose of this directory.
- `plugins/` — TODO: Describe the purpose of this directory.
- `public/` — TODO: Describe the purpose of this directory.
- `src/` — TODO: Describe the purpose of this directory.
- `supabase/` — TODO: Describe the purpose of this directory.
- `tools/` — TODO: Describe the purpose of this directory.

## Key Files
**Entry Points:**
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

## Architecture Context

### Repositories
Data access and persistence
- **Directories**: `supabase\functions\encrypt-existing-data`, `src\data`
- **Symbols**: 1 total

### Config
Configuration and constants
- **Directories**: `.`, `src\constants`, `src\config`, `plugins\visual-editor`
- **Symbols**: 1 total
- **Key exports**: [`getPopupHTMLTemplate`](plugins\visual-editor\visual-editor-config.js#L79)

### Services
Business logic and orchestration
- **Directories**: `src\lib`, `src\lib\__tests__`
- **Symbols**: 6 total
- **Key exports**: [`encryptSensitiveData`](src\lib\encryptionService.js#L7), [`decryptSensitiveData`](src\lib\encryptionService.js#L30), [`isEncrypted`](src\lib\encryptionService.js#L140), [`maskSensitiveData`](src\lib\encryptionService.js#L161)

### Utils
Shared utilities and helpers
- **Directories**: `src\lib`
- **Symbols**: 1 total
- **Key exports**: [`cn`](src\lib\utils.js#L4)

### Controllers
Request handling and routing
- **Directories**: `src\hooks`, `src\api`, `src\routes`, `src\components\session`
- **Symbols**: 1 total

### Components
UI components and views
- **Directories**: `src\components\ui`, `src\pages`, `src\components`, `src\components\session`, `src\components\dashboard`, `src\components\auth`, `src\components\dashboard\intimacao`, `src\components\dashboard\agenda`
- **Symbols**: 11 total
- **Key exports**: [`useToast`](src\components\ui\use-toast.js#L68), [`PerfilPage`](src\pages\PerfilPage.jsx#L10), [`AgendaPage`](src\pages\AgendaPage.jsx#L9), [`ThemeToggle`](src\components\ThemeToggle.jsx#L6), [`InstallPWA`](src\components\InstallPWA.jsx#L13), [`AgendaCalendar`](src\components\dashboard\AgendaCalendar.jsx#L8), [`UpdatePasswordPage`](src\components\auth\UpdatePasswordPage.jsx#L12), [`LoginForm`](src\components\auth\LoginForm.jsx#L12), [`IntimacaoItemContent`](src\components\dashboard\intimacao\IntimacaoItemContent.jsx#L6)
## Key Symbols for This Agent
- *No relevant symbols detected.*

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Glossary & Domain Concepts](../docs/glossary.md)
- [Data Flow & Integrations](../docs/data-flow.md)
- [Security & Compliance Notes](../docs/security.md)
- [Tooling & Productivity Guide](../docs/tooling.md)

## Collaboration Checklist

1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above.
4. Capture learnings back in [docs/README.md](../docs/README.md).

## Hand-off Notes

Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.
