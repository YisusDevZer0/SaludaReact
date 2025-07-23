/**
 * Proveedores page
 * 
 * Esta página proporciona una interfaz completa para la gestión de proveedores,
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
import proveedoresService from "services/proveedores-service";

// Modales
import GenericModal from "components/Modales/GenericModal";

// Componentes de tabla
import DataTable from "examples/Tables/DataTable";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  // Configuración de campos para el modal
  const proveedorFields = [
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
      name: "rfc",
      label: "RFC",
      type: "text",
      validation: (value) => {
        if (value && value.length > 13) {
          return "El RFC no puede exceder 13 caracteres";
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

  // Cargar datos de proveedores
  const loadProveedores = async () => {
    try {
      setLoading(true);
      const response = await proveedoresService.getProveedores();
      const formattedData = proveedoresService.formatProveedoresForTable(response.data || response || []);
      setProveedores(formattedData);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProveedores();
  }, []);

  // Funciones para manejar modales
  const handleOpenModal = (mode, proveedorData = null) => {
    setModalMode(mode);
    setSelectedProveedor(proveedorData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProveedor(null);
  };

  const handleModalSuccess = () => {
    loadProveedores(); // Recargar datos
  };

  // Configuración de la tabla
  const columns = [
    { Header: "ID", accessor: "id", width: 70 },
    { Header: "Nombre", accessor: "nombre" },
    { Header: "RFC", accessor: "rfc" },
    { Header: "Email", accessor: "email" },
    { Header: "Teléfono", accessor: "telefono" },
    { Header: "Dirección", accessor: "direccion" },
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
          Gestión de Proveedores
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Administra los proveedores del sistema
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
              Nuevo Proveedor
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>file_download</Icon>}>
                Exportar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tabla de proveedores */}
        <DataTable
          table={{ columns, rows: proveedores }}
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
          data={selectedProveedor}
          onSuccess={handleModalSuccess}
          title="Proveedor"
          fields={proveedorFields}
          service={proveedoresService}
          entityName="proveedor"
        />
      </MDBox>
    </DashboardLayout>
  );
} 