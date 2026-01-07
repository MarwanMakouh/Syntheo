<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\RecordsAudit;

class Announcement extends Model
{
    use HasFactory, RecordsAudit;

    protected $table = 'announcements';
    protected $primaryKey = 'announcement_id';

    public $timestamps = false;

    protected $fillable = [
        'author_id',
        'title',
        'message',
        'recipient_type',
        'floor_id',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'user_id');
    }

    public function floor()
    {
        return $this->belongsTo(Floor::class, 'floor_id', 'floor_id');
    }

    public function recipients()
    {
        return $this->hasMany(AnnouncementRecipient::class, 'announcement_id', 'announcement_id');
    }
}
