/**
 * Lock (mutex) por chave — o "trecho concorrente" desta entrega.
 *
 * Por que isso resolve a condição de corrida:
 * Sem lock, duas requisições concorrentes podem "ler" o mesmo estoque (ex.: 1 unidade)
 * antes de qualquer uma delas terminar de "escrever" a baixa. As duas veem estoque > 0,
 * as duas decidem vender, e o estoque vira negativo — a clássica corrida de
 * "check-then-act" (verifica, depois age) sem atomicidade.
 *
 * A ideia aqui é simples: para cada chave (ex.: cada produtoId), mantemos uma "fila de
 * promises". Quando uma requisição pede o lock para o produto X, ela recebe uma promise
 * que só resolve depois que a requisição anterior daquele MESMO produto terminou seu
 * trecho crítico. Ou seja, cada acesso ao mesmo produto passa a ser SERIALIZADO — nunca
 * duas requisições disputando o mesmo estoque executam o "ler + decidir + gravar" ao
 * mesmo tempo. Produtos diferentes continuam liberados em paralelo (o lock é por chave,
 * não global), então isso não vira um gargalo pra loja inteira.
 *
 * Isso é o equivalente, em memória, a um "SELECT ... FOR UPDATE" de um banco relacional:
 * ambos garantem que o trecho crítico rode com exclusividade para aquele registro.
 */

class LockManager {
  constructor() {
    this._filas = new Map(); // chave -> promise da última operação enfileirada
  }

  /**
   * Executa `tarefa` com exclusividade para `chave`. Se já existir uma tarefa em
   * andamento para essa chave, a nova só começa quando a anterior terminar (com sucesso
   * ou erro). Retorna o resultado (ou propaga o erro) de `tarefa`.
   */
  async comExclusividade(chave, tarefa) {
    const anterior = this._filas.get(chave) ?? Promise.resolve();

    // Encadeia a nova tarefa depois da anterior, engolindo erro da anterior pra não
    // travar a fila caso ela tenha rejeitado.
    const atual = anterior.catch(() => {}).then(tarefa);

    // Registra essa execução como a "última da fila" pra quem vier em seguida esperar.
    this._filas.set(chave, atual.catch(() => {}));

    return atual;
  }
}

module.exports = { LockManager };
