import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { Grid } from "@mui/material";

// Servicios
import serviciosService from "services/servicios-service";

// Modales
import GenericModal from "components/Modales/GenericModal";

// Componentes de tabla
import DataTable from "examples/Tables/DataTable";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedServicio, setSelectedServicio] = useState(null);

  // Configuración de campos para el modal
  const servicioFields = [
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
      name: "precio",
      label: "Precio",
      type: "number",
      required: true,
      validation: (value) => {
        if (value && isNaN(parseFloat(value))) {
          return "El precio debe ser un número válido";
        }
        if (value && parseFloat(value) < 0) {
          return "El precio no puede ser negativo";
        }
        return null;
      }
    },
    {
      name: "duracion",
      label: "Duración (minutos)",
      type: "number",
      validation: (value) => {
        if (value && isNaN(parseInt(value))) {
          return "La duración debe ser un número válido";
        }
        if (value && parseInt(value) < 0) {
          return "La duración no puede ser negativa";
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

  // Cargar datos de servicios
  const loadServicios = async () => {
    try {
      setLoading(true);
      const response = await serviciosService.getServicios();
      const formattedData = serviciosService.formatServiciosForTable(response.data || response || []);
      setServicios(formattedData);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServicios();
  }, []);

  // Funciones para manejar modales
  const handleOpenModal = (mode, servicioData = null) => {
    setModalMode(mode);
    setSelectedServicio(servicioData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedServicio(null);
  };

  const handleModalSuccess = () => {
    loadServicios(); // Recargar datos
  };

  // Configuración de la tabla
  const columns = [
    { Header: "ID", accessor: "id", width: 70 },
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Descripción", accessor: "descripcion" },
    { Header: "Precio", accessor: "precio" },
    { Header: "Duración", accessor: "duracion" },
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
          Gestión de Servicios
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Administra los servicios ofrecidos en el sistema
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
              Nuevo Servicio
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>file_download</Icon>}>
                Exportar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tabla de servicios */}
        <DataTable
          table={{ columns, rows: servicios }}
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
          data={selectedServicio}
          onSuccess={handleModalSuccess}
          title="Servicio"
          fields={servicioFields}
          service={serviciosService}
          entityName="servicio"
        />
      </MDBox>
    </DashboardLayout>
  );
} 