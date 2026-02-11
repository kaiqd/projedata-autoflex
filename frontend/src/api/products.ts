import { http } from "./http";
import type { Product, ProductRequest } from "../types";

const BASE = "/products";

export const productsApi = {
  list: () => http<Product[]>(BASE),

  getById: (id: string) => http<Product>(`${BASE}/${id}`),

  create: (data: ProductRequest) =>
    http<Product>(BASE, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: ProductRequest) =>
    http<Product>(`${BASE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    http<void>(`${BASE}/${id}`, { method: "DELETE" }),
};
