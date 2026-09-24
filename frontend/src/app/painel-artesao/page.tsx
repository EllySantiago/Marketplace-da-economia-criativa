"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useArtesao } from "@/hooks/useArtesoes";
import { useProdutos, useRemoverProduto } from "@/hooks/useProdutos";
import { usePedidos } from "@/hooks/usePedidos";
import Sidebar from "@/components/layout/Sidebar";
import ProductForm from "@/components/forms/ProductForm";
import ProductManageCard from "@/components/produto/ProductManageCard";
import OrderStatus, { rotulosStatus } from "@/components/pedido/OrderStatus";
import { obterProximosStatus } from "@/services/api/pedidos.service";
import LoadingState from "@/components/feedback/LoadingState";
import ErrorState from "@/components/feedback/ErrorState";
import EmptyState from "@/components/feedback/EmptyState";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateShort } from "@/utils/formatDate";
import { ROTAS } from "@/constants/rotas";
import type { Produto } from "@/types/produto";
import type { StatusPedido } from "@/types/pedido";

type Secao = "overview" | "catalog" | "add" | "orders" | "stock";

const itensMenu = [
  { id: "overview", label: "Visão Geral", icone: "▦" },
  { id: "catalog", label: "Meu Catálogo", icone: "⊞" },
  { id: "add", label: "Adicionar Produto", icone: "+" },
  { id: "orders", label: "Pedidos", icone: "📦" },
  { id: "stock", label: "Estoque", icone: "📋" },
] as const;

function MetricCard({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="metric-card">
      <p className="text-xs uppercase tracking-[.08em] text-[#888]">{label}</p>
      <p className="font-display mt-2 text-2xl text-[#2C2C2C]">{valor}</p>
    </div>
  );
}

export default function PainelArtesaoPage() {
  const { usuario, estaAutenticado } = useAuth();
  const [secao, setSecao] = useState<Secao>("overview");
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const [statusSelecionado, setStatusSelecionado] = useState<Record<string, StatusPedido | "">>({});
  const artesaoId = usuario?.artesaoId ?? -1;

  const { artesao } = useArtesao(artesaoId);
  const { produtos, carregando: carregandoProdutos, erro: erroProdutos, recarregar } = useProdutos({ artesaoId });
  const {
    pedidos,
    carregando: carregandoPedidos,
    erro: erroPedidos,
    atualizarStatus,
    salvandoCodigo,
    erroAtualizacao,
  } = usePedidos({ tipo: "artesao", artesaoId });
  const { remover, removendo } = useRemoverProduto();

  const metricas = useMemo(() => {
    const vendasTotais = pedidos.reduce(
      (soma, pedido) => soma + pedido.itens.filter((item) => item.produto.artesaoId === artesaoId).reduce((sub, item) => sub + item.produto.preco * item.quantidade, 0),
      0,
    );
    const pedidosPendentes = pedidos.filter((pedido) => pedido.status === "pendente" || pedido.status === "confirmado").length;
    return { vendasTotais, produtosAtivos: produtos.filter((produto) => produto.status === "ativo").length, pedidosPendentes };
  }, [pedidos, produtos, artesaoId]);

  function irParaSecao(destino: Secao) {
    setProdutoEmEdicao(null);
    setSecao(destino);
  }

  function editarProduto(produto: Produto) {
    setProdutoEmEdicao(produto);
    setSecao("add");
  }

  async function removerProduto(produto: Produto) {
    if (!window.confirm(`Remover "${produto.nome}" do catálogo?`)) return;
    const ok = await remover(produto.id);
    if (ok) recarregar();
  }

  async function salvarStatus(codigo: string) {
    const novoStatus = statusSelecionado[codigo];
    if (!novoStatus) return;
    try {
      await atualizarStatus(codigo, novoStatus);
      setStatusSelecionado((atual) => ({ ...atual, [codigo]: "" }));
    } catch {
      // Erro já fica visível na tela via erroAtualizacao (setado dentro de atualizarStatus);
      // nada mais a fazer aqui além de deixar o statusSelecionado como estava, pra
      // o artesão poder tentar salvar de novo sem escolher a opção outra vez.
    }
  }

  if (!estaAutenticado || !usuario || usuario.perfil !== "artesao") {
    return (
      <main className="mx-auto max-w-[600px] px-6 py-20">
        <EmptyState titulo="Área exclusiva para artesãos" mensagem="Entre com uma conta de artesão para acessar o painel." acaoHref={ROTAS.login} acaoLabel="Entrar" />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F0EB]">
      <Sidebar
        titulo="Painel do Artesão"
        subtitulo={artesao ? `${artesao.cidade} · ${artesao.regiao}` : usuario.nome}
        itens={itensMenu.map((item) => ({ ...item, ativo: secao === item.id, onClick: () => irParaSecao(item.id) }))}
        corFundo="#1B4332"
      />
      <main className="flex-1 p-6 md:p-10">
        <nav className="show-mobile mb-8 flex flex-wrap gap-2">
          {itensMenu.map((item) => (
            <button key={item.id} type="button" onClick={() => irParaSecao(item.id)} className={`filter-pill ${secao === item.id ? "active" : ""}`}>
              {item.label}
            </button>
          ))}
        </nav>

        {artesao && !artesao.aprovado && (
          <div className="mb-8 border border-[#FEF3C7] bg-[#FFFBEB] p-4 text-sm text-[#92400E]">
            <strong>Cadastro em análise:</strong> seu perfil de artesão ainda não foi aprovado pela administração do Origem. Você já pode preparar seu catálogo, mas suas peças só ficam visíveis na vitrine pública depois da aprovação.
          </div>
        )}

        {secao === "overview" && (
          <section>
            <h1 className="font-display mb-6 text-3xl">Visão geral</h1>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <MetricCard label="Vendas Totais" valor={formatCurrency(metricas.vendasTotais)} />
              <MetricCard label="Produtos Ativos" valor={String(metricas.produtosAtivos)} />
              <MetricCard label="Pedidos Pendentes" valor={String(metricas.pedidosPendentes)} />
            </div>
            <h2 className="font-display mb-4 mt-10 text-xl">Pedidos recentes</h2>
            {carregandoPedidos && <LoadingState variante="lista" itens={3} />}
            {!carregandoPedidos && erroPedidos && <ErrorState mensagem={erroPedidos} />}
            {!carregandoPedidos && !erroPedidos && pedidos.length === 0 && <EmptyState titulo="Nenhum pedido recebido ainda" />}
            {!carregandoPedidos && pedidos.length > 0 && (
              <div className="overflow-x-auto bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="table-row">
                      <th>Pedido</th>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.slice(0, 8).map((pedido) => (
                      <tr key={pedido.codigo} className="table-row">
                        <td>{pedido.codigo}</td>
                        <td>{pedido.clienteEmail}</td>
                        <td>{formatDateShort(pedido.data)}</td>
                        <td>
                          <OrderStatus status={pedido.status} />
                        </td>
                        <td>{formatCurrency(pedido.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {secao === "catalog" && (
          <section>
            <h1 className="font-display mb-6 text-3xl">Meu catálogo</h1>
            {carregandoProdutos && <LoadingState variante="grid" itens={4} />}
            {!carregandoProdutos && erroProdutos && <ErrorState mensagem={erroProdutos} onTentarNovamente={recarregar} />}
            {!carregandoProdutos && !erroProdutos && produtos.length === 0 && (
              <EmptyState titulo="Você ainda não publicou nenhum produto" mensagem='Use a aba "Adicionar Produto" para publicar sua primeira peça.' />
            )}
            {!carregandoProdutos && produtos.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {produtos.map((produto) => (
                  <ProductManageCard key={produto.id} produto={produto} onEditar={editarProduto} onRemover={removerProduto} removendo={removendo} />
                ))}
              </div>
            )}
          </section>
        )}

        {secao === "add" && (
          <section>
            <h1 className="font-display mb-6 text-3xl">{produtoEmEdicao ? "Editar produto" : "Adicionar produto"}</h1>
            <ProductForm
              artesaoId={artesaoId}
              regiaoPadrao={artesao?.regiao}
              produtoExistente={produtoEmEdicao}
              onCancelarEdicao={() => setProdutoEmEdicao(null)}
              onSalvo={() => {
                setProdutoEmEdicao(null);
                recarregar();
              }}
            />
          </section>
        )}

        {secao === "orders" && (
          <section>
            <h1 className="font-display mb-6 text-3xl">Pedidos</h1>
            {carregandoPedidos && <LoadingState variante="lista" itens={4} />}
            {!carregandoPedidos && erroPedidos && <ErrorState mensagem={erroPedidos} />}
            {!carregandoPedidos && erroAtualizacao && <ErrorState mensagem={erroAtualizacao} />}
            {!carregandoPedidos && !erroPedidos && pedidos.length === 0 && <EmptyState titulo="Nenhum pedido recebido ainda" />}
            {!carregandoPedidos && pedidos.length > 0 && (
              <div className="space-y-3">
                {pedidos.map((pedido) => (
                  <Card key={pedido.codigo} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-semibold">{pedido.codigo}</p>
                      <p className="text-xs text-[#888]">
                        {pedido.clienteEmail} · {formatDateShort(pedido.data)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <OrderStatus status={pedido.status} />
                      {obterProximosStatus(pedido.status).length > 0 && (
                        <>
                          <select
                            aria-label={`Próximo status do pedido ${pedido.codigo}`}
                            value={statusSelecionado[pedido.codigo] ?? ""}
                            disabled={salvandoCodigo === pedido.codigo}
                            onChange={(evento) => setStatusSelecionado((atual) => ({ ...atual, [pedido.codigo]: evento.target.value as StatusPedido | "" }))}
                            className="border border-[#E8E0D5] bg-white px-2 py-1 text-sm disabled:opacity-50"
                          >
                            <option value="">Atualizar status</option>
                            {obterProximosStatus(pedido.status).map((status) => (
                              <option key={status} value={status}>
                                {rotulosStatus[status]}
                              </option>
                            ))}
                          </select>
                          {salvandoCodigo === pedido.codigo && <LoadingState variante="texto" mensagem="Salvando status..." />}
                          <button
                            type="button"
                            onClick={() => void salvarStatus(pedido.codigo)}
                            disabled={salvandoCodigo === pedido.codigo || !statusSelecionado[pedido.codigo]}
                            className="btn-outline px-3 py-1 text-sm disabled:opacity-50"
                          >
                            Salvar
                          </button>
                        </>
                      )}
                    </div>
                    <span className="font-semibold text-[#C1522A]">{formatCurrency(pedido.total)}</span>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {secao === "stock" && (
          <section>
            <h1 className="font-display mb-6 text-3xl">Estoque</h1>
            {carregandoProdutos && <LoadingState variante="lista" itens={4} />}
            {!carregandoProdutos && produtos.length === 0 && <EmptyState titulo="Nenhum produto cadastrado" />}
            {!carregandoProdutos && produtos.length > 0 && (
              <div className="overflow-x-auto bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="table-row">
                      <th>Produto</th>
                      <th>Preço</th>
                      <th>Estoque</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((produto) => (
                      <tr key={produto.id} className="table-row">
                        <td>
                          <Link href={ROTAS.produto(produto.id)} className="hover:text-[#C1522A]">
                            {produto.nome}
                          </Link>
                        </td>
                        <td>{formatCurrency(produto.preco)}</td>
                        <td>{produto.estoque}</td>
                        <td>
                          <span className={produto.estoque === 0 ? "text-[#dc2626]" : produto.estoque > 3 ? "text-[#2D6A4F]" : "text-[#92400E]"}>
                            {produto.estoque === 0 ? "Esgotado" : produto.estoque > 3 ? "Normal" : "Baixo"}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => editarProduto(produto)} className="border border-[#E8E0D5] bg-white px-2 py-1 text-xs font-semibold text-[#555]">
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => removerProduto(produto)}
                              disabled={removendo}
                              className="border border-[#fee2e2] bg-[#FFF5F5] px-2 py-1 text-xs font-semibold text-[#dc2626] disabled:opacity-50"
                            >
                              Remover
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
