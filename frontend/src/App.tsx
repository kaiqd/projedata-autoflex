import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/Layout";
import { Health } from "./pages/Health";
import Products from "./pages/Products";
import RawMaterials from "./pages/RawMaterials";
import Suggestions from "./pages/Suggestions";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/products" element={<Products />} />
            <Route path="/raw-materials" element={<RawMaterials />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/health" element={<Health />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
