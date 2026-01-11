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

            // Debug logging
            \Log::info('AuditLogger called', [
                'action' => $action,
                'user_id' => $userId,
                'model_type' => $model ? get_class($model) : null,
                'message' => $meta['message'] ?? null
            ]);

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

            // Build payload - use standard column names from migration
            $data = [];
            $data['user_id'] = $userId;

            // ensure action is stored in Dutch
            $map = [
                'created' => 'toegevoegd',
                'updated' => 'bewerkt',
                'deleted' => 'verwijderd',
                'approved' => 'goedgekeurd',
                'rejected' => 'afgekeurd',
                'restored' => 'hersteld',
                'force_deleted' => 'permanent verwijderd',
            ];
            $key = mb_strtolower((string) $action);
            $data['action'] = $map[$key] ?? $action;

            // Use entity_type/entity_id (from older migration that's actually in DB)
            $data['entity_type'] = $auditableType;
            $data['entity_id'] = $auditableId;
            // Prefer explicit message in meta
            if (isset($meta['message']) && $meta['message'] !== null) {
                // Store as array directly (will be cast to JSON by model)
                $data['details'] = ['message' => (string) $meta['message']];
            } elseif (isset($meta['details'])) {
                $d = $meta['details'];
                if (is_array($d)) {
                    if (isset($d['message'])) {
                        $data['details'] = $d;
                    } else {
                        $data['details'] = ['message' => json_encode($d, JSON_UNESCAPED_UNICODE)];
                    }
                } else {
                    // string or other -> wrap as message
                    $data['details'] = ['message' => (string) $d];
                }
            } else {
                // Build a fallback message like "Bewerkt: Resident #123" or "Toegevoegd: Notitie"
                $act = $data['action'] ?? $action;
                $entity = $auditableType ?? 'item';
                $idpart = $auditableId ? ' #' . $auditableId : '';
                $fallback = sprintf('%s: %s%s', ucfirst((string)$act), $entity, $idpart);
                $data['details'] = ['message' => $fallback];
            }

            // Only include columns that exist in the actual table (2025_12_11 migration)
            // old_values, new_values, ip_address, user_agent don't exist in that migration
            $data['timestamp'] = $meta['timestamp'] ?? now();

            $entry = AuditLog::create($data);

            \Log::info('Audit log created successfully', ['id' => $entry->id ?? null]);

            return $entry;
        } catch (\Throwable $e) {
            // Log the error instead of failing silently
            \Log::error('AuditLogger failed to create log', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data ?? null
            ]);
            return null;
        }
    }
}
