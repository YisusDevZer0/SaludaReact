<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PersonalPos;
use Illuminate\Support\Facades\DB;

class FixProfileImageUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'profile:fix-image-urls {--dry-run : Ejecutar sin hacer cambios}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Corregir URLs de imágenes de perfil en la base de datos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Verificando URLs de imágenes de perfil...');

        $users = PersonalPos::whereNotNull('foto_perfil')
            ->where('foto_perfil', '!=', '')
            ->get();

        if ($users->isEmpty()) {
            $this->info('✅ No se encontraron usuarios con imágenes de perfil.');
            return;
        }

        $this->info("📊 Se encontraron {$users->count()} usuarios con imágenes de perfil.");

        $dryRun = $this->option('dry-run');
        $updated = 0;
        $errors = 0;

        foreach ($users as $user) {
            $originalValue = $user->getRawOriginal('foto_perfil');
            $currentValue = $user->foto_perfil;

            $this->line("👤 Usuario: {$user->nombre} {$user->apellido} (ID: {$user->id})");
            $this->line("   Original: {$originalValue}");
            $this->line("   Actual: {$currentValue}");

            // Verificar si la URL actual es válida
            if ($currentValue && filter_var($currentValue, FILTER_VALIDATE_URL)) {
                $this->info("   ✅ URL válida - No requiere cambios");
                continue;
            }

            // Si es solo un nombre de archivo, verificar si el archivo existe
            if ($originalValue && strpos($originalValue, '/') === false) {
                $filePath = storage_path('app/public/profiles/' . $originalValue);
                
                if (file_exists($filePath)) {
                    $this->info("   📁 Archivo encontrado: {$originalValue}");
                    
                    if (!$dryRun) {
                        try {
                            // El mutator automáticamente convertirá el nombre del archivo a URL
                            $user->save();
                            $updated++;
                            $this->info("   ✅ Actualizado correctamente");
                        } catch (\Exception $e) {
                            $errors++;
                            $this->error("   ❌ Error al actualizar: " . $e->getMessage());
                        }
                    } else {
                        $this->info("   🔄 Se actualizaría en modo real");
                        $updated++;
                    }
                } else {
                    $this->warn("   ⚠️  Archivo no encontrado: {$filePath}");
                    $errors++;
                }
            } else {
                $this->warn("   ⚠️  Formato no reconocido: {$originalValue}");
                $errors++;
            }

            $this->line('');
        }

        $this->info('📈 Resumen:');
        $this->info("   ✅ Actualizados: {$updated}");
        $this->info("   ❌ Errores: {$errors}");

        if ($dryRun) {
            $this->info('🔍 Modo de prueba - No se realizaron cambios reales');
            $this->info('💡 Ejecuta sin --dry-run para aplicar los cambios');
        } else {
            $this->info('🎉 Proceso completado');
        }
    }
} 