import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { Product, ProductRequest } from "../types";

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (data: ProductRequest) => void;
}

const empty: ProductRequest = { code: "", name: "", price: 0 };

export default function ProductForm({ open, product, onClose, onSave }: Props) {
  const [form, setForm] = useState<ProductRequest>(empty);

  useEffect(() => {
    if (product) {
      setForm({ code: product.code, name: product.name, price: product.price });
    } else {
      setForm(empty);
    }
  }, [product, open]);

  const handleChange = (field: keyof ProductRequest, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const isValid = form.code.trim() !== "" && form.name.trim() !== "" && form.price > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Codigo"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Nome"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
          <TextField
            label="Preco"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={!isValid}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
