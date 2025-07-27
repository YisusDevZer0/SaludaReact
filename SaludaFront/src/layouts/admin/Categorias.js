import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { Grid } from "@mui/material";

// Servicios
import categoriasService from "services/categorias-service";

// Modales
import GenericModal from "components/Modales/GenericModal";

// Componentes de tabla
import DataTable from "examples/Tables/DataTable";

// Estilos
import "./Categorias.css";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  // Configuración de campos para el modal - CORREGIDO para coincidir con el backend
  const categoriaFields = [
    {
      name: "nombre",
      label: "Nombre de la Categoría",
      type: "text",
      required: true,
      validation: (value) => {
        if (!value || value.trim() === '') {
          return "El nombre es requerido";
        }
        if (value && value.length > 100) {
          return "El nombre no puede exceder 100 caracteres";
        }
        return null;
      }
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "text",
      multiline: true,
      rows: 3,
      validation: (value) => {
        if (value && value.length > 1000) {
          return "La descripción no puede exceder 1000 caracteres";
        }
        return null;
      }
    },
    {
      name: "codigo",
      label: "Código",
      type: "text",
      required: true,
      validation: (value) => {
        if (!value || value.trim() === '') {
          return "El código es requerido";
        }
        if (value && value.length > 50) {
          return "El código no puede exceder 50 caracteres";
        }
        return null;
      }
    },
    {
      name: "activa",
      label: "Estado",
      type: "select",
      required: true,
      defaultValue: true,
      options: [
        { value: true, label: "Activa" },
        { value: false, label: "Inactiva" }
      ]
    },
    {
      name: "visible_en_pos",
      label: "Visible en POS",
      type: "select",
      required: true,
      defaultValue: true,
      options: [
        { value: true, label: "Sí" },
        { value: false, label: "No" }
      ]
    },
    {
      name: "orden",
      label: "Orden",
      type: "number",
      required: false,
      defaultValue: 0,
      validation: (value) => {
        if (value && (isNaN(value) || value < 0)) {
          return "El orden debe ser un número válido mayor o igual a 0";
        }
        return null;
      }
    },
    {
      name: "comision",
      label: "Comisión (%)",
      type: "number",
      required: false,
      defaultValue: 0,
      validation: (value) => {
        if (value && (isNaN(value) || value < 0 || value > 100)) {
          return "La comisión debe ser un número entre 0 y 100";
        }
        return null;
      }
    }
  ];

  // Cargar datos de categorías
  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await categoriasService.getCategorias();
      
      // Mapear los datos del backend al formato esperado por la tabla
      const formattedData = (response.data || []).map(categoria => ({
        id: categoria.id,
        nombre: categoria.nombre || 'Sin nombre',
        descripcion: categoria.descripcion || 'Sin descripción',
        codigo: categoria.codigo || 'Sin código',
        estado: categoria.activa ? 'Activa' : 'Inactiva',
        visible: categoria.visible_en_pos ? 'Sí' : 'No',
        orden: categoria.orden || 0,
        comision: categoria.comision || 0,
        creado: categoria.created_at ? new Date(categoria.created_at).toLocaleDateString('es-ES') : 'N/A',
        actualizado: categoria.updated_at ? new Date(categoria.updated_at).toLocaleDateString('es-ES') : 'N/A',
        // Datos originales para el modal
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        codigo: categoria.codigo,
        activa: categoria.activa,
        visible_en_pos: categoria.visible_en_pos,
        orden: categoria.orden,
        comision: categoria.comision
      }));
      
      setCategorias(formattedData);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  // Funciones para manejar modales
  const handleOpenModal = (mode, categoriaData = null) => {
    setModalMode(mode);
    setSelectedCategoria(categoriaData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategoria(null);
  };

  const handleModalSuccess = () => {
    loadCategorias(); // Recargar datos
  };

  // Configuración de la tabla
  const columns = [
    { Header: "ID", accessor: "id", width: 70 },
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Código", accessor: "codigo" },
    { 
      Header: "Estado", 
      accessor: "estado",
      Cell: ({ value }) => (
        <MDBox
          component="span"
          variant="caption"
          color={value === "Activa" ? "success" : "error"}
          fontWeight="medium"
        >
          {value === "Activa" ? "ACTIVA" : "INACTIVA"}
        </MDBox>
      )
    },
    { 
      Header: "Visible en POS", 
      accessor: "visible",
      Cell: ({ value }) => (
        <MDBox
          component="span"
          variant="caption"
          color={value === "Sí" ? "info" : "warning"}
          fontWeight="medium"
        >
          {value}
        </MDBox>
      )
    },
    { Header: "Orden", accessor: "orden" },
    { Header: "Comisión (%)", accessor: "comision" },
    { Header: "Creado", accessor: "creado" },
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }) => (
        <MDBox display="flex" alignItems="center">
          <Icon 
            sx={{ cursor: "pointer", color: "info.main", mr: 1 }} 
            onClick={() => handleOpenModal("view", row.original)}
          >
            visibility
          </Icon>
          <Icon 
            sx={{ cursor: "pointer", color: "warning.main", mr: 1 }} 
            onClick={() => handleOpenModal("edit", row.original)}
          >
            edit
          </Icon>
          <Icon 
            sx={{ cursor: "pointer", color: "error.main" }} 
            onClick={() => handleDelete(row.original)}
          >
            delete
          </Icon>
        </MDBox>
      )
    }
  ];

  // Función para eliminar categoría
  const handleDelete = async (categoria) => {
    if (window.confirm(`¿Está seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
        await categoriasService.deleteCategoria(categoria.id);
        loadCategorias(); // Recargar datos
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h4" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Gestión de Categorías POS
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Administra las categorías de productos del sistema POS
        </MDTypography>
        
        {/* Botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton 
              variant="gradient" 
              color="success" 
              startIcon={<Icon>add</Icon>}
              onClick={() => handleOpenModal("create")}
              className="categorias-create-button"
            >
              Nueva Categoría
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>file_download</Icon>}>
                Exportar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tabla de categorías */}
        <DataTable
          table={{ columns, rows: categorias }}
          isSorted={true}
          entriesPerPage={true}
          showTotalEntries={true}
          noEndBorder
          canSearch
          loading={loading}
          className="categorias-table"
        />

        {/* Modal genérico */}
        <GenericModal
          open={modalOpen}
          onClose={handleCloseModal}
          mode={modalMode}
          data={selectedCategoria}
          onSuccess={handleModalSuccess}
          title="Categoría"
          fields={categoriaFields}
          service={categoriasService}
          entityName="categoría"
          className="categorias-modal"
        />
      </MDBox>
    </DashboardLayout>
  );
} 