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

// Paleta institucional y colores vibrantes para cada card
const cardStyles = [
  {
    color: "#1976d2", // Azul Saluda
    button: "#1976d2",
    iconBg: "#e3f0fc"
  },
  {
    color: "#43a047", // Verde
    button: "#43a047",
    iconBg: "#e6f4ea"
  },
  {
    color: "#ff9800", // Naranja
    button: "#ff9800",
    iconBg: "#fff3e0"
  },
  {
    color: "#C80096", // Rosa institucional
    button: "#C80096",
    iconBg: "#fbe3f4"
  },
  {
    color: "#00a8E1", // Celeste
    button: "#00a8E1",
    iconBg: "#e0f7fa"
  },
  {
    color: "#6d4c41", // Café oscuro para servicios
    button: "#6d4c41",
    iconBg: "#efebe9"
  }
];

const cards = [
  {
    icon: "category",
    title: "Categorías",
    description: "Administra las categorías de productos y su clasificación.",
    route: "/admin/almacenes/categorias"
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
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h3" fontWeight="bold" color="info" textAlign="center" mb={4}>
          Almacenes e Inventarios
        </MDTypography>
        <Grid container spacing={3} justifyContent="center">
          {cards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <Card sx={{
                p: 3,
                textAlign: "center",
                boxShadow: 3,
                borderRadius: 4,
                minHeight: 320,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#fff'
              }}>
                <MDBox display="flex" justifyContent="center" alignItems="center" mb={2}>
                  <MDBox
                    sx={{
                      background: cardStyles[idx].iconBg,
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                    }}
                  >
                    <Icon sx={{ color: cardStyles[idx].color, fontSize: 28 }}>{card.icon}</Icon>
                  </MDBox>
                </MDBox>
                <MDTypography variant="h5" fontWeight="bold" color="dark" mb={1}>
                  {card.title}
                </MDTypography>
                <MDTypography variant="body1" color="text" mb={3} sx={{ opacity: 0.7 }}>
                  {card.description}
                </MDTypography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: cardStyles[idx].button,
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderRadius: 2,
                    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
                    py: 1.2,
                    mt: 'auto',
                    letterSpacing: 1,
                    '&:hover': {
                      background: cardStyles[idx].button,
                      opacity: 0.92
                    }
                  }}
                  onClick={() => navigate(card.route)}
                >
                  VER {card.title.toUpperCase()}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
} 