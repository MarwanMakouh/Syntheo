<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChangeRequest extends Model
{
    use HasFactory;

    protected $table = 'change_requests';
    protected $primaryKey = 'request_id';

    public $timestamps = false;

    protected $fillable = [
        'resident_id',
        'requester_id',
        'reviewer_id',
        'urgency',
        'status',
        'created_at',
        'reviewed_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class, 'resident_id', 'resident_id');
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id', 'user_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id', 'user_id');
    }

    public function changeFields()
    {
        return $this->hasMany(ChangeField::class, 'request_id', 'request_id');
    }
}
