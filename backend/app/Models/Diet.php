<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diet extends Model
{
    use HasFactory;

    protected $primaryKey = 'diet_id';

    public $timestamps = false;

    protected $fillable = [
        'resident_id',
        'diet_type',
        'description',
        'preferences',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'preferences' => 'array',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class, 'resident_id', 'resident_id');
    }
}
