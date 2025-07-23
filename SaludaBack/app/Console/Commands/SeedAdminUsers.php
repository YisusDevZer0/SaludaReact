<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SeedAdminUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:admin-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ejecuta el seeder para crear usuarios administrativos específicos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🌱 Ejecutando AdminUsersSeeder...');
        
        try {
            $this->call('db:seed', ['--class' => 'AdminUsersSeeder']);
            $this->info('✅ Usuarios administrativos creados exitosamente');
        } catch (\Exception $e) {
            $this->error('❌ Error al crear usuarios administrativos: ' . $e->getMessage());
        }
    }
}
