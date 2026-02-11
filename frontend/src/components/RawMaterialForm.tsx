import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { RawMaterial, RawMaterialRequest } from "../types";

interface Props {
  open: boolean;
  material: RawMaterial | null;
  onClose: () => void;
  onSave: (data: RawMaterialRequest) => void;
}

const empty: RawMaterialRequest = { code: "", name: "", stockQuantity: 0 };

export default function RawMaterialForm({ open, material, onClose, onSave }: Props) {
  const [form, setForm] = useState<RawMaterialRequest>(empty);

  useEffect(() => {
    if (material) {
      setForm({ code: material.code, name: material.name, stockQuantity: material.stockQuantity });
    } else {
      setForm(empty);
    }
  }, [material, open]);

  const handleChange = (field: keyof RawMaterialRequest, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "stockQuantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const isValid = form.code.trim() !== "" && form.name.trim() !== "" && form.stockQuantity >= 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{material ? "Editar Materia-Prima" : "Nova Materia-Prima"}</DialogTitle>
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
            label="Quantidade em Estoque"
            type="number"
            inputProps={{ min: 0, step: "0.001" }}
            value={form.stockQuantity}
            onChange={(e) => handleChange("stockQuantity", e.target.value)}
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
