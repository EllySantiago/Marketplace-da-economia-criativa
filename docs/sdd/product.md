# product.md — Módulo de Recomendação de Produtos (Origem)

## Contexto do projeto principal

Origem é uma aplicação web full stack que conecta artesãos e empreendedores criativos de
Pernambuco a compradores de todo o país: vitrine, busca por técnica/região, filtros, perfil do
artesão, carrinho, checkout, painéis de gestão e recomendação. Avaliação 1 entregou o frontend
(Next.js) com uma Fake API; Avaliação 2 introduz o backend real (Node/Express + PostgreSQL),
modelado em `docs/Origem_DDL.md`, que já reserva as tabelas `classificacao_produto` e
`recomendacao_log` para os módulos de IA do produto. Este documento trata apenas do módulo de
recomendação — item #15 do backlog priorizado do Origem (EP8, HU15).

## Problema de negócio / necessidade do usuário

Hoje a recomendação é calculada inteiramente no frontend (`recomendacoesService.recomendarSimilares`),
sobre dados em memória da Fake API, sem persistência e sem nenhum registro que permita à equipe
avaliar se as recomendações são relevantes. O catálogo do Origem reúne produtos de vários polos
artesanais de Pernambuco (Alto do Moura, Renda Renascença de Pesqueira/Recife, entalhe em madeira
de Olinda, couro do sertão do São Francisco), o que dificulta a descoberta espontânea de peças
relevantes pelo comprador e reduz a exposição de artesãos com catálogo pequeno. O problema de
negócio é baixa descoberta (*discovery*) de produtos relevantes no catálogo.

## Público-alvo

- **Compradores** (autenticados ou anônimos) navegando pelo catálogo Origem — recebem as
  recomendações.
- **Artesãos aprovados** — beneficiados indiretamente pela maior exposição de seus produtos.
- Indiretamente, a **equipe Origem/administradores**, interessada na qualidade e auditabilidade
  do que é recomendado.

## Objetivo do módulo

Recomendar produtos do catálogo Origem relevantes ao contexto de navegação do comprador (produto
que está visualizando) ou ao seu histórico (quando autenticado), com uma estratégia baseline
auditável — similaridade de atributos (artesão/técnica/região) mais popularidade como fallback —
registrando toda recomendação exibida em `recomendacao_log` para permitir evolução futura da
estratégia com dados comportamentais reais.

## Benefícios esperados

- Aumento da taxa de descoberta de produtos ("Você também pode gostar").
- Maior exposição de artesãos com catálogo pequeno, via recomendação por técnica/região.
- Base de dados (`recomendacao_log`) para evoluir a estratégia com dados de comportamento reais
  em uma avaliação futura.
- Vitrine e página de produto continuam funcionando mesmo se o módulo de recomendação falhar
  (degradação graciosa).

## Limites do produto

- Não é um mecanismo de publicidade paga — nenhum artesão pode pagar para aparecer mais.
- Recomenda apenas **produtos**, nunca artesãos, serviços ou anúncios diretamente.
- Não decide preço, frete ou disponibilidade — apenas sugere produtos já elegíveis (ativos, com
  estoque).
- Não processa dados sensíveis do comprador (CPF, endereço, dados de pagamento).
- Nesta fase, a estratégia é um baseline por regras (similaridade de atributos + popularidade);
  um modelo de aprendizado de máquina treinado fica fora do escopo desta entrega, conforme a
  regra de escopo do backlog do Origem: "começar a IA pelo baseline antes de modelos mais
  sofisticados".
