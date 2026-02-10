import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/Layout";
import { Health } from "./pages/Health";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
});

function PlaceholderPage({ title }: { title: string }) {
  return <h2>{title}</h2>;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/products" element={<PlaceholderPage title="Produtos" />} />
            <Route path="/raw-materials" element={<PlaceholderPage title="Matérias-Primas" />} />
            <Route path="/suggestions" element={<PlaceholderPage title="Sugestões de Produção" />} />
            <Route path="/health" element={<Health />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
