# Contratos da Fake API — Origem

Todos os métodos abaixo retornam `Promise` e simulam 300–500 ms de latência de rede
(`services/api/client.ts#delay`). Erros de regra de negócio são lançados como `ApiError`
(mensagem legível, pronta para `<ErrorState />`). A coluna **Endpoint real (Avaliação 2)** é
a proposta de rota REST equivalente para quando a Fake API for substituída por um backend
Node/Express + PostgreSQL seguindo `docs/Origem_DDL.md`.

## `produtosService` — `src/services/api/produtos.service.ts`

| Método | Assinatura | Descrição | Erros | Endpoint real (Avaliação 2) |
|---|---|---|---|---|
| `listarTodos` | `(): Promise<Produto[]>` | Lista todos os produtos ativos | — | `GET /produtos` |
| `buscarPorId` | `(id: number): Promise<Produto>` | Busca um produto | `ApiError` se não existir | `GET /produtos/:id` |
| `filtrar` | `(filtros: FiltrosProduto): Promise<Produto[]>` | Filtra por `regiao`, `tecnica`, `categoria`, `busca` (texto livre) e/ou `artesaoId` | — | `GET /produtos?regiao=&tecnica=&categoria=&busca=&artesaoId=` |
| `criar` | `(dados: NovoProduto): Promise<Produto>` | Publica um novo produto (painel do artesão) | — | `POST /produtos` |
| `atualizar` | `(id: number, dados: NovoProduto): Promise<Produto>` | Edita um produto já publicado | `ApiError` se não existir | `PUT /produtos/:id` |
| `remover` | `(id: number): Promise<void>` | Remove um produto do catálogo | `ApiError` se não existir | `DELETE /produtos/:id` |
| `removerEstoque` | `(itens: {produtoId, quantidade}[]): Promise<void>` | Baixa o estoque de vários produtos numa única operação, usada pelo checkout | `ApiError` se algum item não tiver estoque suficiente | Transação `UPDATE produto SET estoque = estoque - :quantidade WHERE estoque >= :quantidade` (ver seção 7 do DDL) |

## `artesoesService` — `src/services/api/artesoes.service.ts`

| Método | Assinatura | Descrição | Erros | Endpoint real |
|---|---|---|---|---|
| `listarTodos` | `(): Promise<Artesao[]>` | Lista os artesãos **aprovados** (vitrine pública) | — | `GET /artesoes` |
| `buscarPorId` | `(id: number): Promise<Artesao>` | Busca um artesão | `ApiError` se não existir | `GET /artesoes/:id` |
| `criarPendente` | `(dados: DadosNovoArtesao): Promise<Artesao>` | Cria o registro de artesão de um novo cadastro (`aprovado: false`) | — | Efeito colateral de `POST /auth/registrar` |
| `listarPendentes` | `(): Promise<Artesao[]>` | Fila de aprovação (painel admin) | — | `GET /artesoes?aprovado=false` |
| `aprovar` | `(id: number): Promise<Artesao>` | Aprova o cadastro — o artesão passa a aparecer na vitrine | `ApiError` se não existir | `PATCH /artesoes/:id/aprovar` |
| `rejeitar` | `(id: number): Promise<void>` | Rejeita e remove o cadastro pendente | `ApiError` se não existir | `PATCH /artesoes/:id/rejeitar` |

> Aprovação de artesão é a razão de existir do perfil "administrador": só a equipe do Origem
> aprova quem vende na plataforma — nenhum artesão aprova a si mesmo. Ver `docs/arquitetura.md`.

## `usuariosService` — `src/services/api/usuarios.service.ts`

| Método | Assinatura | Descrição | Erros | Endpoint real |
|---|---|---|---|---|
| `login` | `(credenciais: CredenciaisLogin): Promise<Usuario>` | Autentica por e-mail/senha | `ApiError` se credenciais inválidas | `POST /auth/login` |
| `registrar` | `(dados: DadosCadastro): Promise<Usuario>` | Cria um usuário (comprador ou artesão) | `ApiError` se e-mail já existir | `POST /auth/registrar` |
| `buscarPorId` | `(id: number): Promise<Usuario \| undefined>` | Busca um usuário | — | `GET /usuarios/:id` |

> Todas as contas de demonstração usam a senha `origem123` (ver `src/mocks/usuarios.mock.ts`).
> Isso é uma simplificação proposital da Avaliação 1: não há hash de senha nem token de sessão.

## `pedidosService` — `src/services/api/pedidos.service.ts`

| Método | Assinatura | Descrição | Erros | Endpoint real |
|---|---|---|---|---|
| `listarTodos` | `(): Promise<Pedido[]>` | Lista todos os pedidos (painel admin) | — | `GET /pedidos` |
| `listarPorCliente` | `(email: string): Promise<Pedido[]>` | Pedidos de um comprador | — | `GET /pedidos?clienteEmail=` |
| `listarPorArtesao` | `(artesaoId: number): Promise<Pedido[]>` | Pedidos que contêm ao menos um item do artesão | — | `GET /pedidos?artesaoId=` (join com `item_pedido`) |
| `buscarPorCodigo` | `(codigo: string): Promise<Pedido>` | Busca um pedido pelo código (`PE-XXXX`) | `ApiError` se não existir | `GET /pedidos/:codigo` |
| `criarPedido` | `(dados: DadosNovoPedido): Promise<Pedido>` | Confirma o checkout: valida/baixa estoque, calcula frete e total, **gera o pagamento simulado** e o código numérico do pedido | `ApiError` se carrinho vazio ou estoque insuficiente | `POST /pedidos` (transacional) |

Regra de frete simulada: grátis a partir de R$ 400,00 em subtotal, senão R$ 35,90 — a mesma
regra usada no carrinho (`useCarrinho`) e no checkout, para que o total nunca "pule" entre as
duas telas.

`dados.metodoPagamento` (`"cartao" | "pix" | "boleto"`, escolhido em `/checkout`) vira um
objeto `Pagamento` (`metodo`, `status`, `valor`, `processadoEm`) salvo em `pedido.pagamento` —
equivalente à tabela `pagamento` do DDL. Nesta fase o status é sempre `"aprovado"`: não existe
integração real com nenhuma adquirente, é só a simulação exigida pela Avaliação 1.

## `carrinhoService` — `src/services/api/carrinho.service.ts`

| Método | Assinatura | Descrição | Endpoint real |
|---|---|---|---|
| `validarEstoque` | `(itens: ItemCarrinho[]): Promise<ProblemaEstoque[]>` | Revalida, no momento do checkout, se o estoque atual ainda atende ao carrinho salvo no navegador | Validação equivalente ocorreria dentro da própria transação de `POST /pedidos` |

## `recomendacoesService` — `src/services/api/recomendacoes.service.ts`

| Método | Assinatura | Descrição | Endpoint real |
|---|---|---|---|
| `recomendarSimilares` | `(produtoId: number, limite?: number): Promise<Produto[]>` | Recomenda produtos por técnica/artesão/região em comum (score simples), usado em "Você também pode gostar" | `GET /produtos/:id/recomendados` — candidato natural a virar um modelo de IA na Avaliação 2, registrando o resultado em `recomendacao_log` |

## `avaliacoesService` — `src/services/api/avaliacoes.service.ts`

| Método | Assinatura | Descrição | Erros | Endpoint real |
|---|---|---|---|---|
| `listarPorProduto` | `(produtoId: number): Promise<Avaliacao[]>` | Lista as avaliações de um produto, mais recentes primeiro | — | `GET /produtos/:id/avaliacoes` |
| `criar` | `(dados: NovaAvaliacao): Promise<Avaliacao>` | Registra uma avaliação (nota 1–5 + comentário) | `ApiError` se a nota estiver fora de 1–5 | `POST /produtos/:id/avaliacoes` |

> O DDL atual (`docs/Origem_DDL.md`) não tem uma tabela dedicada a avaliações de produto —
> só `classificacao_produto` (classificação por IA) e `recomendacao_log`. Para a Avaliação 2,
> sugerimos uma tabela `avaliacao_produto(id, produto_id, usuario_id, nota, comentario, criado_em)`,
> espelhando `types/avaliacao.ts`.

## Erros

Todas as promessas rejeitadas pela Fake API usam a classe `ApiError` (`services/api/client.ts`),
para diferenciar uma falha de regra de negócio conhecida (mensagem apresentável ao usuário via
`<ErrorState mensagem={erro} />`) de um erro de programação inesperado.
