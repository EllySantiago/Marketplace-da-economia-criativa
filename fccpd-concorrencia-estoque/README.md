# FCCPD U1 — Concorrência no checkout/estoque + fila assíncrona

Demonstração isolada (não integrada ainda ao app Next.js/Fake API) do trecho crítico de
concorrência do checkout — cenário da HU09 ("dois compradores tentam adquirir a última
unidade simultaneamente, apenas uma compra é concluída") — e de uma fila assíncrona
desacoplada do fluxo síncrono de resposta.

## Por que existe separado do frontend

O app hoje (`frontend/`) é só client-side com uma "Fake API" em memória no navegador —
não há servidor recebendo requisições concorrentes de verdade, então a condição de
corrida do checkout não tem como acontecer nesse código ainda. Esta pasta é uma prova de
conceito standalone com um servidor de verdade (Express), pra já ter o trecho concorrente
pronto, testado e documentado — e plugar no backend real quando ele existir (Avaliação 2).

## Estrutura

- `lock.js` — mutex por chave (produto), que serializa o trecho crítico do checkout
- `fila.js` — fila assíncrona em memória, desacoplada da resposta síncrona
- `servidor.js` — servidor Express com dois endpoints de checkout: um sem proteção
  (`/checkout-sem-lock`, só pra comparação) e um protegido (`/checkout-com-lock`)
- `testar-concorrencia.js` — dispara 10 requisições simultâneas contra os dois endpoints
  e mede o resultado

## Como rodar

```bash
cd fccpd-concorrencia-estoque
npm install

# terminal 1
npm start

# terminal 2
npm run demo
```

## Evidência de consistência (rodado localmente em 21/09/2026)

Estoque inicial: **1 unidade**. 10 requisições de checkout disparadas ao mesmo tempo
contra esse mesmo produto.

```
== SEM lock (endpoint ingênuo) ==
Sucessos: 10 | Falhas: 0
Estoque final: 0 (esperado: 0, nunca negativo)
⚠️  CONDIÇÃO DE CORRIDA CONFIRMADA — mais de uma venda ou estoque negativo.

== COM lock (endpoint protegido) ==
Sucessos: 1 | Falhas: 9
Estoque final: 0 (esperado: 0)
✅ CONSISTÊNCIA GARANTIDA — exatamente 1 venda, como deveria ser.

== Fila assíncrona (eventos processados) ==
[
  {
    tipo: 'pedido_confirmado',
    codigoPedido: 'PE-1790017237527',
    publicadoEm: 1790017237527,
    processadoEm: 1790017237829,
    latenciaMs: 302
  }
]
```

**Leitura do resultado:** sem controle de concorrência, as 10 requisições concorrentes
"leram" o estoque (1 unidade) antes de qualquer uma delas terminar de gravar a baixa —
todas passaram, vendendo a mesma unidade 10 vezes. Com o lock por produto
(`lock.js`), o trecho crítico (ler → decidir → decrementar) passou a ser serializado:
apenas a primeira requisição a chegar conseguiu a unidade, as outras 9 foram recusadas
corretamente com "sem estoque".

A fila assíncrona mostra o evento de confirmação sendo processado ~300ms **depois** de
publicado, sem que o comprador tenha ficado esperando esse processamento — o checkout
responde antes disso terminar.

## O que ainda falta (fora do escopo desta entrega)

- Integração com o backend real do Origem (Avaliação 2) — aqui o estoque é um objeto em
  memória só para a demonstração
- Trocar a fila em memória por uma solução real (RabbitMQ ou BullMQ+Redis) quando o
  backend existir — a interface `publicar()`/consumo continua a mesma
