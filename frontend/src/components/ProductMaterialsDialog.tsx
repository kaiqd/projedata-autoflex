import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { productMaterialsApi } from "../api/productMaterials";
import { rawMaterialsApi } from "../api/rawMaterials";
import type { Product, RawMaterial, ProductMaterialItemRequest } from "../types";

interface Row {
  rawMaterialId: string;
  requiredQuantity: number;
}

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

export default function ProductMaterialsDialog({ open, product, onClose }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [allMaterials, setAllMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !product) return;

    setLoading(true);
    Promise.all([
      productMaterialsApi.list(product.id),
      rawMaterialsApi.list(),
    ])
      .then(([bom, materials]) => {
        setAllMaterials(materials);
        setRows(
          bom.map((item) => ({
            rawMaterialId: item.rawMaterialId,
            requiredQuantity: item.requiredQuantity,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [open, product]);

  const handleAddRow = () => {
    setRows((prev) => [...prev, { rawMaterialId: "", requiredQuantity: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Row, value: string) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, [field]: field === "requiredQuantity" ? Number(value) : value }
          : row
      )
    );
  };

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    const items: ProductMaterialItemRequest[] = rows
      .filter((r) => r.rawMaterialId && r.requiredQuantity > 0)
      .map((r) => ({ rawMaterialId: r.rawMaterialId, requiredQuantity: r.requiredQuantity }));

    await productMaterialsApi.replace(product.id, items);
    setSaving(false);
    onClose();
  };

  const usedIds = rows.map((r) => r.rawMaterialId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Materias-Primas — {product?.name}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {rows.length === 0 && (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                Nenhuma materia-prima associada.
              </Typography>
            )}

            {rows.map((row, index) => (
              <Box key={index} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
                <TextField
                  select
                  label="Materia-Prima"
                  value={row.rawMaterialId}
                  onChange={(e) => handleChange(index, "rawMaterialId", e.target.value)}
                  sx={{ flex: 2 }}
                  size="small"
                >
                  {allMaterials
                    .filter((m) => m.id === row.rawMaterialId || !usedIds.includes(m.id))
                    .map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.code} — {m.name}
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  label="Qtd"
                  type="number"
                  inputProps={{ min: 0, step: "0.001" }}
                  value={row.requiredQuantity}
                  onChange={(e) => handleChange(index, "requiredQuantity", e.target.value)}
                  sx={{ flex: 1 }}
                  size="small"
                />
                <IconButton size="small" color="error" onClick={() => handleRemoveRow(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button startIcon={<AddIcon />} onClick={handleAddRow} sx={{ mt: 1 }}>
              Adicionar
            </Button>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
