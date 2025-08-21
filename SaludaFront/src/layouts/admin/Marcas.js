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
import marcasService from "services/marcas-service";

// Modales
import GenericModal from "components/Modales/GenericModal";

// Componentes de tabla
import StandardDataTable from "components/StandardDataTable";
import { TableThemeProvider } from "components/StandardDataTable/TableThemeProvider";

// Estilos
import "./Marcas.css";

export default function Marcas() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedMarca, setSelectedMarca] = useState(null);

  // Configuración de campos para el modal
  const marcaFields = [
    {
      name: "nombre",
      label: "Nombre de la Marca",
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
      name: "estado",
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
      name: "codigo_estado",
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
      name: "sistema",
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

  // Cargar datos de marcas
  const loadMarcas = async () => {
    try {
      setLoading(true);
      const response = await marcasService.getMarcas();
      
      // Mapear los datos del backend al formato esperado por la tabla
      const formattedData = (response.data || []).map(marca => ({
        id: marca.id,
        nombre: marca.nombre || 'Sin nombre',
        descripcion: marca.descripcion || 'Sin descripción',
        estado: marca.estado || 'Activo',
        codigo_estado: marca.codigo_estado || 'A',
        sistema: marca.sistema || 'POS',
        organizacion: marca.organizacion || 'Saluda',
        creado: marca.agregado_el ? new Date(marca.agregado_el).toLocaleDateString('es-ES') : 'N/A',
        agregado_por: marca.agregado_por || 'Sistema',
        // Datos originales para el modal
        nombre: marca.nombre,
        descripcion: marca.descripcion,
        estado: marca.estado,
        codigo_estado: marca.codigo_estado,
        sistema: marca.sistema
      }));
      
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

  // Función para eliminar marca
  const handleDelete = async (marca) => {
    if (window.confirm(`¿Está seguro de eliminar la marca "${marca.nombre}"?`)) {
      try {
        await marcasService.deleteMarca(marca.id);
        loadMarcas(); // Recargar datos
      } catch (error) {
        console.error("Error al eliminar marca:", error);
      }
    }
  };

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
              className="marcas-create-button"
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
        <TableThemeProvider>
          <StandardDataTable
            service={marcasService}
            columns={[]}
            title="Marcas"
            subtitle="Gestión de marcas comerciales"
            enableCreate={false}
            enableEdit={false}
            enableDelete={false}
            enableSearch={true}
            enableFilters={true}
            enableStats={false}
            enableExport={true}
            serverSide={false}
            defaultPageSize={10}
            defaultSortField="nombre"
            defaultSortDirection="asc"
            onRowClick={(row) => handleOpenModal("view", row)}
            permissions={{
              create: true,
              edit: true,
              delete: true,
              view: true
            }}
          />
        </TableThemeProvider>

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