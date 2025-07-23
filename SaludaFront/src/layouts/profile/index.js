/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Services
import AuthService from "services/auth-service";

// Components
import ProfileImageUpload from "components/ProfileImageUpload";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function Overview() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await AuthService.getProfile();
        if (response.data) {
          setUserData(response.data.attributes);
        }
      } catch (error) {
        console.error("Error al obtener datos del perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  // Función para generar descripción personalizada
  const getPersonalDescription = (userData) => {
    if (!userData) return "Bienvenido al sistema de gestión.";
    
    const nombre = userData.nombre_completo || userData.nombre || "Usuario";
    const rol = userData.role?.nombre || userData.role?.Nombre_rol || "Usuario";
    const sucursal = userData.sucursal?.nombre || "";
    
    let description = `Hola, soy ${nombre}. `;
    
    if (rol) {
      description += `Mi rol en el sistema es ${rol}. `;
    }
    
    if (sucursal) {
      description += `Trabajo en la sucursal ${sucursal}. `;
    }
    
    description += "Estoy aquí para ayudarte con la gestión del sistema.";
    
    return description;
  };

  // Función para obtener información de contacto
  const getContactInfo = (userData) => {
    if (!userData) {
      return {
        fullName: "Usuario",
        mobile: "No disponible",
        email: "No disponible",
        location: "No disponible",
      };
    }

    const contactInfo = {
      fullName: userData.nombre_completo || `${userData.nombre || ""} ${userData.apellido || ""}`.trim() || "Usuario",
      mobile: userData.telefono || "No disponible",
      email: userData.email || "No disponible",
      location: userData.ciudad || userData.provincia || "No disponible",
    };

    // Agregar información adicional si está disponible
    if (userData.dni) {
      contactInfo.dni = userData.dni;
    }
    if (userData.codigo) {
      contactInfo.codigo = userData.codigo;
    }
    if (userData.fecha_ingreso) {
      contactInfo.fecha_ingreso = new Date(userData.fecha_ingreso).toLocaleDateString('es-ES');
    }
    if (userData.sucursal?.nombre) {
      contactInfo.sucursal = userData.sucursal.nombre;
    }
    if (userData.role?.nombre) {
      contactInfo.rol = userData.role.nombre;
    }
    if (userData.estado_laboral) {
      contactInfo.estado = userData.estado_laboral;
    }

    return contactInfo;
  };

  // Función para obtener información adicional del usuario
  const getAdditionalInfo = (userData) => {
    if (!userData) return [];

    const additionalInfo = [];

    if (userData.direccion) {
      additionalInfo.push({
        label: "Dirección",
        value: userData.direccion
      });
    }

    if (userData.fecha_nacimiento) {
      additionalInfo.push({
        label: "Fecha de Nacimiento",
        value: new Date(userData.fecha_nacimiento).toLocaleDateString('es-ES')
      });
    }

    if (userData.genero) {
      additionalInfo.push({
        label: "Género",
        value: userData.genero
      });
    }

    if (userData.salario) {
      additionalInfo.push({
        label: "Salario",
        value: `$${userData.salario}`
      });
    }

    if (userData.tipo_contrato) {
      additionalInfo.push({
        label: "Tipo de Contrato",
        value: userData.tipo_contrato
      });
    }

    if (userData.last_login_at) {
      additionalInfo.push({
        label: "Último Acceso",
        value: new Date(userData.last_login_at).toLocaleString('es-ES')
      });
    }

    return additionalInfo;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <MDTypography variant="h6" color="info">
            Cargando perfil...
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header userData={userData}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="profile information"
                description={getPersonalDescription(userData)}
                info={getContactInfo(userData)}
                social={[
                  {
                    link: "https://www.facebook.com/CreativeTim/",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/creativetim",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/creativetimofficial/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
            </Grid>
          </Grid>
        </MDBox>

        {/* Nueva sección para información completa del usuario */}
        <MDBox mt={3} mb={3}>
          <Grid container spacing={3}>
            {/* Sección de imagen de perfil */}
            <Grid item xs={12} md={4}>
              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                p={2}
                mb={2}
              >
                <MDTypography variant="h5" color="white">
                  Foto de Perfil
                </MDTypography>
              </MDBox>
              <MDBox p={3} bgcolor="background.paper" borderRadius="lg" boxShadow={1}>
                <ProfileImageUpload
                  currentImageUrl={userData?.foto_perfil}
                  userName={userData?.nombre_completo || userData?.nombre}
                  onImageUpdate={(newImageUrl) => {
                    // Actualizar el estado local
                    setUserData(prev => ({
                      ...prev,
                      foto_perfil: newImageUrl
                    }));
                  }}
                  size="xl"
                  showUploadButton={true}
                  showDeleteButton={true}
                />
              </MDBox>
            </Grid>

            {/* Sección de información personal */}
            <Grid item xs={12} md={8}>
              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                p={2}
                mb={2}
              >
                <MDTypography variant="h5" color="white">
                  Información Personal Completa
                </MDTypography>
              </MDBox>
              <MDBox p={3} bgcolor="background.paper" borderRadius="lg" boxShadow={1}>
                {userData && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Nombre Completo:
                        </MDTypography>
                        <MDTypography variant="body1" color="text">
                          {userData.nombre_completo || `${userData.nombre || ""} ${userData.apellido || ""}`.trim() || "No disponible"}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Código:
                        </MDTypography>
                        <MDTypography variant="body1" color="text">
                          {userData.codigo || "No disponible"}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          DNI:
                        </MDTypography>
                        <MDTypography variant="body1" color="text">
                          {userData.dni || "No disponible"}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Email:
                        </MDTypography>
                        <MDTypography variant="body1" color="text">
                          {userData.email || "No disponible"}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Teléfono:
                        </MDTypography>
                        <MDTypography variant="body1" color="text">
                          {userData.telefono || "No disponible"}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Estado Laboral:
                        </MDTypography>
                        <MDTypography variant="body1" color="text">
                          {userData.estado_laboral || "No disponible"}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    {userData.fecha_ingreso && (
                      <Grid item xs={12} sm={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" color="text" fontWeight="medium">
                            Fecha de Ingreso:
                          </MDTypography>
                          <MDTypography variant="body1" color="text">
                            {new Date(userData.fecha_ingreso).toLocaleDateString('es-ES')}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
                    {userData.fecha_nacimiento && (
                      <Grid item xs={12} sm={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" color="text" fontWeight="medium">
                            Fecha de Nacimiento:
                          </MDTypography>
                          <MDTypography variant="body1" color="text">
                            {new Date(userData.fecha_nacimiento).toLocaleDateString('es-ES')}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
                    {userData.genero && (
                      <Grid item xs={12} sm={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" color="text" fontWeight="medium">
                            Género:
                          </MDTypography>
                          <MDTypography variant="body1" color="text">
                            {userData.genero}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
                    {userData.direccion && (
                      <Grid item xs={12}>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" color="text" fontWeight="medium">
                            Dirección:
                          </MDTypography>
                          <MDTypography variant="body1" color="text">
                            {userData.direccion}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
                  </Grid>
                )}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
                p={2}
                mb={2}
              >
                <MDTypography variant="h5" color="white">
                  Información Laboral
                </MDTypography>
              </MDBox>
              <MDBox p={3} bgcolor="background.paper" borderRadius="lg" boxShadow={1}>
                {userData && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Rol:
                        </MDTypography>
                        <MDTypography variant="body1" color="text">
                          {userData.role?.nombre || userData.role?.Nombre_rol || "No asignado"}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12}>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Sucursal:
                        </MDTypography>
                        <MDTypography variant="body1" color="text">
                          {userData.sucursal?.nombre || userData.sucursal?.Nombre_Sucursal || "No asignada"}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    {userData.salario && (
                      <Grid item xs={12} sm={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" color="text" fontWeight="medium">
                            Salario:
                          </MDTypography>
                          <MDTypography variant="body1" color="text">
                            ${userData.salario}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
                    {userData.tipo_contrato && (
                      <Grid item xs={12} sm={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" color="text" fontWeight="medium">
                            Tipo de Contrato:
                          </MDTypography>
                          <MDTypography variant="body1" color="text">
                            {userData.tipo_contrato}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
                    {userData.last_login_at && (
                      <Grid item xs={12}>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" color="text" fontWeight="medium">
                            Último Acceso:
                          </MDTypography>
                          <MDTypography variant="body1" color="text">
                            {new Date(userData.last_login_at).toLocaleString('es-ES')}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
                    {userData.role?.descripcion && (
                      <Grid item xs={12}>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" color="text" fontWeight="medium">
                            Descripción del Rol:
                          </MDTypography>
                          <MDTypography variant="body1" color="text">
                            {userData.role.descripcion}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
                  </Grid>
                )}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Sección de permisos del usuario */}
        <MDBox mt={3} mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
                p={2}
                mb={2}
              >
                <MDTypography variant="h5" color="white">
                  Permisos del Usuario
                </MDTypography>
              </MDBox>
              <MDBox p={3} bgcolor="background.paper" borderRadius="lg" boxShadow={1}>
                {userData && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Estado del Rol:
                        </MDTypography>
                        <MDTypography variant="body1" color="text">
                          {userData.role?.estado || userData.role?.Estado || 'activo'}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    {userData.role?.descripcion && (
                      <Grid item xs={12}>
                        <MDBox mb={2}>
                          <MDTypography variant="body2" color="text" fontWeight="medium">
                            Descripción del Rol:
                          </MDTypography>
                          <MDTypography variant="body1" color="text">
                            {userData.role.descripcion}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <MDBox mb={2}>
                        <MDTypography variant="body2" color="text" fontWeight="medium">
                          Permisos Generales:
                        </MDTypography>
                        <MDBox ml={2} mt={1}>
                          {userData.role?.permisos && userData.role.permisos.length > 0 ? (
                            // Nuevo formato: permisos como array
                            userData.role.permisos.map((permiso, index) => (
                              <MDBox key={index} mb={1}>
                                <MDTypography variant="body2" color="text">
                                  • {permiso}: ✅
                                </MDTypography>
                              </MDBox>
                            ))
                          ) : userData.can_sell || userData.can_refund || userData.can_manage_inventory || userData.can_manage_users || userData.can_view_reports || userData.can_manage_settings ? (
                            // Mostrar permisos individuales del usuario
                            <>
                              {userData.can_sell && (
                                <MDBox mb={1}>
                                  <MDTypography variant="body2" color="text">
                                    • Vender: ✅
                                  </MDTypography>
                                </MDBox>
                              )}
                              {userData.can_refund && (
                                <MDBox mb={1}>
                                  <MDTypography variant="body2" color="text">
                                    • Reembolsar: ✅
                                  </MDTypography>
                                </MDBox>
                              )}
                              {userData.can_manage_inventory && (
                                <MDBox mb={1}>
                                  <MDTypography variant="body2" color="text">
                                    • Gestionar Inventario: ✅
                                  </MDTypography>
                                </MDBox>
                              )}
                              {userData.can_manage_users && (
                                <MDBox mb={1}>
                                  <MDTypography variant="body2" color="text">
                                    • Gestionar Usuarios: ✅
                                  </MDTypography>
                                </MDBox>
                              )}
                              {userData.can_view_reports && (
                                <MDBox mb={1}>
                                  <MDTypography variant="body2" color="text">
                                    • Ver Reportes: ✅
                                  </MDTypography>
                                </MDBox>
                              )}
                              {userData.can_manage_settings && (
                                <MDBox mb={1}>
                                  <MDTypography variant="body2" color="text">
                                    • Gestionar Configuración: ✅
                                  </MDTypography>
                                </MDBox>
                              )}
                            </>
                          ) : userData.Permisos ? (() => {
                            // Formato legacy: permisos como JSON string
                            try {
                              const permisos = JSON.parse(userData.Permisos);
                              return Object.entries(permisos).map(([key, value]) => (
                                <MDBox key={key} mb={1}>
                                  <MDTypography variant="body2" color="text">
                                    • {key}: {value ? '✅' : '❌'}
                                  </MDTypography>
                                </MDBox>
                              ));
                            } catch (error) {
                              console.error('Error parsing permisos:', error);
                              return (
                                <MDBox mb={1}>
                                  <MDTypography variant="body2" color="text">
                                    • Error al cargar permisos
                                  </MDTypography>
                                </MDBox>
                              );
                            }
                          })() : (
                            <MDBox mb={1}>
                              <MDTypography variant="body2" color="text">
                                • No hay permisos configurados
                              </MDTypography>
                            </MDBox>
                          )}
                        </MDBox>
                      </MDBox>
                    </Grid>
                  </Grid>
                )}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor1}
                label="project #2"
                title="modern"
                description="As Uber works through a huge amount of internal management turmoil."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor2}
                label="project #1"
                title="scandinavian"
                description="Music is something that everyone has their own specific opinion about."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor3}
                label="project #3"
                title="minimalist"
                description="Different people have different taste, and various types of music."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor4}
                label="project #4"
                title="gothic"
                description="Why would anyone pick blue over pink? Pink is obviously a better color."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
