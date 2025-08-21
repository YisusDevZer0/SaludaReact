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
import tipoService from "services/tipo-service";

// Modales
import GenericModal from "components/Modales/GenericModal";

// Componentes de tabla
import StandardDataTable from "components/StandardDataTable";
import { TableThemeProvider } from "components/StandardDataTable/TableThemeProvider";

// Estilos
import "./Tipos.css";

export default function Tipos() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTipo, setSelectedTipo] = useState(null);

  // Configuración de campos para el modal
  const tipoFields = [
    {
      name: "Nom_Tipo_Prod",
      label: "Nombre del Tipo",
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

  // Cargar datos de tipos
  const loadTipos = async () => {
    try {
      setLoading(true);
      const response = await tipoService.getTipos();
      
      // Mapear los datos del backend al formato esperado por la tabla
      const formattedData = (response.data || []).map(tipo => ({
        id: tipo.Tip_Prod_ID || tipo.id,
        nombre: tipo.Nom_Tipo_Prod || 'Sin nombre',
        estado: tipo.Estado || 'Activo',
        codigo_estado: tipo.Cod_Estado || 'A',
        sistema: tipo.Sistema || 'POS',
        organizacion: tipo.ID_H_O_D || 'Saluda',
        creado: tipo.Agregadoel ? new Date(tipo.Agregadoel).toLocaleDateString('es-ES') : 'N/A',
        agregado_por: tipo.Agregado_Por || 'Sistema',
        // Datos originales para el modal
        Nom_Tipo_Prod: tipo.Nom_Tipo_Prod,
        Estado: tipo.Estado,
        Cod_Estado: tipo.Cod_Estado,
        Sistema: tipo.Sistema
      }));
      
      setTipos(formattedData);
    } catch (error) {
      console.error("Error al cargar tipos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTipos();
  }, []);

  // Funciones para manejar modales
  const handleOpenModal = (mode, tipoData = null) => {
    setModalMode(mode);
    setSelectedTipo(tipoData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTipo(null);
  };

  const handleModalSuccess = () => {
    loadTipos(); // Recargar datos
  };

  // Configuración de la tabla
  const columns = [
    { Header: "ID", accessor: "id", width: 70 },
    { Header: "Nombre", accessor: "nombre" },
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

  // Función para eliminar tipo
  const handleDelete = async (tipo) => {
    if (window.confirm(`¿Está seguro de eliminar el tipo "${tipo.nombre}"?`)) {
      try {
        await tipoService.deleteTipo(tipo.id);
        loadTipos(); // Recargar datos
      } catch (error) {
        console.error("Error al eliminar tipo:", error);
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h4" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Gestión de Tipos de Productos
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Administra los tipos de productos del sistema
        </MDTypography>
        
        {/* Botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton 
              variant="gradient" 
              color="success" 
              startIcon={<Icon>add</Icon>}
              onClick={() => handleOpenModal("create")}
              className="tipos-create-button"
            >
              Nuevo Tipo
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>file_download</Icon>}>
                Exportar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tabla de tipos */}
        <TableThemeProvider>
          <StandardDataTable
            service={tipoService}
            columns={[]}
            title="Tipos de Productos"
            subtitle="Gestión de tipos y clasificaciones de productos"
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
          data={selectedTipo}
          onSuccess={handleModalSuccess}
          title="Tipo de Producto"
          fields={tipoFields}
          service={tipoService}
          entityName="tipo"
        />
      </MDBox>
    </DashboardLayout>
  );
} 