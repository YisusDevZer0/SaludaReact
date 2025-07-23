import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { Grid } from "@mui/material";

// Servicios
import marcasService from "services/marcas-service";

// Modales
import GenericModal from "components/Modales/GenericModal";

// Componentes de tabla
import DataTable from "examples/Tables/DataTable";

export default function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedMarca, setSelectedMarca] = useState(null);

  // Configuración de campos para el modal
  const marcaFields = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: true,
      validation: (value) => {
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
        if (value && value.length > 500) {
          return "La descripción no puede exceder 500 caracteres";
        }
        return null;
      }
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      defaultValue: "activo",
      options: [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" }
      ]
    }
  ];

  // Cargar datos de marcas
  const loadMarcas = async () => {
    try {
      setLoading(true);
      const response = await marcasService.getMarcas();
      const formattedData = marcasService.formatMarcasForTable(response.data || response || []);
      setMarcas(formattedData);
    } catch (error) {
      console.error("Error al cargar marcas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarcas();
  }, []);

  // Funciones para manejar modales
  const handleOpenModal = (mode, marcaData = null) => {
    setModalMode(mode);
    setSelectedMarca(marcaData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMarca(null);
  };

  const handleModalSuccess = () => {
    loadMarcas(); // Recargar datos
  };

  // Configuración de la tabla
  const columns = [
    { Header: "ID", accessor: "id", width: 70 },
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Descripción", accessor: "descripcion" },
    { 
      Header: "Estado", 
      accessor: "estado",
      Cell: ({ value }) => (
        <MDBox
          component="span"
          variant="caption"
          color={value === "activo" ? "success" : "error"}
          fontWeight="medium"
        >
          {value === "activo" ? "ACTIVO" : "INACTIVO"}
        </MDBox>
      )
    },
    { Header: "Creado", accessor: "created_at" },
    { Header: "Actualizado", accessor: "updated_at" },
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
            onClick={() => handleOpenModal("view", row.original)}
          >
            delete
          </Icon>
        </MDBox>
      )
    }
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h4" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Gestión de Marcas
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Administra las marcas de productos del sistema
        </MDTypography>
        
        {/* Botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton 
              variant="gradient" 
              color="success" 
              startIcon={<Icon>add</Icon>}
              onClick={() => handleOpenModal("create")}
            >
              Nueva Marca
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>file_download</Icon>}>
                Exportar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tabla de marcas */}
        <DataTable
          table={{ columns, rows: marcas }}
          isSorted={true}
          entriesPerPage={true}
          showTotalEntries={true}
          noEndBorder
          canSearch
          loading={loading}
        />

        {/* Modal genérico */}
        <GenericModal
          open={modalOpen}
          onClose={handleCloseModal}
          mode={modalMode}
          data={selectedMarca}
          onSuccess={handleModalSuccess}
          title="Marca"
          fields={marcaFields}
          service={marcasService}
          entityName="marca"
        />
      </MDBox>
    </DashboardLayout>
  );
} 