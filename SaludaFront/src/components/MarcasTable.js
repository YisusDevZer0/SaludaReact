import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { getDataTablesConfig } from "utils/dataTablesLanguage";
import { useMaterialUIController } from "context";
import usePantoneColors from "hooks/usePantoneColors";
import './SucursalesTable.css'; // Reutilizar estilos base
import './MarcasTable.css'; // Estilos específicos
import PillLoader from './PillLoader';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import MarcaService from 'services/marca-service';
import { useNotifications } from 'hooks/useNotifications';
import Swal from 'sweetalert2';

const MarcasTable = () => {
  const tableRef = useRef();
  const [controller] = useMaterialUIController();
  const { tableHeaderColor, darkMode } = controller;
  const { sucursalesTable } = usePantoneColors();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingMarca, setEditingMarca] = useState(null);
  const [paisesDisponibles, setPaisesDisponibles] = useState([]);
  const { showNotification } = useNotifications();
  
  const [form, setForm] = useState({
    Nom_Marca: '',
    Estado: 'Activo',
    Descripcion: '',
    Pais_Origen: '',
    Sitio_Web: '',
    Logo_URL: '',
    Sistema: 'POS',
    ID_H_O_D: 'Saluda'
  });

  // Obtener tipo de usuario de localStorage
  const userType = localStorage.getItem('userRole') || 'Usuario';
  const canEdit = ['Administrador', 'Admin'].includes(userType);
  const canDelete = userType === 'Administrador';

  // Inyectar CSS dinámico para header y texto de celdas
  useEffect(() => {
    const styleId = "datatable-marcas-style";
    let styleTag = document.getElementById(styleId);
    if (styleTag) styleTag.remove();
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    styleTag.innerHTML = `
      .marcas-table .dataTables_wrapper .dataTable thead th {
        background-color: ${tableHeaderColor} !important;
        color: ${darkMode ? '#fff' : '#344767'} !important;
        border-bottom: 1px solid ${darkMode ? '#344767' : '#dee2e6'} !important;
      }
      .marcas-table .dataTables_wrapper .dataTable tbody td {
        color: ${darkMode ? '#fff' : '#344767'} !important;
        border-bottom: 1px solid ${darkMode ? '#344767' : '#dee2e6'} !important;
      }
      .marcas-table .dataTables_info,
      .marcas-table .dataTables_length label,
      .marcas-table .dataTables_filter label {
        color: ${darkMode ? '#fff' : '#344767'} !important;
      }
      .marcas-table .dataTables_paginate .paginate_button {
        color: ${darkMode ? '#fff' : '#344767'} !important;
      }
      .marcas-table .dataTables_paginate .paginate_button.current {
        background: ${tableHeaderColor} !important;
        color: white !important;
        border-color: ${tableHeaderColor} !important;
      }
      .marca-logo {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        object-fit: contain;
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
      }
      .sitio-web-link {
        color: #1976d2;
        text-decoration: none;
        font-weight: 500;
      }
      .sitio-web-link:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      if (document.getElementById(styleId)) {
        document.getElementById(styleId).remove();
      }
    };
  }, [tableHeaderColor, darkMode]);

  // Cargar países disponibles
  useEffect(() => {
    const cargarPaises = async () => {
      try {
        const paises = await MarcaService.getPaisesDisponibles();
        setPaisesDisponibles(paises || []);
      } catch (error) {
        console.error('Error cargando países:', error);
      }
    };
    cargarPaises();
  }, []);

  // Configurar DataTable
  useEffect(() => {
    if (!tableRef.current) return;

    const table = $(tableRef.current).DataTable({
      ...getDataTablesConfig(),
      processing: true,
      serverSide: true,
      ajax: {
        url: 'http://localhost:8000/api/marcas',
        type: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: function(d) {
          return {
            draw: d.draw,
            start: d.start,
            length: d.length,
            search: d.search,
            order: d.order
          };
        },
        dataSrc: function(json) {
          setLoading(false);
          return json.data || [];
        },
        error: function(xhr, error, thrown) {
          console.error('Error en DataTable:', error);
          setLoading(false);
          showNotification('Error al cargar marcas', 'error');
        }
      },
      columns: [
        {
          data: 'id',
          title: 'ID',
          width: '60px',
          className: 'text-center'
        },
        {
          data: null,
          title: 'Logo',
          width: '80px',
          className: 'text-center',
          orderable: false,
          render: function(data, type, row) {
            if (type === 'display') {
              const logoUrl = row.logo_url || '/images/marcas/default-brand.png';
              return `<img src="${logoUrl}" alt="${row.nombre}" class="marca-logo" onerror="this.src='/images/marcas/default-brand.png'">`;
            }
            return '';
          }
        },
        {
          data: 'nombre',
          title: 'Nombre de la Marca',
          width: '20%',
          render: function(data, type, row) {
            if (type === 'display') {
              return `<strong>${data}</strong>`;
            }
            return data;
          }
        },
        {
          data: 'estado',
          title: 'Estado',
          width: '10%',
          className: 'text-center',
          render: function(data, type, row) {
            if (type === 'display') {
              const color = data === 'Activo' ? 'success' : 'error';
              const bgColor = data === 'Activo' ? '#4caf50' : '#f44336';
              return `<span class="badge" style="background-color: ${bgColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem;">${data}</span>`;
            }
            return data;
          }
        },
        {
          data: 'pais_origen',
          title: 'País',
          width: '12%',
          className: 'text-center',
          render: function(data, type, row) {
            if (type === 'display') {
              return data || '<span style="color: #757575; font-style: italic;">No especificado</span>';
            }
            return data;
          }
        },
        {
          data: 'sitio_web',
          title: 'Sitio Web',
          width: '15%',
          className: 'text-center',
          orderable: false,
          render: function(data, type, row) {
            if (type === 'display') {
              if (data) {
                const displayUrl = data.replace(/^https?:\/\//, '');
                return `<a href="${data}" target="_blank" class="sitio-web-link" title="Visitar sitio web">${displayUrl}</a>`;
              } else {
                return '<span style="color: #757575;">No disponible</span>';
              }
            }
            return data;
          }
        },
        {
          data: 'sistema',
          title: 'Sistema',
          width: '10%',
          className: 'text-center'
        },
        {
          data: 'creado_en',
          title: 'Fecha Creación',
          width: '12%',
          className: 'text-center',
          render: function(data, type, row) {
            if (type === 'display' && data) {
              return new Date(data).toLocaleDateString('es-ES');
            }
            return data;
          }
        },
        {
          data: null,
          title: 'Acciones',
          width: '15%',
          className: 'text-center',
          orderable: false,
          render: function(data, type, row) {
            if (type === 'display') {
              let actions = '';
              
              // Ver detalles
              actions += `<button class="btn-action btn-view" data-id="${row.id}" title="Ver detalles">
                <i class="material-icons">visibility</i>
              </button>`;
              
              if (canEdit) {
                // Editar
                actions += `<button class="btn-action btn-edit" data-id="${row.id}" title="Editar">
                  <i class="material-icons">edit</i>
                </button>`;
                
                // Toggle estado
                const toggleIcon = row.estado === 'Activo' ? 'toggle_on' : 'toggle_off';
                const toggleColor = row.estado === 'Activo' ? '#4caf50' : '#757575';
                actions += `<button class="btn-action btn-toggle" data-id="${row.id}" title="Cambiar estado" style="color: ${toggleColor}">
                  <i class="material-icons">${toggleIcon}</i>
                </button>`;
              }
              
              if (canDelete) {
                // Eliminar
                actions += `<button class="btn-action btn-delete" data-id="${row.id}" title="Eliminar">
                  <i class="material-icons">delete</i>
                </button>`;
              }
              
              return `<div class="action-buttons">${actions}</div>`;
            }
            return '';
          }
        }
      ],
      order: [[0, 'desc']],
      responsive: true,
      language: getDataTablesConfig().language
    });

    // Event handlers para acciones
    $(tableRef.current).on('click', '.btn-view', function() {
      const id = $(this).data('id');
      verMarca(id);
    });

    $(tableRef.current).on('click', '.btn-edit', function() {
      const id = $(this).data('id');
      editarMarca(id);
    });

    $(tableRef.current).on('click', '.btn-toggle', function() {
      const id = $(this).data('id');
      toggleEstadoMarca(id);
    });

    $(tableRef.current).on('click', '.btn-delete', function() {
      const id = $(this).data('id');
      eliminarMarca(id);
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [canEdit, canDelete]);

  // Funciones de manejo
  const verMarca = async (id) => {
    try {
      const marca = await MarcaService.getMarca(id, true);
      
      Swal.fire({
        title: marca.nombre,
        html: `
          <div style="text-align: left;">
            ${marca.logo_url ? `<div style="text-align: center; margin-bottom: 16px;"><img src="${marca.logo_url}" alt="${marca.nombre}" style="max-width: 150px; max-height: 80px; object-fit: contain;"></div>` : ''}
            <p><strong>Estado:</strong> ${marca.estado}</p>
            <p><strong>Descripción:</strong> ${marca.descripcion || 'No especificada'}</p>
            <p><strong>País de Origen:</strong> ${marca.pais_origen || 'No especificado'}</p>
            ${marca.sitio_web ? `<p><strong>Sitio Web:</strong> <a href="${marca.sitio_web}" target="_blank">${marca.sitio_web}</a></p>` : ''}
            <p><strong>Sistema:</strong> ${marca.sistema}</p>
            <p><strong>Organización:</strong> ${marca.organizacion}</p>
            <p><strong>Agregado por:</strong> ${marca.agregado_por}</p>
            ${marca.servicios_count > 0 ? `<p><strong>Servicios asociados:</strong> ${marca.servicios_count}</p>` : ''}
          </div>
        `,
        icon: 'info',
        width: 600,
        confirmButtonText: 'Cerrar'
      });
    } catch (error) {
      showNotification('Error al cargar detalles de la marca', 'error');
    }
  };

  const editarMarca = async (id) => {
    try {
      const marca = await MarcaService.getMarca(id, true);
      setEditingMarca(marca);
      setForm({
        Nom_Marca: marca.nombre,
        Estado: marca.estado,
        Descripcion: marca.descripcion || '',
        Pais_Origen: marca.pais_origen || '',
        Sitio_Web: marca.sitio_web || '',
        Logo_URL: marca.logo_url || '',
        Sistema: marca.sistema,
        ID_H_O_D: marca.organizacion
      });
      setOpen(true);
    } catch (error) {
      showNotification('Error al cargar marca para editar', 'error');
    }
  };

  const toggleEstadoMarca = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Cambiar estado de la marca?',
        text: 'Esto cambiará entre Activo e Inactivo',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await MarcaService.toggleStatus(id);
        showNotification('Estado de la marca actualizado', 'success');
        $(tableRef.current).DataTable().ajax.reload();
      }
    } catch (error) {
      showNotification('Error al cambiar estado de la marca', 'error');
    }
  };

  const eliminarMarca = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar marca?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33'
      });

      if (result.isConfirmed) {
        await MarcaService.deleteMarca(id);
        showNotification('Marca eliminada correctamente', 'success');
        $(tableRef.current).DataTable().ajax.reload();
      }
    } catch (error) {
      showNotification('Error al eliminar marca', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const errors = MarcaService.validateMarcaData(form);
      if (errors.length > 0) {
        showNotification(errors.join(', '), 'error');
        return;
      }

      const marcaData = { ...form };

      if (editingMarca) {
        await MarcaService.updateMarca(editingMarca.id, marcaData);
        showNotification('Marca actualizada correctamente', 'success');
      } else {
        await MarcaService.createMarca(marcaData);
        showNotification('Marca creada correctamente', 'success');
      }

      handleClose();
      $(tableRef.current).DataTable().ajax.reload();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMarca(null);
    setForm({
      Nom_Marca: '',
      Estado: 'Activo',
      Descripcion: '',
      Pais_Origen: '',
      Sitio_Web: '',
      Logo_URL: '',
      Sistema: 'POS',
      ID_H_O_D: 'Saluda'
    });
  };

  const handleNuevaMarca = () => {
    setEditingMarca(null);
    setForm({
      Nom_Marca: '',
      Estado: 'Activo',
      Descripcion: '',
      Pais_Origen: '',
      Sitio_Web: '',
      Logo_URL: '',
      Sistema: 'POS',
      ID_H_O_D: 'Saluda'
    });
    setOpen(true);
  };

  return (
    <div className="marcas-table">
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            <Typography color="inherit">Inicio</Typography>
          </Box>
          <Typography color="text.primary">Gestión de Marcas</Typography>
        </Breadcrumbs>
      </Box>

      {/* Header con botón nuevo */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Marcas Médicas
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNuevaMarca}
            startIcon={<Icon>add</Icon>}
          >
            Nueva Marca
          </Button>
        )}
      </Box>

      {/* Loader */}
      {loading && <PillLoader />}

      {/* Tabla */}
      <div className="table-responsive">
        <table ref={tableRef} className="display table table-striped table-hover" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Logo</th>
              <th>Nombre de la Marca</th>
              <th>Estado</th>
              <th>País</th>
              <th>Sitio Web</th>
              <th>Sistema</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Modal para crear/editar */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingMarca ? 'Editar Marca' : 'Nueva Marca'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Nombre de la Marca"
                name="Nom_Marca"
                value={form.Nom_Marca}
                onChange={(e) => setForm({ ...form, Nom_Marca: e.target.value })}
                required
                fullWidth
              />
              
              <TextField
                label="Descripción"
                name="Descripcion"
                value={form.Descripcion}
                onChange={(e) => setForm({ ...form, Descripcion: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={form.Estado}
                    label="Estado"
                    onChange={(e) => setForm({ ...form, Estado: e.target.value })}
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Sistema</InputLabel>
                  <Select
                    value={form.Sistema}
                    label="Sistema"
                    onChange={(e) => setForm({ ...form, Sistema: e.target.value })}
                  >
                    <MenuItem value="POS">POS</MenuItem>
                    <MenuItem value="HOSPITALARIO">Hospitalario</MenuItem>
                    <MenuItem value="FARMACIA">Farmacia</MenuItem>
                    <MenuItem value="LABORATORIO">Laboratorio</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="País de Origen"
                name="Pais_Origen"
                value={form.Pais_Origen}
                onChange={(e) => setForm({ ...form, Pais_Origen: e.target.value })}
                fullWidth
              />

              <TextField
                label="Sitio Web"
                name="Sitio_Web"
                type="url"
                value={form.Sitio_Web}
                onChange={(e) => setForm({ ...form, Sitio_Web: e.target.value })}
                placeholder="https://ejemplo.com"
                fullWidth
              />

              <TextField
                label="URL del Logo"
                name="Logo_URL"
                type="url"
                value={form.Logo_URL}
                onChange={(e) => setForm({ ...form, Logo_URL: e.target.value })}
                placeholder="https://ejemplo.com/logo.png"
                fullWidth
              />

              <TextField
                label="Organización"
                name="ID_H_O_D"
                value={form.ID_H_O_D}
                onChange={(e) => setForm({ ...form, ID_H_O_D: e.target.value })}
                required
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingMarca ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default MarcasTable; 