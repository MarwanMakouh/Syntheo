<?php

namespace App\Models\Traits;

use App\Services\AuditLogger;

trait RecordsAudit
{
    public static function bootRecordsAudit()
    {
        static::created(function ($model) {
            try {
                AuditLogger::log('created', $model, auth()->check() ? auth()->user() : null, null, $model->getAttributes());
            } catch (\Throwable $e) {
            }
        });

        static::updated(function ($model) {
            try {
                $old = $model->getOriginal();
                $changes = $model->getChanges();
                AuditLogger::log('updated', $model, auth()->check() ? auth()->user() : null, $old, $changes);
            } catch (\Throwable $e) {
            }
        });

        static::deleted(function ($model) {
            try {
                AuditLogger::log('deleted', $model, auth()->check() ? auth()->user() : null, $model->getAttributes(), null);
            } catch (\Throwable $e) {
            }
        });

        // Register restore/forceDeleted only for models using SoftDeletes
        if (in_array(\Illuminate\Database\Eloquent\SoftDeletes::class, class_uses_recursive(static::class))) {
            static::restored(function ($model) {
                try {
                    AuditLogger::log('restored', $model, auth()->check() ? auth()->user() : null, null, $model->getAttributes());
                } catch (\Throwable $e) {
                }
            });

            static::forceDeleted(function ($model) {
                try {
                    AuditLogger::log('force_deleted', $model, auth()->check() ? auth()->user() : null, $model->getAttributes(), null);
                } catch (\Throwable $e) {
                }
            });
        }
    }
}
