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
  Tooltip,
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
import { showNotification } from "../store/notificationSlice";
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
    try {
      if (editing) {
        await dispatch(updateRawMaterial({ id: editing.id, data })).unwrap();
        dispatch(showNotification({ message: "Materia-prima atualizada com sucesso", severity: "success" }));
      } else {
        await dispatch(createRawMaterial(data)).unwrap();
        dispatch(showNotification({ message: "Materia-prima criada com sucesso", severity: "success" }));
      }
      setFormOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar materia-prima";
      dispatch(showNotification({ message, severity: "error" }));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteRawMaterial(deleteTarget.id)).unwrap();
      dispatch(showNotification({ message: "Materia-prima excluida com sucesso", severity: "success" }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao excluir materia-prima";
      dispatch(showNotification({ message, severity: "error" }));
    }
    setDeleteTarget(null);
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
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Materias-Primas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nova Materia-Prima
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Codigo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Estoque</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Acoes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: "text.secondary" }}>
                  Nenhuma materia-prima cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              items.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.code}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell align="right">{formatQuantity(m.stockQuantity)}</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleEdit(m)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(m)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
