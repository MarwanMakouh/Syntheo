<?php

namespace App\Models\Traits;

use App\Services\AuditLogger;

trait RecordsAudit
{
    public static function bootRecordsAudit()
    {
        static::created(function ($model) {
            try {
                $userId = function_exists('auth') && auth()->check() ? auth()->id() : null;
                AuditLogger::log('created', $model, $userId, null, $model->getAttributes());
            } catch (\Throwable $e) {
            }
        });

        static::updated(function ($model) {
            try {
                $old = $model->getOriginal();
                $changes = $model->getChanges();
                $userId = function_exists('auth') && auth()->check() ? auth()->id() : null;
                AuditLogger::log('updated', $model, $userId, $old, $changes);
            } catch (\Throwable $e) {
            }
        });

        static::deleted(function ($model) {
            try {
                $userId = function_exists('auth') && auth()->check() ? auth()->id() : null;
                AuditLogger::log('deleted', $model, $userId, $model->getAttributes(), null);
            } catch (\Throwable $e) {
            }
        });

        // Register restore/forceDeleted only for models using SoftDeletes
        if (in_array(\Illuminate\Database\Eloquent\SoftDeletes::class, class_uses_recursive(static::class))) {
            // Use the event dispatcher to avoid calling the magic static::restored which
            // can trigger BadMethodCallException on some model boot sequences.
            \Illuminate\Support\Facades\Event::listen('eloquent.restored: ' . static::class, function ($model) {
                try {
                    $userId = function_exists('auth') && auth()->check() ? auth()->id() : null;
                    AuditLogger::log('restored', $model, $userId, null, $model->getAttributes());
                } catch (\Throwable $e) {
                }
            });

            \Illuminate\Support\Facades\Event::listen('eloquent.forceDeleted: ' . static::class, function ($model) {
                try {
                    $userId = function_exists('auth') && auth()->check() ? auth()->id() : null;
                    AuditLogger::log('force_deleted', $model, $userId, $model->getAttributes(), null);
                } catch (\Throwable $e) {
                }
            });
        }
    }
}
