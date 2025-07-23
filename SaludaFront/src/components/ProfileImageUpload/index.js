import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// @mui icons
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAvatar from 'components/MDAvatar';

// Services
import ProfileImageService from 'services/profile-image-service';

function ProfileImageUpload({ 
  currentImageUrl, 
  userName, 
  onImageUpdate, 
  size = 'lg',
  showUploadButton = true,
  showDeleteButton = true,
  disabled = false 
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  // Función para generar iniciales
  const getInitials = (name) => {
    if (!name) return 'U';
    
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    } else if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Función para generar avatar por defecto
  const generateDefaultAvatar = () => {
    if (!userName) return null;
    return ProfileImageService.generateDefaultAvatar(userName);
  };

  // Manejar selección de archivo
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setError(null);
      setSuccess(null);
      setUploading(true);

      // Validar archivo
      ProfileImageService.validateImageFile(file);

      // Comprimir imagen
      const compressedFile = await ProfileImageService.compressImage(file);

      // Subir imagen
      const response = await ProfileImageService.uploadProfileImage(compressedFile);

      if (response.success) {
        setSuccess('Imagen de perfil actualizada exitosamente');
        if (onImageUpdate) {
          onImageUpdate(response.data.foto_perfil);
        }
      } else {
        setError(response.message || 'Error al subir la imagen');
      }
    } catch (error) {
      setError(error.message || 'Error al procesar la imagen');
    } finally {
      setUploading(false);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Manejar eliminación de imagen
  const handleDeleteImage = async () => {
    try {
      setError(null);
      setSuccess(null);
      setUploading(true);

      const response = await ProfileImageService.deleteProfileImage();

      if (response.success) {
        setSuccess('Imagen de perfil eliminada exitosamente');
        if (onImageUpdate) {
          onImageUpdate(null);
        }
      } else {
        setError(response.message || 'Error al eliminar la imagen');
      }
    } catch (error) {
      setError(error.message || 'Error al eliminar la imagen');
    } finally {
      setUploading(false);
    }
  };

  // Manejar clic en avatar para subir
  const handleAvatarClick = () => {
    if (!disabled && showUploadButton && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <MDBox display="flex" flexDirection="column" alignItems="center" gap={2}>
      {/* Input oculto para seleccionar archivo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />

      {/* Avatar */}
      <MDBox position="relative" display="flex" justifyContent="center">
        <MDAvatar
          src={currentImageUrl || generateDefaultAvatar()}
          alt={userName || 'Usuario'}
          size={size}
          bgColor={currentImageUrl ? "transparent" : "info"}
          sx={{
            cursor: !disabled && showUploadButton ? 'pointer' : 'default',
            '&:hover': {
              opacity: !disabled && showUploadButton ? 0.8 : 1,
            },
            border: ({ borders: { borderWidth }, palette: { white } }) => 
              `${borderWidth[2]} solid ${white.main}`,
          }}
          onClick={handleAvatarClick}
        >
          {!currentImageUrl && !generateDefaultAvatar() && getInitials(userName)}
        </MDAvatar>

        {/* Indicador de carga */}
        {uploading && (
          <MDBox
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            <CircularProgress size={24} />
          </MDBox>
        )}

        {/* Botón de editar */}
        {showUploadButton && !disabled && !uploading && (
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
            onClick={handleAvatarClick}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}

        {/* Botón de eliminar */}
        {showDeleteButton && currentImageUrl && !disabled && !uploading && (
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'error.dark',
              },
            }}
            onClick={handleDeleteImage}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </MDBox>

      {/* Botones de acción */}
      <MDBox display="flex" gap={1} flexWrap="wrap" justifyContent="center">
        {showUploadButton && !disabled && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<PhotoCamera />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Cambiar foto
          </Button>
        )}

        {showDeleteButton && currentImageUrl && !disabled && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteImage}
            disabled={uploading}
          >
            Eliminar
          </Button>
        )}
      </MDBox>

      {/* Mensajes de estado */}
      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ width: '100%', maxWidth: 400 }}>
          {success}
        </Alert>
      )}

      {/* Información de ayuda */}
      {!currentImageUrl && (
        <MDTypography variant="caption" color="text" textAlign="center">
          Haz clic en el avatar para subir una foto de perfil
        </MDTypography>
      )}
    </MDBox>
  );
}

ProfileImageUpload.propTypes = {
  currentImageUrl: PropTypes.string,
  userName: PropTypes.string,
  onImageUpdate: PropTypes.func,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  showUploadButton: PropTypes.bool,
  showDeleteButton: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ProfileImageUpload; 