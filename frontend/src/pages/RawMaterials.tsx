import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
} from "../store/rawMaterialsSlice";
import type { RawMaterial, RawMaterialRequest } from "../types";
import RawMaterialForm from "../components/RawMaterialForm";
import ConfirmDialog from "../components/ConfirmDialog";

export default function RawMaterials() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.rawMaterials);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RawMaterial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RawMaterial | null>(null);

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (material: RawMaterial) => {
    setEditing(material);
    setFormOpen(true);
  };

  const handleSave = async (data: RawMaterialRequest) => {
    if (editing) {
      await dispatch(updateRawMaterial({ id: editing.id, data }));
    } else {
      await dispatch(createRawMaterial(data));
    }
    setFormOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await dispatch(deleteRawMaterial(deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const formatQuantity = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 3 });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Materias-Primas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nova Materia-Prima
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Codigo</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell align="right">Estoque</TableCell>
              <TableCell align="center">Acoes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhuma materia-prima cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              items.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.code}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell align="right">{formatQuantity(m.stockQuantity)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEdit(m)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(m)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <RawMaterialForm
        open={formOpen}
        material={editing}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Excluir Materia-Prima"
        message={`Deseja realmente excluir a materia-prima "${deleteTarget?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
