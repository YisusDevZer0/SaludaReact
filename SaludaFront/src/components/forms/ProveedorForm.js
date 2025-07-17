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
  Business as BusinessIcon,
  ContactPhone as ContactIcon,
  LocationOn as LocationIcon,
  AccountBalance as BankIcon,
  Receipt as TaxIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';

const ProveedorForm = ({ data, errors, onChange, editing = false }) => {
  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [tiposPersona, setTiposPersona] = useState([]);
  const [condicionesIva, setCondicionesIva] = useState([]);
  const [tiposCuenta, setTiposCuenta] = useState([]);

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
      { value: 'fabricante', label: 'Fabricante' },
      { value: 'distribuidor', label: 'Distribuidor' },
      { value: 'importador', label: 'Importador' }
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

    setTiposCuenta([
      { value: 'corriente', label: 'Corriente' },
      { value: 'ahorro', label: 'Ahorro' },
      { value: 'especial', label: 'Especial' }
    ]);
  }, []);

  return (
    <MDBox>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MDTypography variant="h6" color="info" gutterBottom>
            {editing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </MDTypography>
        </Grid>

        {/* Información Básica */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <BusinessIcon sx={{ mr: 1 }} />
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
                  placeholder="Ingrese el código del proveedor..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.tipo_persona}>
                  <InputLabel>Tipo de Persona</InputLabel>
                  <Select
                    value={data.tipo_persona || 'juridica'}
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Razón Social"
                  value={data.razon_social || ''}
                  onChange={handleChange('razon_social')}
                  error={!!errors.razon_social}
                  helperText={errors.razon_social}
                  required
                  placeholder="Ingrese la razón social..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre Comercial"
                  value={data.nombre_comercial || ''}
                  onChange={handleChange('nombre_comercial')}
                  error={!!errors.nombre_comercial}
                  helperText={errors.nombre_comercial}
                  placeholder="Nombre comercial (opcional)..."
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

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DNI"
                  value={data.dni || ''}
                  onChange={handleChange('dni')}
                  error={!!errors.dni}
                  helperText={errors.dni}
                  placeholder="DNI (solo personas físicas)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoria}>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={data.categoria || 'mayorista'}
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
                  placeholder="proveedor@ejemplo.com"
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
                  label="Fax"
                  value={data.fax || ''}
                  onChange={handleChange('fax')}
                  error={!!errors.fax}
                  helperText={errors.fax}
                  placeholder="(011) 1234-5678"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sitio Web"
                  value={data.sitio_web || ''}
                  onChange={handleChange('sitio_web')}
                  error={!!errors.sitio_web}
                  helperText={errors.sitio_web}
                  placeholder="https://www.ejemplo.com"
                />
              </Grid>

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
                  value={data.dias_credito || 30}
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
                <TextField
                  fullWidth
                  label="Tiempo de Entrega Promedio"
                  type="number"
                  value={data.tiempo_entrega_promedio || ''}
                  onChange={handleChange('tiempo_entrega_promedio')}
                  error={!!errors.tiempo_entrega_promedio}
                  helperText={errors.tiempo_entrega_promedio}
                  inputProps={{ min: 0 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>días</Typography>
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Información Bancaria */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <BankIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Información Bancaria</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Banco"
                  value={data.banco || ''}
                  onChange={handleChange('banco')}
                  error={!!errors.banco}
                  helperText={errors.banco}
                  placeholder="Nombre del banco"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.tipo_cuenta}>
                  <InputLabel>Tipo de Cuenta</InputLabel>
                  <Select
                    value={data.tipo_cuenta || ''}
                    onChange={handleChange('tipo_cuenta')}
                    label="Tipo de Cuenta"
                  >
                    <MenuItem value="">Seleccionar tipo</MenuItem>
                    {tiposCuenta.map((tipo) => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tipo_cuenta && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.tipo_cuenta}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Cuenta"
                  value={data.numero_cuenta || ''}
                  onChange={handleChange('numero_cuenta')}
                  error={!!errors.numero_cuenta}
                  helperText={errors.numero_cuenta}
                  placeholder="Número de cuenta"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CBU"
                  value={data.cbu || ''}
                  onChange={handleChange('cbu')}
                  error={!!errors.cbu}
                  helperText={errors.cbu}
                  placeholder="22 dígitos"
                  inputProps={{ maxLength: 22 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Alias CBU"
                  value={data.alias_cbu || ''}
                  onChange={handleChange('alias_cbu')}
                  error={!!errors.alias_cbu}
                  helperText={errors.alias_cbu}
                  placeholder="Alias del CBU"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Información Fiscal */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TaxIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Información Fiscal</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.condicion_iva}>
                  <InputLabel>Condición IVA</InputLabel>
                  <Select
                    value={data.condicion_iva || 'responsable_inscripto'}
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.retencion_iva || false}
                      onChange={handleSwitchChange('retencion_iva')}
                    />
                  }
                  label="Retención IVA"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Porcentaje Retención IVA (%)"
                  type="number"
                  value={data.porcentaje_retencion_iva || 0.00}
                  onChange={handleChange('porcentaje_retencion_iva')}
                  error={!!errors.porcentaje_retencion_iva}
                  helperText={errors.porcentaje_retencion_iva}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.retencion_ganancias || false}
                      onChange={handleSwitchChange('retencion_ganancias')}
                    />
                  }
                  label="Retención Ganancias"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Porcentaje Retención Ganancias (%)"
                  type="number"
                  value={data.porcentaje_retencion_ganancias || 0.00}
                  onChange={handleChange('porcentaje_retencion_ganancias')}
                  error={!!errors.porcentaje_retencion_ganancias}
                  helperText={errors.porcentaje_retencion_ganancias}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Contacto Comercial */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ContactIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Contacto Comercial</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del Contacto"
                  value={data.contacto_nombre || ''}
                  onChange={handleChange('contacto_nombre')}
                  error={!!errors.contacto_nombre}
                  helperText={errors.contacto_nombre}
                  placeholder="Nombre del contacto comercial"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cargo del Contacto"
                  value={data.contacto_cargo || ''}
                  onChange={handleChange('contacto_cargo')}
                  error={!!errors.contacto_cargo}
                  helperText={errors.contacto_cargo}
                  placeholder="Cargo del contacto"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono del Contacto"
                  value={data.contacto_telefono || ''}
                  onChange={handleChange('contacto_telefono')}
                  error={!!errors.contacto_telefono}
                  helperText={errors.contacto_telefono}
                  placeholder="(011) 1234-5678"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email del Contacto"
                  type="email"
                  value={data.contacto_email || ''}
                  onChange={handleChange('contacto_email')}
                  error={!!errors.contacto_email}
                  helperText={errors.contacto_email}
                  placeholder="contacto@proveedor.com"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Celular del Contacto"
                  value={data.contacto_celular || ''}
                  onChange={handleChange('contacto_celular')}
                  error={!!errors.contacto_celular}
                  helperText={errors.contacto_celular}
                  placeholder="(011) 15-1234-5678"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Horarios */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ScheduleIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Horarios</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora de Apertura"
                  type="time"
                  value={data.hora_apertura || ''}
                  onChange={handleChange('hora_apertura')}
                  error={!!errors.hora_apertura}
                  helperText={errors.hora_apertura}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora de Cierre"
                  type="time"
                  value={data.hora_cierre || ''}
                  onChange={handleChange('hora_cierre')}
                  error={!!errors.hora_cierre}
                  helperText={errors.hora_cierre}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
          • Los proveedores activos están disponibles para compras<br />
          • La información bancaria es opcional pero recomendada<br />
          • Los horarios ayudan a planificar las compras<br />
          • La información fiscal es necesaria para facturación
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default ProveedorForm; 