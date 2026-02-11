import { useEffect, useState } from "react";
import {
  Box,
  Button,
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
import RefreshIcon from "@mui/icons-material/Refresh";
import { suggestionsApi } from "../api/suggestions";
import type { ProductionSuggestionResponse } from "../types";

export default function Suggestions() {
  const [data, setData] = useState<ProductionSuggestionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    suggestionsApi
      .get()
      .then(setData)
      .catch((e) => setError(e.message ?? "Erro ao carregar sugestoes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const formatCurrency = (value: number) =>
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
        <Typography variant="h5">Sugestoes de Producao</Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={load}>
          Atualizar
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {data && data.items.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Nenhuma sugestao disponivel. Cadastre produtos com materias-primas e estoque suficiente.
        </Alert>
      )}

      {data && data.items.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Codigo</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Preco Unitario</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Valor Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.productCode}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell align="right">{item.suggestedQuantity}</TableCell>
                    <TableCell align="right">{formatCurrency(item.totalValue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Valor Total da Producao: {formatCurrency(data.totalValue)}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
