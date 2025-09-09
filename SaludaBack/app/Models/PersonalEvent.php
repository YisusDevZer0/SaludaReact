<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PersonalEvent extends Model
{
    use HasFactory;

    protected $table = 'personal_events';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'event_date',
        'start_time',
        'end_time',
        'event_type',
        'color',
        'all_day',
        'location',
        'reminder_settings',
        'is_recurring',
        'recurrence_pattern',
        'recurrence_end_date',
        'status'
    ];

    protected $casts = [
        'event_date' => 'date',
        'start_time' => 'datetime:H:i:s',
        'end_time' => 'datetime:H:i:s',
        'all_day' => 'boolean',
        'is_recurring' => 'boolean',
        'reminder_settings' => 'array',
        'recurrence_end_date' => 'date'
    ];

    /**
     * Relación con el usuario propietario
     */
    public function user()
    {
        return $this->belongsTo(PersonalPos::class, 'user_id');
    }

    /**
     * Scope para filtrar por usuario
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope para filtrar por rango de fechas
     */
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('event_date', [$startDate, $endDate]);
    }

    /**
     * Scope para eventos activos
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope para eventos de hoy
     */
    public function scopeToday($query)
    {
        return $query->whereDate('event_date', today());
    }

    /**
     * Scope para eventos de esta semana
     */
    public function scopeThisWeek($query)
    {
        return $query->whereBetween('event_date', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    /**
     * Scope para eventos de este mes
     */
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('event_date', now()->month)
                    ->whereYear('event_date', now()->year);
    }
}
