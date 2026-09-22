#!/usr/bin/env bash
# ============================================================================
# [FCCPD — Etapa 3] Roda a bateria completa e salva tudo em evidencias/.
#
# Uso (a partir da pasta backend/):
#     npm run evidencias
#
# Pré-requisitos:
#   1. docker compose up -d   (banco de pé)
#   2. npm run api            (API de pé, em outro terminal)
#   3. NENHUM `npm run worker` rodando — o teste da fila sobe os workers dele
#      mesmo; um worker extra roubaria os jobs e falsearia o resultado.
#
# `set -e` aborta na primeira falha. `set -o pipefail` é indispensável aqui:
# sem ele, `node teste.js | tee arquivo` é considerado bem-sucedido sempre que o
# `tee` termina bem — mesmo que o node tenha explodido. O roteiro seguiria em
# frente gravando "evidência" de um teste que nem rodou.
# ============================================================================
set -e
set -o pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$(dirname "$AQUI")"
EVIDENCIAS="$(dirname "$BACKEND")/evidencias"
mkdir -p "$EVIDENCIAS"
cd "$BACKEND"

API="${API:-http://localhost:3333}"
if ! curl -sf "$API/saude" > /dev/null; then
  echo "✖ A API não respondeu em $API. Suba com: npm run api"
  exit 1
fi

if pgrep -f "node src/worker.js" > /dev/null; then
  echo "✖ Há um worker rodando. Encerre-o (Ctrl+C) antes: o teste da fila sobe os seus próprios."
  exit 1
fi

echo "Evidências serão gravadas em: $EVIDENCIAS"
echo

# `tee` mostra na tela E grava no arquivo ao mesmo tempo.
echo "▶ 1/4 — checkout INGÊNUO (a versão com race condition)"
node testes/teste-concorrencia.js --rota=/pedidos-naive --requisicoes=50 --estoque=10 \
  | tee "$EVIDENCIAS/01-checkout-ingenuo.txt"
echo

echo "▶ 2/4 — checkout SEGURO (UPDATE condicional)"
node testes/teste-concorrencia.js --rota=/pedidos --requisicoes=50 --estoque=10 \
  | tee "$EVIDENCIAS/02-checkout-seguro.txt"
echo

echo "▶ 3/4 — deadlock (carrinhos em ordem inversa)"
node testes/teste-deadlock.js --requisicoes=40 \
  | tee "$EVIDENCIAS/03-deadlock.txt"
echo

echo "▶ 4/4 — fila assíncrona (queda do worker, backoff, dead-letter, SKIP LOCKED)"
node testes/teste-fila.js --jobs=200 \
  | tee "$EVIDENCIAS/04-fila.txt"
echo

# Estado final do banco, direto do psql: prova independente dos scripts em JS.
echo "▶ extra — fotografia final do banco"
{
  echo "Consultas feitas direto no PostgreSQL em $(date --iso-8601=seconds)"
  echo
  docker compose exec -T postgres psql -U origem -d origem \
    -c "SELECT id, nome, estoque FROM produto ORDER BY id;" \
    -c "SELECT status, COUNT(*) FROM evento_assincrono GROUP BY status ORDER BY status;" \
    -c "SELECT COUNT(*) AS notificacoes, COUNT(DISTINCT chave_idempotencia) AS distintas FROM notificacao;" \
    -c "\d evento_assincrono"
} | tee "$EVIDENCIAS/05-estado-do-banco.txt"

echo
echo "✅ Pronto. Arquivos em $EVIDENCIAS:"
ls -1 "$EVIDENCIAS"
