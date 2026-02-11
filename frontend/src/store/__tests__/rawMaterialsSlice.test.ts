import { describe, it, expect } from "vitest";
import reducer, {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
} from "../rawMaterialsSlice";
import type { RawMaterial } from "../../types";

const initialState = { items: [], loading: false, error: null };

const material: RawMaterial = { id: "1", code: "MP001", name: "Madeira", stockQuantity: 100 };
const material2: RawMaterial = { id: "2", code: "MP002", name: "Parafuso", stockQuantity: 5000 };

describe("rawMaterialsSlice", () => {
  it("deve retornar o estado inicial", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("fetchRawMaterials", () => {
    it("pending: deve setar loading true e limpar erro", () => {
      const state = reducer(
        { items: [], loading: false, error: "erro anterior" },
        fetchRawMaterials.pending("", undefined)
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("fulfilled: deve popular items e setar loading false", () => {
      const state = reducer(
        { items: [], loading: true, error: null },
        fetchRawMaterials.fulfilled([material, material2], "", undefined)
      );
      expect(state.loading).toBe(false);
      expect(state.items).toEqual([material, material2]);
    });

    it("rejected: deve setar erro e loading false", () => {
      const state = reducer(
        { items: [], loading: true, error: null },
        fetchRawMaterials.rejected(new Error("Falha na API"), "", undefined)
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Falha na API");
    });
  });

  describe("createRawMaterial", () => {
    it("fulfilled: deve adicionar materia-prima na lista", () => {
      const state = reducer(
        { items: [material], loading: false, error: null },
        createRawMaterial.fulfilled(material2, "", { code: "MP002", name: "Parafuso", stockQuantity: 5000 })
      );
      expect(state.items).toHaveLength(2);
      expect(state.items[1]).toEqual(material2);
    });
  });

  describe("updateRawMaterial", () => {
    it("fulfilled: deve atualizar a materia-prima existente", () => {
      const updated = { ...material, name: "Madeira MDF", stockQuantity: 200 };
      const state = reducer(
        { items: [material, material2], loading: false, error: null },
        updateRawMaterial.fulfilled(updated, "", { id: "1", data: { code: "MP001", name: "Madeira MDF", stockQuantity: 200 } })
      );
      expect(state.items[0].name).toBe("Madeira MDF");
      expect(state.items[0].stockQuantity).toBe(200);
      expect(state.items).toHaveLength(2);
    });

    it("fulfilled: nao deve alterar nada se id nao existir", () => {
      const ghost = { id: "999", code: "X", name: "X", stockQuantity: 0 };
      const state = reducer(
        { items: [material], loading: false, error: null },
        updateRawMaterial.fulfilled(ghost, "", { id: "999", data: { code: "X", name: "X", stockQuantity: 0 } })
      );
      expect(state.items).toEqual([material]);
    });
  });

  describe("deleteRawMaterial", () => {
    it("fulfilled: deve remover a materia-prima da lista", () => {
      const state = reducer(
        { items: [material, material2], loading: false, error: null },
        deleteRawMaterial.fulfilled("1", "", "1")
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe("2");
    });
  });
});
