<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\RecordsAudit;

class MedicationLibrary extends Model
{
    use HasFactory, RecordsAudit;

    protected $table = 'medication_library';
    protected $primaryKey = 'medication_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'category',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
