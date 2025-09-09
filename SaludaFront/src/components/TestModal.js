import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';

const TestModal = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained">
        Probar Modal
      </Button>
      
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: { 
            minHeight: '90vh',
            maxHeight: '95vh',
            width: '95vw !important',
            maxWidth: 'none !important',
            minWidth: '1200px !important'
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6">
            Modal de Prueba - Versión Actualizada
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Este es un modal de prueba para verificar que los cambios se están aplicando correctamente.
            El modal debería ser mucho más ancho que antes.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestModal;
