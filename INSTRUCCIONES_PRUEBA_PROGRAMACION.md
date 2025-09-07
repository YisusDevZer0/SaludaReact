# 🧪 Instrucciones para Probar la Nueva Interfaz de Programación

## 🚀 **Servidores en Ejecución**

### Backend (Laravel)
- **URL**: http://localhost:8000
- **Estado**: ✅ Ejecutándose
- **Rutas disponibles**: `/api/programacion/*`

### Frontend (React)
- **URL**: http://localhost:3000
- **Estado**: ✅ Ejecutándose
- **Ruta de programación**: `/admin-agendas/gestion-programaciones`

## 📋 **Pasos para Probar**

### 1. **Acceder a la Interfaz**
1. Abrir navegador en: `http://localhost:3000`
2. Iniciar sesión con credenciales válidas
3. Navegar a: **Agendas Médicas** → **Gestión de Programaciones**

### 2. **Crear una Nueva Programación**
1. Hacer clic en **"Nueva Programación"**
2. Llenar el formulario:
   - **Especialista**: Seleccionar de la lista
   - **Sucursal**: Seleccionar de la lista
   - **Tipo de Programación**: Regular/Temporal/Especial
   - **Fecha Inicio**: Seleccionar fecha
   - **Fecha Fin**: Seleccionar fecha
   - **Hora Inicio**: Seleccionar hora
   - **Hora Fin**: Seleccionar hora
   - **Intervalo**: 15, 30, 45, 60 minutos
3. Hacer clic en **"Crear Programación"**

### 3. **Aperturar Fechas**
1. En la lista de programaciones, buscar la creada
2. Hacer clic en **"Aperturar Fechas"**
3. En el modal:
   - Seleccionar las fechas que se quieren aperturar
   - Hacer clic en **"Aperturar Fechas Seleccionadas"**
4. Verificar que el estado cambie a **"Autorizar Horas"**

### 4. **Aperturar Horarios**
1. Hacer clic en **"Aperturar Horarios"**
2. En el modal de dos pasos:
   - **Paso 1**: Seleccionar las fechas aperturadas
   - **Paso 2**: Seleccionar los horarios específicos
3. Hacer clic en **"Aperturar Horarios"**

### 5. **Editar Programación**
1. Hacer clic en **"Editar"** en cualquier programación
2. Probar las funciones:
   - **Gestionar Fecha**: Aperturar/Eliminar/Editar fechas
   - **Gestionar Horario**: Aperturar/Eliminar/Editar horarios
   - **Agregar Fecha**: Añadir nuevas fechas
   - **Agregar Horarios**: Añadir horarios a fechas existentes

## 🔍 **Verificaciones Importantes**

### ✅ **Funcionalidades que Deben Funcionar**
- [ ] Crear programación nueva
- [ ] Listar programaciones existentes
- [ ] Filtrar por especialista, sucursal, estado
- [ ] Aperturar fechas (cambia estado a "Autorizar Horas")
- [ ] Aperturar horarios en fechas específicas
- [ ] Editar programaciones existentes
- [ ] Eliminar programaciones
- [ ] Ver estadísticas (Programadas vs Activas)

### ✅ **Estados de Programación**
- **Programada**: Programación creada, sin fechas aperturadas
- **Autorizar Horas**: Al menos una fecha aperturada
- **Activa**: Al menos un horario aperturado

### ✅ **Validaciones**
- Fechas de inicio no pueden ser posteriores a fechas de fin
- Horarios de inicio no pueden ser posteriores a horarios de fin
- Intervalos deben ser múltiplos de 15 minutos
- No se pueden aperturar horarios sin fechas aperturadas

## 🐛 **Posibles Errores y Soluciones**

### Error: "CORS Policy"
- **Solución**: Verificar que el backend esté ejecutándose en puerto 8000
- **Verificar**: `http://localhost:8000/api/programacion` debe responder

### Error: "404 Not Found"
- **Solución**: Verificar que las rutas estén registradas en `routes/api.php`
- **Verificar**: El controlador `ProgramacionController` existe

### Error: "Database Connection"
- **Solución**: Verificar conexión a base de datos
- **Verificar**: Las tablas `Programacion_MedicosExt`, `Fechas_EspecialistasExt`, `Horarios_Citas_Ext` existen

### Error: "Foreign Key Constraint"
- **Solución**: Verificar que los IDs de especialistas y sucursales existan
- **Verificar**: Tabla `especialistas` tiene datos válidos

## 📊 **Datos de Prueba Recomendados**

### Especialistas de Prueba
```sql
-- Verificar especialistas disponibles
SELECT Especialista_ID, Nombre_Completo FROM especialistas LIMIT 5;
```

### Sucursales de Prueba
```sql
-- Verificar sucursales disponibles
SELECT ID_Sucursal, Nombre_Sucursal FROM sucursales_mejoradas LIMIT 5;
```

## 🎯 **Casos de Prueba Específicos**

### Caso 1: Programación Regular
- Tipo: Regular
- Duración: 1 semana
- Intervalo: 30 minutos
- Horario: 9:00 - 17:00

### Caso 2: Programación Temporal
- Tipo: Temporal
- Duración: 3 días
- Intervalo: 60 minutos
- Horario: 14:00 - 18:00

### Caso 3: Edición de Programación
- Crear programación
- Aperturar algunas fechas
- Editar fechas existentes
- Agregar nuevas fechas
- Eliminar fechas

## 📝 **Reporte de Pruebas**

Después de completar las pruebas, documentar:

1. **Funcionalidades que funcionan correctamente**
2. **Errores encontrados**
3. **Sugerencias de mejora**
4. **Performance y velocidad de respuesta**
5. **Experiencia de usuario**

---

**¡Listo para probar! 🚀**
