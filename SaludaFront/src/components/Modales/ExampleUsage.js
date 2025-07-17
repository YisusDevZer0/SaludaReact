import React, { useState } from "react";
import { Button, Box, Typography, Grid, Paper } from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { BaseModal, FormModal, FiltersModal } from "./index";

const ExampleUsage = () => {
  const [modalType, setModalType] = useState(null);
  const [filters, setFilters] = useState({});

  // Ejemplo de campos para formulario
  const formFields = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: true,
      placeholder: "Ingrese su nombre",
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "ejemplo@correo.com",
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: "categoria",
      label: "Categoría",
      type: "select",
      required: true,
      options: [
        { value: "admin", label: "Administrador" },
        { value: "user", label: "Usuario" },
        { value: "guest", label: "Invitado" }
      ],
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: "activo",
      label: "Usuario Activo",
      type: "switch",
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "text",
      multiline: true,
      rows: 3,
      placeholder: "Descripción opcional",
      gridProps: { xs: 12 }
    }
  ];

  // Ejemplo de filtros
  const filterFields = [
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
        { value: "pendiente", label: "Pendiente" }
      ],
      section: "Estado y Sistema"
    },
    {
      name: "sistema",
      label: "Sistema",
      type: "select",
      options: [
        { value: "pos", label: "POS" },
        { value: "web", label: "Web" },
        { value: "mobile", label: "Mobile" }
      ],
      section: "Estado y Sistema"
    },
    {
      name: "fecha",
      label: "Fecha de Creación",
      type: "date",
      section: "Fechas"
    },
    {
      name: "rango",
      label: "Rango de Precio",
      type: "range",
      min: 0,
      max: 1000,
      step: 10,
      section: "Fechas"
    },
    {
      name: "busqueda",
      label: "Buscar",
      type: "search",
      placeholder: "Buscar por nombre o descripción",
      gridProps: { xs: 12 }
    }
  ];

  const handleFormSubmit = async (formData) => {
    console.log("Datos del formulario:", formData);
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    setModalType(null);
  };

  const handleFiltersApply = (filterData) => {
    console.log("Filtros aplicados:", filterData);
    setFilters(filterData);
    setModalType(null);
  };

  const handleFiltersClear = () => {
    setFilters({});
  };

  const renderModal = () => {
    switch (modalType) {
      case "form":
        return (
          <FormModal
            open={true}
            onClose={() => setModalType(null)}
            title="Nuevo Usuario"
            titleIcon={<AddIcon />}
            fields={formFields}
            onSubmit={handleFormSubmit}
            submitButtonText="Crear Usuario"
            maxWidth="md"
          />
        );

      case "filters":
        return (
          <FiltersModal
            open={true}
            onClose={() => setModalType(null)}
            filters={filterFields}
            initialFilters={filters}
            onApply={handleFiltersApply}
            onClear={handleFiltersClear}
            title="Filtros Avanzados"
            maxWidth="lg"
          />
        );

      case "custom":
        return (
          <BaseModal
            open={true}
            onClose={() => setModalType(null)}
            title="Modal Personalizado"
            titleIcon={<SettingsIcon />}
            maxWidth="sm"
            actions={
              <>
                <MDButton
                  onClick={() => setModalType(null)}
                  color="secondary"
                  variant="outlined"
                >
                  Cancelar
                </MDButton>
                <MDButton
                  onClick={() => setModalType(null)}
                  color="info"
                  variant="gradient"
                >
                  Aceptar
                </MDButton>
              </>
            }
          >
            <MDBox>
              <Typography variant="body1" paragraph>
                Este es un ejemplo de modal personalizado usando el componente BaseModal.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Puedes agregar cualquier contenido aquí y personalizar las acciones.
              </Typography>
            </MDBox>
          </BaseModal>
        );

      default:
        return null;
    }
  };

  return (
    <MDBox p={3}>
      <Typography variant="h4" gutterBottom>
        Ejemplos de Modales Mejorados
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Estos son ejemplos de los nuevos modales con diseño moderno y funcionalidad mejorada.
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Modal de Formulario
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Formulario con validación, campos dinámicos y diseño moderno.
            </Typography>
            <MDButton
              onClick={() => setModalType("form")}
              color="info"
              variant="gradient"
              startIcon={<AddIcon />}
            >
              Abrir Formulario
            </MDButton>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <FilterIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Modal de Filtros
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Filtros avanzados con secciones colapsables y múltiples tipos de campos.
            </Typography>
            <MDButton
              onClick={() => setModalType("filters")}
              color="info"
              variant="gradient"
              startIcon={<FilterIcon />}
            >
              Abrir Filtros
            </MDButton>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <SettingsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Modal Personalizado
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Modal base personalizable con contenido y acciones a medida.
            </Typography>
            <MDButton
              onClick={() => setModalType("custom")}
              color="info"
              variant="gradient"
              startIcon={<SettingsIcon />}
            >
              Abrir Personalizado
            </MDButton>
          </Paper>
        </Grid>
      </Grid>

      {/* Mostrar filtros activos */}
      {Object.keys(filters).length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filtros Activos
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {Object.entries(filters).map(([key, value]) => (
              <Typography key={key} variant="body2" color="primary">
                {key}: {Array.isArray(value) ? value.join(', ') : value}
              </Typography>
            ))}
          </Box>
        </Paper>
      )}

      {/* Renderizar modal activo */}
      {renderModal()}
    </MDBox>
  );
};

export default ExampleUsage; 