import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  ContactPhone as ContactIcon,
  LocationOn as LocationIcon,
  LocalHospital as HealthIcon,
  Business as BusinessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';

const ClienteForm = ({ data, errors, onChange, editing = false }) => {
  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [tiposPersona, setTiposPersona] = useState([]);
  const [condicionesIva, setCondicionesIva] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [gruposSanguineos, setGruposSanguineos] = useState([]);
  const [factoresRh, setFactoresRh] = useState([]);

  const handleChange = (field) => (event) => {
    onChange(field, event.target.value);
  };

  const handleSwitchChange = (field) => (event) => {
    onChange(field, event.target.checked);
  };

  // Cargar datos de referencia
  useEffect(() => {
    // Aquí se cargarían los datos de las tablas relacionadas
    // Por ahora usamos datos de ejemplo
    setCategorias([
      { value: 'minorista', label: 'Minorista' },
      { value: 'mayorista', label: 'Mayorista' },
      { value: 'distribuidor', label: 'Distribuidor' },
      { value: 'consumidor_final', label: 'Consumidor Final' }
    ]);

    setEstados([
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' },
      { value: 'suspendido', label: 'Suspendido' },
      { value: 'bloqueado', label: 'Bloqueado' }
    ]);

    setTiposPersona([
      { value: 'fisica', label: 'Física' },
      { value: 'juridica', label: 'Jurídica' }
    ]);

    setCondicionesIva([
      { value: 'responsable_inscripto', label: 'Responsable Inscripto' },
      { value: 'monotributista', label: 'Monotributista' },
      { value: 'exento', label: 'Exento' },
      { value: 'consumidor_final', label: 'Consumidor Final' }
    ]);

    setGeneros([
      { value: 'masculino', label: 'Masculino' },
      { value: 'femenino', label: 'Femenino' },
      { value: 'otro', label: 'Otro' }
    ]);

    setGruposSanguineos([
      { value: 'A+', label: 'A+' },
      { value: 'A-', label: 'A-' },
      { value: 'B+', label: 'B+' },
      { value: 'B-', label: 'B-' },
      { value: 'AB+', label: 'AB+' },
      { value: 'AB-', label: 'AB-' },
      { value: 'O+', label: 'O+' },
      { value: 'O-', label: 'O-' }
    ]);

    setFactoresRh([
      { value: '+', label: 'Positivo (+)' },
      { value: '-', label: 'Negativo (-)' }
    ]);
  }, []);

  return (
    <MDBox>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MDTypography variant="h6" color="info" gutterBottom>
            {editing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </MDTypography>
        </Grid>

        {/* Información Básica */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PersonIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Información Básica</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Código"
                  value={data.codigo || ''}
                  onChange={handleChange('codigo')}
                  error={!!errors.codigo}
                  helperText={errors.codigo}
                  required
                  autoFocus={!editing}
                  placeholder="Ingrese el código del cliente..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.tipo_persona}>
                  <InputLabel>Tipo de Persona</InputLabel>
                  <Select
                    value={data.tipo_persona || 'fisica'}
                    onChange={handleChange('tipo_persona')}
                    label="Tipo de Persona"
                  >
                    {tiposPersona.map((tipo) => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tipo_persona && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.tipo_persona}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Campos para persona física */}
              {(data.tipo_persona === 'fisica' || !data.tipo_persona) && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={data.nombre || ''}
                      onChange={handleChange('nombre')}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      required
                      placeholder="Nombre"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Apellido"
                      value={data.apellido || ''}
                      onChange={handleChange('apellido')}
                      error={!!errors.apellido}
                      helperText={errors.apellido}
                      required
                      placeholder="Apellido"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="DNI"
                      value={data.dni || ''}
                      onChange={handleChange('dni')}
                      error={!!errors.dni}
                      helperText={errors.dni}
                      placeholder="DNI"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Fecha de Nacimiento"
                      type="date"
                      value={data.fecha_nacimiento || ''}
                      onChange={handleChange('fecha_nacimiento')}
                      error={!!errors.fecha_nacimiento}
                      helperText={errors.fecha_nacimiento}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.genero}>
                      <InputLabel>Género</InputLabel>
                      <Select
                        value={data.genero || ''}
                        onChange={handleChange('genero')}
                        label="Género"
                      >
                        <MenuItem value="">Seleccionar género</MenuItem>
                        {generos.map((genero) => (
                          <MenuItem key={genero.value} value={genero.value}>
                            {genero.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.genero && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.genero}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </>
              )}

              {/* Campos para persona jurídica */}
              {data.tipo_persona === 'juridica' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Razón Social"
                      value={data.razon_social || ''}
                      onChange={handleChange('razon_social')}
                      error={!!errors.razon_social}
                      helperText={errors.razon_social}
                      required
                      placeholder="Razón social"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CUIT"
                      value={data.cuit || ''}
                      onChange={handleChange('cuit')}
                      error={!!errors.cuit}
                      helperText={errors.cuit}
                      placeholder="XX-XXXXXXXX-X"
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoria}>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={data.categoria || 'consumidor_final'}
                    onChange={handleChange('categoria')}
                    label="Categoría"
                  >
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoria && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.categoria}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.estado}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={data.estado || 'activo'}
                    onChange={handleChange('estado')}
                    label="Estado"
                  >
                    {estados.map((estado) => (
                      <MenuItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.estado && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.estado}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Información de Contacto */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ContactIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Información de Contacto</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={data.email || ''}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  placeholder="cliente@ejemplo.com"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={data.telefono || ''}
                  onChange={handleChange('telefono')}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                  placeholder="(011) 1234-5678"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Celular"
                  value={data.celular || ''}
                  onChange={handleChange('celular')}
                  error={!!errors.celular}
                  helperText={errors.celular}
                  placeholder="(011) 15-1234-5678"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contacto Alternativo"
                  value={data.contacto_alternativo || ''}
                  onChange={handleChange('contacto_alternativo')}
                  error={!!errors.contacto_alternativo}
                  helperText={errors.contacto_alternativo}
                  placeholder="Nombre del contacto alternativo"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono Alternativo"
                  value={data.telefono_alternativo || ''}
                  onChange={handleChange('telefono_alternativo')}
                  error={!!errors.telefono_alternativo}
                  helperText={errors.telefono_alternativo}
                  placeholder="(011) 1234-5678"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Alternativo"
                  type="email"
                  value={data.email_alternativo || ''}
                  onChange={handleChange('email_alternativo')}
                  error={!!errors.email_alternativo}
                  helperText={errors.email_alternativo}
                  placeholder="alternativo@ejemplo.com"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Dirección */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <LocationIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Dirección</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={data.direccion || ''}
                  onChange={handleChange('direccion')}
                  error={!!errors.direccion}
                  helperText={errors.direccion}
                  multiline
                  rows={2}
                  placeholder="Dirección completa..."
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  value={data.ciudad || ''}
                  onChange={handleChange('ciudad')}
                  error={!!errors.ciudad}
                  helperText={errors.ciudad}
                  placeholder="Ciudad"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Provincia"
                  value={data.provincia || ''}
                  onChange={handleChange('provincia')}
                  error={!!errors.provincia}
                  helperText={errors.provincia}
                  placeholder="Provincia"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Código Postal"
                  value={data.codigo_postal || ''}
                  onChange={handleChange('codigo_postal')}
                  error={!!errors.codigo_postal}
                  helperText={errors.codigo_postal}
                  placeholder="Código postal"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Información Comercial */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <BusinessIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Información Comercial</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Límite de Crédito"
                  type="number"
                  value={data.limite_credito || ''}
                  onChange={handleChange('limite_credito')}
                  error={!!errors.limite_credito}
                  helperText={errors.limite_credito}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Días de Crédito"
                  type="number"
                  value={data.dias_credito || 0}
                  onChange={handleChange('dias_credito')}
                  error={!!errors.dias_credito}
                  helperText={errors.dias_credito}
                  inputProps={{ min: 0 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>días</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Descuento por Defecto (%)"
                  type="number"
                  value={data.descuento_por_defecto || 0.00}
                  onChange={handleChange('descuento_por_defecto')}
                  error={!!errors.descuento_por_defecto}
                  helperText={errors.descuento_por_defecto}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.condicion_iva}>
                  <InputLabel>Condición IVA</InputLabel>
                  <Select
                    value={data.condicion_iva || 'consumidor_final'}
                    onChange={handleChange('condicion_iva')}
                    label="Condición IVA"
                  >
                    {condicionesIva.map((condicion) => (
                      <MenuItem key={condicion.value} value={condicion.value}>
                        {condicion.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.condicion_iva && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.condicion_iva}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Ingresos Brutos"
                  value={data.numero_ingresos_brutos || ''}
                  onChange={handleChange('numero_ingresos_brutos')}
                  error={!!errors.numero_ingresos_brutos}
                  helperText={errors.numero_ingresos_brutos}
                  placeholder="Número de ingresos brutos"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.exento_iva || false}
                      onChange={handleSwitchChange('exento_iva')}
                    />
                  }
                  label="Exento de IVA"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Información de Salud */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <HealthIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Información de Salud</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Obra Social"
                  value={data.obra_social || ''}
                  onChange={handleChange('obra_social')}
                  error={!!errors.obra_social}
                  helperText={errors.obra_social}
                  placeholder="Nombre de la obra social"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Afiliado"
                  value={data.numero_afiliado || ''}
                  onChange={handleChange('numero_afiliado')}
                  error={!!errors.numero_afiliado}
                  helperText={errors.numero_afiliado}
                  placeholder="Número de afiliado"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Plan de Obra Social"
                  value={data.plan_obra_social || ''}
                  onChange={handleChange('plan_obra_social')}
                  error={!!errors.plan_obra_social}
                  helperText={errors.plan_obra_social}
                  placeholder="Plan de la obra social"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.grupo_sanguineo}>
                  <InputLabel>Grupo Sanguíneo</InputLabel>
                  <Select
                    value={data.grupo_sanguineo || ''}
                    onChange={handleChange('grupo_sanguineo')}
                    label="Grupo Sanguíneo"
                  >
                    <MenuItem value="">Seleccionar grupo</MenuItem>
                    {gruposSanguineos.map((grupo) => (
                      <MenuItem key={grupo.value} value={grupo.value}>
                        {grupo.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.grupo_sanguineo && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.grupo_sanguineo}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.factor_rh}>
                  <InputLabel>Factor RH</InputLabel>
                  <Select
                    value={data.factor_rh || ''}
                    onChange={handleChange('factor_rh')}
                    label="Factor RH"
                  >
                    <MenuItem value="">Seleccionar factor</MenuItem>
                    {factoresRh.map((factor) => (
                      <MenuItem key={factor.value} value={factor.value}>
                        {factor.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.factor_rh && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.factor_rh}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Alergias"
                  value={data.alergias || ''}
                  onChange={handleChange('alergias')}
                  error={!!errors.alergias}
                  helperText={errors.alergias}
                  multiline
                  rows={2}
                  placeholder="Lista de alergias..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medicamentos Actuales"
                  value={data.medicamentos_actuales || ''}
                  onChange={handleChange('medicamentos_actuales')}
                  error={!!errors.medicamentos_actuales}
                  helperText={errors.medicamentos_actuales}
                  multiline
                  rows={2}
                  placeholder="Medicamentos que está tomando..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Condiciones Médicas"
                  value={data.condiciones_medicas || ''}
                  onChange={handleChange('condiciones_medicas')}
                  error={!!errors.condiciones_medicas}
                  helperText={errors.condiciones_medicas}
                  multiline
                  rows={2}
                  placeholder="Condiciones médicas importantes..."
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Información Laboral */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <BusinessIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Información Laboral</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Profesión"
                  value={data.profesion || ''}
                  onChange={handleChange('profesion')}
                  error={!!errors.profesion}
                  helperText={errors.profesion}
                  placeholder="Profesión u oficio"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Empresa"
                  value={data.empresa || ''}
                  onChange={handleChange('empresa')}
                  error={!!errors.empresa}
                  helperText={errors.empresa}
                  placeholder="Empresa donde trabaja"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cargo"
                  value={data.cargo || ''}
                  onChange={handleChange('cargo')}
                  error={!!errors.cargo}
                  helperText={errors.cargo}
                  placeholder="Cargo o puesto"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Marketing */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <InfoIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Marketing</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.acepta_marketing || false}
                      onChange={handleSwitchChange('acepta_marketing')}
                    />
                  }
                  label="Acepta marketing"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.acepta_newsletter || false}
                      onChange={handleSwitchChange('acepta_newsletter')}
                    />
                  }
                  label="Acepta newsletter"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Campos adicionales en modo edición */}
        {editing && data.id && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ID"
              value={data.id}
              disabled
              helperText="Identificador único"
            />
          </Grid>
        )}

        {editing && data.created_at && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha de Creación"
              value={new Date(data.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              disabled
              helperText="Fecha de creación del registro"
            />
          </Grid>
        )}
      </Grid>

      {/* Información adicional */}
      <MDBox mt={3} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
        <MDTypography variant="body2" color="text" gutterBottom>
          <strong>Información:</strong>
        </MDTypography>
        <MDTypography variant="caption" color="text">
          • El código debe ser único en el sistema<br />
          • Los clientes activos están disponibles para ventas<br />
          • La información de salud es importante para farmacias<br />
          • Los datos de contacto son necesarios para seguimiento<br />
          • La información fiscal es requerida para facturación
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default ClienteForm; 