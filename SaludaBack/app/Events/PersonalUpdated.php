<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PersonalUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $licencia;
    public $activeCount;
    public $totalCount;
    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct($licencia, $activeCount, $totalCount = null)
    {
        $this->licencia = $licencia;
        $this->activeCount = $activeCount;
        $this->totalCount = $totalCount;
        $this->message = "Se actualizó el conteo de personal en la licencia {$licencia}";
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('personal.licencia.' . $this->licencia),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'success' => true,
            'active' => $this->activeCount,
            'total' => $this->totalCount,
            'licencia' => $this->licencia,
            'message' => $this->message,
            'timestamp' => now()->toISOString()
        ];
    }
} 