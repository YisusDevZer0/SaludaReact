#!/bin/bash

# Script de configuración para la funcionalidad Almacenes - SaludaReact
# Ejecuta las migraciones y seeders necesarios

echo "🏗️  Configurando funcionalidad Almacenes para SaludaReact..."
echo "================================================="

# Cambiar al directorio del backend
cd SaludaBack

echo "📦 Ejecutando migraciones..."
# Ejecutar la migración de almacenes
php artisan migrate --path=database/migrations/2024_01_15_000004_create_almacenes_table.php

if [ $? -eq 0 ]; then
    echo "✅ Migración de almacenes ejecutada exitosamente"
else
    echo "❌ Error al ejecutar la migración de almacenes"
    exit 1
fi

echo ""
echo "🌱 Ejecutando seeders..."
# Ejecutar el seeder de almacenes
php artisan db:seed --class=AlmacenSeeder

if [ $? -eq 0 ]; then
    echo "✅ Seeder de almacenes ejecutado exitosamente"
else
    echo "❌ Error al ejecutar el seeder de almacenes"
    exit 1
fi

echo ""
echo "🔍 Verificando datos creados..."
# Verificar que los datos se crearon correctamente
php artisan tinker --execute="
\$count = App\Models\Almacen::count();
echo \"Total de almacenes creados: \$count\n\";

\$tipos = App\Models\Almacen::select('Tipo')->distinct()->pluck('Tipo');
echo \"Tipos de almacenes: \" . \$tipos->implode(', ') . \"\n\";

\$activos = App\Models\Almacen::where('Estado', 'Activo')->count();
echo \"Almacenes activos: \$activos\n\";
"

echo ""
echo "🎉 ¡Configuración completada exitosamente!"
echo ""
echo "📋 Resumen de la implementación:"
echo "   ✅ Migración de base de datos"
echo "   ✅ Modelo Almacen con relaciones y scopes"
echo "   ✅ Controlador CRUD con endpoints especializados"
echo "   ✅ Form Request con validaciones"
echo "   ✅ API Resources para serialización"
echo "   ✅ Rutas protegidas configuradas"
echo "   ✅ Factory y Seeder con datos realistas"
echo "   ✅ Servicio API frontend"
echo "   ✅ Componente AlmacenesTable con CRUD"
echo "   ✅ Integración con sistema de rutas y menú"
echo ""
echo "🌐 Acceso:"
echo "   Frontend: http://localhost:3000/admin/almacenes/gestion"
echo "   API: http://localhost:8000/api/almacenes"
echo ""
echo "📊 Características implementadas:"
echo "   • CRUD completo (Crear, Leer, Actualizar, Eliminar)"
echo "   • Filtros avanzados por tipo, estado, responsable"
echo "   • Búsqueda por texto libre"
echo "   • Paginación del lado del servidor"
echo "   • Ordenamiento por columnas"
echo "   • Validaciones tanto frontend como backend"
echo "   • Gestión de estados masiva"
echo "   • Estadísticas en tiempo real"
echo "   • Interfaz responsive con Material UI"
echo "   • Notificaciones con SweetAlert2"
echo ""
echo "🔧 Tipos de almacenes soportados:"
echo "   • Servicios Médicos"
echo "   • Insumos Médicos" 
echo "   • Medicamentos"
echo "   • Equipos Médicos"
echo "   • Materiales"
echo "   • Consumibles"
echo ""
echo "⚡ ¡La funcionalidad está lista para usar!" 