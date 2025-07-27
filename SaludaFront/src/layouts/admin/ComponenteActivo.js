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
import componenteService from "services/componente-service";

// Modales
import GenericModal from "components/Modales/GenericModal.js";

// Componentes de tabla
import DataTable from "examples/Tables/DataTable/index";

// Estilos
import "./ComponenteActivo.css";

export default function ComponenteActivo() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedComponente, setSelectedComponente] = useState(null);

  // Configuración de campos para el modal
  const componenteFields = [
    {
      name: "Nom_Com",
      label: "Nombre del Componente",
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
        if (value && value.length > 500) {
          return "La descripción no puede exceder 500 caracteres";
        }
        return null;
      }
    },
    {
      name: "Estado",
      label: "Estado",
      type: "select",
      required: true,
      defaultValue: "Vigente",
      options: [
        { value: "Vigente", label: "Vigente" },
        { value: "Descontinuado", label: "Descontinuado" }
      ]
    },
    {
      name: "Cod_Estado",
      label: "Código de Estado",
      type: "select",
      required: true,
      defaultValue: "V",
      options: [
        { value: "V", label: "Vigente (V)" },
        { value: "D", label: "Descontinuado (D)" }
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

  // Cargar datos de componentes
  const loadComponentes = async () => {
    try {
      setLoading(true);
      const response = await componenteService.getComponentes();
      
      // Mapear los datos del backend al formato esperado por la tabla
      const formattedData = (response.data || []).map(componente => ({
        id: componente.ID_Comp || componente.id,
        nombre: componente.Nom_Com || 'Sin nombre',
        descripcion: componente.Descripcion || 'Sin descripción',
        estado: componente.Estado || 'Vigente',
        codigo_estado: componente.Cod_Estado || 'V',
        sistema: componente.Sistema || 'POS',
        organizacion: componente.Organizacion || 'Saluda',
        creado: componente.Agregadoel ? new Date(componente.Agregadoel).toLocaleDateString('es-ES') : 'N/A',
        agregado_por: componente.Agregado_Por || 'Sistema',
        // Datos originales para el modal
        Nom_Com: componente.Nom_Com,
        Descripcion: componente.Descripcion,
        Estado: componente.Estado,
        Cod_Estado: componente.Cod_Estado,
        Sistema: componente.Sistema
      }));
      
      setComponentes(formattedData);
    } catch (error) {
      console.error("Error al cargar componentes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComponentes();
  }, []);

  // Funciones para manejar modales
  const handleOpenModal = (mode, componenteData = null) => {
    setModalMode(mode);
    setSelectedComponente(componenteData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedComponente(null);
  };

  const handleModalSuccess = () => {
    loadComponentes(); // Recargar datos
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
          color={value === "Vigente" ? "success" : "error"}
          fontWeight="medium"
        >
          {value === "Vigente" ? "VIGENTE" : "DESCONTINUADO"}
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
          color={value === "V" ? "success" : "error"}
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

  // Función para eliminar componente
  const handleDelete = async (componente) => {
    if (window.confirm(`¿Está seguro de eliminar el componente "${componente.nombre}"?`)) {
      try {
        await componenteService.deleteComponente(componente.id);
        loadComponentes(); // Recargar datos
      } catch (error) {
        console.error("Error al eliminar componente:", error);
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h4" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Gestión de Componentes Activos
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Administra los componentes activos del sistema médico
        </MDTypography>
        
        {/* Botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton 
              variant="gradient" 
              color="success" 
              startIcon={<Icon>add</Icon>}
              onClick={() => handleOpenModal("create")}
              className="componente-create-button"
            >
              Nuevo Componente
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>file_download</Icon>}>
                Exportar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tabla de componentes */}
        <DataTable
          table={{ columns, rows: componentes }}
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
          data={selectedComponente}
          onSuccess={handleModalSuccess}
          title="Componente Activo"
          fields={componenteFields}
          service={componenteService}
          entityName="componente"
        />
      </MDBox>
    </DashboardLayout>
  );
} 