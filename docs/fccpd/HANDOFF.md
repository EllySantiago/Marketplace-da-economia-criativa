# Handoff — FCCPD Unidade 1 (concorrência + fila assíncrona)

> **Para que serve este arquivo:** retomar o trabalho em outra máquina ou em outro dia
> sem perder contexto. Ele registra o que já foi feito, por quê, como rodar, e o que
> falta. Na seção final há um prompt pronto para colar numa nova sessão de IA.
>
> Última atualização: **21/09/2026** — fim da Etapa 4. Entrega completa.
> Branch: `feat/fccpd-concorrencia`.

---

## 1. Situação

| Etapa | Escopo | Status |
|---|---|---|
| **1** | Controle de concorrência no checkout (UPDATE condicional em transação) | ✅ **concluída** |
| **2** | Fila assíncrona (notificações + processamento de imagem) com worker em processo separado | ✅ **concluída** |
| **3** | Scripts de teste de carga + pasta `evidencias/` | ✅ **concluída** |
| **4** | `RELATORIO.md` em português | ✅ **concluída** |

Entrega avaliada por 6 critérios de 4 pontos: (1) mecanismo de concorrência com justificativa,
(2) estoque consistente sob compras simultâneas, (3) fila assíncrona para tarefas secundárias,
(4) confiabilidade e desacoplamento da fila, (5) evidência de teste, (6) nota de uso de IA.

**Fora de escopo** (é a Unidade 2, outra entrega): arquitetura distribuída, microsserviços,
paralelismo.

---

## 2. Ponto de partida encontrado no repositório

Levantamento feito antes de escrever qualquer código:

- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript `strict` + Zustand + Tailwind 4.
  Completo e publicado na Vercel.
- **Backend:** a pasta `backend/` estava **vazia**. Não existia backend nenhum.
- **Banco:** não existia banco rodando — só o DDL modelado em `docs/Origem_DDL.md`, nunca
  executado. Sem migrations, sem `docker-compose`, sem `.sql` no repo.
- **Checkout:** existia apenas na "Fake API" do frontend, em memória.
- **Testes:** nenhum. Nem framework de teste, nem script de carga.

### O achado mais importante

`frontend/src/services/api/produtos.service.ts` (`removerEstoque`) já continha o bug de
concorrência: confere o estoque numa passada (`for`) e escreve em outra (`forEach`). É o
padrão **check-then-act**, que produz **lost update**. Ou seja: a versão "ingênua" exigida para
o teste comparativo **já era o código real da equipe** — não foi preciso inventar um bug.

Além disso, a **seção 7 do `docs/Origem_DDL.md`** já descrevia a solução correta (UPDATE
condicional) e a linha 64 já tinha `CHECK (estoque >= 0)`. A modelagem estava certa; faltava
implementar. Vale citar isso na apresentação.

---

## 3. Decisões tomadas (e por quê)

| Decisão | Escolha | Motivo |
|---|---|---|
| Stack do backend | **Node + Express + `pg`** (JavaScript puro, sem TypeScript) | Mesma linguagem do frontend; é o que `README.md` e `docs/arquitetura.md` já prometiam para a Avaliação 2. `pg` usa SQL puro, então o `BEGIN`/`UPDATE`/`COMMIT` fica **visível no código** — essencial para defender oralmente. JS puro dispensa passo de compilação. |
| Banco | **PostgreSQL 16 em Docker**, porta **5434** | O DDL já era PostgreSQL. Docker evita instalar o banco na máquina. Porta 5434 porque 5432 e 5433 estavam ocupadas na máquina de origem. |
| Fila | **Tabela no próprio Postgres, com `SELECT ... FOR UPDATE SKIP LOCKED`** | A tabela `evento_assincrono` **já existia no DDL da equipe** — a fila nasce integrada à modelagem entregue. Nenhuma infraestrutura além do Postgres. E retry, backoff, ack, idempotência e dead-letter viram **SQL explícito**, defensável numa prova oral, em vez de mágica dentro de uma biblioteca. |
| Fila — alternativa descartada | Redis + BullMQ | Menos código, mas as garantias ficam escondidas na biblioteca ("como o ack funciona?" → "a BullMQ faz"), o que é frágil na defesa. E adiciona um serviço a mais para subir. |
| Frontend | **Não foi alterado** | A rubrica é satisfeita 100% por backend + scripts de teste. Mexer na vitrine arriscaria quebrar a Avaliação 1, que já está entregue e publicada. |

---

## 4. O que já existe

### Etapa 1 — concorrência no checkout

```
backend/
├── docker-compose.yml          PostgreSQL 16, porta 5434, healthcheck
├── package.json               deps: express, pg | script: npm run api
├── .env.example               documenta as variáveis (todas têm padrão no código)
├── sql/
│   ├── 01_schema.sql          DDL da equipe, executado de verdade + CHECK (estoque >= 0)
│   └── 02_seed.sql            dados sintéticos: 3 usuários, 1 artesão, 3 produtos (estoque 10)
└── src/
    ├── db.js                  pool de conexões + comTransacao() (BEGIN/COMMIT/ROLLBACK)
    ├── pedido.js              comum às 2 versões: erros, frete, gravarPedido()
    ├── checkout-seguro.js     ✅ UPDATE condicional atômico + ordenação anti-deadlock
    ├── checkout-ingenuo.js    🔴 SELECT → decide → UPDATE (o bug, mantido de propósito)
    └── server.js              API HTTP
```

O Docker executa `01_schema.sql` e `02_seed.sql` **automaticamente** na primeira subida
(volume vazio). Para refazer do zero: `docker compose down -v && docker compose up -d`.

### Rotas

| Rota | O que faz |
|---|---|
| `GET /saude` | O banco responde? Informa qual checkout está ativo. |
| `GET /produtos/:id` | Consulta um produto — usado para ler o estoque atual. |
| `POST /pedidos` | Checkout **seguro**. Vira o ingênuo se `NAIVE_CHECKOUT=true`. |
| `POST /pedidos-naive` | Checkout **ingênuo** sempre — para o teste comparativo. |
| `POST /teste/reiniciar` | Apaga pedidos, fila e notificações e recoloca o estoque. Instrumentação de laboratório, não existiria em produção. |
| `POST /produtos/:id/imagens` | [Etapa 2] Registra a imagem e **só enfileira** o processamento. Responde **202 Accepted** — o código honesto para "aceitei, ainda não terminei". |
| `GET /fila` | [Etapa 2] Quantos jobs em cada status + o conteúdo da dead-letter. |
| `POST /teste/fila` | [Etapa 2] Enfileira N jobs de uma vez, para o teste de carga da fila. |

Corpo do pedido:

```json
{
  "compradorId": 1,
  "enderecoEntrega": "Rua da Aurora, 100 - Recife/PE",
  "metodoPagamento": "pix",
  "itens": [{ "produtoId": 1, "quantidade": 1 }]
}
```

Respostas: **201** criado · **409** `ESTOQUE_INSUFICIENTE` ou `DEADLOCK_DETECTADO` ·
**404** `PRODUTO_INEXISTENTE` · **400** corpo inválido · **500** `VIOLACAO_CHECK_ESTOQUE`
(a constraint do banco barrou — esperado na versão ingênua, sinal de bug na segura).

### Resultado medido na Etapa 1 (prévia, 30 requisições simultâneas)

> Números preliminares, mantidos por registro. Os **números oficiais da entrega**
> são os da Etapa 3 mais abaixo (50 requisições) e estão em `evidencias/`.

| Cenário | 201 | 409 | Estoque final | Veredito |
|---|---:|---:|---:|---|
| `/pedidos-naive` | **30** | 0 | **6** | 🔴 vendeu 30 existindo 10; estoque caiu só 4 |
| `/pedidos` | **10** | 20 | **0** | 🟢 exatamente o estoque, nada negativo |

O número revelador é o estoque final 6 da versão ingênua: **30 vendas derrubaram o estoque em
apenas 4 unidades**. 26 escritas foram apagadas por escritas posteriores — essa é a assinatura
do *lost update*. Não é só "vendeu demais": o próprio número do estoque ficou sem sentido.

Constraint do banco verificada na mão:

```
UPDATE produto SET estoque = -1 WHERE id = 1;
ERROR: new row for relation "produto" violates check constraint "produto_estoque_check"
```

### Etapa 2 — fila assíncrona

```
backend/
├── sql/03_fila.sql          estende evento_assincrono: tentativas, max_tentativas,
│                            disponivel_em (backoff), chave_idempotencia UNIQUE,
│                            ultimo_erro, atualizado_em + índices parciais.
│                            Também dá chave_idempotencia à tabela notificacao.
└── src/
    ├── fila.js              enfileirar · reservar (FOR UPDATE SKIP LOCKED) ·
    │                        confirmar (ack) · falhar (backoff/dead-letter) ·
    │                        recuperarOrfaos · resumo
    ├── tarefas.js           notificar_pedido e processar_imagem, ambas idempotentes
    └── worker.js            processo separado (npm run worker), polling,
                             desligamento gracioso em SIGINT/SIGTERM
```

Decisões da etapa (as três foram escolhidas pela aluna, com prós e contras na mão):

| Decisão | Escolha | Motivo |
|---|---|---|
| Processamento de imagem | **Simulado** (SHA-256 sobre 4 MB + espera), sem `sharp` | O ponto da rubrica é o trabalho pesado sair do caminho HTTP; o algoritmo é intercambiável. Zero dependências novas e menos assunto para defender. Está declarado em comentário no código, não escondido. |
| Falhas | **Injetadas por variável** `TAXA_FALHA` (0 a 1), desligada por padrão | Sem falha não há como *demonstrar* retry, backoff e dead-letter — e os três são critérios avaliados. |
| Momento de enfileirar | **Dentro da transação do pedido** (*transactional outbox*) | Ou o pedido e os bilhetes existem juntos, ou nenhum existe. Não há janela para pedido confirmado sem notificação. Uma fila externa (Redis) não consegue isso. |

Alterações no que já existia: `src/pedido.js` enfileira as notificações dentro da
transação; `src/server.js` ganhou `POST /produtos/:id/imagens` (responde **202**,
só enfileira), `GET /fila`, `POST /teste/fila` e um `/teste/reiniciar` que agora
limpa também a fila, as notificações e as imagens.

Garantias implementadas, e onde cada uma está:

| Garantia | Como | Onde |
|---|---|---|
| Nada se perde | ack só depois do sucesso (at-least-once) | `worker.js` → `processar()` |
| Nada duplica o efeito | `chave_idempotencia UNIQUE` + `ON CONFLICT DO NOTHING` | `fila.js`, `tarefas.js`, `sql/03_fila.sql` |
| Falha transitória se recupera | retry com backoff exponencial (2s, 4s, 8s, 16s) | `fila.js` → `falhar()` |
| Falha permanente não entope a fila | dead-letter (`status = 'morto'` + `ultimo_erro`) | `fila.js` → `falhar()` |
| Worker morto não trava a fila | varredura de órfãos por tempo (*visibility timeout*) | `fila.js` → `recuperarOrfaos()` |
| Vários workers escalam de verdade | `SELECT … FOR UPDATE SKIP LOCKED` | `fila.js` → `reservar()` |
| Desacoplamento | API e worker só se falam pela tabela da fila | `worker.js` (cabeçalho) |

### Etapa 3 — testes e evidências

```
backend/testes/
├── teste-concorrencia.js    N compras simultâneas; conta status e mede o estoque
├── teste-deadlock.js        carrinhos com os mesmos produtos em ordem inversa
├── teste-fila.js            3 partes: kill -9 no worker · backoff/dead-letter ·
│                            3 workers com SKIP LOCKED
└── gerar-evidencias.sh      roda tudo e grava em evidencias/  (npm run evidencias)

evidencias/                  saídas reais + README.md explicando cada arquivo
                             e listando os prints de tela a tirar
```

**Resultados medidos** (50 requisições simultâneas, estoque inicial 10):

| Cenário | 201 | 409 | Estoque final | Escritas perdidas | Veredito |
|---|---:|---:|---:|---:|---|
| `/pedidos-naive` | **50** | 0 | **1** | **41** | 🔴 vendeu 50 existindo 10 |
| `/pedidos` | **10** | **40** | **0** | 0 | 🟢 exatamente o estoque |

Deadlock: 40 compras com `[2,3]` e `[3,2]` simultâneas → **0 deadlocks**.

Fila: 200 jobs com `kill -9` no worker no meio → **200 processados, 200 efeitos,
200 distintos, 0 perdidos**. Backoff observado: 500 ms → 1 s → 2 s → `morto`.
Três workers dividiram 60 jobs em **20 / 20 / 20**, sem nenhuma entrega dupla.

---

## 5. Como rodar, do zero, em qualquer máquina

Pré-requisitos: **Docker** e **Node.js 20+**.

```bash
git clone https://github.com/thainapontes/Marketplace-da-economia-criativa.git
cd Marketplace-da-economia-criativa
git switch feat/fccpd-concorrencia

cd backend
docker compose up -d      # sobe o PostgreSQL e aplica schema + seed automaticamente
npm install
npm run api               # terminal 1 — API em http://localhost:3333
npm run worker            # terminal 2 — worker da fila (processo separado)
```

Num banco que **já existia** antes da Etapa 2, aplique a migration da fila à mão
(ela é idempotente, rodar duas vezes não dá erro):

```bash
docker compose exec -T postgres psql -U origem -d origem -f /docker-entrypoint-initdb.d/03_fila.sql
```

Rodar a bateria de testes e regravar a pasta `evidencias/` (com a API de pé e
**nenhum** worker rodando — o teste sobe os dele):

```bash
npm run evidencias
```

Verificar:

```bash
curl -s http://localhost:3333/saude          # {"ok":true,"checkoutPadrao":"seguro"}
curl -s http://localhost:3333/produtos/1     # estoque: 10
```

Comprar 1 unidade (espera **201**):

```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:3333/pedidos \
  -H "Content-Type: application/json" \
  -d '{"compradorId":1,"enderecoEntrega":"Rua da Aurora, 100 - Recife/PE","metodoPagamento":"pix","itens":[{"produtoId":1,"quantidade":1}]}'
```

Comprar mais do que existe (espera **409**): troque `"quantidade":1` por `"quantidade":99`.

Voltar ao estado inicial:

```bash
curl -s -X POST http://localhost:3333/teste/reiniciar -H "Content-Type: application/json" -d '{"estoque":10}'
```

Rodar no modo ingênuo: `NAIVE_CHECKOUT=true npm run api`.

Olhar o banco por dentro:

```bash
docker compose exec postgres psql -U origem -d origem -c "SELECT id, nome, estoque FROM produto ORDER BY id;"
docker compose exec postgres psql -U origem -d origem -c "SELECT COUNT(*) FROM pedido;"
```

### Se a porta 5434 estiver ocupada na nova máquina

Edite `ports` em `backend/docker-compose.yml` e o `DATABASE_URL` correspondente
(ou exporte `DATABASE_URL` antes de `npm run api`).

---

## 6. Conceitos, para a defesa oral

### Race condition e o bug do "SELECT depois UPDATE"

**Race condition** = o resultado depende de quem chegou primeiro entre duas execuções
simultâneas, e existe uma ordem de chegada que dá resultado errado. O padrão que a causa se
chama **check-then-act**: conferir e agir em dois passos separados deixa uma janela entre eles.

Produto com `estoque = 1`; Ana e Bruno compram no mesmo instante:

| tempo | Ana | Bruno | estoque |
|:--|:--|:--|:--:|
| t1 | `SELECT estoque` → **1** | | 1 |
| t2 | | `SELECT estoque` → **1** | 1 |
| t3 | `1 >= 1`? sim → pode vender | | 1 |
| t4 | | `1 >= 1`? sim → pode vender | 1 |
| t5 | `UPDATE SET estoque = 0` | | **0** |
| t6 | | `UPDATE SET estoque = 0` | **0** |
| t7 | `INSERT pedido` → 201 | | 0 |
| t8 | | `INSERT pedido` → 201 | 0 |

Dois pedidos para uma peça. O furo está entre **t2 e t6**: Bruno decidiu com uma informação que
venceu em t5. A escrita de Ana foi apagada pela de Bruno — **lost update**.

### Por que o UPDATE condicional resolve

```sql
UPDATE produto SET estoque = estoque - :qtd
 WHERE id = :id AND estoque >= :qtd;
```

1. `estoque = estoque - :qtd` — a aplicação manda **a operação**, não um valor calculado antes.
   O banco lê o saldo no instante da escrita.
2. `AND estoque >= :qtd` no `WHERE` — conferir e escrever passaram a ser **um único comando**,
   e um comando SQL é **atômico** (indivisível). A janela deixou de existir.
3. `rowCount === 0` → sem saldo. O `UPDATE` não dá erro, simplesmente **não afeta linha
   nenhuma**. Aí: `ROLLBACK` + HTTP **409 Conflict**.

**Lock de linha** (*row-level lock*): trava que o Postgres coloca automaticamente numa linha
específica quando uma transação a modifica; dura até `COMMIT`/`ROLLBACK`. Analogia: o cadeado
da porta do banheiro do avião — não trava o avião, trava a cabine, e quem chega **espera na
fila** em vez de receber erro.

O que o banco faz com a segunda transação, passo a passo:

1. **Bloqueia** — ela tenta modificar uma linha travada e é posta para dormir. Não é erro; do
   lado do usuário é só alguns milissegundos a mais.
2. **Libera** — a primeira dá `COMMIT`, a trava cai.
3. **Reavalia** — e aqui está o essencial: ao acordar, o Postgres **testa o `WHERE` de novo
   contra a versão mais recente da linha**. Ela **não** reaproveita o valor que tinha visto
   antes de dormir. (Mecanismo interno: *EvalPlanQual*.) Se o saldo acabou, 0 linhas.
4. **Rejeita** — `ROLLBACK`, 409.

Efeito líquido: o banco **serializou** transações que chegaram juntas, sem uma linha de código
de sincronização nossa.

### As três perguntas-armadilha

**"Por que não bastava colocar numa transação?"** Porque no isolamento padrão do PostgreSQL
(`READ COMMITTED`) duas transações conseguem **ler o mesmo valor antes de qualquer uma
escrever**. Transação garante *tudo-ou-nada* e durabilidade, não *exclusão mútua*. Prova:
`checkout-ingenuo.js` **está dentro de uma transação e erra**.

**"Por que não bastava o `CHECK (estoque >= 0)`?"** Porque no *lost update* o estoque nunca fica
negativo (ficou 6, não −20) — o `CHECK` não teria reclamado de nada e o overselling aconteceria
igual. O `CHECK` protege a **integridade do número**; só o UPDATE condicional protege a **regra
de negócio**. As duas camadas se somam: é defesa em profundidade, cinto além do freio.

**"Por que não um mutex na aplicação?"** **Mutex** (*mutual exclusion*) = trava que vive na
memória do programa (`threading.Lock`, `synchronized`, variável global). Para entender a falha:

- **Processo** = programa em execução com memória **própria e isolada**. Analogia: duas casas
  separadas, cada uma com sua geladeira.
- **Thread** = linha de execução **dentro** de um processo; threads do mesmo processo
  **compartilham** memória. Analogia: duas pessoas na mesma casa, uma geladeira.

O mutex funciona entre threads (memória compartilhada) e **falha entre processos** (cada um tem
a sua própria trava, e nenhum sabe da outra). Com duas réplicas da API, Ana pega o mutex da
réplica 1 e Bruno o da réplica 2: ninguém espera, **o bug volta inteiro** — e volta de forma
traiçoeira, porque passava nos testes locais (um processo só) e quebra em produção.

Não é hipotético aqui: o deploy é na **Vercel**, plataforma serverless que sobe e derruba
múltiplas instâncias automaticamente. E o modelo padrão de escala do Node é justamente rodar
**vários processos** (um por núcleo), porque cada processo Node executa JS numa thread só.

| Problema do mutex em memória | Consequência |
|---|---|
| Não atravessa fronteira de processo | Quebra com 2+ réplicas — o caso normal em produção |
| A trava não sobrevive a um restart | Processo cai segurando a trava → estado incoerente |
| Trava a *aplicação*, não a *linha* | Compras de produtos diferentes esperam sem motivo → throughput afunda |

**Princípio, em uma frase:** *o dado é compartilhado no banco, então a trava também tem que
morar no banco.* Proteger recurso compartilhado com trava privada é o erro de arquitetura.

*(Alternativa "certa" da mesma ideia, também descartada por complexidade desnecessária: travas
distribuídas — Redlock no Redis, ou advisory locks do Postgres.)*

### Deadlock e a ordenação por id

**Deadlock** = duas transações presas esperando uma pela outra para sempre; cada uma segura o
que a outra precisa. Analogia: corredor estreito com duas portas, Ana entrou pela A e precisa
da B, Bruno entrou pela B e precisa da A.

Ana compra `[1, 7]`, Bruno compra `[7, 1]` — mesmos produtos, ordem inversa:

| tempo | Ana | Bruno |
|:--|:--|:--|
| t1 | trava a linha 1 ✓ | |
| t2 | | trava a linha 7 ✓ |
| t3 | pede a 7 → **espera** ⏳ | |
| t4 | | pede a 1 → **espera** ⏳ |

O Postgres detecta o ciclo (~1s) e mata uma transação com `deadlock detected` (código `40P01`).
O sistema não congela, mas um comprador legítimo leva um erro aleatório — bug intermitente,
horrível de reproduzir.

**Solução:** ordenar os itens por `produto_id` antes dos UPDATEs
(`checkout-seguro.js`: `itens.sort((a, b) => a.produtoId - b.produtoId)`). Todos passam a
adquirir as travas na mesma ordem, então Bruno é bloqueado **no primeiro recurso**, antes de
segurar qualquer coisa que Ana precise.

> **Frase para decorar:** *deadlock exige um ciclo de espera; com ordem única de aquisição o
> ciclo é impossível, e a espera vira uma fila reta — que sempre anda.*

### Fila assíncrona: os termos que o professor vai cobrar

**Fila de mensagens** = lista de tarefas para depois. A API não executa a tarefa:
escreve um bilhete e responde. Analogia: o garçom anota o pedido e volta a
atender; não fica parado na cozinha. A comanda no balcão é a fila.

**Worker** = o processo que lê essa lista e executa. É a cozinha. Aqui é
`npm run worker`, iniciado **separado** da API.

**Por que processo separado, e não uma thread dentro do servidor?** Processo tem
memória própria e isolada (duas casas, duas geladeiras); threads do mesmo
processo dividem memória (duas pessoas, uma geladeira). Separado: (1) se o
worker travar processando uma imagem enorme, a API continua vendendo; (2) dá
para subir 3 workers e 1 API conforme o gargalo; (3) em Node isso é ainda mais
grave, porque o JavaScript da aplicação roda numa **única thread** — cálculo
pesado dentro do servidor congela todas as requisições, inclusive as que nada
têm a ver com a tarefa.

**Ack** (*acknowledge*) = a confirmação "terminei com sucesso". Só depois dela o
job sai da fila. Se o worker morrer antes, o job continua lá para outro pegar.
Dar o ack *antes* de executar seria perder a tarefa numa queda.

**At-least-once** ("pelo menos uma vez") = a garantia que isso produz: nenhum job
se perde, mas um job **pode** rodar duas vezes (trabalhou, caiu antes do ack,
outro pegou). *Exactly-once* entre dois sistemas é praticamente impossível de
garantir; a indústria escolhe at-least-once e resolve a duplicata do outro lado.

**Idempotência** = repetir a operação não muda o resultado. Apertar o botão do
elevador dez vezes é idempotente. "Enviar e-mail" não é — por isso
at-least-once **exige** idempotência. Resolvido aqui com `chave_idempotencia`
UNIQUE + `ON CONFLICT DO NOTHING`: quem garante é o **banco**, não um `if` da
aplicação (um `if` seria consultar-e-depois-inserir, o mesmo check-then-act que
causou o bug de estoque).

**Backoff exponencial** = ao falhar, esperar antes de tentar de novo, dobrando a
espera (2s, 4s, 8s, 16s). Se o serviço de e-mail caiu, martelá-lo atrapalha a
recuperação dele e ainda queima todas as tentativas em 2 segundos.

**Dead-letter** ("carta morta") = depois de N tentativas o job para de tentar,
vira `morto` e fica guardado com o motivo, para alguém investigar. Sem isso, um
job impossível tentaria para sempre.

**`SELECT … FOR UPDATE SKIP LOCKED`** = o que faz uma tabela virar fila.
`FOR UPDATE` trava as linhas que o worker pegou; `SKIP LOCKED` manda **pular** as
linhas já travadas por outro em vez de esperar por elas. Sem `SKIP LOCKED`, o
worker 2 ficaria parado atrás do worker 1 e dois workers renderiam o mesmo que
um. Com ele, os workers dividem a fila — foi o 20/20/20 da evidência.

**Job órfão e *visibility timeout*** = job preso em `processando` porque o worker
morreu de repente. Passado um tempo sem notícia, ele volta para `pendente`.
**Ponto frágil, e é honesto admitir:** se esse tempo for menor que a tarefa mais
lenta, a fila reentrega um job que ainda está rodando e ele executa em dobro —
quem segura o estrago é a idempotência, não o timeout.

**Transactional outbox** = enfileirar dentro da MESMA transação do pedido. Ou os
dois existem, ou nenhum existe: não há janela para pedido confirmado sem
notificação. Uma fila externa (Redis, RabbitMQ) não consegue isso, porque está
fora da transação do banco.

### Dois detalhes do código que também são de concorrência

- **`pool.connect()` e não `pool.query()`** (`db.js`): a transação exige **uma conexão
  dedicada**. Com `pool.query()` cada comando poderia sair por uma conexão diferente do pool —
  o `BEGIN` por um caminho, o `UPDATE` por outro. A transação não existiria e os locks seriam
  liberados no momento errado. Erro comum e silencioso.
- **`cliente.release()` no `finally`**: devolve a conexão ao pool **sempre**, inclusive em erro.
  Sem isso, cada rejeição de estoque vazaria uma conexão; depois de 10 rejeições o pool estaria
  esgotado e a API travaria inteira — um bug de concorrência causado pelo tratamento de erro.
- **`explicarFalhaDeEstoque()`** (`pedido.js`): o UPDATE condicional afeta 0 linhas em **dois**
  casos (produto inexistente / sem saldo), e a API precisa responder 404 num e 409 no outro.
  Essa consulta extra roda **só no caminho da rejeição**, nunca no de sucesso. Não é uma nova
  race condition: naquele ponto já decidimos rejeitar, e ela só escolhe a mensagem.

---

## 7. O que falta

As quatro etapas estão concluídas. O que resta **depende da aluna**, não de código:

1. **Preencher o bloco destacado na seção 6.3 do [`RELATORIO.md`](../../RELATORIO.md)** —
   outras IAs usadas, em que medida o código foi revisado/executado por ela, e material do
   professor que tenha guiado a escolha. A IA deixou isso em aberto de propósito: preencher
   sem perguntar seria inventar.
2. **Tirar os prints de tela** listados em [`evidencias/README.md`](../../evidencias/README.md).
3. **Estudar a seção 6 deste arquivo** para a defesa oral. Os dois pontos mais prováveis de
   pergunta: como o `SKIP LOCKED` divide a fila, e por que o *visibility timeout* é o ponto
   frágil do desenho (a resposta certa é "quem segura o estrago é a idempotência").
4. **Abrir o PR** de `feat/fccpd-concorrencia` para `main`, se a entrega for por pull request.

## 8. Prompt para retomar com a IA

Cole isto numa sessão nova do Claude Code, na raiz do repositório:

```
Estou retomando a entrega da Parte 1 de FCCPD (Fundamentos de Computação Concorrente,
Paralela e Distribuída) no projeto Origem, um marketplace de artesanato de Pernambuco.

Leia docs/fccpd/HANDOFF.md primeiro — ele tem todo o contexto. As quatro etapas estão
concluídas: concorrência no checkout, fila assíncrona com worker em processo separado,
scripts de teste com a pasta evidencias/ gerada, e o RELATORIO.md na raiz. O que falta
está na seção 7 do handoff.

COMO ME TRATAR (importante): perdi várias aulas dessa disciplina e não domino os
conceitos. Termos como thread, processo, lock, transação, race condition, deadlock,
worker, fila, ack, idempotência e throughput são vagos para mim. Então:
1. A primeira vez que usar qualquer termo técnico, explique o que significa em uma ou
   duas frases, com analogia se ajudar. Não presuma que eu sei.
2. Trabalhe em etapas. Ao fim de cada etapa, pare, me diga o que fez, o que eu devo
   rodar para testar, e espere minha confirmação antes de seguir.
3. Se eu precisar tomar uma decisão, me pergunte em vez de decidir sozinho,
   explicando prós e contras.
4. Não me entregue código que eu não entenda.
5. Me avise quando tiver algum trecho que eu provavelmente não saberia explicar se o
   professor perguntar.

Suba o ambiente (docker compose up -d, npm install, npm run api e npm run worker dentro
de backend/), confirme que `npm run evidencias` ainda passa, e então me ajude com o que
falta. Para a seção de uso de IA do relatório, me PERGUNTE o que realmente aconteceu —
não invente.
```

---

## 9. Pendências fora do FCCPD (não commitadas nesta branch)

Ficaram de propósito fora dos commits desta branch, na `main`:

- `README.md` — alteração já na *staging area* adicionando a URL do deploy da Vercel
  (pertence à Avaliação 1).
- `.claude/settings.json` — permissões acumuladas automaticamente pelo Claude Code durante a
  sessão; configuração local de máquina.
