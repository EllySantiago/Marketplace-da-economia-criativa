"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSalvarProduto } from "@/hooks/useProdutos";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/feedback/ErrorState";
import { REGIOES } from "@/constants/regioes";
import { TECNICAS } from "@/constants/tecnicas";
import { CATEGORIAS } from "@/constants/categorias";
import type { NovoProduto, Produto } from "@/types/produto";

interface ProductFormProps {
  artesaoId: number;
  regiaoPadrao?: string;
  /** Quando informado, o formulário edita esse produto em vez de criar um novo. */
  produtoExistente?: Produto | null;
  onSalvo?: (produto: Produto) => void;
  onCancelarEdicao?: () => void;
}

interface CamposProduto {
  nome: string;
  descricao: string;
  preco: string;
  estoque: string;
  categoria: string;
  tecnica: string;
  imagem: string;
  regiao: string;
}

function camposVazios(regiaoPadrao?: string): CamposProduto {
  return { nome: "", descricao: "", preco: "", estoque: "", categoria: CATEGORIAS[0], tecnica: TECNICAS[0], imagem: "", regiao: regiaoPadrao ?? REGIOES[0] };
}

function camposDoProduto(produto: Produto): CamposProduto {
  return {
    nome: produto.nome,
    descricao: produto.descricao,
    preco: String(produto.preco),
    estoque: String(produto.estoque),
    categoria: produto.categoria,
    tecnica: produto.tecnica,
    imagem: produto.imagem,
    regiao: produto.regiao,
  };
}

export default function ProductForm({ artesaoId, regiaoPadrao, produtoExistente, onSalvo, onCancelarEdicao }: ProductFormProps) {
  const { salvar, enviando, erro } = useSalvarProduto();
  const [campos, setCampos] = useState<CamposProduto>(() => (produtoExistente ? camposDoProduto(produtoExistente) : camposVazios(regiaoPadrao)));
  const [sucesso, setSucesso] = useState(false);
  const emEdicao = Boolean(produtoExistente);

  useEffect(() => {
    setCampos(produtoExistente ? camposDoProduto(produtoExistente) : camposVazios(regiaoPadrao));
    setSucesso(false);
  }, [produtoExistente, regiaoPadrao]);

  function atualizar<K extends keyof CamposProduto>(chave: K, valor: CamposProduto[K]) {
    setCampos((atual) => ({ ...atual, [chave]: valor }));
    setSucesso(false);
  }

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados: NovoProduto = {
      nome: campos.nome,
      descricao: campos.descricao,
      preco: Number(campos.preco),
      estoque: Number(campos.estoque),
      categoria: campos.categoria,
      tecnica: campos.tecnica,
      regiao: campos.regiao,
      artesaoId,
      imagem: campos.imagem || "https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=800&h=800&fit=crop&auto=format",
    };
    const produtoSalvo = await salvar(dados, produtoExistente?.id);
    if (produtoSalvo) {
      if (!emEdicao) setCampos(camposVazios(regiaoPadrao));
      setSucesso(true);
      onSalvo?.(produtoSalvo);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6 md:p-8">
      <h2 className="font-display text-2xl">{emEdicao ? "Editar produto" : "Novo produto"}</h2>
      <Input label="Título" required value={campos.nome} onChange={(e) => atualizar("nome", e.target.value)} />
      <Textarea label="Descrição" required rows={4} value={campos.descricao} onChange={(e) => atualizar("descricao", e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Preço (R$)" type="number" min={0} step="0.01" required value={campos.preco} onChange={(e) => atualizar("preco", e.target.value)} />
        <Input label="Estoque" type="number" min={0} step={1} required value={campos.estoque} onChange={(e) => atualizar("estoque", e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <label className="block text-sm font-medium">
          Categoria
          <select className="mt-2 w-full border border-[#E8E0D5] bg-white px-3 py-3 text-sm" value={campos.categoria} onChange={(e) => atualizar("categoria", e.target.value)}>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria}>{categoria}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Técnica
          <select className="mt-2 w-full border border-[#E8E0D5] bg-white px-3 py-3 text-sm" value={campos.tecnica} onChange={(e) => atualizar("tecnica", e.target.value)}>
            {TECNICAS.map((tecnica) => (
              <option key={tecnica}>{tecnica}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Região
          <select className="mt-2 w-full border border-[#E8E0D5] bg-white px-3 py-3 text-sm" value={campos.regiao} onChange={(e) => atualizar("regiao", e.target.value)}>
            {REGIOES.map((regiao) => (
              <option key={regiao}>{regiao}</option>
            ))}
          </select>
        </label>
      </div>
      <Input label="URL da foto (opcional)" value={campos.imagem} onChange={(e) => atualizar("imagem", e.target.value)} placeholder="https://..." />

      {erro && <ErrorState titulo="Não foi possível publicar" mensagem={erro} />}
      {sucesso && <p className="text-sm font-semibold text-[#2D6A4F]">{emEdicao ? "Alterações salvas com sucesso." : "Produto publicado com sucesso."}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : emEdicao ? "Salvar alterações" : "Publicar produto"}
        </Button>
        {emEdicao && (
          <Button type="button" variante="outline" onClick={onCancelarEdicao}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
