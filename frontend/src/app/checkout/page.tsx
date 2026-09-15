"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PublicLayout from "@/components/layout/PublicLayout";
import { useCarrinho } from "@/hooks/useCarrinho";
import { useAuth } from "@/hooks/useAuth";
import { useCriarPedido } from "@/hooks/usePedidos";
import { carrinhoService, type ProblemaEstoque } from "@/services/api/carrinho.service";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/feedback/ErrorState";
import EmptyState from "@/components/feedback/EmptyState";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROTAS } from "@/constants/rotas";
import type { MetodoPagamento } from "@/types/pedido";

const METODOS_PAGAMENTO: { id: MetodoPagamento; label: string; icone: string; nota: string }[] = [
  { id: "cartao", label: "Cartão de Crédito", icone: "💳", nota: "Cobrança simulada em até 3x sem juros." },
  { id: "pix", label: "Pix", icone: "🔗", nota: "O código Pix simulado aparece depois de confirmar." },
  { id: "boleto", label: "Boleto", icone: "🧾", nota: "Boleto simulado, vencimento em 3 dias úteis." },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { itens, subtotal, frete, total, limparCarrinho } = useCarrinho();
  const { usuario } = useAuth();
  const { criar, enviando, erro } = useCriarPedido();
  const [endereco, setEndereco] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>("cartao");
  const [problemasEstoque, setProblemasEstoque] = useState<ProblemaEstoque[]>([]);

  // Revalida o estoque a cada visita ao checkout: o carrinho fica salvo no navegador e
  // pode ter ficado desatualizado em relação à Fake API (ex.: outra aba esgotou a peça).
  useEffect(() => {
    if (itens.length === 0) return;
    let ativo = true;
    carrinhoService.validarEstoque(itens).then((problemas) => ativo && setProblemasEstoque(problemas));
    return () => {
      ativo = false;
    };
  }, [itens]);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!usuario) return;
    const pedido = await criar({ clienteEmail: usuario.email, enderecoEntrega: endereco, itens, metodoPagamento });
    if (pedido) {
      limparCarrinho();
      router.push(ROTAS.checkoutSucesso(pedido.codigo));
    }
  }

  return (
    <PublicLayout>
      <main className="mx-auto max-w-[1000px] px-6 py-12 md:px-12">
        <p className="section-label">Checkout</p>
        <h1 className="mt-2 font-display text-4xl text-[#2C2C2C]">Confirmar pedido</h1>

        {itens.length === 0 ? (
          <div className="mt-10">
            <EmptyState titulo="Seu carrinho está vazio" mensagem="Adicione peças ao carrinho antes de finalizar o pedido." acaoHref={ROTAS.produtos} acaoLabel="Explorar catálogo" />
          </div>
        ) : !usuario ? (
          <div className="mt-10">
            <EmptyState titulo="Entre para continuar" mensagem="Você precisa estar autenticado para confirmar um pedido." acaoHref={ROTAS.login} acaoLabel="Entrar" />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <form onSubmit={handleSubmit} className="card space-y-5 p-6 md:p-8">
              <Input label="E-mail" value={usuario.email} disabled />
              <Input label="Endereço de entrega" required placeholder="Rua, número — bairro, cidade/UF — CEP" value={endereco} onChange={(e) => setEndereco(e.target.value)} />

              <div>
                <p className="mb-2 text-sm font-medium text-[#2C2C2C]">Forma de pagamento</p>
                <div className="grid grid-cols-3 gap-3">
                  {METODOS_PAGAMENTO.map((opcao) => (
                    <button
                      key={opcao.id}
                      type="button"
                      onClick={() => setMetodoPagamento(opcao.id)}
                      className={`flex flex-col items-center gap-1.5 rounded border p-3 text-center ${metodoPagamento === opcao.id ? "border-2 border-[#C1522A] bg-[#FFF7F4]" : "border-[#E8E0D5] bg-white"}`}
                    >
                      <span className="text-xl">{opcao.icone}</span>
                      <span className={`text-xs font-bold ${metodoPagamento === opcao.id ? "text-[#C1522A]" : "text-[#555]"}`}>{opcao.label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[#aaa]">{METODOS_PAGAMENTO.find((opcao) => opcao.id === metodoPagamento)?.nota} Pagamento simulado — nenhum dado financeiro real é processado.</p>
              </div>

              {problemasEstoque.length > 0 && (
                <ErrorState
                  titulo="Estoque insuficiente"
                  mensagem={`Ajuste a quantidade no carrinho: ${problemasEstoque.map((problema) => `${problema.nome} (disponível: ${problema.disponivel})`).join(", ")}.`}
                />
              )}
              {erro && <ErrorState titulo="Não foi possível confirmar" mensagem={erro} />}
              <Button type="submit" disabled={enviando || problemasEstoque.length > 0} className="w-full justify-center">
                {enviando ? "Confirmando..." : "Confirmar pedido"}
              </Button>
            </form>

            <aside className="h-fit border border-[#E8E0D5] bg-white p-6">
              <h2 className="font-display text-xl">Resumo</h2>
              <ul className="mt-4 space-y-3 border-b border-[#E8E0D5] pb-4">
                {itens.map((item) => (
                  <li key={item.produto.id} className="flex items-center gap-3 text-sm">
                    <img src={item.produto.imagem} alt="" className="h-12 w-12 shrink-0 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate">{item.produto.nome}</p>
                      <Badge className="mt-1">{item.quantidade}×</Badge>
                    </div>
                    <span>{formatCurrency(item.produto.preco * item.quantidade)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 text-sm text-[#555]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>{frete ? formatCurrency(frete) : "Grátis"}</span>
                </div>
                <div className="flex justify-between border-t border-[#E8E0D5] pt-2 font-semibold text-[#2C2C2C]">
                  <span>Total</span>
                  <span className="text-[#C1522A]">{formatCurrency(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </PublicLayout>
  );
}
