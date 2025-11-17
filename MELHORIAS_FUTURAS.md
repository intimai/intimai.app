# Plano de Melhorias Futuras - IntimAI

Este documento descreve as próximas funcionalidades e melhorias planejadas para a plataforma IntimAI.

## 1. Gerenciamento de Conexão do WhatsApp (Evolution API)

**Objetivo:** Permitir que usuários de uma delegacia verifiquem o status da conexão com a Evolution API e gerem um novo QR Code para reconexão, de forma autônoma e segura.

**Justificativa:** A desconexão da instância do WhatsApp é um ponto crítico de falha que atualmente exige intervenção manual do suporte. Dar autonomia aos usuários para resolverem o problema agiliza o processo e aumenta a resiliência do sistema de envio de intimações.

### Arquitetura Proposta

A implementação será dividida em duas partes principais: uma nova interface no front-end e uma Edge Function segura no Supabase para intermediar a comunicação.

#### a) Front-end (Nova Página: "Conexão WhatsApp")

-   **Localização:** Adicionar um novo item de menu no `Sidebar.jsx` que levará a uma nova página, por exemplo, `src/pages/ConexaoWhatsappPage.jsx`.
-   **Componentes da Página:**
    -   **Indicador de Status:** Um componente visual (ex: um badge com ícone) que mostrará o status atual da conexão (`Conectado`, `Desconectado`, `Verificando...`).
    -   **Botão de Ação Principal:**
        -   Se o status for `Desconectado`, o botão será "Gerar QR Code".
        -   Se o status for `Conectado`, o botão pode ser "Atualizar Status" ou ficar desabilitado.
    -   **Área de Exibição do QR Code:** Um container que ficará visível apenas quando um QR Code for gerado, mostrando a imagem para escaneamento.
    -   **Informações Adicionais:** Exibir a data/hora da última verificação de status.

#### b) Back-end (Supabase Edge Function: `manage-evolution-instance`)

-   **Criação:** Criar uma nova função em `supabase/functions/manage-evolution-instance/index.ts`.
-   **Segurança:**
    -   A função **NUNCA** retornará as chaves da API (`evoInstancia`, `evoAPI`) para o cliente.
    -   A função será invocada pelo front-end com o token de autenticação do usuário logado.
    -   A lógica interna da função usará o `user_id` do token para identificar a `delegaciaId` correspondente.
    -   As credenciais da Evolution API serão lidas da tabela `delegacias` usando a `delegaciaId` e a `service_role_key` do Supabase, garantindo que um usuário só possa acessar as credenciais de sua própria delegacia.
-   **Funcionalidades (Ações):** A função aceitará um payload JSON para determinar a ação a ser executada.
    -   **`{ "action": "get_status" }`**:
        1.  Busca as credenciais da delegacia.
        2.  Faz uma requisição para o endpoint de status da instância na Evolution API.
        3.  Retorna uma resposta simples para o front-end, como `{"status": "CONNECTED"}`.
    -   **`{ "action": "get_qrcode" }`**:
        1.  Busca as credenciais da delegacia.
        2.  Faz uma requisição para o endpoint de QR Code da instância na Evolution API.
        3.  A Evolution API retorna o QR Code (geralmente em formato base64).
        4.  A função repassa essa string base64 para o front-end.
    -   **`{ "action": "logout_instance" }`** (Opcional, para futuras melhorias):
        1.  Permitiria desconectar a instância remotamente.

### Fluxo de Interação

1.  Usuário clica em "Conexão WhatsApp" no menu.
2.  A página é carregada e imediatamente dispara uma chamada para a Edge Function com `action: "get_status"`.
3.  O front-end exibe o status recebido.
4.  Se desconectado, o usuário clica em "Gerar QR Code".
5.  O front-end chama a Edge Function com `action: "get_qrcode"`.
6.  A função retorna a imagem do QR Code em base64.
7.  O front-end renderiza a imagem para o usuário escanear com o celular.
8.  O front-end pode iniciar um processo de polling (verificar o status a cada X segundos) para atualizar a interface automaticamente assim que a conexão for estabelecida.

---