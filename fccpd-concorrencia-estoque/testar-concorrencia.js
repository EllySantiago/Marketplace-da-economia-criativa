/**
 * Dispara N requisições de checkout ao mesmo tempo contra o mesmo produto (estoque = 1)
 * e imprime quantas tiveram sucesso — essa é a "evidência de consistência" pedida.
 *
 * Uso:
 *   1. Num terminal: npm start   (sobe o servidor em http://localhost:3001)
 *   2. Noutro terminal: npm run demo
 */

const BASE_URL = "http://localhost:3001";
const PRODUTO = "produto-teste";
const REQUISICOES_CONCORRENTES = 10;

async function resetarEstoque() {
  await fetch(`${BASE_URL}/estoque/${PRODUTO}/reset`, { method: "POST" });
}

async function dispararConcorrente(caminho) {
  const requisicoes = Array.from({ length: REQUISICOES_CONCORRENTES }, () =>
    fetch(`${BASE_URL}/${caminho}/${PRODUTO}`, { method: "POST" }).then((r) => r.json()),
  );
  return Promise.all(requisicoes);
}

function resumir(resultados) {
  const sucessos = resultados.filter((r) => r.ok).length;
  const falhas = resultados.length - sucessos;
  return { sucessos, falhas };
}

async function main() {
  console.log(`Disparando ${REQUISICOES_CONCORRENTES} requisições simultâneas para estoque = 1\n`);

  console.log("== SEM lock (endpoint ingênuo) ==");
  await resetarEstoque();
  const semLock = resumir(await dispararConcorrente("checkout-sem-lock"));
  const estoqueFinalSemLock = await (await fetch(`${BASE_URL}/estoque/${PRODUTO}`)).json();
  console.log(`Sucessos: ${semLock.sucessos} | Falhas: ${semLock.falhas}`);
  console.log(`Estoque final: ${estoqueFinalSemLock.estoque} (esperado: 0, nunca negativo)`);
  if (semLock.sucessos > 1 || estoqueFinalSemLock.estoque < 0) {
    console.log("⚠️  CONDIÇÃO DE CORRIDA CONFIRMADA — mais de uma venda ou estoque negativo.\n");
  } else {
    console.log(
      "(Não reproduziu desta vez — condição de corrida é probabilística; rode de novo com npm run demo.)\n",
    );
  }

  console.log("== COM lock (endpoint protegido) ==");
  await resetarEstoque();
  const comLock = resumir(await dispararConcorrente("checkout-com-lock"));
  const estoqueFinalComLock = await (await fetch(`${BASE_URL}/estoque/${PRODUTO}`)).json();
  console.log(`Sucessos: ${comLock.sucessos} | Falhas: ${comLock.falhas}`);
  console.log(`Estoque final: ${estoqueFinalComLock.estoque} (esperado: 0)`);
  console.log(
    comLock.sucessos === 1
      ? "✅ CONSISTÊNCIA GARANTIDA — exatamente 1 venda, como deveria ser.\n"
      : "❌ algo está errado, revisar o lock.\n",
  );

  await pausa(600); // dá tempo da fila assíncrona processar o evento do checkout com sucesso
  const logFila = await (await fetch(`${BASE_URL}/fila/log`)).json();
  console.log("== Fila assíncrona (eventos processados) ==");
  console.log(logFila);
}

function pausa(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((erro) => {
  console.error("Erro ao rodar a demonstração:", erro);
  process.exit(1);
});
