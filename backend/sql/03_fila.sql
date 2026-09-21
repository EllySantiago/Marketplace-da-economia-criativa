-- ============================================================================
-- [FCCPD — Etapa 2] A FILA ASSÍNCRONA
--
-- A tabela `evento_assincrono` já existia no DDL da equipe (docs/Origem_DDL.md)
-- com o essencial: tipo, payload, status, criado_em, processado_em. Este
-- arquivo acrescenta o que falta para ela ser uma FILA CONFIÁVEL, e não apenas
-- um log de eventos.
--
-- Por que uma tabela do próprio Postgres, e não Redis/RabbitMQ/BullMQ?
--   1. A tabela já fazia parte da modelagem entregue pela equipe.
--   2. Não sobe nenhum serviço a mais: um único banco, um único backup.
--   3. E o principal: retry, ack, idempotência e dead-letter ficam escritos em
--      SQL visível, em vez de escondidos dentro de uma biblioteca. Na defesa
--      oral, "o ack é este UPDATE aqui" vale mais que "a biblioteca faz".
--
-- Todos os comandos usam IF NOT EXISTS: rodar este arquivo duas vezes não dá
-- erro. (O docker-compose só executa a pasta sql/ na PRIMEIRA subida do volume;
-- num banco que já estava de pé, aplicamos este arquivo à mão.)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Colunas que transformam a tabela em fila
-- ----------------------------------------------------------------------------
ALTER TABLE evento_assincrono
  -- Quantas vezes este job JÁ foi entregue a um worker. É o contador que o
  -- backoff usa para calcular a espera e que decide quando desistir.
  ADD COLUMN IF NOT EXISTS tentativas         INT NOT NULL DEFAULT 0,

  -- Teto de tentativas. Passou disso, o job vira 'morto' (dead-letter) em vez
  -- de ficar tentando para sempre e entupindo a fila.
  ADD COLUMN IF NOT EXISTS max_tentativas     INT NOT NULL DEFAULT 4,

  -- A HORA A PARTIR DA QUAL o job pode ser pego. É isto que implementa o
  -- BACKOFF EXPONENCIAL: ao falhar, empurramos esta data para frente
  -- (2s, 4s, 8s, 16s). Enquanto now() < disponivel_em, o worker nem enxerga o
  -- job. Uma fila com "hora de liberação" chama-se fila com agendamento.
  ADD COLUMN IF NOT EXISTS disponivel_em      TIMESTAMP NOT NULL DEFAULT now(),

  -- CHAVE DE IDEMPOTÊNCIA: identifica o EFEITO desejado, não o job.
  -- Ex.: 'notificar-comprador:42' = "o comprador do pedido 42 deve ser avisado".
  -- Com UNIQUE, uma segunda tentativa de enfileirar a mesma coisa é recusada
  -- pelo banco — não por um `if` da aplicação, que duas requisições simultâneas
  -- conseguiriam furar (seria o mesmo check-then-act da Etapa 1!).
  ADD COLUMN IF NOT EXISTS chave_idempotencia VARCHAR(160),

  -- Mensagem de erro da última falha. Sem isso, um job em 'morto' é um mistério.
  ADD COLUMN IF NOT EXISTS ultimo_erro        TEXT,

  -- Quando o status mudou pela última vez. Usado para achar jobs ÓRFÃOS: um
  -- worker que morre de repente deixa o job preso em 'processando' para sempre;
  -- o worker seguinte usa esta data para perceber isso e devolver o job à fila.
  ADD COLUMN IF NOT EXISTS atualizado_em      TIMESTAMP NOT NULL DEFAULT now();

-- A garantia de idempotência propriamente dita. É uma constraint de banco:
-- vale para TODOS os processos da aplicação ao mesmo tempo, inclusive em
-- réplicas diferentes — exatamente o argumento da Etapa 1 contra o mutex em
-- memória. Índice UNIQUE parcial: jobs sem chave (NULL) não disputam nada.
CREATE UNIQUE INDEX IF NOT EXISTS uq_evento_chave_idempotencia
  ON evento_assincrono (chave_idempotencia)
  WHERE chave_idempotencia IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 2. Índices de consumo
-- ----------------------------------------------------------------------------
-- O worker faz sempre a mesma pergunta: "quais jobs prontos para rodar, do mais
-- antigo para o mais novo?". Índice PARCIAL (com WHERE) = o índice só guarda as
-- linhas que interessam. Depois de 200 mil jobs processados, ele continua
-- pequeno, porque só indexa os que ainda estão na fila.
CREATE INDEX IF NOT EXISTS idx_evento_prontos
  ON evento_assincrono (disponivel_em, id)
  WHERE status IN ('pendente', 'falha');

-- Índice para a varredura de jobs órfãos (presos em 'processando').
CREATE INDEX IF NOT EXISTS idx_evento_em_processamento
  ON evento_assincrono (atualizado_em)
  WHERE status = 'processando';

-- ----------------------------------------------------------------------------
-- 3. Idempotência no EFEITO, não só no job
-- ----------------------------------------------------------------------------
-- Detalhe que é fácil errar: a chave única em evento_assincrono impede
-- ENFILEIRAR o mesmo job duas vezes. Ela NÃO impede o mesmo job de ser
-- EXECUTADO duas vezes — e ele pode ser, porque a garantia da fila é
-- at-least-once (o worker pode terminar o trabalho e cair antes de dar o ack).
--
-- Então o efeito final também precisa de uma trava. A tabela `notificacao` do
-- DDL não tinha como distinguir "a mesma notificação de novo" de "outra
-- notificação igual", então [FCCPD] acrescenta a mesma chave aqui. O INSERT do
-- worker usa ON CONFLICT DO NOTHING: rodar duas vezes cria UMA notificação.
ALTER TABLE notificacao
  ADD COLUMN IF NOT EXISTS chave_idempotencia VARCHAR(160);

CREATE UNIQUE INDEX IF NOT EXISTS uq_notificacao_chave_idempotencia
  ON notificacao (chave_idempotencia)
  WHERE chave_idempotencia IS NOT NULL;
