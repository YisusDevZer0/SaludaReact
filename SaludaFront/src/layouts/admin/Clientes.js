/**
 * Clientes page
 * 
 * Esta página proporciona una interfaz completa para la gestión de clientes,
 * incluyendo funcionalidades CRUD, filtros avanzados, y estadísticas.
 */

import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { Grid } from "@mui/material";

// Servicios
import clientesService from "services/clientes-service";

// Modales
import GenericModal from "components/Modales/GenericModal";

// Componentes de tabla
import DataTable from "examples/Tables/DataTable";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCliente, setSelectedCliente] = useState(null);

  // Configuración de campos para el modal
  const clienteFields = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: true,
      validation: (value) => {
        if (value && value.length > 50) {
          return "El nombre no puede exceder 50 caracteres";
        }
        return null;
      }
    },
    {
      name: "apellido",
      label: "Apellido",
      type: "text",
      required: true,
      validation: (value) => {
        if (value && value.length > 50) {
          return "El apellido no puede exceder 50 caracteres";
        }
        return null;
      }
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      validation: (value) => {
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          return "El email no es válido";
        }
        return null;
      }
    },
    {
      name: "telefono",
      label: "Teléfono",
      type: "text",
      validation: (value) => {
        if (value && value.length > 20) {
          return "El teléfono no puede exceder 20 caracteres";
        }
        return null;
      }
    },
    {
      name: "direccion",
      label: "Dirección",
      type: "text",
      multiline: true,
      rows: 2,
      validation: (value) => {
        if (value && value.length > 200) {
          return "La dirección no puede exceder 200 caracteres";
        }
        return null;
      }
    },
    {
      name: "fecha_nacimiento",
      label: "Fecha de Nacimiento",
      type: "date"
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

  // Cargar datos de clientes
  const loadClientes = async () => {
    try {
      setLoading(true);
      const response = await clientesService.getClientes();
      const formattedData = clientesService.formatClientesForTable(response.data || response || []);
      setClientes(formattedData);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  // Funciones para manejar modales
  const handleOpenModal = (mode, clienteData = null) => {
    setModalMode(mode);
    setSelectedCliente(clienteData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCliente(null);
  };

  const handleModalSuccess = () => {
    loadClientes(); // Recargar datos
  };

  // Configuración de la tabla
  const columns = [
    { Header: "ID", accessor: "id", width: 70 },
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Apellido", accessor: "apellido" },
    { Header: "Email", accessor: "email" },
    { Header: "Teléfono", accessor: "telefono" },
    { Header: "Dirección", accessor: "direccion" },
    { Header: "Fecha Nacimiento", accessor: "fecha_nacimiento" },
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
          Gestión de Clientes
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Administra los clientes del sistema
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
              Nuevo Cliente
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>file_download</Icon>}>
                Exportar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tabla de clientes */}
        <DataTable
          table={{ columns, rows: clientes }}
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
          data={selectedCliente}
          onSuccess={handleModalSuccess}
          title="Cliente"
          fields={clienteFields}
          service={clientesService}
          entityName="cliente"
        />
      </MDBox>
    </DashboardLayout>
  );
} 