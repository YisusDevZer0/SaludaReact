import HttpService from "./htttp.service";

class ProfileImageService {
  /**
   * Subir imagen de perfil
   */
  uploadProfileImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      // Usar axios directamente para archivos multipart
      const axios = require('axios');
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/profile/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        timeout: 30000 // 30 segundos para subida de archivos
      });

      return response.data;
    } catch (error) {
      console.error("Error al subir imagen de perfil:", error);
      
      // Manejar errores de validación específicos
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        if (validationErrors.image) {
          throw new Error(validationErrors.image[0] || 'Error de validación en la imagen');
        }
      }
      
      throw new Error(error.response?.data?.message || 'Error al subir la imagen');
    }
  };

  /**
   * Eliminar imagen de perfil
   */
  deleteProfileImage = async () => {
    try {
      const response = await HttpService.delete("profile/image/delete");
      return response;
    } catch (error) {
      console.error("Error al eliminar imagen de perfil:", error);
      throw error;
    }
  };

  /**
   * Obtener imagen de perfil
   */
  getProfileImage = async (userId = null) => {
    try {
      const endpoint = userId ? `profile/image/${userId}` : "profile/image";
      const response = await HttpService.get(endpoint);
      return response;
    } catch (error) {
      console.error("Error al obtener imagen de perfil:", error);
      throw error;
    }
  };

  /**
   * Generar URL de avatar por defecto usando UI Avatars
   */
  generateDefaultAvatar = (name, size = 200) => {
    const encodedName = encodeURIComponent(name || 'Usuario');
    return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=1976d2&color=fff&rounded=true&bold=true`;
  };

  /**
   * Validar archivo de imagen
   */
  validateImageFile = (file) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

    if (!file) {
      throw new Error('No se seleccionó ningún archivo');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Solo se permiten: JPEG, PNG, JPG, GIF');
    }

    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo 2MB');
    }

    return true;
  };

  /**
   * Comprimir imagen antes de subir
   */
  compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Configurar canvas
        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = URL.createObjectURL(file);
    });
  };
}

export default new ProfileImageService(); 