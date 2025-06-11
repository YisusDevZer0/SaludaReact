/**
=========================================================
* SaludaReact - Menú de Configuración para Administrador
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";

// React components
import { useState, useEffect } from "react";

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

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setSucursalesTableHeaderColor,
  setSucursalesTableHeaderText,
  setSucursalesTableCellText,
  setSucursalesTableActiveIcon,
  setSucursalesTableInactiveIcon
} from "context";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function Configuracion() {
  const [tabValue, setTabValue] = useState(0);
  const [controller, dispatch] = useMaterialUIController();
  const [rolesTableData, setRolesTableData] = useState({ columns: [], rows: [] });
  const [loadingRoles, setLoadingRoles] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    // Obtener userData del usuario logueado
    let userData = null;
    try {
      userData = JSON.parse(localStorage.getItem("userData"));
    } catch (e) {}
    const id_hod = userData?.ID_H_O_D;
    if (!id_hod) return;
    setLoadingRoles(true);
    fetch(`http://localhost:8000/api/roles-puestos?id_hod=${id_hod}`)
      .then(res => res.json())
      .then(data => {
        // Mapear los datos a las columnas y filas esperadas
        const columns = [
          { Header: "Rol", accessor: "rol" },
          { Header: "Descripción", accessor: "descripcion" },
          { Header: "Usuarios", accessor: "usuarios" },
          { Header: "Permisos", accessor: "permisos" },
          { Header: "Último Cambio", accessor: "ultimoCambio" },
          { Header: "Acciones", accessor: "acciones" },
        ];
        const rows = (data || []).map(rol => ({
          rol: rol.Nombre_rol,
          descripcion: rol.Descripcion || "-",
          usuarios: rol.Usuarios || "-",
          permisos: (
            <MDTypography variant="caption" color="info" fontWeight="medium">
              {rol.Sistema ? Object.keys(JSON.parse(rol.Sistema)).join(", ") : "-"}
            </MDTypography>
          ),
          ultimoCambio: rol.updated_at ? rol.updated_at.split("T")[0] : "-",
          acciones: (
            <MDBox display="flex" alignItems="center">
              <Icon sx={{ cursor: "pointer", color: "info.main" }}>edit</Icon>
              <Icon sx={{ cursor: "pointer", ml: 1, color: "warning.main" }}>security</Icon>
            </MDBox>
          ),
        }));
        setRolesTableData({ columns, rows });
        setLoadingRoles(false);
      })
      .catch(() => setLoadingRoles(false));
  }, []);

  // Datos simulados para la tabla de sucursales
  const sucursalesTableData = {
    columns: [
      { Header: "Sucursal", accessor: "sucursal" },
      { Header: "Dirección", accessor: "direccion" },
      { Header: "Teléfono", accessor: "telefono" },
      { Header: "Encargado", accessor: "encargado" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: [
      {
        sucursal: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src="https://ui-avatars.com/api/?name=MATRIZ&background=0D8ABC&color=fff"
              alt="Matriz"
              size="sm"
              sx={{ mr: 1 }}
            />
            <MDTypography variant="button" fontWeight="medium">
              Matriz CdCaucel
            </MDTypography>
          </MDBox>
        ),
        direccion: "Calle 50 #485 x 57 y 59, Cd. Caucel, Mérida, Yucatán",
        telefono: "999-123-4567",
        encargado: "Dr. Juan Méndez",
        estado: (
          <MDBox>
            <MDTypography
              variant="caption"
              color="success"
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: "success.light",
              }}
            >
              Activa
            </MDTypography>
          </MDBox>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "warning.main" }}>settings</Icon>
          </MDBox>
        ),
      },
      {
        sucursal: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src="https://ui-avatars.com/api/?name=NORTE&background=27AE60&color=fff"
              alt="Norte"
              size="sm"
              sx={{ mr: 1 }}
            />
            <MDTypography variant="button" fontWeight="medium">
              Sucursal Norte
            </MDTypography>
          </MDBox>
        ),
        direccion: "Calle 21 #115 x 24 y 26, Col. México Norte, Mérida, Yucatán",
        telefono: "999-234-5678",
        encargado: "Dra. María Sánchez",
        estado: (
          <MDBox>
            <MDTypography
              variant="caption"
              color="success"
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: "success.light",
              }}
            >
              Activa
            </MDTypography>
          </MDBox>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "warning.main" }}>settings</Icon>
          </MDBox>
        ),
      },
      {
        sucursal: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src="https://ui-avatars.com/api/?name=SUR&background=E74C3C&color=fff"
              alt="Sur"
              size="sm"
              sx={{ mr: 1 }}
            />
            <MDTypography variant="button" fontWeight="medium">
              Sucursal Sur
            </MDTypography>
          </MDBox>
        ),
        direccion: "Calle 42 Sur #200 x 39 y 41, Col. Chuburná, Mérida, Yucatán",
        telefono: "999-345-6789",
        encargado: "Dr. Pedro López",
        estado: (
          <MDBox>
            <MDTypography
              variant="caption"
              color="success"
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: "success.light",
              }}
            >
              Activa
            </MDTypography>
          </MDBox>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "warning.main" }}>settings</Icon>
          </MDBox>
        ),
      },
      {
        sucursal: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src="https://ui-avatars.com/api/?name=ESTE&background=F39C12&color=fff"
              alt="Este"
              size="sm"
              sx={{ mr: 1 }}
            />
            <MDTypography variant="button" fontWeight="medium">
              Sucursal Este
            </MDTypography>
          </MDBox>
        ),
        direccion: "Calle 15 #225 x 18 y 20, Col. Altabrisa, Mérida, Yucatán",
        telefono: "999-456-7890",
        encargado: "Dra. Ana Torres",
        estado: (
          <MDBox>
            <MDTypography
              variant="caption"
              color="warning"
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: "warning.light",
              }}
            >
              En renovación
            </MDTypography>
          </MDBox>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "warning.main" }}>settings</Icon>
          </MDBox>
        ),
      }
    ]
  };

  // Bloque de selección de colores para la tabla de sucursales
  const SucursalesColorPanel = () => (
    <Card sx={{ mb: 3 }}>
      <MDBox p={3}>
        <MDTypography variant="h6" fontWeight="medium" mb={3}>
          Colores de la Tabla de Sucursales
        </MDTypography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MDBox mb={2}>
              <MDTypography variant="button" display="block" mb={1}>
                Color de fondo del header
              </MDTypography>
              <input type="color" value={controller.sucursalesTableHeaderColor || "#0057B8"}
                onChange={e => setSucursalesTableHeaderColor(dispatch, e.target.value)} />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button" display="block" mb={1}>
                Color de texto del header
              </MDTypography>
              <input type="color" value={controller.sucursalesTableHeaderText || "#ffffff"}
                onChange={e => setSucursalesTableHeaderText(dispatch, e.target.value)} />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button" display="block" mb={1}>
                Color de texto de celdas
              </MDTypography>
              <input type="color" value={controller.sucursalesTableCellText || "#333333"}
                onChange={e => setSucursalesTableCellText(dispatch, e.target.value)} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDBox mb={2}>
              <MDTypography variant="button" display="block" mb={1}>
                Color del ícono activo
              </MDTypography>
              <input type="color" value={controller.sucursalesTableActiveIcon || "#00C7B1"}
                onChange={e => setSucursalesTableActiveIcon(dispatch, e.target.value)} />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button" display="block" mb={1}>
                Color del ícono inactivo
              </MDTypography>
              <input type="color" value={controller.sucursalesTableInactiveIcon || "#C00096"}
                onChange={e => setSucursalesTableInactiveIcon(dispatch, e.target.value)} />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado y botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium">
                Configuración del Sistema
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Administración de roles, sucursales y preferencias
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="dark" startIcon={<Icon>backup</Icon>}>
              Respaldo
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="info" startIcon={<Icon>settings_backup_restore</Icon>}>
                Restaurar
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Pestañas */}
        <Card>
          <MDBox p={0}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                "& .MuiTabs-indicator": {
                  backgroundColor: "info.main"
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "info.main"
                }
              }}
            >
              <Tab label="Roles y Permisos" />
              <Tab label="Sucursales" />
              <Tab label="Preferencias del Sistema" />
            </Tabs>
            
            {/* Tab 1: Roles y Permisos */}
            <TabPanel value={tabValue} index={0}>
              <MDBox p={3}>
                <MDBox mb={3} display="flex" justifyContent="flex-end">
                  <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
                    Nuevo Rol
                  </MDButton>
                </MDBox>
                {loadingRoles ? (
                  <MDTypography variant="body2">Cargando roles...</MDTypography>
                ) : (
                  <DataTable
                    table={rolesTableData}
                    isSorted={false}
                    entriesPerPage={{
                      defaultValue: 5,
                      entries: [5, 10, 15, 20, 25],
                    }}
                    showTotalEntries={true}
                    noEndBorder
                  />
                )}
              </MDBox>
            </TabPanel>
            
            {/* Tab 2: Sucursales */}
            <TabPanel value={tabValue} index={1}>
              <MDBox p={3}>
                <MDBox mb={3} display="flex" justifyContent="flex-end">
                  <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
                    Nueva Sucursal
                  </MDButton>
                </MDBox>
                <DataTable
                  table={sucursalesTableData}
                  isSorted={false}
                  entriesPerPage={{
                    defaultValue: 5,
                    entries: [5, 10, 15, 20, 25],
                  }}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </TabPanel>
            
            {/* Tab 3: Preferencias del Sistema */}
            <TabPanel value={tabValue} index={2}>
              <MDBox p={3}>
                <Card>
                  <MDBox p={3}>
                    <MDTypography variant="h6" fontWeight="medium" mb={3}>
                      Configuración General
                    </MDTypography>
                    
                    <Grid container spacing={3} mb={3}>
                      <Grid item xs={12} md={6}>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <MDTypography variant="button">
                            Modo oscuro
                          </MDTypography>
                          <Switch defaultChecked={false} />
                        </MDBox>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <MDTypography variant="button">
                            Notificaciones por email
                          </MDTypography>
                          <Switch defaultChecked={true} />
                        </MDBox>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <MDTypography variant="button">
                            Alertas de inventario bajo
                          </MDTypography>
                          <Switch defaultChecked={true} />
                        </MDBox>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                          <MDTypography variant="button">
                            Recordatorios de citas
                          </MDTypography>
                          <Switch defaultChecked={true} />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="button" display="block" mb={1}>
                            Idioma del sistema
                          </MDTypography>
                          <MDInput
                            select
                            fullWidth
                            SelectProps={{ native: true }}
                            defaultValue="es"
                          >
                            <option value="es">Español</option>
                            <option value="en">Inglés</option>
                          </MDInput>
                        </MDBox>
                        <MDBox mb={2}>
                          <MDTypography variant="button" display="block" mb={1}>
                            Formato de fecha
                          </MDTypography>
                          <MDInput
                            select
                            fullWidth
                            SelectProps={{ native: true }}
                            defaultValue="dd/mm/yyyy"
                          >
                            <option value="dd/mm/yyyy">DD/MM/AAAA</option>
                            <option value="mm/dd/yyyy">MM/DD/AAAA</option>
                            <option value="yyyy-mm-dd">AAAA-MM-DD</option>
                          </MDInput>
                        </MDBox>
                        <MDBox>
                          <MDTypography variant="button" display="block" mb={1}>
                            Zona horaria
                          </MDTypography>
                          <MDInput
                            select
                            fullWidth
                            SelectProps={{ native: true }}
                            defaultValue="america_mexico_city"
                          >
                            <option value="america_mexico_city">América/Ciudad de México (UTC-6)</option>
                            <option value="america_cancun">América/Cancún (UTC-5)</option>
                            <option value="america_tijuana">América/Tijuana (UTC-7)</option>
                          </MDInput>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>

                <Card sx={{ mt: 3 }}>
                  <MDBox p={3}>
                    <MDTypography variant="h6" fontWeight="medium" mb={3}>
                      Configuración de Facturación
                    </MDTypography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="button" display="block" mb={1}>
                            RFC de la empresa
                          </MDTypography>
                          <MDInput fullWidth defaultValue="XAXX010101000" />
                        </MDBox>
                        <MDBox mb={2}>
                          <MDTypography variant="button" display="block" mb={1}>
                            Razón social
                          </MDTypography>
                          <MDInput fullWidth defaultValue="Saluda Servicios Médicos S.A. de C.V." />
                        </MDBox>
                        <MDBox mb={2}>
                          <MDTypography variant="button" display="block" mb={1}>
                            Régimen fiscal
                          </MDTypography>
                          <MDInput
                            select
                            fullWidth
                            SelectProps={{ native: true }}
                            defaultValue="601"
                          >
                            <option value="601">601 - General de Ley Personas Morales</option>
                            <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                            <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                          </MDInput>
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="button" display="block" mb={1}>
                            Serie de facturas
                          </MDTypography>
                          <MDInput fullWidth defaultValue="A" />
                        </MDBox>
                        <MDBox mb={2}>
                          <MDTypography variant="button" display="block" mb={1}>
                            Siguiente folio
                          </MDTypography>
                          <MDInput fullWidth defaultValue="1001" />
                        </MDBox>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <MDTypography variant="button">
                            Incluir logo en factura
                          </MDTypography>
                          <Switch defaultChecked={true} />
                        </MDBox>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                          <MDTypography variant="button">
                            Enviar facturas automáticamente
                          </MDTypography>
                          <Switch defaultChecked={true} />
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>

                <SucursalesColorPanel />

                <MDBox mt={3} display="flex" justifyContent="flex-end">
                  <MDButton variant="gradient" color="info">
                    Guardar Cambios
                  </MDButton>
                </MDBox>
              </MDBox>
            </TabPanel>
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Configuracion; 