<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class AuditLog extends Model
{
    protected $table = 'audit_logs';

    protected $guarded = [];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'details' => 'array',
        'timestamp' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
