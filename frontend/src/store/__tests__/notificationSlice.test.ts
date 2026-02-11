import { describe, it, expect } from "vitest";
import reducer, { showNotification, hideNotification } from "../notificationSlice";

const initialState = { open: false, message: "", severity: "success" as const };

describe("notificationSlice", () => {
  it("deve retornar o estado inicial", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("showNotification: deve abrir com mensagem e severity", () => {
    const state = reducer(
      initialState,
      showNotification({ message: "Produto criado", severity: "success" })
    );
    expect(state.open).toBe(true);
    expect(state.message).toBe("Produto criado");
    expect(state.severity).toBe("success");
  });

  it("showNotification: deve funcionar com severity error", () => {
    const state = reducer(
      initialState,
      showNotification({ message: "Erro ao salvar", severity: "error" })
    );
    expect(state.open).toBe(true);
    expect(state.message).toBe("Erro ao salvar");
    expect(state.severity).toBe("error");
  });

  it("hideNotification: deve fechar mantendo mensagem", () => {
    const openState = { open: true, message: "Teste", severity: "info" as const };
    const state = reducer(openState, hideNotification());
    expect(state.open).toBe(false);
    expect(state.message).toBe("Teste");
  });
});
