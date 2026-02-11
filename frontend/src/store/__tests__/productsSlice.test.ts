import { describe, it, expect } from "vitest";
import reducer, {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../productsSlice";
import type { Product } from "../../types";

const initialState = { items: [], loading: false, error: null };

const product: Product = { id: "1", code: "P001", name: "Cadeira", price: 500 };
const product2: Product = { id: "2", code: "P002", name: "Mesa", price: 800 };

describe("productsSlice", () => {
  it("deve retornar o estado inicial", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("fetchProducts", () => {
    it("pending: deve setar loading true e limpar erro", () => {
      const state = reducer(
        { items: [], loading: false, error: "erro anterior" },
        fetchProducts.pending("", undefined)
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("fulfilled: deve popular items e setar loading false", () => {
      const state = reducer(
        { items: [], loading: true, error: null },
        fetchProducts.fulfilled([product, product2], "", undefined)
      );
      expect(state.loading).toBe(false);
      expect(state.items).toEqual([product, product2]);
    });

    it("rejected: deve setar erro e loading false", () => {
      const state = reducer(
        { items: [], loading: true, error: null },
        fetchProducts.rejected(new Error("Falha na API"), "", undefined)
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Falha na API");
    });
  });

  describe("createProduct", () => {
    it("fulfilled: deve adicionar produto na lista", () => {
      const state = reducer(
        { items: [product], loading: false, error: null },
        createProduct.fulfilled(product2, "", { code: "P002", name: "Mesa", price: 800 })
      );
      expect(state.items).toHaveLength(2);
      expect(state.items[1]).toEqual(product2);
    });
  });

  describe("updateProduct", () => {
    it("fulfilled: deve atualizar o produto existente", () => {
      const updated = { ...product, name: "Cadeira Premium", price: 750 };
      const state = reducer(
        { items: [product, product2], loading: false, error: null },
        updateProduct.fulfilled(updated, "", { id: "1", data: { code: "P001", name: "Cadeira Premium", price: 750 } })
      );
      expect(state.items[0].name).toBe("Cadeira Premium");
      expect(state.items[0].price).toBe(750);
      expect(state.items).toHaveLength(2);
    });

    it("fulfilled: nao deve alterar nada se id nao existir", () => {
      const ghost = { id: "999", code: "X", name: "X", price: 0 };
      const state = reducer(
        { items: [product], loading: false, error: null },
        updateProduct.fulfilled(ghost, "", { id: "999", data: { code: "X", name: "X", price: 0 } })
      );
      expect(state.items).toEqual([product]);
    });
  });

  describe("deleteProduct", () => {
    it("fulfilled: deve remover o produto da lista", () => {
      const state = reducer(
        { items: [product, product2], loading: false, error: null },
        deleteProduct.fulfilled("1", "", "1")
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe("2");
    });
  });
});
