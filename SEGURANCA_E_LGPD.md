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
| ✅ Concluído | **Política de Privacidade** | Foi criado o arquivo `POLITICA_DE_PRIVACIDADE.md`, uma página na aplicação (`/privacy-policy`) para exibi-la e um link na barra de navegação para fácil acesso. |

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