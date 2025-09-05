import { API_BASE_URL } from '../config/config';

class ProgramacionService {
    constructor() {
        this.baseURL = API_BASE_URL || 'http://localhost:8000';
    }

    /**
     * Crear una nueva programación de especialista
     */
    async crearProgramacion(programacionData) {
        try {
            console.log('ProgramacionService.crearProgramacion - Iniciando...');
            console.log('URL:', `${this.baseURL}/api/programacion`);
            console.log('Datos:', programacionData);
            
            const requestBody = {
                FK_Especialista: programacionData.especialista_id,
                Fk_Sucursal: programacionData.sucursal_id,
                Tipo_Programacion: programacionData.tipo_programacion,
                Fecha_Inicio: programacionData.fecha_inicio,
                Fecha_Fin: programacionData.fecha_fin,
                Hora_inicio: programacionData.hora_inicio,
                Hora_Fin: programacionData.hora_fin,
                Intervalo: programacionData.intervalo_citas
            };
            
            console.log('Request body:', requestBody);
            
            const response = await fetch(`${this.baseURL}/api/programacion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Hospital-ID': 'default',
                    'X-User-ID': 'system'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Error al crear la programación');
            }

            const responseData = await response.json();
            console.log('Success response:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error en crearProgramacion:', error);
            throw error;
        }
    }

    /**
     * Obtener horarios disponibles para agendar citas
     */
    async obtenerHorariosDisponibles(filtros) {
        try {
            const params = new URLSearchParams({
                sucursal_id: filtros.sucursal_id,
                especialidad_id: filtros.especialidad_id,
                fecha_inicio: filtros.fecha_inicio,
                fecha_fin: filtros.fecha_fin || filtros.fecha_inicio
            });

            if (filtros.especialista_id) {
                params.append('especialista_id', filtros.especialista_id);
            }

            if (filtros.consultorio_id) {
                params.append('consultorio_id', filtros.consultorio_id);
            }

            const response = await fetch(`${this.baseURL}/api/programacion/horarios-disponibles?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener horarios disponibles');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en obtenerHorariosDisponibles:', error);
            throw error;
        }
    }

    /**
     * Obtener programaciones existentes
     */
    async obtenerProgramaciones(filtros = {}) {
        try {
            const params = new URLSearchParams();
            
            if (filtros.especialista_id) {
                params.append('especialista_id', filtros.especialista_id);
            }
            
            if (filtros.sucursal_id) {
                params.append('sucursal_id', filtros.sucursal_id);
            }
            
            if (filtros.estatus) {
                params.append('estatus', filtros.estatus);
            }
            
            if (filtros.fecha_inicio) {
                params.append('fecha_inicio', filtros.fecha_inicio);
            }
            
            if (filtros.fecha_fin) {
                params.append('fecha_fin', filtros.fecha_fin);
            }
            
            if (filtros.per_page) {
                params.append('per_page', filtros.per_page);
            }

            const response = await fetch(`${this.baseURL}/api/programacion?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener programaciones');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en obtenerProgramaciones:', error);
            throw error;
        }
    }

    /**
     * Generar horarios disponibles para una programación
     */
    async generarHorariosDisponibles(programacionId) {
        try {
            const response = await fetch(`${this.baseURL}/api/programacion/${programacionId}/generar-horarios`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al generar horarios');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en generarHorariosDisponibles:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas de programaciones
     */
    async obtenerEstadisticas() {
        try {
            const response = await fetch(`${this.baseURL}/api/programacion/estadisticas`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener estadísticas');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en obtenerEstadisticas:', error);
            throw error;
        }
    }

    /**
     * Obtener horarios de una programación agrupados por fecha
     */
    async obtenerHorariosPorFecha(programacionId) {
        try {
            const response = await fetch(`${this.baseURL}/api/programacion/${programacionId}/horarios-por-fecha`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener horarios por fecha');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en obtenerHorariosPorFecha:', error);
            throw error;
        }
    }

    /**
     * Gestionar fecha (aperturar, eliminar, editar)
     */
    async gestionarFecha(programacionId, fecha, accion, nuevaFecha = null, nuevosHorarios = null) {
        try {
            console.log('Gestionando fecha:', { programacionId, fecha, accion, nuevaFecha });
            
            const body = { fecha, accion };
            if (accion === 'editar') {
                body.nueva_fecha = nuevaFecha;
            }

            const response = await fetch(`${this.baseURL}/api/programacion/${programacionId}/gestionar-fecha`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-User-ID': 'system',
                    'X-Hospital-ID': 'default'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al gestionar fecha');
            }

            const result = await response.json();
            console.log('Fecha gestionada exitosamente:', result);
            return result;
        } catch (error) {
            console.error('Error en gestionarFecha:', error);
            throw error;
        }
    }

    /**
     * Gestionar horario individual (aperturar, eliminar, editar)
     */
    async gestionarHorario(programacionId, horarioId, accion, nuevaHora = null) {
        try {
            const body = { accion };
            if (accion === 'editar') {
                body.nueva_hora = nuevaHora;
            }

            const response = await fetch(`${this.baseURL}/api/programacion/${programacionId}/horarios/${horarioId}/gestionar`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al gestionar horario');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en gestionarHorario:', error);
            throw error;
        }
    }

    /**
     * Agregar nueva fecha a una programación
     */
    async agregarFecha(programacionId, fecha, horarios) {
        try {
            const response = await fetch(`${this.baseURL}/api/programacion/${programacionId}/agregar-fecha`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fecha, horarios })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al agregar fecha');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en agregarFecha:', error);
            throw error;
        }
    }

         /**
      * Aperturar la primera fecha de una programación
      */
     async aperturarPrimeraFecha(programacionId) {
         try {
             const response = await fetch(`${this.baseURL}/api/programacion/${programacionId}/aperturar-primera-fecha`, {
                 method: 'POST',
                 headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json'
                 }
             });
 
             if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Error al aperturar primera fecha');
             }
 
             return await response.json();
         } catch (error) {
             console.error('Error en aperturarPrimeraFecha:', error);
             throw error;
         }
     }

     /**
      * Agregar nuevos horarios a una fecha existente
      */
     async agregarHorariosAFecha(programacionId, fecha, horarios) {
        try {
            console.log('Agregando horarios a fecha:', { programacionId, fecha, horarios });
            
            const response = await fetch(`${this.baseURL}/api/programacion/${programacionId}/agregar-horarios`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-User-ID': 'system',
                    'X-Hospital-ID': 'default'
                },
                body: JSON.stringify({ 
                    fecha, 
                    horarios: horarios.map(h => ({
                        hora: h.hora,
                        estatus: h.estatus || 'Disponible'
                    }))
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al agregar horarios');
            }

            const result = await response.json();
            console.log('Horarios agregados exitosamente:', result);
            return result;
        } catch (error) {
            console.error('Error en agregarHorariosAFecha:', error);
            throw error;
        }
    }

    /**
     * Eliminar una programación
     */
    async eliminarProgramacion(programacionId) {
        try {
            const response = await fetch(`${this.baseURL}/api/programacion/${programacionId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar la programación');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en eliminarProgramacion:', error);
            throw error;
        }
    }

    /**
     * Calcular horarios disponibles basado en intervalo
     */
    calcularHorariosDisponibles(horaInicio, horaFin, intervalo) {
        const horarios = [];
        const inicio = new Date(`2000-01-01 ${horaInicio}`);
        const fin = new Date(`2000-01-01 ${horaFin}`);
        
        let horaActual = new Date(inicio);
        
        while (horaActual <= fin) {
            horarios.push(horaActual.toTimeString().slice(0, 5));
            horaActual.setMinutes(horaActual.getMinutes() + intervalo);
        }
        
        return horarios;
    }

    /**
     * Validar datos de programación
     */
    validarProgramacion(datos) {
        const errores = [];
        
        if (!datos.especialista_id) {
            errores.push('Debe seleccionar un especialista');
        }
        
        if (!datos.sucursal_id) {
            errores.push('Debe seleccionar una sucursal');
        }
        
        if (!datos.fecha_inicio) {
            errores.push('Debe especificar una fecha de inicio');
        }
        
        if (!datos.fecha_fin) {
            errores.push('Debe especificar una fecha de fin');
        }
        
        if (datos.fecha_inicio && datos.fecha_fin && datos.fecha_inicio > datos.fecha_fin) {
            errores.push('La fecha de inicio debe ser anterior a la fecha de fin');
        }
        
        if (!datos.hora_inicio) {
            errores.push('Debe especificar una hora de inicio');
        }
        
        if (!datos.hora_fin) {
            errores.push('Debe especificar una hora de fin');
        }
        
        if (datos.hora_inicio && datos.hora_fin && datos.hora_inicio >= datos.hora_fin) {
            errores.push('La hora de inicio debe ser anterior a la hora de fin');
        }
        
        if (!datos.intervalo_citas || datos.intervalo_citas < 15 || datos.intervalo_citas > 120) {
            errores.push('El intervalo debe estar entre 15 y 120 minutos');
        }
        
        return {
            esValida: errores.length === 0,
            errores
        };
    }

    /**
     * Formatear fecha para mostrar
     */
    formatearFecha(fecha) {
        if (!fecha) return '';
        
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Formatear hora para mostrar
     */
    formatearHora(hora) {
        if (!hora) return '';
        
        const [horas, minutos] = hora.split(':');
        return `${horas}:${minutos}`;
    }

    /**
     * Calcular duración de la programación en días
     */
    calcularDuracionDias(fechaInicio, fechaFin) {
        if (!fechaInicio || !fechaFin) return 0;
        
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diferencia = fin.getTime() - inicio.getTime();
        const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
        
        return dias + 1; // +1 para incluir el día de inicio
    }

    /**
     * Calcular total de horarios disponibles
     */
    calcularTotalHorarios(fechaInicio, fechaFin, horaInicio, horaFin, intervalo) {
        const dias = this.calcularDuracionDias(fechaInicio, fechaFin);
        const horariosPorDia = this.calcularHorariosDisponibles(horaInicio, horaFin, intervalo).length;
        
        return dias * horariosPorDia;
    }
}

export default new ProgramacionService();
