import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productsApi } from "../api/products";
import type { Product, ProductRequest } from "../types";

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk("products/fetchAll", () =>
  productsApi.list()
);

export const createProduct = createAsyncThunk(
  "products/create",
  (data: ProductRequest) => productsApi.create(data)
);

export const updateProduct = createAsyncThunk(
  "products/update",
  ({ id, data }: { id: string; data: ProductRequest }) =>
    productsApi.update(id, data)
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    await productsApi.remove(id);
    return id;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* fetchAll */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Erro ao carregar produtos";
      })
      /* create */
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      /* update */
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      /* delete */
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
