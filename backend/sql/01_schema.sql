-- ============================================================================
-- Origem — schema PostgreSQL
--
-- Este arquivo é a execução real do DDL modelado pela equipe em
-- docs/Origem_DDL.md. Nada foi reinventado: as tabelas, tipos e índices são os
-- mesmos. O que esta entrega (FCCPD) acrescenta está marcado com [FCCPD].
--
-- Destaque para a entrega de concorrência:
--   produto.estoque INT NOT NULL DEFAULT 0 CHECK (estoque >= 0)
--   ^ a constraint CHECK é a "rede de proteção" no nível do banco: nenhum
--     caminho de código consegue deixar o estoque negativo. Ela NÃO evita
--     overselling por si só (ver RELATORIO.md) — quem evita é o UPDATE
--     condicional em src/checkout-seguro.js. As duas camadas se somam.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Tipos enumerados
-- ----------------------------------------------------------------------------
CREATE TYPE perfil_usuario       AS ENUM ('comprador','artesao','administrador');
CREATE TYPE status_produto       AS ENUM ('ativo','inativo');
CREATE TYPE status_pedido        AS ENUM ('pendente','confirmado','em_producao','enviado','entregue','cancelado');
CREATE TYPE status_pagamento     AS ENUM ('aprovado','recusado');
CREATE TYPE status_classificacao AS ENUM ('aprovado','revisao');
CREATE TYPE status_imagem        AS ENUM ('disponivel','indisponivel','processando');

-- status_evento é o estado de um job na fila assíncrona (Etapa 2).
-- O DDL original previa ('pendente','processado','falha'); [FCCPD] acrescenta
-- 'processando' (job entregue a um worker, ainda sem ack) e 'morto'
-- (dead-letter: estourou todas as tentativas).
CREATE TYPE status_evento AS ENUM ('pendente','processando','processado','falha','morto');

-- ----------------------------------------------------------------------------
-- 2. Núcleo: usuário, artesão e catálogo
-- ----------------------------------------------------------------------------
CREATE TABLE usuario (
    id            BIGSERIAL PRIMARY KEY,
    nome          VARCHAR(150) NOT NULL,
    email         VARCHAR(180) NOT NULL UNIQUE,
    senha_hash    VARCHAR(255) NOT NULL,
    perfil        perfil_usuario NOT NULL DEFAULT 'comprador',
    criado_em     TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE regiao (
    id    SERIAL PRIMARY KEY,
    nome  VARCHAR(100) NOT NULL,
    polo  VARCHAR(100) NOT NULL,
    UNIQUE (nome, polo)
);

CREATE TABLE artesao (
    usuario_id   BIGINT PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    nome_atelie  VARCHAR(150) NOT NULL,
    descricao    TEXT,
    regiao_id    INT NOT NULL REFERENCES regiao(id),
    criado_em    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE categoria (
    id    SERIAL PRIMARY KEY,
    nome  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE tecnica (
    id    SERIAL PRIMARY KEY,
    nome  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE produto (
    id            BIGSERIAL PRIMARY KEY,
    artesao_id    BIGINT NOT NULL REFERENCES artesao(usuario_id),
    categoria_id  INT NOT NULL REFERENCES categoria(id),
    tecnica_id    INT NOT NULL REFERENCES tecnica(id),
    regiao_id     INT NOT NULL REFERENCES regiao(id),
    nome          VARCHAR(150) NOT NULL,
    descricao     TEXT,
    preco         NUMERIC(10,2) NOT NULL CHECK (preco >= 0),

    -- >>> O CAMPO CENTRAL DESTA ENTREGA <<<
    -- CHECK (estoque >= 0): rede de proteção no nível do banco. Qualquer
    -- comando que tentasse gravar um valor negativo é rejeitado e a transação
    -- inteira é desfeita, não importa qual código o enviou.
    estoque       INT NOT NULL DEFAULT 0 CHECK (estoque >= 0),

    status        status_produto NOT NULL DEFAULT 'ativo',
    criado_em     TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE produto_imagem (
    id                  BIGSERIAL PRIMARY KEY,
    produto_id          BIGINT NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
    chave_armazenamento VARCHAR(300) NOT NULL,
    content_type        VARCHAR(50)  NOT NULL,
    hash_sha256         CHAR(64),
    status              status_imagem NOT NULL DEFAULT 'disponivel',
    verificado_em       TIMESTAMP,
    ordem               SMALLINT NOT NULL DEFAULT 0,
    UNIQUE (produto_id, hash_sha256)
);

-- ----------------------------------------------------------------------------
-- 3. Carrinho, pedido e pagamento
-- ----------------------------------------------------------------------------
CREATE TABLE carrinho (
    id            BIGSERIAL PRIMARY KEY,
    usuario_id    BIGINT NOT NULL UNIQUE REFERENCES usuario(id),
    atualizado_em TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE item_carrinho (
    id             BIGSERIAL PRIMARY KEY,
    carrinho_id    BIGINT NOT NULL REFERENCES carrinho(id) ON DELETE CASCADE,
    produto_id     BIGINT NOT NULL REFERENCES produto(id),
    quantidade     INT NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL,
    UNIQUE (carrinho_id, produto_id)
);

CREATE TABLE pedido (
    id               BIGSERIAL PRIMARY KEY,
    comprador_id     BIGINT NOT NULL REFERENCES usuario(id),
    status           status_pedido NOT NULL DEFAULT 'pendente',
    endereco_entrega VARCHAR(255) NOT NULL,
    valor_total      NUMERIC(10,2) NOT NULL,
    criado_em        TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE item_pedido (
    id             BIGSERIAL PRIMARY KEY,
    pedido_id      BIGINT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
    produto_id     BIGINT NOT NULL REFERENCES produto(id),
    artesao_id     BIGINT NOT NULL REFERENCES artesao(usuario_id),
    quantidade     INT NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL,
    subtotal       NUMERIC(10,2) NOT NULL
);

CREATE TABLE pagamento (
    id            BIGSERIAL PRIMARY KEY,
    pedido_id     BIGINT NOT NULL UNIQUE REFERENCES pedido(id) ON DELETE CASCADE,
    metodo        VARCHAR(30) NOT NULL DEFAULT 'simulado',
    status        status_pagamento NOT NULL,
    valor         NUMERIC(10,2) NOT NULL,
    processado_em TIMESTAMP NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. Assíncrono, notificação e IA
-- ----------------------------------------------------------------------------
CREATE TABLE notificacao (
    id         BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuario(id),
    tipo       VARCHAR(50) NOT NULL,
    mensagem   VARCHAR(300) NOT NULL,
    lida       BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em  TIMESTAMP NOT NULL DEFAULT now()
);

-- A tabela da fila assíncrona propriamente dita é criada na Etapa 2
-- (sql/03_fila.sql), estendendo este evento_assincrono do DDL original.
CREATE TABLE evento_assincrono (
    id            BIGSERIAL PRIMARY KEY,
    tipo          VARCHAR(50) NOT NULL,
    payload       JSONB NOT NULL,
    status        status_evento NOT NULL DEFAULT 'pendente',
    criado_em     TIMESTAMP NOT NULL DEFAULT now(),
    processado_em TIMESTAMP
);

CREATE TABLE classificacao_produto (
    id         BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL REFERENCES produto(id),
    classe     VARCHAR(80) NOT NULL,
    confianca  NUMERIC(4,3) NOT NULL CHECK (confianca BETWEEN 0 AND 1),
    status     status_classificacao NOT NULL DEFAULT 'aprovado',
    criado_em  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE recomendacao_log (
    id         BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuario(id),
    produto_id BIGINT NOT NULL REFERENCES produto(id),
    criterio   VARCHAR(30) NOT NULL,
    score      NUMERIC(5,4),
    criado_em  TIMESTAMP NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. Índices
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_produto_nome_trgm            ON produto USING GIN (nome gin_trgm_ops);
CREATE INDEX idx_produto_filtros              ON produto (tecnica_id, regiao_id, categoria_id);
CREATE INDEX idx_produto_preco                ON produto (preco);
CREATE INDEX idx_item_pedido_artesao          ON item_pedido (artesao_id);
CREATE INDEX idx_pedido_comprador             ON pedido (comprador_id, status);
CREATE INDEX idx_notificacao_usuario_nao_lida ON notificacao (usuario_id) WHERE lida = FALSE;
CREATE INDEX idx_produto_imagem_indisponivel  ON produto_imagem (produto_id) WHERE status = 'indisponivel';

-- ----------------------------------------------------------------------------
-- 6. Views — indicadores (HU13, HU14)
-- ----------------------------------------------------------------------------
CREATE VIEW vw_indicadores_artesao AS
SELECT
    ip.artesao_id,
    SUM(ip.subtotal)                                          AS total_vendido,
    COUNT(DISTINCT p.id)                                      AS total_pedidos,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'pendente') AS pedidos_pendentes
FROM item_pedido ip
JOIN pedido p ON p.id = ip.pedido_id
GROUP BY ip.artesao_id;

CREATE VIEW vw_indicadores_admin AS
SELECT
    (SELECT COUNT(*) FROM usuario)                        AS total_usuarios,
    (SELECT COUNT(*) FROM produto WHERE status = 'ativo') AS produtos_ativos,
    (SELECT COUNT(*) FROM pedido)                         AS total_pedidos,
    (SELECT COALESCE(SUM(valor_total),0) FROM pedido
        WHERE status <> 'cancelado')                      AS total_vendas;
