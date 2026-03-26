# Registro de Software - INPI

Este documento registra os detalhes da versão do software **IntimAI (Horizons)** preparada para o registro no INPI.

## Detalhes do Registro
- **Data da Geração**: 26 de março de 2026
- **Arquivo Gerado**: `IntimAI_INPI_Registro.zip`
- **Hash SHA-256 (Hexadecimal)**: `2287E5BDBB905038ED1139BD8B0E4EB68DE8A88A6E977914FD203F50E8CA462C`
- **Versão do Código (Commit)**: `1daf599d76de5acaa78bc7e5b03373cd07b326d8`

## Conteúdo do Arquivo ZIP
O arquivo contém o código-fonte essencial e a lógica de automação, incluindo:
- `/src`: Interface e lógica do front-end (React/JSX).
- `/supabase`: Configurações de banco de dados e Edge Functions (TypeScript/SQL).
- `/N8N/Fluxos`: 9 fluxos de automação (arquivos JSON).
- `/public`: Ativos públicos.
- Arquivos de configuração: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vitest.config.js`, `index.html`.
- Documentação técnica complementar (`.md`).

## Instruções para Verificação
Para verificar a integridade do arquivo no futuro, utilize o comando:
```powershell
Get-FileHash -Path .\IntimAI_INPI_Registro.zip -Algorithm SHA256
```
O resultado deve ser idêntico ao hash registrado acima.
