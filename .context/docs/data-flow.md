---
status: unfilled
generated: 2026-03-14
---

# Data Flow & Integrations

Explain how data enters, moves through, and exits the system, including interactions with external services.

## Module Dependencies
- **src\lib\webhookService.js/** → `src\lib\customSupabaseClient.js`
- **src\lib\lgpdService.js/** → `src\lib\customSupabaseClient.js`, `src\lib\webhookService.js`
- **src\lib\auditService.js/** → `src\lib\customSupabaseClient.js`
- **plugins\visual-editor\vite-plugin-edit-mode.js/** → `plugins\visual-editor\visual-editor-config.js`
- **src\lib\__tests__\auditService.test.js/** → `src\lib\auditService.js`
- **src\lib\__tests__\auditService.simple.test.js/** → `src\lib\auditService.js`
- **src\main.jsx/** → `src\App.jsx`, `src\components\ui\toaster.jsx`, `src\contexts\SupabaseAuthContext.jsx`, `src\contexts\ThemeContext.jsx`, `src\index.css`
- **src\App.jsx/** → `src\components\Layout.jsx`, `src\components\session\IdleTimeoutHandler.jsx`, `src\contexts\SupabaseAuthContext.jsx`, `src\pages\AgendaPage.jsx`, `src\pages\Dashboard.jsx`, `src\pages\DireitosTitularesPage.jsx`, `src\pages\ForgotPasswordPage.jsx`, `src\pages\GlossarioPage.jsx`, `src\pages\IntimacoesPage.jsx`, `src\pages\LoginPage.jsx`, `src\pages\OrientacoesPage.jsx`, `src\pages\PerfilPage.jsx`, `src\pages\PoliticaDePrivacidadePage.jsx`, `src\pages\PrivacidadePublicaPage.jsx`, `src\pages\RegisterPage.jsx`, `src\pages\ResetPasswordPage.jsx`, `src\pages\SuportePage.jsx`, `src\pages\TermosDeUsoPage.jsx`, `src\pages\TransparenciaPage.jsx`, `src\routes\ProtectedRoute.jsx`
- **src\routes\ProtectedRoute.jsx/** → `src\components\auth\ConsentModal.jsx`, `src\contexts\SupabaseAuthContext.jsx`
- **src\pages\SuportePage.jsx/** → `src\lib\webhookService.js`
- **src\pages\ResetPasswordPage.jsx/** → `src\components\auth\UpdatePasswordPage.jsx`, `src\contexts\ThemeContext.jsx`
- **src\pages\RegisterPage.jsx/** → `src\components\auth\RegisterForm.jsx`, `src\contexts\ThemeContext.jsx`
- **src\pages\PoliticaDePrivacidadePage.jsx/** → `src\components\PrivacyPolicy.jsx`
- **src\pages\LoginPage.jsx/** → `src\components\InstallPWA.jsx`, `src\components\auth\LoginForm.jsx`, `src\contexts\ThemeContext.jsx`
- **src\pages\ForgotPasswordPage.jsx/** → `src\components\auth\ForgotPasswordForm.jsx`, `src\contexts\ThemeContext.jsx`
- **src\pages\Dashboard.jsx/** → `src\components\dashboard\CreateIntimacaoModal.jsx`, `src\components\dashboard\StatsChart.jsx`
- **src\components\Layout.jsx/** → `src\components\Sidebar.jsx`, `src\components\ThemeToggle.jsx`
- **src\components\InstallPWA.jsx/** → `src\components\ui\button.jsx`, `src\components\ui\dialog.jsx`
- **src\components\ui\Tooltip.jsx/** → `src\components\ui\TooltipContent.jsx`
- **src\components\ui\Pagination.jsx/** → `src\components\ui\button.jsx`
- **src\components\ui\InfoItem.jsx/** → `src\components\ui\Tooltip.jsx`
- **src\components\ui\CollapsibleCard.jsx/** → `src\components\ui\ExpansionButton.jsx`
- **src\components\session\IdleTimeoutHandler.jsx/** → `src\components\session\SessionTimeoutModal.jsx`
- **src\components\dashboard\StatsChart.jsx/** → `src\components\ui\TooltipContent.jsx`
- **src\components\dashboard\IntimacaoCard.jsx/** → `src\components\dashboard\ChatHistoryModal.jsx`, `src\components\dashboard\intimacao\IntimacaoItemContent.jsx`, `src\components\dashboard\intimacao\IntimacaoItemHeader.jsx`, `src\components\dashboard\intimacao\IntimacaoModalsGroup.jsx`, `src\components\ui\CollapsibleCard.jsx`, `src\components\ui\StatusLabel.jsx`
- **src\components\dashboard\AgendaCard.jsx/** → `src\components\dashboard\agenda\AgendaItemHeader.jsx`, `src\components\dashboard\agenda\AgendaModalsGroup.jsx`, `src\components\ui\CollapsibleCard.jsx`, `src\components\ui\InfoItem.jsx`
- **src\components\dashboard\AgendaCalendar.jsx/** → `src\components\dashboard\AgendaCalendar.css`
- **src\components\dashboard\intimacao\IntimacaoModalsGroup.jsx/** → `src\components\dashboard\ReativarIntimacaoModal.jsx`, `src\components\ui\ConfirmationModal.jsx`
- **src\components\dashboard\intimacao\IntimacaoItemHeader.jsx/** → `src\components\ui\StatusLabel.jsx`
- **src\components\dashboard\intimacao\IntimacaoItemContent.jsx/** → `src\components\ui\InfoItem.jsx`
- **src\components\dashboard\agenda\AgendaModalsGroup.jsx/** → `src\components\ui\ConfirmationModal.jsx`
- **src\components\dashboard\agenda\AgendaItemHeader.jsx/** → `src\components\dashboard\agenda\AgendaItemActions.jsx`
- **src\components\dashboard\agenda\AgendaItemActions.jsx/** → `src\components\dashboard\agenda\AgendaAttendanceControl.jsx`

## Service Layer
- *No service classes detected.*

## High-level Flow

Summarize the primary pipeline from input to output. Reference diagrams or embed Mermaid definitions when available.

## Internal Movement

Describe how modules within `ANALISE_TECNICA.md`, `backup_supabase_guide.md`, `configurar_email_confirmacao.sql`, `configurar_templates_email_supabase.sql`, `consulta_duplicada_edgeFunction.ts`, `criar_tabela_email_templates.sql`, `CRIPTOGRAFIA_SETUP.md`, `dev-dist`, `er.name`, `handle-webhook-corrected.ts`, `index.html`, `INSTALL_CHAT_FEATURE.md`, `LGPD_E_SEGURANCA.md`, `LOGS_CONFIRMACAO_IDENTIDADE.md`, `N8N`, `package-lock.json`, `package.json`, `plugins`, `postcss.config.js`, `Prd App Intimacoes.pdf`, `preparar_ambiente_testes.sql`, `public`, `rc`, `REGRAS_DE_NEGOCIO.md`, `ROADMAP_E_ANALISE_DE_ESCALABILIDADE.md`, `scripts_consolidado_supabase.sql`, `SETUP_CONEXAO_WHATSAPP.md`, `src`, `supabase`, `supabase_cron_job.sql`, `supabase-schema-utqtxfgmartcznacksnm.png`, `tailwind.config.js`, `tools`, `vercel.json`, `verificar_rls_supabase.sql`, `vite.config.js`, `vitest.config.js` collaborate (queues, events, RPC calls, shared databases).

## External Integrations

Document each integration with purpose, authentication, payload shapes, and retry strategy.

## Observability & Failure Modes

Describe metrics, traces, or logs that monitor the flow. Note backoff, dead-letter, or compensating actions when downstream systems fail.
