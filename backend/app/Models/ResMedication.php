<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\RecordsAudit;

class ResMedication extends Model
{
    use HasFactory, RecordsAudit;

    protected $table = 'res_medication';
    protected $primaryKey = 'res_medication_id';

    protected $fillable = [
        'medication_id',
        'resident_id',
        'is_active',
        'end_date',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'end_date' => 'date',
    ];

    public function medication()
    {
        return $this->belongsTo(\App\Models\MedicationLibrary::class, 'medication_id', 'medication_id');
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class, 'resident_id', 'resident_id');
    }

    public function schedules()
    {
        return $this->hasMany(\App\Models\ResSchedule::class, 'res_medication_id', 'res_medication_id');
    }
}
