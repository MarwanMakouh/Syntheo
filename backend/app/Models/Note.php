<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\RecordsAudit;

class Note extends Model
{
    use HasFactory, RecordsAudit;

    protected $primaryKey = 'note_id';

    public $timestamps = false;

    protected $fillable = [
        'resident_id',
        'author_id',
        'category',
        'urgency',
        'content',
        'is_resolved',
        'created_at',
        'resolved_at',
        'resolved_by',
    ];

    protected $casts = [
        'is_resolved' => 'boolean',
        'created_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    /**
     * Get the urgency attribute and map English values to Dutch
     */
    public function getUrgencyAttribute($value)
    {
        $mapping = [
            'high' => 'Hoog',
            'medium' => 'Matig',
            'low' => 'Laag',
        ];

        return $mapping[$value] ?? $value;
    }

    /**
     * Set the urgency attribute and map Dutch values to English for database storage
     */
    public function setUrgencyAttribute($value)
    {
        $mapping = [
            'Hoog' => 'high',
            'Matig' => 'medium',
            'Laag' => 'low',
        ];

        $this->attributes['urgency'] = $mapping[$value] ?? $value;
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class, 'resident_id', 'resident_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'user_id');
    }

    public function resolver()
    {
        return $this->belongsTo(User::class, 'resolved_by', 'user_id');
    }
}
