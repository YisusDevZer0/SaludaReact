# 🐳 Guía de Instalación de Docker para Windows

## 📋 **Requisitos Previos**

### **1. Verificar requisitos del sistema:**
- Windows 10/11 Pro, Enterprise o Education (64-bit)
- WSL2 habilitado
- Virtualización habilitada en BIOS

### **2. Verificar si tu Windows soporta Docker:**
```powershell
# Abrir PowerShell como Administrador y ejecutar:
systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type"
```

## 🚀 **Instalación de Docker Desktop**

### **Opción 1: Descarga oficial (Recomendado)**

1. **Descargar Docker Desktop:**
   - Ve a: https://www.docker.com/products/docker-desktop/
   - Haz clic en "Download for Windows"
   - Descarga el archivo `.exe`

2. **Instalar Docker Desktop:**
   - Ejecuta el archivo descargado como Administrador
   - Sigue el asistente de instalación
   - **IMPORTANTE**: Marca la opción "Use WSL 2 instead of Hyper-V"

3. **Reiniciar el sistema**

### **Opción 2: Usando Chocolatey (si lo tienes instalado)**
```powershell
# Abrir PowerShell como Administrador
choco install docker-desktop
```

### **Opción 3: Usando Winget (Windows 10/11)**
```powershell
# Abrir PowerShell como Administrador
winget install Docker.DockerDesktop
```

## ⚙️ **Configuración Post-Instalación**

### **1. Habilitar WSL2 (si no está habilitado):**
```powershell
# Abrir PowerShell como Administrador
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### **2. Descargar e instalar WSL2 Linux kernel:**
- Descarga: https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
- Instala el archivo descargado

### **3. Configurar WSL2 como versión por defecto:**
```powershell
wsl --set-default-version 2
```

### **4. Reiniciar el sistema**

## 🔧 **Configuración de Docker Desktop**

### **1. Iniciar Docker Desktop:**
- Busca "Docker Desktop" en el menú de inicio
- Iniciar la aplicación
- Esperar a que termine de inicializar

### **2. Configurar para usar disco D (opcional):**
1. Abrir Docker Desktop
2. Ir a **Settings** (⚙️)
3. Ir a **Resources** → **Advanced**
4. Cambiar **Disk image location** a: `D:\DockerData`
5. Aplicar y reiniciar

### **3. Verificar la instalación:**
```bash
# Abrir Git Bash o PowerShell
docker --version
docker compose version
docker run hello-world
```

## 🧪 **Pruebas de Funcionamiento**

### **1. Verificar que Docker funciona:**
```bash
# Probar Docker
docker run hello-world

# Ver información del sistema
docker info

# Ver versiones
docker --version
docker compose version
```

### **2. Probar con tu proyecto:**
```bash
# Navegar a tu proyecto
cd /c/Users/chuch/OneDrive/Documentos/SaludaReact

# Probar el comando de Docker Compose
docker compose -f docker-compose.dev.yml up -d --build
```

## 🚨 **Solución de Problemas Comunes**

### **Problema 1: "Docker Desktop is not running"**
**Solución:**
1. Abrir Docker Desktop
2. Esperar a que termine de inicializar
3. Verificar que el ícono de Docker esté verde

### **Problema 2: "WSL2 is not available"**
**Solución:**
```powershell
# Verificar estado de WSL
wsl --status

# Si no está habilitado, habilitarlo:
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all
```

### **Problema 3: "Virtualization is not enabled"**
**Solución:**
1. Reiniciar y entrar a BIOS/UEFI
2. Habilitar Virtualization Technology (VT-x/AMD-V)
3. Guardar y reiniciar

### **Problema 4: "docker-compose command not found"**
**Solución:**
```bash
# Usar el comando moderno
docker compose up -d

# O instalar docker-compose por separado
pip install docker-compose
```

## 📊 **Verificación Final**

### **Comandos para verificar que todo funciona:**
```bash
# Verificar Docker
docker --version
docker info

# Verificar Docker Compose
docker compose version

# Probar con un contenedor simple
docker run --rm hello-world

# Verificar que puedes construir imágenes
docker build --help
```

### **Verificar con tu proyecto:**
```bash
# Navegar al proyecto
cd /c/Users/chuch/OneDrive/Documentos/SaludaReact

# Verificar archivos de Docker
ls -la docker-compose*.yml
ls -la SaludaFront/Dockerfile*
ls -la SaludaBack/Dockerfile*

# Probar construcción
docker compose -f docker-compose.dev.yml build
```

## 🎯 **Próximos Pasos**

Una vez que Docker esté instalado y funcionando:

1. **Configurar variables de entorno:**
   ```bash
   cp env.example .env
   # Editar .env con tus credenciales
   ```

2. **Ejecutar el proyecto:**
   ```bash
   # Desarrollo
   docker compose -f docker-compose.dev.yml up -d --build
   
   # Producción
   docker compose up -d --build
   ```

3. **Verificar que funciona:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

## 📞 **Soporte**

Si tienes problemas:
1. Verificar que Docker Desktop esté ejecutándose
2. Revisar los logs de Docker Desktop
3. Reiniciar Docker Desktop
4. Reiniciar el sistema si es necesario

## 🔗 **Enlaces Útiles**

- [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/)
- [Documentación oficial de Docker](https://docs.docker.com/)
- [WSL2 Installation Guide](https://docs.microsoft.com/en-us/windows/wsl/install) 