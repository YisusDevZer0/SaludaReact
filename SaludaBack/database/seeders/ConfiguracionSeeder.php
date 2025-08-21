<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Configuracion;

class ConfiguracionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tabla de configuraciones
        DB::table('configuraciones')->truncate();

        $configuraciones = [
            // Configuraciones Generales
            [
                'clave' => 'app_name',
                'valor' => 'SaludaReact',
                'descripcion' => 'Nombre de la aplicación',
                'tipo' => 'string',
                'categoria' => 'general',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'app_description',
                'valor' => 'Sistema Médico-Comercial Integral',
                'descripcion' => 'Descripción de la aplicación',
                'tipo' => 'string',
                'categoria' => 'general',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'app_version',
                'valor' => '1.0.0',
                'descripcion' => 'Versión actual de la aplicación',
                'tipo' => 'string',
                'categoria' => 'general',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'app_timezone',
                'valor' => 'America/Mexico_City',
                'descripcion' => 'Zona horaria de la aplicación',
                'tipo' => 'string',
                'categoria' => 'general',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'app_locale',
                'valor' => 'es',
                'descripcion' => 'Idioma por defecto de la aplicación',
                'tipo' => 'string',
                'categoria' => 'general',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Configuraciones del Sistema
            [
                'clave' => 'maintenance_mode',
                'valor' => 'false',
                'descripcion' => 'Modo mantenimiento del sistema',
                'tipo' => 'boolean',
                'categoria' => 'sistema',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'debug_mode',
                'valor' => 'true',
                'descripcion' => 'Modo debug para desarrollo',
                'tipo' => 'boolean',
                'categoria' => 'sistema',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'session_timeout',
                'valor' => '3600',
                'descripcion' => 'Tiempo de sesión en segundos',
                'tipo' => 'integer',
                'categoria' => 'sistema',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'max_login_attempts',
                'valor' => '5',
                'descripcion' => 'Máximo número de intentos de login',
                'tipo' => 'integer',
                'categoria' => 'sistema',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'password_expiry_days',
                'valor' => '90',
                'descripcion' => 'Días de expiración de contraseña',
                'tipo' => 'integer',
                'categoria' => 'sistema',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Configuraciones de Aplicación
            [
                'clave' => 'default_page_size',
                'valor' => '15',
                'descripcion' => 'Tamaño de página por defecto en tablas',
                'tipo' => 'integer',
                'categoria' => 'aplicacion',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'enable_dark_mode',
                'valor' => 'true',
                'descripcion' => 'Habilitar modo oscuro',
                'tipo' => 'boolean',
                'categoria' => 'aplicacion',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'enable_notifications',
                'valor' => 'true',
                'descripcion' => 'Habilitar notificaciones del sistema',
                'tipo' => 'boolean',
                'categoria' => 'aplicacion',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'auto_logout_minutes',
                'valor' => '30',
                'descripcion' => 'Minutos para auto-logout por inactividad',
                'tipo' => 'integer',
                'categoria' => 'aplicacion',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Configuraciones de Notificaciones
            [
                'clave' => 'email_notifications',
                'valor' => 'true',
                'descripcion' => 'Habilitar notificaciones por email',
                'tipo' => 'boolean',
                'categoria' => 'notificaciones',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'sms_notifications',
                'valor' => 'false',
                'descripcion' => 'Habilitar notificaciones por SMS',
                'tipo' => 'boolean',
                'categoria' => 'notificaciones',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'push_notifications',
                'valor' => 'true',
                'descripcion' => 'Habilitar notificaciones push',
                'tipo' => 'boolean',
                'categoria' => 'notificaciones',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'notification_sound',
                'valor' => 'true',
                'descripcion' => 'Habilitar sonido en notificaciones',
                'tipo' => 'boolean',
                'categoria' => 'notificaciones',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Configuraciones de Backup
            [
                'clave' => 'auto_backup',
                'valor' => 'true',
                'descripcion' => 'Habilitar backup automático',
                'tipo' => 'boolean',
                'categoria' => 'backup',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'backup_frequency',
                'valor' => 'daily',
                'descripcion' => 'Frecuencia de backup (daily, weekly, monthly)',
                'tipo' => 'string',
                'categoria' => 'backup',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'backup_retention_days',
                'valor' => '30',
                'descripcion' => 'Días de retención de backups',
                'tipo' => 'integer',
                'categoria' => 'backup',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'backup_include_files',
                'valor' => 'true',
                'descripcion' => 'Incluir archivos en el backup',
                'tipo' => 'boolean',
                'categoria' => 'backup',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Configuraciones de Seguridad
            [
                'clave' => 'two_factor_auth',
                'valor' => 'false',
                'descripcion' => 'Habilitar autenticación de dos factores',
                'tipo' => 'boolean',
                'categoria' => 'seguridad',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'ip_whitelist',
                'valor' => '[]',
                'descripcion' => 'Lista blanca de IPs permitidas',
                'tipo' => 'json',
                'categoria' => 'seguridad',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'session_regenerate',
                'valor' => 'true',
                'descripcion' => 'Regenerar ID de sesión en cada request',
                'tipo' => 'boolean',
                'categoria' => 'seguridad',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Configuraciones de Facturación
            [
                'clave' => 'company_name',
                'valor' => 'Saluda Servicios Médicos S.A. de C.V.',
                'descripcion' => 'Nombre de la empresa',
                'tipo' => 'string',
                'categoria' => 'facturacion',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'company_rfc',
                'valor' => 'XAXX010101000',
                'descripcion' => 'RFC de la empresa',
                'tipo' => 'string',
                'categoria' => 'facturacion',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'invoice_series',
                'valor' => 'A',
                'descripcion' => 'Serie de facturas',
                'tipo' => 'string',
                'categoria' => 'facturacion',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'next_invoice_number',
                'valor' => '1001',
                'descripcion' => 'Siguiente número de factura',
                'tipo' => 'integer',
                'categoria' => 'facturacion',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'tax_rate',
                'valor' => '16',
                'descripcion' => 'Porcentaje de IVA',
                'tipo' => 'integer',
                'categoria' => 'facturacion',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Configuraciones de Inventario
            [
                'clave' => 'low_stock_threshold',
                'valor' => '10',
                'descripcion' => 'Umbral de stock bajo para alertas',
                'tipo' => 'integer',
                'categoria' => 'inventario',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'expiry_alert_days',
                'valor' => '30',
                'descripcion' => 'Días de anticipación para alertas de vencimiento',
                'tipo' => 'integer',
                'categoria' => 'inventario',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'auto_reorder',
                'valor' => 'false',
                'descripcion' => 'Habilitar reorden automático',
                'tipo' => 'boolean',
                'categoria' => 'inventario',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Configuraciones de Citas
            [
                'clave' => 'appointment_duration',
                'valor' => '30',
                'descripcion' => 'Duración por defecto de citas en minutos',
                'tipo' => 'integer',
                'categoria' => 'citas',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'reminder_hours',
                'valor' => '24',
                'descripcion' => 'Horas de anticipación para recordatorios de citas',
                'tipo' => 'integer',
                'categoria' => 'citas',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'cancellation_hours',
                'valor' => '2',
                'descripcion' => 'Horas mínimas para cancelar una cita',
                'tipo' => 'integer',
                'categoria' => 'citas',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Configuraciones de Reportes
            [
                'clave' => 'report_retention_days',
                'valor' => '365',
                'descripcion' => 'Días de retención de reportes',
                'tipo' => 'integer',
                'categoria' => 'reportes',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'auto_generate_reports',
                'valor' => 'true',
                'descripcion' => 'Generar reportes automáticamente',
                'tipo' => 'boolean',
                'categoria' => 'reportes',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'clave' => 'report_format',
                'valor' => 'pdf',
                'descripcion' => 'Formato por defecto de reportes (pdf, excel)',
                'tipo' => 'string',
                'categoria' => 'reportes',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insertar configuraciones
        foreach ($configuraciones as $config) {
            Configuracion::create($config);
        }

        $this->command->info('Configuraciones del sistema sembradas exitosamente.');
    }
}
