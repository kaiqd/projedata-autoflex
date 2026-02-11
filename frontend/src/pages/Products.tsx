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
import ScienceIcon from "@mui/icons-material/Science";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/productsSlice";
import { showNotification } from "../store/notificationSlice";
import type { Product, ProductRequest } from "../types";
import ProductForm from "../components/ProductForm";
import ConfirmDialog from "../components/ConfirmDialog";
import ProductMaterialsDialog from "../components/ProductMaterialsDialog";

export default function Products() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.products);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [materialsTarget, setMaterialsTarget] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleSave = async (data: ProductRequest) => {
    try {
      if (editing) {
        await dispatch(updateProduct({ id: editing.id, data })).unwrap();
        dispatch(showNotification({ message: "Produto atualizado com sucesso", severity: "success" }));
      } else {
        await dispatch(createProduct(data)).unwrap();
        dispatch(showNotification({ message: "Produto criado com sucesso", severity: "success" }));
      }
      setFormOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar produto";
      dispatch(showNotification({ message, severity: "error" }));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteProduct(deleteTarget.id)).unwrap();
      dispatch(showNotification({ message: "Produto excluido com sucesso", severity: "success" }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao excluir produto";
      dispatch(showNotification({ message, severity: "error" }));
    }
    setDeleteTarget(null);
  };

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Produtos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Novo Produto
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Codigo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Preco</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Acoes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: "text.secondary" }}>
                  Nenhum produto cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              items.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.code}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell align="right">{formatPrice(p.price)}</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Materias-Primas">
                      <IconButton size="small" color="secondary" onClick={() => setMaterialsTarget(p)}>
                        <ScienceIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleEdit(p)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(p)}>
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

      <ProductForm
        open={formOpen}
        product={editing}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Excluir Produto"
        message={`Deseja realmente excluir o produto "${deleteTarget?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <ProductMaterialsDialog
        open={materialsTarget !== null}
        product={materialsTarget}
        onClose={() => setMaterialsTarget(null)}
      />
    </Box>
  );
}
