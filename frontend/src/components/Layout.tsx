import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryIcon from "@mui/icons-material/Inventory";
import ScienceIcon from "@mui/icons-material/Science";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Produtos", path: "/products", icon: <InventoryIcon /> },
  { label: "Matérias-Primas", path: "/raw-materials", icon: <ScienceIcon /> },
  { label: "Sugestões de Produção", path: "/suggestions", icon: <TipsAndUpdatesIcon /> },
];

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box sx={{ mt: 1 }}>
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => handleNav(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            Autoflex
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
