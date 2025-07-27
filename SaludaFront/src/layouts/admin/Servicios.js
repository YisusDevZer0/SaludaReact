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
import serviciosService from "services/servicios-service";

// Modales
import GenericModal from "components/Modales/GenericModal";

// Componentes de tabla
import DataTable from "examples/Tables/DataTable";

// Estilos
import "./Servicios.css";

export default function Servicios() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedServicio, setSelectedServicio] = useState(null);

  // Configuración de campos para el modal
  const servicioFields = [
    {
      name: "Nom_Serv",
      label: "Nombre del Servicio",
      type: "text",
      required: true,
      validation: (value) => {
        if (!value || value.trim() === '') {
          return "El nombre es requerido";
        }
        if (value && value.length > 255) {
          return "El nombre no puede exceder 255 caracteres";
        }
        return null;
      }
    },
    {
      name: "Descripcion",
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
      name: "Estado",
      label: "Estado",
      type: "select",
      required: true,
      defaultValue: "Activo",
      options: [
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" }
      ]
    },
    {
      name: "Cod_Estado",
      label: "Código de Estado",
      type: "select",
      required: true,
      defaultValue: "A",
      options: [
        { value: "A", label: "Activo (A)" },
        { value: "I", label: "Inactivo (I)" }
      ]
    },
    {
      name: "Sistema",
      label: "Sistema",
      type: "select",
      required: true,
      defaultValue: true,
      options: [
        { value: true, label: "Sistema" },
        { value: false, label: "Personalizado" }
      ]
    }
  ];

  // Cargar datos de servicios
  const loadServicios = async () => {
    try {
      setLoading(true);
      const response = await serviciosService.getServicios();
      
      // Mapear los datos del backend al formato esperado por la tabla
      const formattedData = (response.data || []).map(servicio => ({
        id: servicio.Servicio_ID || servicio.id,
        nombre: servicio.Nom_Serv || 'Sin nombre',
        descripcion: servicio.Descripcion || 'Sin descripción',
        estado: servicio.Estado || 'Activo',
        codigo_estado: servicio.Cod_Estado || 'A',
        sistema: servicio.Sistema || 'POS',
        organizacion: servicio.ID_H_O_D || 'Saluda',
        creado: servicio.Agregadoel ? new Date(servicio.Agregadoel).toLocaleDateString('es-ES') : 'N/A',
        agregado_por: servicio.Agregado_Por || 'Sistema',
        // Datos originales para el modal
        Nom_Serv: servicio.Nom_Serv,
        Descripcion: servicio.Descripcion,
        Estado: servicio.Estado,
        Cod_Estado: servicio.Cod_Estado,
        Sistema: servicio.Sistema
      }));
      
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
    { 
      Header: "Estado", 
      accessor: "estado",
      Cell: ({ value }) => (
        <MDBox
          component="span"
          variant="caption"
          color={value === "Activo" ? "success" : "error"}
          fontWeight="medium"
        >
          {value === "Activo" ? "ACTIVO" : "INACTIVO"}
        </MDBox>
      )
    },
    { 
      Header: "Código Estado", 
      accessor: "codigo_estado",
      Cell: ({ value }) => (
        <MDBox
          component="span"
          variant="caption"
          color={value === "A" ? "success" : "error"}
          fontWeight="medium"
        >
          {value}
        </MDBox>
      )
    },
    { Header: "Sistema", accessor: "sistema" },
    { Header: "Organización", accessor: "organizacion" },
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

  // Función para eliminar servicio
  const handleDelete = async (servicio) => {
    if (window.confirm(`¿Está seguro de eliminar el servicio "${servicio.nombre}"?`)) {
      try {
        await serviciosService.deleteServicio(servicio.id);
        loadServicios(); // Recargar datos
      } catch (error) {
        console.error("Error al eliminar servicio:", error);
      }
    }
  };

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
              className="servicios-create-button"
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