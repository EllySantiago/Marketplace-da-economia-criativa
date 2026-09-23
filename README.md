# Origem — Marketplace da Economia Criativa de Pernambuco

Aplicação web que conecta artesãos e empreendedores criativos de Pernambuco a compradores de
todo o país. Projeto Integrador. O repositório reúne o **frontend responsivo com Fake API**
(Avaliação 1) e o **backend da entrega de FCCPD** (concorrência no checkout e fila assíncrona).

**Equipe:** Ana Beatriz Lopes, Everton Nunes, Drielly Santiago e Thainá Pontes.

---

## FCCPD — Unidade 1: concorrência no checkout e fila assíncrona

Entrega de Fundamentos de Computação Concorrente, Paralela e Distribuída, construída sobre
este mesmo projeto. Comece por aqui:

| | |
|---|---|
| **[RELATORIO.md](RELATORIO.md)** | o relatório da entrega: pontos concorrentes, técnica escolhida e alternativas descartadas, desenho da fila, metodologia dos testes e uso de IA |
| **[evidencias/](evidencias/)** | as saídas reais dos testes, com um [README](evidencias/README.md) explicando cada arquivo |
| **[backend/](backend/)** | a API, o worker em processo separado e os scripts que geraram as evidências |

Resultado em uma linha: 50 compras simultâneas de um produto com 10 unidades →
**10 aprovadas, 40 rejeitadas, estoque final 0**. A versão ingênua, com o mesmo teste,
aprovou as 50 e perdeu 41 escritas.

Para rodar (precisa de Docker e Node 20+):

```bash
cd backend
docker compose up -d      # PostgreSQL com schema e dados de teste
npm install
npm run api               # terminal 1 — http://localhost:3333
npm run worker            # terminal 2 — consumidor da fila
npm run evidencias        # regrava a pasta evidencias/ do zero
```

---

## Como executar o projeto (frontend, Avaliação 1)

Pré-requisitos: Node.js 20+ e npm.

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:3000`. Para gerar a build de produção: `npm run build && npm start`
(também dentro de `frontend/`).

### Contas de demonstração (login)

Todas usam a senha **`origem123`**:

| Perfil | E-mail |
|---|---|
| Comprador | `comprador@origem.com.br` |
| Artesão | `maria@origem.com.br` |
| Administrador | `admin@origem.com.br` |

Também é possível criar uma conta nova em `/cadastro` (Comprador ou Artesão — ver
"Autenticação e perfis de acesso" abaixo).

## Estrutura do repositório

```
frontend/   aplicação Next.js (App Router) — o entregável desta avaliação
backend/    API Node/Express + PostgreSQL da entrega de FCCPD (checkout concorrente e fila assíncrona)
evidencias/ saídas reais dos testes de concorrência e da fila (FCCPD)
RELATORIO.md  relatório da entrega de FCCPD
docs/       documentação do projeto
  Origem_DDL.md    modelagem do banco de dados (referência para a Avaliação 2)
  arquitetura.md   arquitetura em camadas do frontend e estratégia de integração futura
  api.md           contratos de todos os serviços da Fake API
  uso-de-ia.md     registro do uso de IA generativa no desenvolvimento
```

## Fluxos implementados

- **Vitrine** (`/`) — destaques, filtro por categoria, mestres artesãos.
- **Catálogo** (`/produtos`) — busca por texto, região, categoria, técnica, preço máximo e
  disponibilidade em estoque; ordenação por preço.
- **Detalhe do produto** (`/produtos/[id]`) — galeria, especificações, recomendações de peças
  relacionadas (mesmo artesão/técnica/região) e **avaliações de compradores** (ver e enviar).
- **Artesãos** (`/artesoes`, `/artesoes/[id]`) — listagem e perfil público com catálogo do
  artesão.
- **Carrinho** (`/carinho`) — adicionar, remover, alterar quantidade, cálculo de frete/total.
- **Checkout** (`/checkout` → `/checkout/sucesso`) — endereço de entrega, forma de pagamento
  simulada (cartão/Pix/boleto), confirmação com código de pedido gerado e limpeza do carrinho.
- **Login / Cadastro** (`/login`, `/cadastro`) — autenticação simulada e criação de conta como
  comprador ou artesão.
- **Meus pedidos** (`/pedidos`) — histórico de pedidos do comprador autenticado.
- **Painel do artesão** (`/painel-artesao`) — visão geral, catálogo (editar/remover produto),
  publicação de produto, pedidos recebidos, controle de estoque.
- **Painel administrativo** (`/admin`) — indicadores da plataforma, fila de aprovação de novos
  artesãos, listagem de artesãos e pedidos.

## Autenticação e perfis de acesso

Existem três perfis (`comprador`, `artesao`, `administrador`), mutuamente exclusivos:

- **Comprador** e **artesão** têm cadastro público (`/cadastro`). Todo cadastro de artesão
  nasce **pendente de aprovação** e só aparece na vitrine depois que um administrador aprova
  (painel `/admin`) — evita que qualquer pessoa se autopromova a vendedor sem revisão.
- **Administrador** é a própria equipe do Origem: não existe tela pública para virar admin,
  são contas provisionadas internamente (por isso só há uma conta demo desse perfil).

Login/sessão são simulados nesta fase (sem hash de senha nem JWT) — ver limitações abaixo.

## Fake API — como foi estruturada

O frontend nunca lê dados fixos dentro de páginas ou componentes. Toda informação passa por
uma camada de serviços assíncronos que simula uma API real:

```
componente (app/ ou components/)
   → hook (hooks/*.ts)                     — expõe { dado, carregando, erro, recarregar? }
      → service (services/api/*.service.ts) — Promise + 300–500 ms de latência simulada
         → mocks/*.mock.ts                  — dados sintéticos (a única fonte "crua")
```

Recursos simulados: **produtos, artesãos, usuários, categorias, técnicas, regiões, carrinho,
pedidos, avaliações e recomendações**, além de indicadores agregados (painel admin/artesão).
Toda tela que busca dado trata os três estados obrigatórios — carregando (`LoadingState`),
erro (`ErrorState`) e vazio (`EmptyState`).

Contratos completos (parâmetros, retorno, erros e a rota REST equivalente prevista para a
Avaliação 2) estão documentados em **[`docs/api.md`](docs/api.md)**. A arquitetura em camadas
e a estratégia de transição para o backend real estão em **[`docs/arquitetura.md`](docs/arquitetura.md)**.

## Como a Fake API será substituída pelo backend real (Avaliação 2)

Cada arquivo em `services/api/` é a única fronteira entre a interface e a fonte de dados.
Na Avaliação 2, o corpo de cada função passa a chamar `fetch("/api/...")` contra o backend
Node/Express + PostgreSQL (modelado em `docs/Origem_DDL.md`) em vez de ler `mocks/`. Como
componentes e páginas só conversam com `hooks/`, e os hooks só conversam com `services/`,
**nenhuma tela precisa ser reescrita** — a troca fica isolada nessa camada. Autenticação passa
a usar sessão real (JWT/cookies) dentro de `authStore`/`useAuth`, e a Fake API para de existir.

## Limitações conhecidas desta entrega (Avaliação 1)

- Sem persistência real: os dados criados na sessão (novo produto, novo pedido, nova conta)
  vivem em memória e voltam ao estado inicial a cada reinício do servidor.
- Login sem hash de senha (todas as contas demo usam `origem123`) e sem token de sessão real.
- Recomendação de produtos usa similaridade simples de atributos (técnica/artesão/região), não
  um modelo de IA — candidato natural para evoluir na Avaliação 2.

## Status de publicação

URL do DEPLOY: https://marketplace-da-economia-criativa.vercel.app/cadastro
