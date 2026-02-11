import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { rawMaterialsApi } from "../api/rawMaterials";
import type { RawMaterial, RawMaterialRequest } from "../types";

interface RawMaterialsState {
  items: RawMaterial[];
  loading: boolean;
  error: string | null;
}

const initialState: RawMaterialsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchRawMaterials = createAsyncThunk("rawMaterials/fetchAll", () =>
  rawMaterialsApi.list()
);

export const createRawMaterial = createAsyncThunk(
  "rawMaterials/create",
  (data: RawMaterialRequest) => rawMaterialsApi.create(data)
);

export const updateRawMaterial = createAsyncThunk(
  "rawMaterials/update",
  ({ id, data }: { id: string; data: RawMaterialRequest }) =>
    rawMaterialsApi.update(id, data)
);

export const deleteRawMaterial = createAsyncThunk(
  "rawMaterials/delete",
  async (id: string) => {
    await rawMaterialsApi.remove(id);
    return id;
  }
);

const rawMaterialsSlice = createSlice({
  name: "rawMaterials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* fetchAll */
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Erro ao carregar materias-primas";
      })
      /* create */
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      /* update */
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const idx = state.items.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      /* delete */
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
      });
  },
});

export default rawMaterialsSlice.reducer;
