# Documentação de Segurança e Conformidade com a LGPD - IntimAI

Este documento serve como um guia e checklist para as práticas de segurança e conformidade com a Lei Geral de Proteção de Dados (LGPD) no projeto IntimAI.

## 1. Controle de Acesso

| Status | Item | Próximos Passos |
| :---: | :--- | :--- |
| ✅ Concluído | **Controle de Acesso Baseado em Função (RBAC)** | Foram implementadas políticas de segurança em nível de linha (Row Level Security - RLS) no Supabase para a tabela `intimacoes`. Cada usuário agora só pode visualizar, criar, atualizar e deletar suas próprias intimações, garantindo o isolamento dos dados. |
| ✅ Concluído | **Autenticação Segura** | O sistema utiliza o provedor de autenticação do Supabase, que gerencia o login e a segurança das senhas. |

## 2. Segurança de Dados

| Status | Item | Próximos Passos |
| :---: | :--- | :--- |
| ✅ Concluído | **Minimização de Dados** | As queries ao banco de dados foram refatoradas para especificar apenas as colunas necessárias, evitando o uso de `select('*')`. |
| ✅ Concluído | **Comunicação Criptografada** | O Supabase utiliza HTTPS por padrão, garantindo que a comunicação entre o cliente e o servidor seja criptografada. |
| ❌ Pendente | **Tratamento de Dados Sensíveis** | Identificar e classificar todos os dados pessoais coletados. Garantir que dados sensíveis (como documentos) sejam armazenados com criptografia adicional, se necessário. |

## 3. Conformidade com a LGPD

| Status | Item | Próximos Passos |
| :---: | :--- | :--- |
| ❌ Pendente | **Consentimento do Usuário** | Implementar um mecanismo claro para obter o consentimento dos usuários para a coleta e processamento de seus dados. |
| ❌ Pendente | **Direitos dos Titulares** | Criar funcionalidades que permitam aos usuários exercerem seus direitos, como acesso, correção e exclusão de seus dados. |
| ✅ Concluído | **Política de Privacidade** | Foi criado o arquivo `POLITICA_DE_PRIVACIDADE.md`, uma página na aplicação (`/politica-de-privacidade`) para exibi-la e um link na barra de navegação para fácil acesso. |

### 🎯 **ROADMAP LGPD ESPECÍFICO PARA INTIMAI**

#### **FASE 1: TRANSPARÊNCIA E ACESSO PÚBLICO** (Prioridade Alta)
| Status | Item | Descrição |
| :---: | :--- | :--- |
| ✅ Concluído | **Política Pública de Privacidade** | Criar página pública `/privacidade` acessível sem login, específica para intimados e público geral |
| ✅ Concluído | **Portal de Transparência** | Página `/transparencia` explicando tratamento de dados de terceiros (intimados) |
| ✅ Concluído | **Canal de Direitos dos Titulares** | Página `/direitos-titulares` para intimados exercerem direitos LGPD |
| ❌ Pendente | **Aviso de Transparência** | Modal no primeiro acesso dos policiais explicando responsabilidades |

#### **FASE 2: CONTROLE E GESTÃO DE DADOS** (Prioridade Média)
| Status | Item | Descrição |
| :---: | :--- | :--- |
| ❌ Pendente | **Formulário de Solicitações** | Sistema para intimados solicitarem acesso, correção ou exclusão de dados |
| ❌ Pendente | **Processo de Verificação** | Sistema de confirmação de identidade para solicitações de terceiros |
| ❌ Pendente | **Fluxo de Atendimento** | Processo interno para atender solicitações LGPD |
| 🔄 Em Progresso | **Logs de Auditoria** | Sistema completo de logs para demonstrar conformidade |
| ✅ Concluído | **Logs Básicos** | ETAPA 1: Logs de ações críticas (criar/cancelar/reativar) |
| ❌ Pendente | **Logs Avançados** | ETAPA 2: Logs de acesso e visualização de dados |
| ❌ Pendente | **Dashboard de Auditoria** | ETAPA 3: Interface administrativa para logs |
| ❌ Pendente | **Sistema de Roles** | Implementar roles (admin, policial) para controle de acesso |
| ❌ Pendente | **Painel Administrativo** | Interface completa para administradores |
| ❌ Pendente | **Gestão de Delegacias** | CRUD de delegacias e visualização de usuários |
| ❌ Pendente | **Controle de Planos** | Limite de usuários por plano contratado |
| ✅ Concluído | **Testes de Auditoria** | ETAPA 4A: Testes unitários básicos (30-45min) |
| ❌ Pendente | **Testes Integração** | ETAPA 4B: Testes de integração completos (2-3h) |

#### **FASE 3: SEGURANÇA AVANÇADA** (Prioridade Alta)
| Status | Item | Descrição |
| :---: | :--- | :--- |
| 🔄 Em Progresso | **Criptografia de Dados Críticos** | Criptografia de CPF, telefone e dados sensíveis |
| ❌ Pendente | **Controle de Acesso Granular** | Sistema de roles específicos (policial, supervisor, admin, auditor) |
| ❌ Pendente | **Painel Administrativo** | Interface completa para administradores |
| ❌ Pendente | **Gestão de Delegacias** | CRUD de delegacias e visualização de usuários |
| ❌ Pendente | **Controle de Planos** | Limite de usuários por plano contratado |
| ❌ Pendente | **Evolution API Integration** | Menu de conexão WhatsApp com QR Code e responsabilização |
| ❌ Pendente | **Dashboard de Compliance** | Interface para monitoramento de conformidade LGPD |

#### **FASE 4: TEMPLATES E COMUNICAÇÃO** (Prioridade Baixa)
| Status | Item | Descrição |
| :---: | :--- | :--- |
| ❌ Pendente | **Template Email Confirmação** | HTML para confirmação de cadastro por email |

### 📋 **CONTEXTO ESPECÍFICO DO SISTEMA**
- **Base Legal**: Art. 7º, III LGPD (execução de políticas públicas)
- **Titulares**: Intimados (terceiros)
- **Controladores**: Instituições policiais  
- **Operadores**: Policiais civis (usuários do sistema)
- **Finalidade**: Entrega de intimações e agendamento de oitivas

### 🔒 **CONSIDERAÇÕES DE SEGURANÇA**
- **Dados Sensíveis**: CPF, telefone, números de processo
- **Acesso Admin**: Necessário para manutenção, mas deve ser controlado
- **Criptografia Híbrida**: Dados críticos criptografados + acesso granular
- **Auditoria**: Logs completos para demonstração de conformidade

## 4. Práticas de Desenvolvimento Seguro

| Status | Item | Próximos Passos |
| :---: | :--- | :--- |
| ✅ Concluído | **Validação no Backend** | A lógica de negócio crítica (como cancelamento de intimações) é validada no backend através das funções do Supabase, e não apenas no frontend. |
| ✅ Concluído | **Prevenção de Cross-Site Scripting (XSS)** | O React, por padrão, escapa o conteúdo renderizado, o que ajuda a prevenir ataques de XSS. |
| ✅ Concluído | **Validação de Entrada no Frontend** | Os formulários, como o de criação de intimação, utilizam `zod` e `react-hook-form` para validar o formato, tipo e regras dos dados inseridos pelo usuário antes de serem enviados ao servidor. |
| ✅ Concluído | **Gerenciamento de Dependências** | As dependências do projeto foram auditadas e atualizadas com `npm audit fix` para corrigir vulnerabilidades conhecidas. |

---

**Legenda:**
- ✅ **Concluído:** Implementado e funcional.
- 🟡 **Parcial:** Em andamento ou parcialmente implementado.
- ❌ **Pendente:** Não iniciado.