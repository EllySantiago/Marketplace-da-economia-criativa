-- ============================================================================
-- Origem — dados sintéticos (seed)
--
-- Conjunto mínimo para exercitar o checkout. Todos os dados são fictícios,
-- inspirados em técnicas e polos reais de artesanato de Pernambuco.
--
-- IDs são inseridos explicitamente para que os scripts de teste possam se
-- referir a "produto 1" com segurança. Depois de inserir com id fixo é
-- obrigatório reposicionar a sequência com setval(), senão o próximo INSERT
-- sem id tentaria usar o id 1 de novo e falharia com violação de chave.
-- ============================================================================

INSERT INTO usuario (id, nome, email, senha_hash, perfil) VALUES
  (1, 'Joana Compradora', 'comprador@origem.com.br', 'hash-demonstracao-origem123', 'comprador'),
  (2, 'Maria do Barro',   'maria@origem.com.br',     'hash-demonstracao-origem123', 'artesao'),
  (3, 'Equipe Origem',    'admin@origem.com.br',     'hash-demonstracao-origem123', 'administrador');
SELECT setval('usuario_id_seq', (SELECT MAX(id) FROM usuario));

INSERT INTO regiao (id, nome, polo) VALUES
  (1, 'Alto do Moura', 'Caruaru'),
  (2, 'Pesqueira',     'Agreste');
SELECT setval('regiao_id_seq', (SELECT MAX(id) FROM regiao));

INSERT INTO categoria (id, nome) VALUES
  (1, 'Decoração'),
  (2, 'Têxtil');
SELECT setval('categoria_id_seq', (SELECT MAX(id) FROM categoria));

INSERT INTO tecnica (id, nome) VALUES
  (1, 'Cerâmica figurativa'),
  (2, 'Renda Renascença');
SELECT setval('tecnica_id_seq', (SELECT MAX(id) FROM tecnica));

INSERT INTO artesao (usuario_id, nome_atelie, descricao, regiao_id) VALUES
  (2, 'Ateliê Maria do Barro', 'Cerâmica figurativa do Alto do Moura, Caruaru.', 1);

-- produto 1 = alvo do teste de carga (estoque 10, 50 compras simultâneas).
-- produtos 2 e 3 = usados no teste de deadlock (carrinho com dois itens).
INSERT INTO produto (id, artesao_id, categoria_id, tecnica_id, regiao_id, nome, descricao, preco, estoque) VALUES
  (1, 2, 1, 1, 1, 'Boneca de Barro Pequena',  'Peça em cerâmica queimada e pintada à mão.',      120.00, 10),
  (2, 2, 1, 1, 1, 'Jarro de Barro Esmaltado', 'Jarro utilitário em barro com esmalte natural.',   89.90, 10),
  (3, 2, 2, 2, 2, 'Caminho de Mesa Renascença','Renda Renascença feita em bilro, 1,20m.',        260.00, 10);
SELECT setval('produto_id_seq', (SELECT MAX(id) FROM produto));
