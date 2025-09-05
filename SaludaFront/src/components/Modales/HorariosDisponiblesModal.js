import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    Alert,
    Box,
    Chip,
    Card,
    CardContent,
    CardActions,
    Divider,
    CircularProgress,
    TextField
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import programacionService from '../../services/programacion-service';
import agendaService from '../../services/agenda-service';

const HorariosDisponiblesModal = ({ open, onClose, onHorarioSeleccionado }) => {
    const [filtros, setFiltros] = useState({
        sucursal_id: '',
        especialidad_id: '',
        especialista_id: '',
        consultorio_id: '',
        fecha_inicio: new Date(),
        fecha_fin: new Date()
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [horarios, setHorarios] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [especialistas, setEspecialistas] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [consultorios, setConsultorios] = useState([]);
    const [especialistasFiltrados, setEspecialistasFiltrados] = useState([]);
    const [consultoriosFiltrados, setConsultoriosFiltrados] = useState([]);

    useEffect(() => {
        if (open) {
            loadReferenceData();
        }
    }, [open]);

    useEffect(() => {
        if (filtros.sucursal_id) {
            loadEspecialidadesPorSucursal();
        }
    }, [filtros.sucursal_id]);

    useEffect(() => {
        if (filtros.especialidad_id) {
            loadEspecialistasPorEspecialidad();
        }
    }, [filtros.especialidad_id]);

    useEffect(() => {
        if (filtros.sucursal_id) {
            loadConsultoriosPorSucursal();
        }
    }, [filtros.sucursal_id]);

    const loadReferenceData = async () => {
        try {
            const [especialidadesData, sucursalesData] = await Promise.all([
                agendaService.getEspecialidadesMejoradas(),
                agendaService.getSucursalesMejoradas()
            ]);

            setEspecialidades(especialidadesData.data || []);
            setSucursales(sucursalesData.data || []);
        } catch (error) {
            console.error('Error cargando datos de referencia:', error);
            setError('Error al cargar datos de referencia');
        }
    };

    const loadEspecialidadesPorSucursal = async () => {
        try {
            // Por ahora mostramos todas las especialidades
            setEspecialidades(especialidades);
        } catch (error) {
            console.error('Error cargando especialidades por sucursal:', error);
        }
    };

    const loadEspecialistasPorEspecialidad = async () => {
        try {
            const especialistasData = await agendaService.getEspecialistasMejorados();
            const especialistasFiltrados = especialistasData.data?.filter(
                esp => esp.Fk_Especialidad === filtros.especialidad_id
            ) || [];
            setEspecialistasFiltrados(especialistasFiltrados);
        } catch (error) {
            console.error('Error cargando especialistas por especialidad:', error);
        }
    };

    const loadConsultoriosPorSucursal = async () => {
        try {
            const consultoriosData = await agendaService.getConsultoriosMejorados();
            const consultoriosFiltrados = consultoriosData.data?.filter(
                cons => cons.Fk_Sucursal === filtros.sucursal_id
            ) || [];
            setConsultoriosFiltrados(consultoriosFiltrados);
        } catch (error) {
            console.error('Error cargando consultorios por sucursal:', error);
        }
    };

    const handleFiltroChange = (field, value) => {
        setFiltros(prev => ({
            ...prev,
            [field]: value
        }));

        // Resetear campos dependientes
        if (field === 'sucursal_id') {
            setFiltros(prev => ({
                ...prev,
                especialidad_id: '',
                especialista_id: '',
                consultorio_id: ''
            }));
        } else if (field === 'especialidad_id') {
            setFiltros(prev => ({
                ...prev,
                especialista_id: ''
            }));
        }
    };

    const buscarHorarios = async () => {
        try {
            setLoading(true);
            setError('');
            setHorarios([]);

            if (!filtros.sucursal_id || !filtros.especialidad_id) {
                setError('Debe seleccionar sucursal y especialidad');
                return;
            }

            const response = await programacionService.obtenerHorariosDisponibles(filtros);
            setHorarios(response.data.horarios || []);

        } catch (error) {
            console.error('Error buscando horarios:', error);
            setError(error.message || 'Error al buscar horarios disponibles');
        } finally {
            setLoading(false);
        }
    };

    const seleccionarHorario = (horario) => {
        onHorarioSeleccionado({
            fecha: horario.fecha,
            hora: horario.hora,
            especialista: horario.especialista,
            consultorio: horario.consultorio,
            programacion_id: horario.programacion_id
        });
        onClose();
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getColorEstado = (estado) => {
        switch (estado) {
            case 'Disponible':
                return 'success';
            case 'Ocupado':
                return 'error';
            case 'Reservado':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                Horarios Disponibles para Agendar Cita
            </DialogTitle>
            
            <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}

                    {/* Filtros */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Filtros de Búsqueda
                        </Typography>
                    </Grid>

                    {/* Sucursal */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Sucursal *</InputLabel>
                            <Select
                                value={filtros.sucursal_id}
                                onChange={(e) => handleFiltroChange('sucursal_id', e.target.value)}
                                label="Sucursal *"
                            >
                                {sucursales.map((sucursal) => (
                                    <MenuItem key={sucursal.Sucursal_ID} value={sucursal.Sucursal_ID}>
                                        {sucursal.Nombre_Sucursal}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Especialidad */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Especialidad *</InputLabel>
                            <Select
                                value={filtros.especialidad_id}
                                onChange={(e) => handleFiltroChange('especialidad_id', e.target.value)}
                                label="Especialidad *"
                                disabled={!filtros.sucursal_id}
                            >
                                {especialidades.map((especialidad) => (
                                    <MenuItem key={especialidad.Especialidad_ID} value={especialidad.Especialidad_ID}>
                                        {especialidad.Nombre_Especialidad}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Especialista */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Especialista</InputLabel>
                            <Select
                                value={filtros.especialista_id}
                                onChange={(e) => handleFiltroChange('especialista_id', e.target.value)}
                                label="Especialista"
                                disabled={!filtros.especialidad_id}
                            >
                                <MenuItem value="">Todos los especialistas</MenuItem>
                                {especialistasFiltrados.map((especialista) => (
                                    <MenuItem key={especialista.Especialista_ID} value={especialista.Especialista_ID}>
                                        {especialista.Nombre} {especialista.Apellido} - {especialista.Cedula_Profesional}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Consultorio */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Consultorio</InputLabel>
                            <Select
                                value={filtros.consultorio_id}
                                onChange={(e) => handleFiltroChange('consultorio_id', e.target.value)}
                                label="Consultorio"
                                disabled={!filtros.sucursal_id}
                            >
                                <MenuItem value="">Todos los consultorios</MenuItem>
                                {consultoriosFiltrados.map((consultorio) => (
                                    <MenuItem key={consultorio.Consultorio_ID} value={consultorio.Consultorio_ID}>
                                        {consultorio.Nombre_Consultorio}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Fecha de Inicio */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Fecha de Inicio"
                            type="date"
                            value={filtros.fecha_inicio instanceof Date ? filtros.fecha_inicio.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleFiltroChange('fecha_inicio', new Date(e.target.value))}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: new Date().toISOString().split('T')[0] }}
                        />
                    </Grid>

                    {/* Fecha de Fin */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Fecha de Fin"
                            type="date"
                            value={filtros.fecha_fin instanceof Date ? filtros.fecha_fin.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleFiltroChange('fecha_fin', new Date(e.target.value))}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ 
                                min: filtros.fecha_inicio instanceof Date ? filtros.fecha_inicio.toISOString().split('T')[0] : new Date().toISOString().split('T')[0] 
                            }}
                        />
                    </Grid>

                    {/* Botón de búsqueda */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            onClick={buscarHorarios}
                            disabled={!filtros.sucursal_id || !filtros.especialidad_id || loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'Buscar Horarios Disponibles'}
                        </Button>
                    </Grid>

                    {/* Resultados */}
                    {loading && (
                        <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
                            <CircularProgress />
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Buscando horarios disponibles...
                            </Typography>
                        </Grid>
                    )}

                    {!loading && horarios.length > 0 && (
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Horarios Disponibles ({horarios.length} fechas)
                            </Typography>
                            
                            {horarios.map((dia, index) => (
                                <Card key={index} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" color="primary" gutterBottom>
                                            {formatearFecha(dia.fecha)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {dia.dia_semana}
                                        </Typography>
                                        
                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {dia.horarios.map((horario, horaIndex) => (
                                                <Chip
                                                    key={String(horaIndex)}
                                                    label={`${String(horario.hora || '')} - ${String(horario.especialista?.nombre || '')}`}
                                                    color="success"
                                                    variant="outlined"
                                                    onClick={() => seleccionarHorario({
                                                        fecha: dia.fecha,
                                                        hora: horario.hora,
                                                        especialista: horario.especialista,
                                                        consultorio: horario.consultorio,
                                                        programacion_id: horario.programacion_id
                                                    })}
                                                    sx={{ cursor: 'pointer' }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Grid>
                    )}

                    {!loading && horarios.length === 0 && filtros.sucursal_id && filtros.especialidad_id && (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                No se encontraron horarios disponibles para los criterios seleccionados.
                                Verifique las fechas o contacte al administrador para crear programaciones.
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HorariosDisponiblesModal;
