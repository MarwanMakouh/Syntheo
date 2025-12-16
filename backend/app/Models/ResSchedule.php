<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResSchedule extends Model
{
    use HasFactory;

    protected $table = 'res_schedule';
    protected $primaryKey = 'schedule_id';

    public $timestamps = false;

    protected $fillable = [
        'res_medication_id',
        'dosage',
        'instructions',
        'time_of_day',
        'day_of_week',
    ];

    protected $casts = [
        'time_of_day' => 'datetime:H:i',
    ];

    public function resMedication()
    {
        return $this->belongsTo(ResMedication::class, 'res_medication_id', 'res_medication_id');
    }

    public function medicationRounds()
    {
        return $this->hasMany(MedicationRound::class, 'schedule_id', 'schedule_id');
    }
}
