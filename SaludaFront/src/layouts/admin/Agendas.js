/**
=========================================================
* SaludaReact - Layout de Agendas 
=========================================================
*/

import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Avatar
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  AttachMoney as MoneyIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  EventAvailable as EventIcon
} from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Context
import { useMaterialUIController } from "context";

// Servicios
import agendaService from "services/agenda-service";
import useNotifications from "hooks/useNotifications";

// Componentes
import StandardDataTable from "components/StandardDataTable";
import { TableThemeProvider } from "components/StandardDataTable/TableThemeProvider";
import AgendaModal from "components/Modales/AgendaModal";
import ConfirmModal from "components/Modales/ConfirmModal";

function Agendas() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { showSuccess, showError } = useNotifications();

  // Estados del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  
  // Estados del modal de confirmación
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Estado para estadísticas
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    confirmadas: 0,
    completadas: 0,
    canceladas: 0
  });

  // Cargar estadísticas
  useEffect(() => {
    loadEstadisticas();
  }, []);

  const loadEstadisticas = async () => {
    try {
      const response = await agendaService.getEstadisticas();
      if (response.success) {
        setEstadisticas(response.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Funciones para manejar modales
  const handleOpenModal = (mode, agendaData = null) => {
    setModalMode(mode);
    setSelectedAgenda(agendaData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAgenda(null);
  };

  const handleModalSuccess = () => {
    // El StandardDataTable se recarga automáticamente
    loadEstadisticas(); // Recargar estadísticas
    showSuccess('Operación realizada exitosamente');
  };

  // Funciones para manejar modal de confirmación
  const handleOpenConfirmModal = (agendaData) => {
    setConfirmModalData(agendaData);
    setConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
    setConfirmModalData(null);
  };

  const handleConfirmDelete = async () => {
    if (!confirmModalData) return;
    
    setDeleteLoading(true);
    try {
      const result = await agendaService.deleteAgenda(confirmModalData.id);
      if (result) {
        showSuccess('Cita eliminada correctamente');
        loadEstadisticas(); // Recargar estadísticas
        handleCloseConfirmModal();
        // StandardDataTable se recarga automáticamente
      }
    } catch (error) {
      showError('Error al eliminar la cita: ' + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Función para obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'warning';
      case 'confirmada':
        return 'info';
      case 'en proceso':
        return 'primary';
      case 'completada':
        return 'success';
      case 'cancelada':
        return 'error';
      case 'no asistió':
        return 'default';
      default:
        return 'default';
    }
  };

  // Función para obtener color del tipo
  const getTipoColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'urgencia':
        return 'error';
      case 'cirugía':
        return 'warning';
      case 'control':
        return 'success';
      case 'consulta':
        return 'info';
      default:
        return 'default';
    }
  };

  // Definición de columnas para la tabla
  const columns = [
    {
      name: 'Fecha',
      selector: row => row.fecha_cita,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDBox display="flex" alignItems="center">
          <CalendarIcon color="info" sx={{ mr: 1 }} />
          <MDTypography variant="caption" fontWeight="medium">
            {agendaService.formatDate(row.fecha_cita)}
          </MDTypography>
        </MDBox>
      )
    },
    {
      name: 'Horario',
      selector: row => row.hora_inicio,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <MDBox display="flex" alignItems="center">
          <TimeIcon color="primary" sx={{ mr: 1 }} />
          <MDTypography variant="caption">
            {agendaService.formatTime(row.hora_inicio)} - {agendaService.formatTime(row.hora_fin)}
          </MDTypography>
        </MDBox>
      )
    },
    {
      name: 'Paciente',
      selector: row => row.paciente?.nombre_completo || 'N/A',
      sortable: true,
      width: '200px',
      cell: (row) => (
        <MDBox display="flex" alignItems="center">
          <MDAvatar
            src={row.paciente?.foto_perfil}
            alt={row.paciente?.nombre_completo}
            size="sm"
            sx={{ mr: 1 }}
          >
            {row.paciente?.nombre_completo?.charAt(0) || 'P'}
          </MDAvatar>
          <MDBox>
            <MDTypography variant="button" fontWeight="medium">
              {row.paciente?.nombre_completo || 'N/A'}
            </MDTypography>
            {row.paciente?.telefono && (
              <MDTypography variant="caption" color="text" display="block">
                {row.paciente.telefono}
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
      )
    },
    {
      name: 'Doctor',
      selector: row => row.doctor?.nombre_completo || 'N/A',
      sortable: true,
      width: '200px',
      cell: (row) => (
        <MDBox display="flex" alignItems="center">
          <HospitalIcon color="success" sx={{ mr: 1 }} />
          <MDBox>
            <MDTypography variant="button" fontWeight="medium">
              {row.doctor?.nombre_completo || 'N/A'}
            </MDTypography>
            {row.doctor?.especialidad && (
              <MDTypography variant="caption" color="text" display="block">
                {row.doctor.especialidad}
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
      )
    },
    {
      name: 'Título',
      selector: row => row.titulo_cita,
      sortable: true,
      width: '250px',
      cell: (row) => (
        <MDBox>
          <MDTypography variant="button" fontWeight="medium" noWrap>
            {row.titulo_cita}
          </MDTypography>
          <MDBox display="flex" gap={0.5} mt={0.5}>
            <Chip
              label={row.tipo_cita}
              color={getTipoColor(row.tipo_cita)}
              size="small"
              variant="outlined"
            />
          </MDBox>
        </MDBox>
      )
    },
    {
      name: 'Estado',
      selector: row => row.estado_cita,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <Chip
          label={row.estado_cita}
          color={getEstadoColor(row.estado_cita)}
          size="small"
          sx={{ fontWeight: 'bold' }}
        />
      )
    },
    {
      name: 'Costo',
      selector: row => row.costo || 0,
      sortable: true,
      width: '100px',
      cell: (row) => (
        <MDBox display="flex" alignItems="center">
          <MoneyIcon color="success" sx={{ mr: 0.5 }} />
          <MDTypography variant="caption" fontWeight="medium">
            {agendaService.formatCosto(row.costo)}
          </MDTypography>
        </MDBox>
      )
    },
    {
      name: 'Sucursal',
      selector: row => row.sucursal?.nombre || 'N/A',
      sortable: true,
      width: '150px',
      cell: (row) => (
        <MDTypography variant="caption">
          {row.sucursal?.nombre || 'N/A'}
          {row.consultorio && (
            <MDTypography variant="caption" color="text" display="block">
              {row.consultorio}
            </MDTypography>
          )}
        </MDTypography>
      )
    }
  ];

  // Filtros disponibles
  const availableFilters = [
    {
      key: 'estado',
      label: 'Estado',
      type: 'select',
      options: agendaService.getEstadosDisponibles().map(estado => ({
        value: estado,
        label: estado
      }))
    },
    {
      key: 'tipo_cita',
      label: 'Tipo de Cita',
      type: 'select',
      options: agendaService.getTiposDisponibles().map(tipo => ({
        value: tipo,
        label: tipo
      }))
    },
    {
      key: 'fecha_inicio',
      label: 'Fecha Desde',
      type: 'date'
    },
    {
      key: 'fecha_fin',
      label: 'Fecha Hasta',
      type: 'date'
    },
    {
      key: 'doctor_id',
      label: 'Doctor',
      type: 'text'
    },
    {
      key: 'paciente_id',
      label: 'Paciente',
      type: 'text'
    }
  ];

  // Acciones personalizadas
  const customActions = [
    {
      title: 'Ver Detalles',
      icon: <ViewIcon fontSize="small" />,
      color: 'info.main',
      onClick: (row) => handleOpenModal('view', row)
    },
    {
      title: 'Editar Cita',
      icon: <EditIcon fontSize="small" />,
      color: 'warning.main',
      onClick: (row) => handleOpenModal('edit', row)
    },
    {
      title: 'Eliminar Cita',
      icon: <DeleteIcon fontSize="small" />,
      color: 'error.main',
      onClick: async (row) => {
        if (window.confirm(`¿Está seguro de eliminar la cita "${row.titulo_cita}"?`)) {
          try {
            const result = await agendaService.deleteAgenda(row.id);
            if (result) {
              showSuccess('Cita eliminada correctamente');
              loadEstadisticas(); // Recargar estadísticas
              // StandardDataTable se recarga automáticamente
            }
          } catch (error) {
            showError('Error al eliminar la cita: ' + error.message);
          }
        }
      }
    }
  ];

  // Configuración del servicio para StandardDataTable
  const tableService = {
    // Método para obtener datos con filtros
    getAll: async (params = {}) => {
      try {
        const response = await agendaService.getAgendas(params);
        return {
          success: response.success,
          data: response.success ? agendaService.formatAgendaData(response.data.data || response.data) : [],
          total: response.data?.total || response.data?.length || 0
        };
      } catch (error) {
        console.error('Error en tableService.getAll:', error);
        return {
          success: false,
          message: error.message,
          data: [],
          total: 0
        };
      }
    },

    // Método para eliminar
    delete: async (id) => {
      try {
        const result = await agendaService.deleteAgenda(id);
        return {
          success: !!result,
          message: result ? 'Cita eliminada correctamente' : 'Error al eliminar la cita'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },

    // Método para estadísticas
    getStats: async () => {
      try {
        const response = await agendaService.getEstadisticas();
        return response;
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Tarjetas de estadísticas */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={2.4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <EventIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                    <MDTypography variant="h4" fontWeight="bold" color="info">
                      {estadisticas.total || 0}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Total Citas
                    </MDTypography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <CalendarIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <MDTypography variant="h4" fontWeight="bold" color="warning">
                      {estadisticas.pendientes || 0}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Pendientes
                    </MDTypography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <CalendarIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                    <MDTypography variant="h4" fontWeight="bold" color="info">
                      {estadisticas.confirmadas || 0}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Confirmadas
                    </MDTypography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <CalendarIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <MDTypography variant="h4" fontWeight="bold" color="success">
                      {estadisticas.completadas || 0}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Completadas
                    </MDTypography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <CalendarIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                    <MDTypography variant="h4" fontWeight="bold" color="error">
                      {estadisticas.canceladas || 0}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Canceladas
                    </MDTypography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Tabla de agendas */}
          <Grid item xs={12}>
            <TableThemeProvider>
              <StandardDataTable
              service={tableService}
              columns={columns}
              title="Agendas"
              subtitle="Gestión completa de citas médicas"
              enableCreate={false}
              enableEdit={false}
              enableDelete={false}
              enableSearch={true}
              enableFilters={true}
              enableStats={true}
              enableExport={false}
              availableFilters={availableFilters}
              customActions={customActions}
              serverSide={true}
              defaultPageSize={15}
              defaultSortField="fecha_cita"
              defaultSortDirection="desc"
              onRowClick={(row) => handleOpenModal('view', row)}
              permissions={{
                create: true,
                edit: true,
                delete: true,
                view: true
              }}
              dense={false}
              />
            </TableThemeProvider>
          </Grid>
        </Grid>

        {/* Botón flotante para agregar cita rápida */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
        >
          <MDButton
            variant="gradient"
            color="info"
            onClick={() => handleOpenModal('create')}
            sx={{
              borderRadius: '50%',
              minWidth: 56,
              width: 56,
              height: 56,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            <CalendarIcon />
          </MDButton>
        </Box>

        {/* Modal de Agenda */}
        <AgendaModal
          open={modalOpen}
          onClose={handleCloseModal}
          mode={modalMode}
          agendaData={selectedAgenda}
          onSuccess={handleModalSuccess}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default Agendas;
