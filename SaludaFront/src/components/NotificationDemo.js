import React from 'react';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import useNotifications from 'hooks/useNotifications';

const NotificationDemo = () => {
  const { success, error, warning, info, clear } = useNotifications();

  const handleSuccess = () => {
    success('¡Operación completada exitosamente!');
  };

  const handleError = () => {
    error('Ha ocurrido un error inesperado');
  };

  const handleWarning = () => {
    warning('Ten cuidado, esta acción no se puede deshacer');
  };

  const handleInfo = () => {
    info('Información importante para el usuario');
  };

  const handleLongMessage = () => {
    success('Esta es una notificación con un mensaje muy largo que debería envolverse correctamente en el contenedor de notificaciones sin romper el diseño', {
      duration: 8000
    });
  };

  const handleCustomNotification = () => {
    success('Notificación personalizada', {
      title: 'Título Personalizado',
      duration: 3000,
      autoClose: true
    });
  };

  return (
    <MDBox p={3}>
      <MDTypography variant="h4" fontWeight="bold" color="info" mb={3}>
        Demostración del Sistema de Notificaciones
      </MDTypography>
      
      <MDTypography variant="body2" color="text" mb={4}>
        Prueba los diferentes tipos de notificaciones que se integran perfectamente con el diseño Material de tu sistema.
      </MDTypography>

      <MDBox display="flex" flexWrap="wrap" gap={2}>
        <MDButton 
          variant="contained" 
          color="success" 
          onClick={handleSuccess}
        >
          Notificación de Éxito
        </MDButton>

        <MDButton 
          variant="contained" 
          color="error" 
          onClick={handleError}
        >
          Notificación de Error
        </MDButton>

        <MDButton 
          variant="contained" 
          color="warning" 
          onClick={handleWarning}
        >
          Notificación de Advertencia
        </MDButton>

        <MDButton 
          variant="contained" 
          color="info" 
          onClick={handleInfo}
        >
          Notificación Informativa
        </MDButton>

        <MDButton 
          variant="outlined" 
          color="primary" 
          onClick={handleLongMessage}
        >
          Mensaje Largo
        </MDButton>

        <MDButton 
          variant="outlined" 
          color="secondary" 
          onClick={handleCustomNotification}
        >
          Notificación Personalizada
        </MDButton>

        <MDButton 
          variant="text" 
          color="dark" 
          onClick={clear}
        >
          Limpiar Todas
        </MDButton>
      </MDBox>

      <MDBox mt={4}>
        <MDTypography variant="h6" fontWeight="medium" color="dark" mb={2}>
          Características del Sistema:
        </MDTypography>
        <MDBox component="ul" pl={3}>
          <MDTypography component="li" variant="body2" color="text">
            Notificaciones con animaciones suaves
          </MDTypography>
          <MDTypography component="li" variant="body2" color="text">
            Auto-cierre configurable
          </MDTypography>
          <MDTypography component="li" variant="body2" color="text">
            Colores Material Design
          </MDTypography>
          <MDTypography component="li" variant="body2" color="text">
            Iconos intuitivos
          </MDTypography>
          <MDTypography component="li" variant="body2" color="text">
            Posicionamiento fijo en la esquina superior derecha
          </MDTypography>
          <MDTypography component="li" variant="body2" color="text">
            Múltiples notificaciones simultáneas
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
};

export default NotificationDemo; 