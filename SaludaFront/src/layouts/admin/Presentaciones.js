import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { Grid } from "@mui/material";

// Context
import { useMaterialUIController } from "context";

// Servicios
import presentacionService from "services/presentacion-service";

// Modales
import GenericModal from "components/Modales/GenericModal";

// Componentes de tabla
import DataTable from "examples/Tables/DataTable";

// Estilos
import "./Presentaciones.css";

export default function Presentaciones() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  
  const [presentaciones, setPresentaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedPresentacion, setSelectedPresentacion] = useState(null);

  // Configuración de campos para el modal
  const presentacionFields = [
    {
      name: "nombre",
      label: "Nombre de la Presentación",
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
      name: "abreviatura",
      label: "Abreviatura",
      type: "text",
      validation: (value) => {
        if (value && value.length > 20) {
          return "La abreviatura no puede exceder 20 caracteres";
        }
        return null;
      }
    },
    {
      name: "activa",
      label: "Activa",
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
      validation: (value) => {
        if (value && (value < 0 || !Number.isInteger(parseInt(value)))) {
          return "El orden debe ser un número entero positivo";
        }
        return null;
      }
    }
  ];

  // Cargar datos de presentaciones
  const loadPresentaciones = async () => {
    try {
      setLoading(true);
      const response = await presentacionService.getPresentaciones();
      
      // Mapear los datos del backend al formato esperado por la tabla
      const formattedData = (response.data || []).map(presentacion => ({
        id: presentacion.id,
        nombre: presentacion.nombre || 'Sin nombre',
        codigo: presentacion.codigo || 'Sin código',
        descripcion: presentacion.descripcion || 'Sin descripción',
        abreviatura: presentacion.abreviatura || 'Sin abreviatura',
        activa: presentacion.activa ? 'Sí' : 'No',
        orden: presentacion.orden || 0,
        created_at: presentacion.created_at ? new Date(presentacion.created_at).toLocaleDateString('es-ES') : 'N/A',
        Id_Licencia: presentacion.Id_Licencia || 'Sistema',
        // Datos originales para el modal
        nombre: presentacion.nombre,
        codigo: presentacion.codigo,
        descripcion: presentacion.descripcion,
        abreviatura: presentacion.abreviatura,
        activa: presentacion.activa,
        orden: presentacion.orden
      }));
      
      setPresentaciones(formattedData);
    } catch (error) {
      console.error("Error al cargar presentaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresentaciones();
  }, []);

  // Funciones para manejar modales
  const handleOpenModal = (mode, presentacionData = null) => {
    setModalMode(mode);
    setSelectedPresentacion(presentacionData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPresentacion(null);
  };

  const handleModalSuccess = () => {
    loadPresentaciones(); // Recargar datos
  };

  // Configuración de la tabla
  const columns = [
    { Header: "ID", accessor: "id", width: 70 },
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Código", accessor: "codigo" },
    { Header: "Descripción", accessor: "descripcion" },
    { Header: "Abreviatura", accessor: "abreviatura" },
    { 
      Header: "Activa", 
      accessor: "activa",
      Cell: ({ value }) => (
        <MDBox
          component="span"
          variant="caption"
          color={value === "Sí" ? "success" : "error"}
          fontWeight="medium"
        >
          {value}
        </MDBox>
      )
    },
    { Header: "Orden", accessor: "orden" },
    { Header: "Creado", accessor: "created_at" },
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

  // Función para eliminar presentación
  const handleDelete = async (presentacion) => {
    if (window.confirm(`¿Está seguro de eliminar la presentación "${presentacion.nombre}"?`)) {
      try {
        await presentacionService.eliminarPresentacion(presentacion.id);
        loadPresentaciones(); // Recargar datos
      } catch (error) {
        console.error("Error al eliminar presentación:", error);
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h4" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Gestión de Presentaciones POS
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Administra las presentaciones de productos del sistema POS
        </MDTypography>
        
        {/* Botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton 
              variant="gradient" 
              color="success" 
              startIcon={<Icon>add</Icon>}
              onClick={() => handleOpenModal("create")}
              className="presentaciones-create-button"
            >
              Nueva Presentación
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>file_download</Icon>}>
                Exportar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tabla de presentaciones */}
        <DataTable
          table={{ columns, rows: presentaciones }}
          isSorted={true}
          entriesPerPage={true}
          showTotalEntries={true}
          noEndBorder
          canSearch
        />

        {/* Modal genérico */}
        <GenericModal
          open={modalOpen}
          onClose={handleCloseModal}
          mode={modalMode}
          data={selectedPresentacion}
          onSuccess={handleModalSuccess}
          title="Presentación"
          fields={presentacionFields}
          service={presentacionService}
          entityName="presentación"
        />
      </MDBox>
    </DashboardLayout>
  );
} 