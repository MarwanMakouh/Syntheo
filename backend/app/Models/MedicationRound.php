<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\RecordsAudit;

class MedicationRound extends Model
{
    use HasFactory, RecordsAudit;

    protected $table = 'medication_rounds';
    protected $primaryKey = 'round_id';

    public $timestamps = false;

    protected $fillable = [
        'schedule_id',
        'res_medication_id',
        'resident_id',
        'status',
        'notes',
        'given_by',
        'given_at',
    ];

    protected $casts = [
        'given_at' => 'datetime',
    ];

    public function schedule()
    {
        return $this->belongsTo(ResSchedule::class, 'schedule_id', 'schedule_id');
    }

    public function resMedication()
    {
        return $this->belongsTo(ResMedication::class, 'res_medication_id', 'res_medication_id');
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class, 'resident_id', 'resident_id');
    }

    public function givenBy()
    {
        return $this->belongsTo(User::class, 'given_by', 'user_id');
    }
}
