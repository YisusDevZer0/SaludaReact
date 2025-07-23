import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

// Context
import { useMaterialUIController } from "context";

const cards = [
  {
    icon: "category",
    title: "Categorías",
    description: "Administra las categorías de productos y su clasificación.",
    route: "/admin/categorias-pos"
  },
  {
    icon: "science",
    title: "Componente Activo",
    description: "Gestiona los componentes activos de los medicamentos.",
    route: "/admin/almacenes/componentes-activos"
  },
  {
    icon: "layers",
    title: "Tipos",
    description: "Define y organiza los diferentes tipos de productos.",
    route: "/admin/almacenes/tipos"
  },
  {
    icon: "view_module",
    title: "Presentaciones",
    description: "Controla las presentaciones disponibles para cada producto.",
    route: "/admin/almacenes/presentaciones"
  },
  {
    icon: "branding_watermark",
    title: "Marcas",
    description: "Administra las marcas asociadas a los productos.",
    route: "/admin/almacenes/marcas"
  },
  {
    icon: "medical_services",
    title: "Servicios",
    description: "Gestiona los servicios ofrecidos en el almacén.",
    route: "/admin/almacenes/servicios"
  }
];

export default function AdminAlmacenes() {
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Colores adaptados al tema
  const getCardStyles = (idx) => {
    const baseColors = [
      { color: "#1976d2", button: "#1976d2", iconBg: darkMode ? "#1a237e" : "#e3f0fc" },
      { color: "#43a047", button: "#43a047", iconBg: darkMode ? "#1b5e20" : "#e6f4ea" },
      { color: "#ff9800", button: "#ff9800", iconBg: darkMode ? "#e65100" : "#fff3e0" },
      { color: "#C80096", button: "#C80096", iconBg: darkMode ? "#880e4f" : "#fbe3f4" },
      { color: "#00a8E1", button: "#00a8E1", iconBg: darkMode ? "#006064" : "#e0f7fa" },
      { color: "#6d4c41", button: "#6d4c41", iconBg: darkMode ? "#3e2723" : "#efebe9" }
    ];
    return baseColors[idx];
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h3" fontWeight="bold" color="info" textAlign="center" mb={4}>
          Configuracion general de productos
        </MDTypography>
        <Grid container spacing={3} justifyContent="center">
          {cards.map((card, idx) => {
            const cardStyle = getCardStyles(idx);
            return (
              <Grid item xs={12} sm={6} md={4} key={card.title}>
                <Card sx={{
                  p: 3,
                  textAlign: "center",
                  boxShadow: darkMode ? 6 : 3,
                  borderRadius: 4,
                  minHeight: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: darkMode ? '#1a1a1a' : '#fff',
                  border: darkMode ? '1px solid #333' : 'none',
                  '&:hover': {
                    boxShadow: darkMode ? 8 : 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <MDBox display="flex" justifyContent="center" alignItems="center" mb={2}>
                    <MDBox
                      sx={{
                        background: cardStyle.iconBg,
                        borderRadius: '50%',
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: darkMode ? '0 2px 8px rgba(255,255,255,0.1)' : '0 2px 8px rgba(0,0,0,0.07)'
                      }}
                    >
                      <Icon sx={{ color: cardStyle.color, fontSize: 28 }}>{card.icon}</Icon>
                    </MDBox>
                  </MDBox>
                  <MDTypography 
                    variant="h5" 
                    fontWeight="bold" 
                    color={darkMode ? "white" : "dark"} 
                    mb={1}
                  >
                    {card.title}
                  </MDTypography>
                  <MDTypography 
                    variant="body1" 
                    color={darkMode ? "white" : "text"} 
                    mb={3} 
                    sx={{ opacity: darkMode ? 0.8 : 0.7 }}
                  >
                    {card.description}
                  </MDTypography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: cardStyle.button,
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      borderRadius: 2,
                      boxShadow: darkMode ? '0 4px 16px 0 rgba(255,255,255,0.1)' : '0 4px 16px 0 rgba(0,0,0,0.08)',
                      py: 1.2,
                      mt: 'auto',
                      letterSpacing: 1,
                      '&:hover': {
                        background: cardStyle.button,
                        opacity: 0.92,
                        transform: 'translateY(-1px)',
                        boxShadow: darkMode ? '0 6px 20px 0 rgba(255,255,255,0.15)' : '0 6px 20px 0 rgba(0,0,0,0.12)'
                      }
                    }}
                    onClick={() => navigate(card.route)}
                  >
                    VER {card.title.toUpperCase()}
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
} 