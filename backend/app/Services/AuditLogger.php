<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Request;

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
     * @return AuditLog|null
     */
    public static function log(string $action, $model = null, $user = null, $old = null, $new = null, array $meta = [])
    {
        try {
            $userId = null;
            if ($user && is_object($user)) {
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
                $auditableType = get_class($model);
                if (method_exists($model, 'getKey')) {
                    $auditableId = $model->getKey();
                } elseif (isset($model->id)) {
                    $auditableId = $model->id;
                } elseif (isset($model->user_id)) {
                    $auditableId = $model->user_id;
                }
            }

            $entry = AuditLog::create([
                'user_id' => $userId,
                'action' => $action,
                'auditable_type' => $auditableType,
                'auditable_id' => $auditableId,
                'old_values' => $old,
                'new_values' => $new,
                'ip_address' => Request::ip(),
                'user_agent' => Request::header('User-Agent'),
            ]);

            return $entry;
        } catch (\Throwable $e) {
            // Avoid throwing from logger; fail silently
            return null;
        }
    }
}
