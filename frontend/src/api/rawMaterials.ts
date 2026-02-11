import { http } from "./http";
import type { RawMaterial, RawMaterialRequest } from "../types";

const BASE = "/raw-materials";

export const rawMaterialsApi = {
  list: () => http<RawMaterial[]>(BASE),

  getById: (id: string) => http<RawMaterial>(`${BASE}/${id}`),

  create: (data: RawMaterialRequest) =>
    http<RawMaterial>(BASE, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: RawMaterialRequest) =>
    http<RawMaterial>(`${BASE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    http<void>(`${BASE}/${id}`, { method: "DELETE" }),
};
