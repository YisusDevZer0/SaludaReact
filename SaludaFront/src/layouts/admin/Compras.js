/**
=========================================================
* SaludaReact - Menú de Compras para Administrador
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

// React components
import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Compras() {
  // Datos simulados para la tabla de órdenes de compra
  const ordersTableData = {
    columns: [
      { Header: "Orden #", accessor: "orden" },
      { Header: "Proveedor", accessor: "proveedor" },
      { Header: "Fecha Orden", accessor: "fechaOrden" },
      { Header: "Total Items", accessor: "totalItems" },
      { Header: "Total", accessor: "total" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 10 }, (_, i) => {
      const estadoOptions = ["Pendiente", "En proceso", "Entregada", "Cancelada"];
      const estado = estadoOptions[i % 4];
      const estadoColor = estado === "Pendiente" ? "info" : estado === "En proceso" ? "warning" : estado === "Entregada" ? "success" : "error";
      
      return {
        orden: `OC-${(1000 + i).toString()}`,
        proveedor: ["FarmaPro", "MediSupplies", "PharmaDist", "MedicalStock", "HealthDist", "BioMed", "MedEquip", "PharmaWholesale", "MedSupply", "GlobalHealth"][i],
        fechaOrden: ["10/05/2023", "12/05/2023", "15/05/2023", "18/05/2023", "20/05/2023", "25/05/2023", "27/05/2023", "29/05/2023", "30/05/2023", "01/06/2023"][i],
        totalItems: Math.floor(Math.random() * 50) + 5,
        total: `$${(Math.random() * 10000 + 1000).toFixed(2)}`,
        estado: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={estadoColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${estadoColor}.light`,
              }}
            >
              {estado}
            </MDTypography>
          </MDBox>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "warning.main" }}>print</Icon>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para proveedores
  const providersTableData = {
    columns: [
      { Header: "Proveedor", accessor: "proveedor" },
      { Header: "Contacto", accessor: "contacto" },
      { Header: "Teléfono", accessor: "telefono" },
      { Header: "Email", accessor: "email" },
      { Header: "Productos", accessor: "productos" },
      { Header: "Estatus", accessor: "estatus" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 5 }, (_, i) => {
      const estatus = ["Activo", "Activo", "Inactivo", "Activo", "Suspendido"][i];
      const estatusColor = estatus === "Activo" ? "success" : estatus === "Inactivo" ? "error" : "warning";
      
      return {
        proveedor: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src={`https://ui-avatars.com/api/?name=${["FarmaPro", "MediSupplies", "PharmaDist", "MedicalStock", "HealthDist"][i]}&background=random`}
              alt={`Proveedor ${i + 1}`}
              size="sm"
              sx={{ mr: 1 }}
            />
            <MDTypography variant="button" fontWeight="medium">
              {["FarmaPro", "MediSupplies", "PharmaDist", "MedicalStock", "HealthDist"][i]}
            </MDTypography>
          </MDBox>
        ),
        contacto: ["Juan Méndez", "María Sánchez", "Pedro López", "Carlos Díaz", "Ana Torres"][i],
        telefono: ["999-123-4567", "999-234-5678", "999-345-6789", "999-456-7890", "999-567-8901"][i],
        email: ["contacto@farmapro.com", "ventas@medisupplies.com", "info@pharmadist.com", "pedidos@medicalstock.com", "ventas@healthdist.com"][i],
        productos: ["Medicamentos", "Insumos médicos", "Medicamentos", "Equipos médicos", "Medicamentos e insumos"][i],
        estatus: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={estatusColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${estatusColor}.light`,
              }}
            >
              {estatus}
            </MDTypography>
          </MDBox>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
          </MDBox>
        ),
      };
    })
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado y botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium">
                Compras
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Gestión de órdenes de compra y proveedores
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
              Nueva Orden de Compra
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>person_add</Icon>}>
                Nuevo Proveedor
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tarjetas de resumen */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="info"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">shopping_cart</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Órdenes Totales
                  </MDTypography>
                  <MDTypography variant="h4">48</MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="success"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">check_circle</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Entregadas
                  </MDTypography>
                  <MDTypography variant="h4">35</MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="warning"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">pending</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Pendientes
                  </MDTypography>
                  <MDTypography variant="h4">10</MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="error"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">cancel</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Canceladas
                  </MDTypography>
                  <MDTypography variant="h4">3</MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Órdenes de compra */}
        <Card mb={3}>
          <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium">
                Órdenes de Compra
              </MDTypography>
              <MDTypography variant="button" color="text">
                Listado de órdenes de compra recientes
              </MDTypography>
            </MDBox>
            <MDButton variant="outlined" color="info" size="small" startIcon={<Icon>filter_list</Icon>}>
              Filtrar
            </MDButton>
          </MDBox>
          <MDBox px={3} mb={3}>
            {/* Área de búsqueda */}
            <Grid container spacing={3} alignItems="center" mb={3}>
              <Grid item xs={12} md={6}>
                <MDInput 
                  label="Buscar orden" 
                  fullWidth 
                  icon={{ component: "search", direction: "left" }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <MDInput 
                  select
                  label="Estado"
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="entregada">Entregada</option>
                  <option value="cancelada">Cancelada</option>
                </MDInput>
              </Grid>
              <Grid item xs={12} md={3}>
                <MDButton 
                  variant="gradient" 
                  color="info" 
                  fullWidth
                >
                  Buscar
                </MDButton>
              </Grid>
            </Grid>
            <DataTable
              table={ordersTableData}
              isSorted={false}
              entriesPerPage={{
                defaultValue: 10,
                entries: [5, 10, 15, 20, 25],
              }}
              showTotalEntries={true}
              noEndBorder
            />
          </MDBox>
        </Card>

        {/* Proveedores */}
        <Card>
          <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium">
                Proveedores
              </MDTypography>
              <MDTypography variant="button" color="text">
                Listado de proveedores activos
              </MDTypography>
            </MDBox>
            <MDButton variant="text" color="info" startIcon={<Icon>download</Icon>}>
              Exportar
            </MDButton>
          </MDBox>
          <MDBox px={3} mb={3}>
            <DataTable
              table={providersTableData}
              isSorted={false}
              entriesPerPage={{
                defaultValue: 5,
                entries: [5, 10, 15, 20, 25],
              }}
              showTotalEntries={true}
              noEndBorder
            />
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Compras; 