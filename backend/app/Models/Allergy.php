<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\RecordsAudit;

class Allergy extends Model
{
    use HasFactory, RecordsAudit;

    protected $primaryKey = 'allergy_id';

    public $timestamps = false;

    protected $fillable = [
        'resident_id',
        'symptom',
        'severity',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class, 'resident_id', 'resident_id');
    }
}
