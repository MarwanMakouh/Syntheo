<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class AuditLog extends Model
{
    protected $table = 'audit_logs';

    protected $guarded = [];

    // Disable timestamps since the table doesn't have created_at/updated_at
    public $timestamps = false;

    protected $casts = [
        'details' => 'array',
        'timestamp' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Support legacy tables that used `log_id` as primary key.
     */
    public function getKeyName()
    {
        if (Schema::hasColumn($this->getTable(), 'log_id')) {
            return 'log_id';
        }

        return parent::getKeyName();
    }
}
