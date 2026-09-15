# Registro de uso de IA generativa — Origem

Este documento registra, de forma transparente, onde e como ferramentas de IA generativa
foram usadas na construção do projeto Origem, conforme exigido pela disciplina.

## 1. Figma Make — protótipo visual

A interface do marketplace (vitrine, catálogo, detalhe de produto, perfil do artesão,
carrinho, painel do artesão, painel administrativo, login/cadastro e confirmação de pedido)
foi inicialmente gerada com o **Figma Make** a partir do briefing do projeto (artesanato e
economia criativa de Pernambuco), produzindo um protótipo React autocontido com dados de
exemplo fixos no próprio código.

Esse protótipo serviu **apenas como referência visual e estrutural** — layout, paleta de
cores (`src/styles/global.css`), tipografia (Fraunces + Inter) e composição de cada tela. Ele
não foi entregue como está: cada página foi reimplementada na arquitetura real do projeto
(`app/`, `components/`, `hooks/`, `services/`, `store/`), eliminando todos os dados fixos e
conectando-a à Fake API. O protótipo original foi removido do repositório após a portagem,
para não deixar código morto com dados hardcoded.

## 2. Claude Code (Anthropic) — arquitetura, Fake API e integração

A maior parte do trabalho de engenharia registrado neste commit foi feita com o auxílio do
**Claude Code**, atuando como copiloto de desenvolvimento sobre o repositório já criado pela
equipe (estrutura de pastas, DDL do banco em `docs/Origem_DDL.md`, parte dos tipos/serviços
iniciais). Especificamente, a IA:

- Levantou o estado real do repositório (o que já existia vs. o que era só estrutura vazia)
  antes de qualquer alteração, para não descartar trabalho da equipe.
- Completou as interfaces TypeScript de domínio (`src/types/`) e os dados sintéticos de
  artesanato pernambucano (`src/mocks/`), com base em referências reais de técnicas e regiões
  (Alto do Moura, Renda Renascença de Pesqueira/Recife, entalhe em madeira de Olinda, couro do
  sertão do São Francisco).
- Implementou a Fake API assíncrona (`src/services/api/`), incluindo a regra de baixa de
  estoque no checkout descrita no DDL (seção 7).
- Implementou o estado global (Zustand) do carrinho e da sessão de usuário
  (`src/store/cartStore.ts`, `src/store/authStore.ts`) e os hooks que os expõem aos
  componentes (`src/hooks/`).
- Reconstruiu as páginas e componentes visuais a partir do protótipo do Figma Make, agora
  consumindo a Fake API por meio dos hooks, com tratamento explícito dos três estados
  (`LoadingState`, `ErrorState`, `EmptyState`) em toda tela que busca dados.
- Redigiu este conjunto de documentos (`docs/arquitetura.md`, `docs/api.md` e este arquivo).
- Validou o resultado com `tsc --noEmit`, `next build` e verificação manual de todas as rotas
  em ambiente de desenvolvimento antes de considerar a tarefa concluída.

Todo o código gerado foi revisado quanto à compilação (TypeScript `strict`, sem `any`) e ao
comportamento das rotas antes da entrega; decisões de modelagem (ex.: simplificações de
autenticação e persistência, listadas em `docs/arquitetura.md`, seção 4) foram deliberadas e
documentadas, não deixadas como lacunas silenciosas.

## 3. Outras ferramentas

*(Espaço reservado para a equipe registrar o uso de outras IAs — ex.: ChatGPT para textos de
apoio, brainstorm de nomes/copy, ou revisão de conteúdo — indicando ferramenta, trecho do
projeto em que foi usada e o que foi gerado por IA vs. revisado/ajustado pela equipe.)*

## 4. Responsabilidade final

Conforme orientação da disciplina, o uso de IA generativa foi tratado como apoio ao
desenvolvimento, não como substituto do entendimento do time sobre a solução: a equipe é
responsável por revisar, entender e defender qualquer trecho de código ou decisão de
arquitetura registrado neste repositório.
