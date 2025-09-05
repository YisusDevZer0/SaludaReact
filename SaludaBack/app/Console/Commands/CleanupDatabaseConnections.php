<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CleanupDatabaseConnections extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:cleanup-connections';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up inactive database connections';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            // Obtener información de conexiones activas
            $connections = DB::select("SHOW PROCESSLIST");
            $activeConnections = count($connections);
            
            $this->info("Active database connections: {$activeConnections}");
            
            // Limpiar conexiones inactivas (más de 5 minutos)
            $cleaned = DB::statement("
                KILL 
                (SELECT GROUP_CONCAT(ID) 
                 FROM INFORMATION_SCHEMA.PROCESSLIST 
                 WHERE Command = 'Sleep' 
                 AND Time > 300 
                 AND User = DATABASE()
                 AND ID != CONNECTION_ID())
            ");
            
            $this->info("Database connections cleaned up successfully");
            
            Log::info('Database connections cleaned up', [
                'active_connections' => $activeConnections,
                'cleaned' => $cleaned
            ]);
            
            return 0;
            
        } catch (\Exception $e) {
            $this->error("Error cleaning up connections: " . $e->getMessage());
            
            Log::error('Error cleaning up database connections', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return 1;
        }
    }
}
