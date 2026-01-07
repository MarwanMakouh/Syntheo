<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\RecordsAudit;

class Floor extends Model
{
    use HasFactory, RecordsAudit;

    protected $primaryKey = 'floor_id';

    protected $fillable = [
        'name',
        'description',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class, 'floor_id', 'floor_id');
    }
}
