<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\RecordsAudit;

class Resident extends Model
{
    use HasFactory, RecordsAudit;

    protected $primaryKey = 'resident_id';

    protected $fillable = [
        'name',
        'date_of_birth',
        'photo_url',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    // Relationships
    public function room()
    {
        return $this->hasOne(Room::class, 'resident_id', 'resident_id');
    }

    public function allergies()
    {
        return $this->hasMany(Allergy::class, 'resident_id', 'resident_id');
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class, 'resident_id', 'resident_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'resident_id', 'resident_id');
    }

    public function diet()
    {
        return $this->hasOne(Diet::class, 'resident_id', 'resident_id');
    }

    public function medications()
    {
        return $this->hasMany(\App\Models\ResMedication::class, 'resident_id', 'resident_id');
    }

    // Helper method to get primary contact
    public function primaryContact()
    {
        return $this->hasOne(Contact::class, 'resident_id', 'resident_id')
            ->where('is_primary', true);
    }
}
