import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';

const initialForm = {
  Nombre_Apellidos: '',
  Correo_Electronico: '',
  Password: '',
  Telefono: '',
  Fecha_Nacimiento: '',
  Fk_Usuario: '',
  Fk_Sucursal: '',
  Estatus: 'Vigente',
  ColorEstatus: '#2BBB1D',
  ID_H_O_D: 'Saluda',
  AgregadoPor: 'Sistema',
  Perm_Elim: false,
  Perm_Edit: false,
  avatar_url: '',
};

const ModalNuevoPersonal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [roles, setRoles] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (open) {
      fetch('http://localhost:8000/api/roles-puestos?id_hod=Saluda')
        .then(res => res.json())
        .then(data => {
          const rolesVigentes = data.filter(rol => rol.Estado === 'Vigente');
          setRoles(rolesVigentes);
        })
        .catch(() => setRoles([]));
      
      fetch('http://localhost:8000/api/sucursales/activas')
        .then(res => res.json())
        .then(data => setSucursales(data.data || []))
        .catch(() => setSucursales([]));
    }
  }, [open]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('http://localhost:8000/api/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Manejar errores de validación del backend
        if (res.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(`Error de validación: ${errorMessages}`);
        }
        throw new Error(data.message || 'Error al crear personal');
      }
      
      setSuccess(data.message || 'Personal creado exitosamente');
      setForm(initialForm);
      
      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Icon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }}>person_add</Icon>
        Nuevo Personal
      </DialogTitle>
      <form onSubmit={handleSubmit} autoComplete="off">
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Nombre y Apellidos"
              name="Nombre_Apellidos"
              value={form.Nombre_Apellidos}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>person</Icon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Correo Electrónico"
              name="Correo_Electronico"
              value={form.Correo_Electronico}
              onChange={handleChange}
              fullWidth
              required
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>email</Icon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Contraseña"
              name="Password"
              value={form.Password}
              onChange={handleChange}
              fullWidth
              required
              type="password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>lock</Icon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Teléfono"
              name="Telefono"
              value={form.Telefono}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>phone</Icon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Fecha de Nacimiento"
              name="Fecha_Nacimiento"
              value={form.Fecha_Nacimiento}
              onChange={handleChange}
              fullWidth
              required
              type="date"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>calendar_today</Icon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Rol"
              name="Fk_Usuario"
              value={form.Fk_Usuario}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>badge</Icon>
                  </InputAdornment>
                ),
              }}
            >
              {roles.map(rol => (
                <MenuItem key={rol.ID_rol} value={rol.ID_rol}>{rol.Nombre_rol}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Sucursal"
              name="Fk_Sucursal"
              value={form.Fk_Sucursal}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>store</Icon>
                  </InputAdornment>
                ),
              }}
            >
              {sucursales.map(suc => (
                <MenuItem key={suc.ID_SucursalC} value={suc.ID_SucursalC}>{suc.Nombre_Sucursal}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Estatus"
              name="Estatus"
              value={form.Estatus}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>check_circle</Icon>
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="Vigente">Vigente</MenuItem>
              <MenuItem value="Baja">Baja</MenuItem>
            </TextField>
            <TextField
              label="Color Estatus"
              name="ColorEstatus"
              value={form.ColorEstatus}
              onChange={handleChange}
              fullWidth
              type="color"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>palette</Icon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Avatar URL"
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>image</Icon>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel control={<Checkbox checked={form.Perm_Elim} onChange={handleChange} name="Perm_Elim" />} label="Permiso Eliminar" />
            <FormControlLabel control={<Checkbox checked={form.Perm_Edit} onChange={handleChange} name="Perm_Edit" />} label="Permiso Editar" />
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginTop: 8, fontWeight: 'bold' }}>{success}</div>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} size="small">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" size="small" disabled={loading}>{loading ? <CircularProgress size={20} /> : 'Guardar'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalNuevoPersonal; 