/**
 * Fila assíncrona simples (em memória) — desacopla o "efeito colateral" do checkout
 * (aqui, simulando uma notificação de pedido confirmado) do trecho síncrono que
 * responde ao comprador.
 *
 * Por que isso importa: o comprador não deveria esperar o tempo de enviar notificação/
 * e-mail pra receber a confirmação do pedido. A ideia da fila é: o checkout só PUBLICA
 * um evento ("pedido X confirmado") e devolve a resposta pro comprador imediatamente;
 * um worker separado consome essa fila no próprio ritmo dele, sem bloquear o checkout.
 *
 * Isso é a mesma ideia de RabbitMQ/BullMQ+Redis, só que sem infraestrutura externa —
 * dá pra trocar por uma dessas depois, sem mudar a lógica de quem publica e quem
 * consome (o "contrato" continua: publicar(evento) / processar(evento)).
 */

class FilaAssincrona {
  constructor({ atrasoProcessamentoMs = 300 } = {}) {
    this._pendentes = [];
    this._processando = false;
    this._atraso = atrasoProcessamentoMs;
    this.log = []; // histórico de eventos processados, usado como evidência na demo
  }

  publicar(evento) {
    this._pendentes.push({ ...evento, publicadoEm: Date.now() });
    this._processarProximo(); // dispara o worker sem bloquear quem publicou
  }

  async _processarProximo() {
    if (this._processando) return; // já existe um worker rodando, não duplica
    const proximo = this._pendentes.shift();
    if (!proximo) return;

    this._processando = true;
    await new Promise((resolve) => setTimeout(resolve, this._atraso)); // simula I/O (envio de e-mail/push)

    const processadoEm = Date.now();
    this.log.push({
      ...proximo,
      processadoEm,
      latenciaMs: processadoEm - proximo.publicadoEm,
    });
    console.log(
      `[fila] processado: ${proximo.tipo} (pedido ${proximo.codigoPedido}) — ` +
        `${processadoEm - proximo.publicadoEm}ms depois de publicado`,
    );

    this._processando = false;
    this._processarProximo(); // continua consumindo o resto da fila
  }
}

module.exports = { FilaAssincrona };
