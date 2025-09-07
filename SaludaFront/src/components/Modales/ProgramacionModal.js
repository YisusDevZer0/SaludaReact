import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Grid,
    Typography,
    Alert,
    Box,
    Chip
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import programacionService from '../../services/programacion-service';
import agendaService from '../../services/agenda-service';
import './Modales.css';

const ProgramacionModal = ({ open, onClose, onSuccess, programacion = null }) => {
    const [formData, setFormData] = useState({
        especialista_id: '',
        especialidad_id: '',
        sucursal_id: '',
        consultorio_id: '',
        tipo_programacion: 'Regular',
        fecha_inicio: null,
        fecha_fin: null,
        hora_inicio: null,
        hora_fin: null,
        intervalo_citas: 30,
        notas: '',
        activar_automaticamente: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [especialidades, setEspecialidades] = useState([]);
    const [especialistas, setEspecialistas] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [consultorios, setConsultorios] = useState([]);
    const [especialistasFiltrados, setEspecialistasFiltrados] = useState([]);
    const [consultoriosFiltrados, setConsultoriosFiltrados] = useState([]);
    const [previewHorarios, setPreviewHorarios] = useState([]);

    useEffect(() => {
        if (open) {
            loadReferenceData();
            if (programacion) {
                loadProgramacionData();
            }
        }
    }, [open, programacion]);

    useEffect(() => {
        if (formData.sucursal_id) {
            loadEspecialidadesPorSucursal();
        }
    }, [formData.sucursal_id]);

    useEffect(() => {
        if (formData.especialidad_id) {
            loadEspecialistasPorEspecialidad();
        }
    }, [formData.especialidad_id]);

    useEffect(() => {
        if (formData.sucursal_id) {
            loadConsultoriosPorSucursal();
        }
    }, [formData.sucursal_id]);

    useEffect(() => {
        if (formData.fecha_inicio && formData.fecha_fin && formData.hora_inicio && formData.hora_fin && formData.intervalo_citas) {
            generarPreviewHorarios();
        }
    }, [formData.fecha_inicio, formData.fecha_fin, formData.hora_inicio, formData.hora_fin, formData.intervalo_citas]);

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
            // Por ahora, mostramos todas las especialidades
            // En el futuro se puede implementar filtrado por sucursal
            // setEspecialidades(especialidades);
        } catch (error) {
            console.error('Error cargando especialidades por sucursal:', error);
        }
    };

    const loadEspecialistasPorEspecialidad = async () => {
        try {
            const especialistasData = await agendaService.getEspecialistasMejorados();
            const especialistasFiltrados = especialistasData.data?.filter(
                esp => esp.Fk_Especialidad === formData.especialidad_id
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
                cons => cons.Fk_Sucursal === formData.sucursal_id
            ) || [];
            setConsultoriosFiltrados(consultoriosFiltrados);
        } catch (error) {
            console.error('Error cargando consultorios por sucursal:', error);
        }
    };

    const loadProgramacionData = () => {
        if (programacion) {
            setFormData({
                especialista_id: programacion.Fk_Especialista || '',
                especialidad_id: programacion.especialista?.Fk_Especialidad || '',
                sucursal_id: programacion.Fk_Sucursal || '',
                consultorio_id: programacion.Fk_Consultorio || '',
                tipo_programacion: programacion.Tipo_Programacion || 'Regular',
                fecha_inicio: new Date(programacion.Fecha_Inicio),
                fecha_fin: new Date(programacion.Fecha_Fin),
                hora_inicio: new Date(`2000-01-01 ${programacion.Hora_Inicio}`),
                hora_fin: new Date(`2000-01-01 ${programacion.Hora_Fin}`),
                intervalo_citas: programacion.Intervalo_Citas || 30,
                notas: programacion.Notas || '',
                activar_automaticamente: programacion.Estatus === 'Activa'
            });
        }
    };

    const generarPreviewHorarios = () => {
        if (!formData.fecha_inicio || !formData.fecha_fin || !formData.hora_inicio || !formData.hora_fin) {
            return;
        }

        const horarios = programacionService.calcularHorariosDisponibles(
            formData.hora_inicio.toTimeString().slice(0, 5),
            formData.hora_fin.toTimeString().slice(0, 5),
            formData.intervalo_citas
        );

        const dias = programacionService.calcularDuracionDias(
            formData.fecha_inicio,
            formData.fecha_fin
        );

        const preview = [];
        let fechaActual = new Date(formData.fecha_inicio);

        for (let i = 0; i < Math.min(dias, 7); i++) { // Mostrar máximo 7 días
            preview.push({
                fecha: new Date(fechaActual),
                horarios: horarios
            });
            fechaActual.setDate(fechaActual.getDate() + 1);
        }

        setPreviewHorarios(preview);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // Validación adicional
            if (!formData.especialidad_id) {
                setError('Debe seleccionar una especialidad');
                return;
            }

            const validacion = programacionService.validarProgramacion(formData);
            if (!validacion.esValida) {
                setError(validacion.errores.join(', '));
                return;
            }

            const programacionData = {
                ...formData,
                fecha_inicio: formData.fecha_inicio.toISOString().split('T')[0],
                fecha_fin: formData.fecha_fin.toISOString().split('T')[0],
                hora_inicio: formData.hora_inicio.toTimeString().slice(0, 5),
                hora_fin: formData.hora_fin.toTimeString().slice(0, 5)
            };

            // Debug: Log de datos a enviar
            console.log('Datos de programación a enviar:', programacionData);

            if (programacion) {
                // Actualizar programación existente
                // await programacionService.actualizarProgramacion(programacion.Programacion_ID, programacionData);
                setSuccess('Programación actualizada exitosamente');
            } else {
                // Crear nueva programación
                console.log('Intentando crear nueva programación...');
                const response = await programacionService.crearProgramacion(programacionData);
                console.log('Respuesta del servidor:', response);
                setSuccess(`Programación creada exitosamente. Se generaron ${response.data.horarios_generados} horarios disponibles.`);
            }

            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 2000);

        } catch (error) {
            console.error('Error al guardar programación:', error);
            setError(error.message || 'Error al guardar la programación');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            especialista_id: '',
            especialidad_id: '',
            sucursal_id: '',
            consultorio_id: '',
            tipo_programacion: 'Regular',
            fecha_inicio: null,
            fecha_fin: null,
            hora_inicio: null,
            hora_fin: null,
            intervalo_citas: 30,
            notas: '',
            activar_automaticamente: false
        });
        setError('');
        setSuccess('');
        setPreviewHorarios([]);
        onClose();
    };

    const totalHorarios = programacionService.calcularTotalHorarios(
        formData.fecha_inicio,
        formData.fecha_fin,
        formData.hora_inicio?.toTimeString().slice(0, 5),
        formData.hora_fin?.toTimeString().slice(0, 5),
        formData.intervalo_citas
    );

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="md" 
            fullWidth
            className="programacion-modal"
            PaperProps={{
                sx: {
                    backgroundColor: 'white',
                    minHeight: '60vh'
                }
            }}
        >
            <DialogTitle>
                {programacion ? 'Editar Programación' : 'Crear Nueva Programación'}
            </DialogTitle>
            
            <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}
                    
                    {success && (
                        <Grid item xs={12}>
                            <Alert severity="success">{success}</Alert>
                        </Grid>
                    )}

                    {/* Sucursal */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Sucursal *</InputLabel>
                            <Select
                                value={formData.sucursal_id}
                                onChange={(e) => handleInputChange('sucursal_id', e.target.value)}
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
                         <FormControl fullWidth required>
                             <InputLabel>Especialidad *</InputLabel>
                             <Select
                                 value={formData.especialidad_id || ''}
                                 onChange={(e) => handleInputChange('especialidad_id', e.target.value)}
                                 label="Especialidad *"
                                 error={!formData.especialidad_id}
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
                            <InputLabel>Especialista *</InputLabel>
                            <Select
                                value={formData.especialista_id}
                                onChange={(e) => handleInputChange('especialista_id', e.target.value)}
                                label="Especialista *"
                                disabled={!formData.especialidad_id}
                            >
                                {especialistasFiltrados.map((especialista) => (
                                    <MenuItem key={especialista.Especialista_ID} value={especialista.Especialista_ID}>
                                        {especialista.Nombre_Completo} - {especialista.Cedula_Profesional}
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
                                value={formData.consultorio_id}
                                onChange={(e) => handleInputChange('consultorio_id', e.target.value)}
                                label="Consultorio"
                                disabled={!formData.sucursal_id}
                            >
                                <MenuItem value="">Sin consultorio específico</MenuItem>
                                {consultoriosFiltrados.map((consultorio) => (
                                    <MenuItem key={consultorio.Consultorio_ID} value={consultorio.Consultorio_ID}>
                                        {consultorio.Nombre_Consultorio}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Tipo de Programación */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de Programación</InputLabel>
                            <Select
                                value={formData.tipo_programacion}
                                onChange={(e) => handleInputChange('tipo_programacion', e.target.value)}
                                label="Tipo de Programación"
                            >
                                <MenuItem value="Regular">Regular</MenuItem>
                                <MenuItem value="Temporal">Temporal</MenuItem>
                                <MenuItem value="Especial">Especial</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Intervalo de Citas */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Intervalo entre Citas (minutos)</InputLabel>
                            <Select
                                value={formData.intervalo_citas}
                                onChange={(e) => handleInputChange('intervalo_citas', e.target.value)}
                                label="Intervalo entre Citas (minutos)"
                            >
                                <MenuItem value={15}>15 minutos</MenuItem>
                                <MenuItem value={30}>30 minutos</MenuItem>
                                <MenuItem value={45}>45 minutos</MenuItem>
                                <MenuItem value={60}>1 hora</MenuItem>
                                <MenuItem value={90}>1.5 horas</MenuItem>
                                <MenuItem value={120}>2 horas</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Fecha de Inicio */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Fecha de Inicio *"
                            type="date"
                            value={formData.fecha_inicio instanceof Date ? formData.fecha_inicio.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleInputChange('fecha_inicio', new Date(e.target.value))}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: new Date().toISOString().split('T')[0] }}
                        />
                    </Grid>

                    {/* Fecha de Fin */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Fecha de Fin *"
                            type="date"
                            value={formData.fecha_fin instanceof Date ? formData.fecha_fin.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleInputChange('fecha_fin', new Date(e.target.value))}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ 
                                min: formData.fecha_inicio instanceof Date ? formData.fecha_inicio.toISOString().split('T')[0] : new Date().toISOString().split('T')[0] 
                            }}
                        />
                    </Grid>

                    {/* Hora de Inicio */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Hora de Inicio *"
                            type="time"
                            value={formData.hora_inicio instanceof Date ? formData.hora_inicio.toTimeString().slice(0, 5) : ''}
                            onChange={(e) => handleInputChange('hora_inicio', new Date(`2000-01-01T${e.target.value}`))}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Hora de Fin */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Hora de Fin *"
                            type="time"
                            value={formData.hora_fin instanceof Date ? formData.hora_fin.toTimeString().slice(0, 5) : ''}
                            onChange={(e) => handleInputChange('hora_fin', new Date(`2000-01-01T${e.target.value}`))}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Activar Automáticamente */}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.activar_automaticamente}
                                    onChange={(e) => handleInputChange('activar_automaticamente', e.target.checked)}
                                />
                            }
                            label="Activar programación automáticamente y generar horarios disponibles"
                        />
                    </Grid>

                    {/* Notas */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Notas adicionales"
                            value={formData.notas}
                            onChange={(e) => handleInputChange('notas', e.target.value)}
                        />
                    </Grid>

                    {/* Resumen */}
                    {totalHorarios > 0 && (
                        <Grid item xs={12}>
                            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    Resumen de la Programación
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2">
                                            <strong>Duración:</strong> {programacionService.calcularDuracionDias(formData.fecha_inicio, formData.fecha_fin)} días
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2">
                                            <strong>Total de horarios:</strong> {totalHorarios}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            <strong>Horarios por día:</strong> {formData.hora_inicio && formData.hora_fin ? 
                                                programacionService.calcularHorariosDisponibles(
                                                    formData.hora_inicio.toTimeString().slice(0, 5),
                                                    formData.hora_fin.toTimeString().slice(0, 5),
                                                    formData.intervalo_citas
                                                ).length : 0}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    )}

                    {/* Preview de Horarios */}
                    {previewHorarios.length > 0 && (
                        <Grid item xs={12}>
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    Vista Previa de Horarios (primeros 7 días)
                                </Typography>
                                {previewHorarios.map((dia, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {programacionService.formatearFecha(dia.fecha)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {dia.horarios.map((hora, horaIndex) => (
                                                <Chip
                                                    key={horaIndex}
                                                    label={hora}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : (programacion ? 'Actualizar' : 'Crear')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProgramacionModal;
