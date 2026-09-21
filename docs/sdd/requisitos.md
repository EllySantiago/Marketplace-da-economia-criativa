# requisitos.md — Módulo de Recomendação de Produtos (Origem)

Descreve os requisitos do Módulo de Recomendação em histórias de usuário, com critérios de
aceitação verificáveis em notação EARS. Os identificadores (RF-XX / RNF-XX) são os mesmos do
*Documento de Requisitos de Software*, para preservar rastreabilidade entre os dois artefatos.

Os requisitos não funcionais (RNF) descrevem atributos de qualidade do módulo, não um objetivo
de um tipo de usuário específico; por isso são expressos apenas como critérios EARS, sem história
de usuário associada.

---

## RF-01 — Recomendação por similaridade de atributos (baseline)

**História de usuário:** Como comprador, quero ver produtos semelhantes ao que estou
visualizando, para descobrir peças relevantes ao meu interesse mesmo sem histórico de compra.

**Critérios de aceitação (EARS):**
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ calcular, para um produto de referência, uma pontuação de
  similaridade com cada outro produto ativo, somando peso 3 se o artesão for o mesmo, peso 2 se
  a técnica for a mesma e peso 1 se a região for a mesma.
- QUANDO o marketplace solicitar recomendações para um produto de referência, O MÓDULO DE
  RECOMENDAÇÃO DEVERÁ retornar os produtos com pontuação maior que zero, ordenados por pontuação
  decrescente.
- QUANDO dois ou mais produtos candidatos tiverem a mesma pontuação, O MÓDULO DE RECOMENDAÇÃO
  DEVERÁ desempatar na seguinte ordem: maior média de avaliações, maior quantidade vendida e,
  por último, produto cadastrado mais recentemente.
- SE nenhum outro produto ativo compartilhar artesão, técnica ou região com o produto de
  referência, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ acionar a estratégia de popularidade (RF-07)
  para completar a lista.

## RF-02 — Exposição via API REST

**História de usuário:** Como frontend do Origem, quero consultar recomendações por meio de uma
API HTTP, para exibi-las na página de detalhe do produto sem depender de cálculo no navegador.

**Critérios de aceitação (EARS):**
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ expor a rota `GET /produtos/:id/recomendados`, recebendo o
  identificador do produto de referência e o parâmetro opcional `limite`.
- QUANDO a rota for chamada com um `id` de produto existente, O MÓDULO DE RECOMENDAÇÃO DEVERÁ
  responder com HTTP 200 e uma lista de produtos recomendados em formato JSON, contendo, para
  cada item, `id`, `nome`, `criterio` e `score`.
- SE o `id` informado não corresponder a nenhum produto existente, ENTÃO O MÓDULO DE
  RECOMENDAÇÃO DEVERÁ responder com HTTP 404 e uma mensagem de erro legível.

## RF-03 — Registro das recomendações (recomendacao_log)

**História de usuário:** Como equipe do Origem, quero que toda recomendação exibida fique
registrada, para poder auditar e evoluir a estratégia de recomendação com dados reais.

**Critérios de aceitação (EARS):**
- QUANDO uma lista de recomendações for retornada a uma requisição, O MÓDULO DE RECOMENDAÇÃO
  DEVERÁ registrar, para cada produto recomendado, uma linha em `recomendacao_log` contendo
  `produto_id`, `criterio`, `score` e a data/hora.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ gravar em `criterio` exatamente um dos valores
  `mesmo-artesao`, `mesma-tecnica`, `mesma-regiao`, `popularidade` ou `historico-compra`.
- QUANDO o usuário estiver autenticado, O MÓDULO DE RECOMENDAÇÃO DEVERÁ preencher também
  `usuario_id` no registro de `recomendacao_log`.
- SE o usuário não estiver autenticado, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ registrar a
  recomendação com `usuario_id` nulo, sem bloquear o registro do restante dos dados.
- SE a gravação em `recomendacao_log` falhar, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ ainda assim
  responder a lista de recomendações ao sistema principal, registrando a falha de escrita.

## RF-04 — Filtragem de elegibilidade

**História de usuário:** Como comprador, quero que as recomendações mostrem apenas produtos que
eu realmente posso comprar, para não perder tempo com itens indisponíveis.

**Critérios de aceitação (EARS):**
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ excluir da lista de candidatos o próprio produto de
  referência.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ excluir produtos com `status` diferente de `ativo`.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ excluir produtos com `estoque` igual a zero.

## RF-05 — Parametrização da quantidade retornada

**História de usuário:** Como frontend do Origem, quero controlar quantos itens recomendados
recebo, para adaptar o layout de cada tela (ex.: 4 na página de produto, mais itens na home).

**Critérios de aceitação (EARS):**
- QUANDO o parâmetro `limite` for informado com um valor inteiro entre 1 e 20, O MÓDULO DE
  RECOMENDAÇÃO DEVERÁ retornar no máximo essa quantidade de produtos.
- SE o parâmetro `limite` não for informado, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar, no
  máximo, 4 produtos na rota `GET /produtos/:id/recomendados` e 8 produtos na rota
  `GET /usuarios/:id/recomendados`.
- SE o parâmetro `limite` for não numérico ou estiver fora do intervalo de 1 a 20, ENTÃO O
  MÓDULO DE RECOMENDAÇÃO DEVERÁ responder com HTTP 400 e uma mensagem de erro legível.

## RF-06 — Recomendação personalizada por histórico de compra

**História de usuário:** Como comprador com pedidos anteriores, quero receber recomendações
alinhadas ao que já comprei, para descobrir produtos relevantes na página inicial.

**Critérios de aceitação (EARS):**
- QUANDO um comprador autenticado com ao menos um pedido anterior acessar a página inicial, O
  MÓDULO DE RECOMENDAÇÃO DEVERÁ compor uma lista de produtos considerando as categorias e
  técnicas dos itens já comprados por ele.
- SE o comprador autenticado não possuir nenhum pedido anterior, ENTÃO O MÓDULO DE RECOMENDAÇÃO
  DEVERÁ acionar a estratégia de popularidade (RF-07) no lugar da recomendação por histórico.
- SE a requisição à rota `GET /usuarios/:id/recomendados` não apresentar autenticação válida,
  ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ responder com HTTP 401.
- SE o `id` solicitado na rota `GET /usuarios/:id/recomendados` for diferente do usuário
  autenticado, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ responder com HTTP 403, sem retornar
  nenhuma recomendação.

## RF-07 — Recomendação por popularidade (fallback)

**História de usuário:** Como comprador sem histórico de navegação/compra suficiente, quero
ainda assim ver produtos relevantes, para poder descobrir o catálogo desde a primeira visita.

**Critérios de aceitação (EARS):**
- QUANDO a similaridade de atributos (RF-01) retornar menos produtos que o `limite` solicitado,
  O MÓDULO DE RECOMENDAÇÃO DEVERÁ completar a lista com produtos populares, ordenados por
  quantidade de vendas e/ou média de avaliações.
- QUANDO o marketplace solicitar cinco recomendações para um usuário sem histórico, O MÓDULO DE
  RECOMENDAÇÃO DEVERÁ retornar cinco itens elegíveis utilizando a estratégia de popularidade
  definida no projeto.

## RF-08 — Degradação graciosa em caso de falha

**História de usuário:** Como comprador, quero continuar navegando pelo catálogo mesmo se as
recomendações falharem, para que um problema pontual não me impeça de comprar.

**Critérios de aceitação (EARS):**
- SE a chamada ao módulo de recomendação falhar ou exceder o tempo limite, ENTÃO O MÓDULO DE
  RECOMENDAÇÃO DEVERÁ responder com um código de erro estável (HTTP 503), sem lançar exceção não
  tratada nem deixar a requisição pendente.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ manter esse contrato de erro estável, de modo que o sistema
  principal consiga ocultar a seção de recomendações e continuar exibindo normalmente as demais
  informações da tela (produto, avaliações, carrinho), sem bloquear a navegação do usuário.

---

## Requisitos não funcionais

### RNF-01 — Desempenho
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ responder a requisições de recomendação em até 300 ms no
  percentil 95, medido no ambiente de avaliação do projeto.

### RNF-02 — Disponibilidade e resiliência
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ encerrar toda requisição em, no máximo, 500 ms de tempo
  limite (timeout), respondendo HTTP 503 ao estourar esse tempo, de modo que uma falha ou
  lentidão do módulo nunca impeça a renderização das demais informações da tela (produto,
  avaliações, carrinho) no sistema principal (ver RF-08).

### RNF-03 — Privacidade
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ utilizar como entrada de suas estratégias exclusivamente
  atributos de produto (artesão, técnica, região, categoria, status, estoque) e sinais agregados
  de comportamento (quantidade vendida, média de avaliações, categorias/técnicas já compradas),
  não recebendo CPF, endereço ou dados de pagamento do comprador.

### RNF-04 — Auditabilidade
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ manter, em cada registro de `recomendacao_log`, o critério
  (`criterio`) que originou a recomendação, de forma a permitir auditoria posterior.

### RNF-05 — Escalabilidade
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ calcular similaridade sem percorrer o catálogo completo mais
  de uma vez por requisição, evitando complexidade quadrática perceptível com o crescimento do
  catálogo.

### RNF-06 — Ausência de viés sistemático de favorecimento
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ aplicar os mesmos critérios de pontuação (RF-01, RF-07) a
  todos os artesãos elegíveis, sem oferecer nenhuma forma de pagamento por destaque nas
  recomendações.
- QUANDO um mesmo artesão tiver múltiplos produtos elegíveis para a mesma lista de
  recomendações, O MÓDULO DE RECOMENDAÇÃO DEVERÁ limitar a, no máximo, 2 produtos desse artesão
  simultaneamente na lista.

### RNF-07 — Observabilidade
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ permitir consultar, a partir de `recomendacao_log`, a
  quantidade de recomendações geradas por critério em um período.

---

## Rastreabilidade

Todo requisito acima (RF-01 a RF-08, RNF-01 a RNF-07) corresponde, com o mesmo identificador, a
uma linha das tabelas de Requisitos Funcionais e Não Funcionais do *Documento de Requisitos de
Software* deste projeto (seções 8 e 9), e aparece na matriz de rastreabilidade da seção 14 do
mesmo documento.

As regras de negócio RN-01 a RN-07 do *Documento de Requisitos de Software* (seção 4.4) estão
refletidas nos critérios EARS acima da seguinte forma:

| Regra | Onde aparece neste arquivo |
|---|---|
| RN-01 (produto ativo, com estoque, de artesão aprovado) | RF-04 |
| RN-02 (produto de referência nunca aparece na lista) | RF-04 |
| RN-03 (pesos 3/2/1 do baseline) | RF-01 |
| RN-04 (ordem de desempate) | RF-01 |
| RN-05 (máximo de 2 produtos do mesmo artesão) | RNF-06 |
| RN-06 (limite entre 1 e 20; padrão 4 e 8) | RF-05 |
| RN-07 (sem pagamento por destaque) | RNF-06 |
