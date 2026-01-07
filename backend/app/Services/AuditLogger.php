<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Schema;

class AuditLogger
{
    /**
     * Create an audit log entry.
     *
     * @param string $action
     * @param mixed|null $model
     * @param mixed|null $user
     * @param array|null $old
     * @param array|null $new
     * @param array $meta
    * @return \App\Models\AuditLog|null
     */
    public static function log(string $action, $model = null, $user = null, $old = null, $new = null, array $meta = [])
    {
        try {
            $userId = null;
            if (is_numeric($user)) {
                $userId = (int) $user;
            } elseif ($user && is_object($user)) {
                if (method_exists($user, 'getKey')) {
                    $userId = $user->getKey();
                } elseif (property_exists($user, 'id')) {
                    $userId = $user->id;
                } elseif (property_exists($user, 'user_id')) {
                    $userId = $user->user_id;
                }
            } elseif (function_exists('auth') && auth()->check()) {
                $userId = auth()->id();
            }

            $auditableType = null;
            $auditableId = null;

            if (is_object($model)) {
                // store short class name for easier display (e.g. Resident, Note)
                $auditableType = class_basename($model);
                if (method_exists($model, 'getKey')) {
                    $auditableId = $model->getKey();
                } elseif (isset($model->id)) {
                    $auditableId = $model->id;
                } elseif (isset($model->user_id)) {
                    $auditableId = $model->user_id;
                }
            }

            // Build payload only for columns that actually exist in DB
            $data = [];
            if (Schema::hasColumn('audit_logs', 'user_id')) {
                $data['user_id'] = $userId;
            }
            if (Schema::hasColumn('audit_logs', 'action')) {
                $data['action'] = $action;
            }
            if (Schema::hasColumn('audit_logs', 'auditable_type')) {
                $data['auditable_type'] = $auditableType;
            } elseif (Schema::hasColumn('audit_logs', 'entity_type')) {
                $data['entity_type'] = $auditableType;
            }
            if (Schema::hasColumn('audit_logs', 'auditable_id')) {
                $data['auditable_id'] = $auditableId;
            } elseif (Schema::hasColumn('audit_logs', 'entity_id')) {
                $data['entity_id'] = $auditableId;
            }
            if (Schema::hasColumn('audit_logs', 'details')) {
                $data['details'] = $meta['details'] ?? null;
            }
            if (Schema::hasColumn('audit_logs', 'old_values')) {
                $data['old_values'] = $old;
            }
            if (Schema::hasColumn('audit_logs', 'new_values')) {
                $data['new_values'] = $new;
            }
            if (Schema::hasColumn('audit_logs', 'timestamp')) {
                $data['timestamp'] = $meta['timestamp'] ?? now();
            }
            if (Schema::hasColumn('audit_logs', 'ip_address')) {
                $data['ip_address'] = Request::ip();
            }
            if (Schema::hasColumn('audit_logs', 'user_agent')) {
                $data['user_agent'] = Request::header('User-Agent');
            }

            $entry = AuditLog::create($data);

            return $entry;
        } catch (\Throwable $e) {
            // Avoid throwing from logger; fail silently
            return null;
        }
    }
}
