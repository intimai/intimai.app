-- Fase 1: Criar a Função SQL para atualizar o status das intimações
-- Copie e cole este código no SQL Editor do seu projeto Supabase e clique em RUN.

CREATE OR REPLACE FUNCTION update_intimacoes_status()
RETURNS void AS $$
BEGIN
  UPDATE intimacoes
  SET status = 'finalizada'
  WHERE
    status = 'agendada' AND
    (dataAgendada + horaAgendada) < (now() AT TIME ZONE 'America/Sao_Paulo');
END;
$$ LANGUAGE plpgsql;

-- Fase 2: Agendar a execução da função a cada hora
-- Após executar o código acima com sucesso, copie e cole este segundo bloco e clique em RUN.
-- Este comando agenda a função para ser executada no início de cada hora.

SELECT cron.schedule(
  'update-intimacoes-status-job', -- nome do job
  '0 * * * *', -- cron schedule: executa a cada hora, no minuto 0
  $$ SELECT update_intimacoes_status(); $$ -- comando a ser executado
);

-- Para verificar se o job foi agendado com sucesso (opcional):
-- SELECT * FROM cron.job;

-- Para remover o agendamento (caso necessário no futuro):
-- SELECT cron.unschedule('update-intimacoes-status-job');