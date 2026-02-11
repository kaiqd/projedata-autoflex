import { http } from "./http";
import type { ProductMaterialItem, ProductMaterialItemRequest } from "../types";

export const productMaterialsApi = {
  list: (productId: string) =>
    http<ProductMaterialItem[]>(`/products/${productId}/materials`),

  replace: (productId: string, items: ProductMaterialItemRequest[]) =>
    http<ProductMaterialItem[]>(`/products/${productId}/materials`, {
      method: "PUT",
      body: JSON.stringify(items),
    }),
};
