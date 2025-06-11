import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';

const ModalNuevaSucursal = ({ open, onClose, onSubmit, form, onChange }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Icon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }}>add_business</Icon>
      Nueva Sucursal
    </DialogTitle>
    <form onSubmit={onSubmit} autoComplete="off">
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            name="nombre"
            label="Nombre"
            fullWidth
            required
            value={form.nombre}
            onChange={onChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>store</Icon>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="direccion"
            label="Dirección"
            fullWidth
            required
            value={form.direccion}
            onChange={onChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>location_on</Icon>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="telefono"
            label="Teléfono"
            fullWidth
            required
            value={form.telefono}
            onChange={onChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>phone</Icon>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="correo"
            label="Correo"
            type="email"
            fullWidth
            required
            value={form.correo}
            onChange={onChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>email</Icon>
                </InputAdornment>
              ),
            }}
          />
          <input type="hidden" name="creado_por" value={form.creado_por} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" color="primary">Guardar</Button>
      </DialogActions>
    </form>
  </Dialog>
);

export default ModalNuevaSucursal; 