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
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';

const ProductoForm = ({ data, errors, onChange, editing = false }) => {
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [componentesActivos, setComponentesActivos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

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
      { id: 1, nombre: 'Medicamentos' },
      { id: 2, nombre: 'Insumos' },
      { id: 3, nombre: 'Equipos' }
    ]);
    setMarcas([
      { Marca_ID: 1, Nom_Marca: 'Marca 1' },
      { Marca_ID: 2, Nom_Marca: 'Marca 2' }
    ]);
    setPresentaciones([
      { id: 1, nombre: 'Comprimido' },
      { id: 2, nombre: 'Cápsula' },
      { id: 3, nombre: 'Jarabe' }
    ]);
    setComponentesActivos([
      { id: 1, nombre: 'Paracetamol' },
      { id: 2, nombre: 'Ibuprofeno' }
    ]);
    setProveedores([
      { id: 1, razon_social: 'Proveedor 1' },
      { id: 2, razon_social: 'Proveedor 2' }
    ]);
  }, []);

  return (
    <MDBox>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MDTypography variant="h6" color="info" gutterBottom>
            {editing ? 'Editar Producto' : 'Nuevo Producto'}
          </MDTypography>
        </Grid>

        {/* Información Básica */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <CategoryIcon sx={{ mr: 1 }} />
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
                  placeholder="Ingrese el código del producto..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Código de Barras"
                  value={data.codigo_barras || ''}
                  onChange={handleChange('codigo_barras')}
                  error={!!errors.codigo_barras}
                  helperText={errors.codigo_barras}
                  placeholder="Código de barras opcional..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del Producto"
                  value={data.nombre || ''}
                  onChange={handleChange('nombre')}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  required
                  placeholder="Ingrese el nombre del producto..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={data.descripcion || ''}
                  onChange={handleChange('descripcion')}
                  multiline
                  rows={3}
                  placeholder="Descripción del producto..."
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoria_id}>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={data.categoria_id || ''}
                    onChange={handleChange('categoria_id')}
                    label="Categoría"
                  >
                    <MenuItem value="">Seleccionar categoría</MenuItem>
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoria_id && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.categoria_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.marca_id}>
                  <InputLabel>Marca</InputLabel>
                  <Select
                    value={data.marca_id || ''}
                    onChange={handleChange('marca_id')}
                    label="Marca"
                  >
                    <MenuItem value="">Seleccionar marca</MenuItem>
                    {marcas.map((marca) => (
                      <MenuItem key={marca.Marca_ID} value={marca.Marca_ID}>
                        {marca.Nom_Marca}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.marca_id && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.marca_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.presentacion_id}>
                  <InputLabel>Presentación</InputLabel>
                  <Select
                    value={data.presentacion_id || ''}
                    onChange={handleChange('presentacion_id')}
                    label="Presentación"
                  >
                    <MenuItem value="">Seleccionar presentación</MenuItem>
                    {presentaciones.map((presentacion) => (
                      <MenuItem key={presentacion.id} value={presentacion.id}>
                        {presentacion.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.presentacion_id && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.presentacion_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.componente_activo_id}>
                  <InputLabel>Componente Activo</InputLabel>
                  <Select
                    value={data.componente_activo_id || ''}
                    onChange={handleChange('componente_activo_id')}
                    label="Componente Activo"
                  >
                    <MenuItem value="">Seleccionar componente</MenuItem>
                    {componentesActivos.map((componente) => (
                      <MenuItem key={componente.id} value={componente.id}>
                        {componente.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.componente_activo_id && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.componente_activo_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Precios y Comercialización */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <MoneyIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Precios y Comercialización</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Precio de Venta"
                  type="number"
                  value={data.precio_venta || ''}
                  onChange={handleChange('precio_venta')}
                  error={!!errors.precio_venta}
                  helperText={errors.precio_venta}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Precio de Compra"
                  type="number"
                  value={data.precio_compra || ''}
                  onChange={handleChange('precio_compra')}
                  error={!!errors.precio_compra}
                  helperText={errors.precio_compra}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Precio por Mayor"
                  type="number"
                  value={data.precio_por_mayor || ''}
                  onChange={handleChange('precio_por_mayor')}
                  error={!!errors.precio_por_mayor}
                  helperText={errors.precio_por_mayor}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Margen de Ganancia (%)"
                  type="number"
                  value={data.margen_ganancia || ''}
                  onChange={handleChange('margen_ganancia')}
                  error={!!errors.margen_ganancia}
                  helperText={errors.margen_ganancia}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="IVA (%)"
                  type="number"
                  value={data.iva || 21.00}
                  onChange={handleChange('iva')}
                  error={!!errors.iva}
                  helperText={errors.iva}
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

        {/* Inventario */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <InventoryIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Inventario</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.inventariable !== undefined ? data.inventariable : true}
                      onChange={handleSwitchChange('inventariable')}
                    />
                  }
                  label="Inventariable"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.visible_en_pos !== undefined ? data.visible_en_pos : true}
                      onChange={handleSwitchChange('visible_en_pos')}
                    />
                  }
                  label="Visible en POS"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock Mínimo"
                  type="number"
                  value={data.stock_minimo || 0}
                  onChange={handleChange('stock_minimo')}
                  error={!!errors.stock_minimo}
                  helperText={errors.stock_minimo}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock Máximo"
                  type="number"
                  value={data.stock_maximo || ''}
                  onChange={handleChange('stock_maximo')}
                  error={!!errors.stock_maximo}
                  helperText={errors.stock_maximo}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock Actual"
                  type="number"
                  value={data.stock_actual || 0}
                  onChange={handleChange('stock_actual')}
                  error={!!errors.stock_actual}
                  helperText={errors.stock_actual}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.unidad_medida}>
                  <InputLabel>Unidad de Medida</InputLabel>
                  <Select
                    value={data.unidad_medida || 'unidad'}
                    onChange={handleChange('unidad_medida')}
                    label="Unidad de Medida"
                  >
                    <MenuItem value="unidad">Unidad</MenuItem>
                    <MenuItem value="caja">Caja</MenuItem>
                    <MenuItem value="blister">Blister</MenuItem>
                    <MenuItem value="ampolla">Ampolla</MenuItem>
                    <MenuItem value="vial">Vial</MenuItem>
                    <MenuItem value="comprimido">Comprimido</MenuItem>
                    <MenuItem value="capsula">Cápsula</MenuItem>
                    <MenuItem value="ml">Mililitros</MenuItem>
                    <MenuItem value="mg">Miligramos</MenuItem>
                    <MenuItem value="g">Gramos</MenuItem>
                    <MenuItem value="kg">Kilogramos</MenuItem>
                    <MenuItem value="l">Litros</MenuItem>
                  </Select>
                  {errors.unidad_medida && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.unidad_medida}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ubicación en Almacén"
                  value={data.ubicacion_almacen || ''}
                  onChange={handleChange('ubicacion_almacen')}
                  error={!!errors.ubicacion_almacen}
                  helperText={errors.ubicacion_almacen}
                  placeholder="Ej: Estante A, Nivel 2"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.permitir_venta_sin_stock || false}
                      onChange={handleSwitchChange('permitir_venta_sin_stock')}
                    />
                  }
                  label="Permitir venta sin stock"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.requiere_receta || false}
                      onChange={handleSwitchChange('requiere_receta')}
                    />
                  }
                  label="Requiere receta"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Proveedor */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <BusinessIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Proveedor</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.proveedor_id}>
                  <InputLabel>Proveedor</InputLabel>
                  <Select
                    value={data.proveedor_id || ''}
                    onChange={handleChange('proveedor_id')}
                    label="Proveedor"
                  >
                    <MenuItem value="">Seleccionar proveedor</MenuItem>
                    {proveedores.map((proveedor) => (
                      <MenuItem key={proveedor.id} value={proveedor.id}>
                        {proveedor.razon_social}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.proveedor_id && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.proveedor_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Código del Proveedor"
                  value={data.codigo_proveedor || ''}
                  onChange={handleChange('codigo_proveedor')}
                  error={!!errors.codigo_proveedor}
                  helperText={errors.codigo_proveedor}
                  placeholder="Código asignado por el proveedor"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Precio del Proveedor"
                  type="number"
                  value={data.precio_proveedor || ''}
                  onChange={handleChange('precio_proveedor')}
                  error={!!errors.precio_proveedor}
                  helperText={errors.precio_proveedor}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tiempo de Entrega (días)"
                  type="number"
                  value={data.tiempo_entrega_dias || ''}
                  onChange={handleChange('tiempo_entrega_dias')}
                  error={!!errors.tiempo_entrega_dias}
                  helperText={errors.tiempo_entrega_dias}
                  inputProps={{ min: 0 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>días</Typography>
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Estado */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <InfoIcon sx={{ mr: 1 }} />
            <MDTypography variant="h6">Estado y Control</MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.estado}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={data.estado || 'activo'}
                    onChange={handleChange('estado')}
                    label="Estado"
                  >
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                    <MenuItem value="descontinuado">Descontinuado</MenuItem>
                    <MenuItem value="agotado">Agotado</MenuItem>
                  </Select>
                  {errors.estado && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.estado}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.controlado_por_lote || false}
                      onChange={handleSwitchChange('controlado_por_lote')}
                    />
                  }
                  label="Controlado por lote"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.controlado_por_fecha_vencimiento || false}
                      onChange={handleSwitchChange('controlado_por_fecha_vencimiento')}
                    />
                  }
                  label="Controlado por fecha de vencimiento"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vida Útil (días)"
                  type="number"
                  value={data.vida_util_dias || ''}
                  onChange={handleChange('vida_util_dias')}
                  error={!!errors.vida_util_dias}
                  helperText={errors.vida_util_dias}
                  inputProps={{ min: 0 }}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>días</Typography>
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
          • Los productos activos están disponibles para venta<br />
          • Los productos inventariables requieren control de stock<br />
          • Los productos con receta requieren prescripción médica
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default ProductoForm; 