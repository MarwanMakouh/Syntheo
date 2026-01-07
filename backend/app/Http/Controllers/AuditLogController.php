<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    /** Map backend auditable type (class basename) to localized display names */
    protected array $displayMap = [
        'Resident' => 'Bewoner',
        'ChangeRequest' => 'Wijzigingsverzoek',
        'Note' => 'Notitie',
        'Medication' => 'Medicatie',
        'Alert' => 'Melding',
        'User' => 'Gebruiker',
        'MedicationRound' => 'Medicatie Ronde',
    ];

    // Map incoming action tokens (EN/NL) to the stored Dutch action value
    protected array $actionMap = [
        // English -> Dutch
        'created' => 'toegevoegd',
        'updated' => 'bewerkt',
        'deleted' => 'verwijderd',
        'approved' => 'goedgekeurd',
        'rejected' => 'afgekeurd',
        'restored' => 'hersteld',
        'force_deleted' => 'permanent verwijderd',

        // Dutch variants -> Dutch
        'toevoegen' => 'toegevoegd',
        'toegevoegd' => 'toegevoegd',
        'toevoeging' => 'toegevoegd',
        'aanmaken' => 'toegevoegd',

        'verwijderen' => 'verwijderd',
        'verwijderd' => 'verwijderd',

        'bewerkt' => 'bewerkt',
        'bewerken' => 'bewerkt',
        'bewerk' => 'bewerkt',

        'goedgekeurd' => 'goedgekeurd',
        'goedkeuren' => 'goedgekeurd',

        'afgekeurd' => 'afgekeurd',
        'afkeuren' => 'afgekeurd',
    ];

    public function index(Request $request)
    {
        $query = AuditLog::query()->with('user');

        if ($request->filled('action')) {
            $raw = array_map('trim', explode(',', $request->action));
            $actions = [];
            foreach ($raw as $a) {
                $key = mb_strtolower($a);
                $actions[] = $this->actionMap[$key] ?? $a;
            }
            $actions = array_values(array_unique($actions));
            $query->whereIn('action', $actions);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // accept either auditable_type or entity_type
        if ($request->filled('auditable_type')) {
            $query->where('auditable_type', $request->auditable_type);
        } elseif ($request->filled('entity_type')) {
            $query->where('auditable_type', $request->entity_type);
        }

        if ($request->filled('auditable_id')) {
            $query->where('auditable_id', $request->auditable_id);
        } elseif ($request->filled('entity_id')) {
            $query->where('auditable_id', $request->entity_id);
        }

        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        $perPage = (int) $request->get('per_page', 25);

        // choose an existing column to order by (legacy tables may not have created_at)
        if (Schema::hasColumn('audit_logs', 'created_at')) {
            $orderCol = 'created_at';
        } elseif (Schema::hasColumn('audit_logs', 'timestamp')) {
            $orderCol = 'timestamp';
        } elseif (Schema::hasColumn('audit_logs', 'log_id')) {
            $orderCol = 'log_id';
        } else {
            $orderCol = 'id';
        }

        $paginator = $query->orderBy($orderCol, 'desc')->paginate($perPage);

        // Normalize each item so frontend can rely on consistent fields
        $displayMap = $this->displayMap;
        $paginator->getCollection()->transform(function ($item) use ($displayMap) {
            // id handling (support either id or log_id)
            $id = $item->log_id ?? $item->id ?? null;

            // timestamp / created_at -> format to 'YYYY-MM-DD HH:MM' for frontend
            $createdAtRaw = $item->timestamp ?? ($item->created_at ?? null);
            $createdAt = null;
            if ($createdAtRaw) {
                if ($createdAtRaw instanceof \DateTimeInterface) {
                    $createdAt = $createdAtRaw->format('Y-m-d H:i');
                } else {
                    try {
                        $dt = new \DateTime($createdAtRaw);
                        $createdAt = $dt->format('Y-m-d H:i');
                    } catch (\Exception $e) {
                        $createdAt = (string) $createdAtRaw;
                    }
                }
            }

            // user name
            $userName = null;
            if ($item->relationLoaded('user') && $item->user) {
                $userName = $item->user->name ?? ($item->user->user_name ?? null);
            } else {
                $userName = $item->user_name ?? null;
            }

            // entity type / auditable_type (raw)
            $entityType = $item->entity_type ?? $item->auditable_type ?? null;
            if ($entityType && strpos($entityType, '\\') !== false) {
                $parts = explode('\\', $entityType);
                $entityType = end($parts);
            }

            // localized display name for entity type
            $entityDisplay = $displayMap[$entityType] ?? $entityType;

            // entity id / auditable_id
            $entityId = $item->entity_id ?? $item->auditable_id ?? null;

            // details: prefer `details` column, try to extract friendly message
            $details = null;
            if (isset($item->details) && $item->details) {
                $raw = $item->details;
                $decoded = null;
                if (is_array($raw)) {
                    $decoded = $raw;
                } elseif (is_string($raw)) {
                    $temp = json_decode($raw, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($temp)) {
                        $decoded = $temp;
                    }
                }

                if (is_array($decoded)) {
                    if (isset($decoded['message'])) {
                        $details = $decoded['message'];
                    } elseif (isset($decoded['field']) && array_key_exists('old_value', $decoded) && array_key_exists('new_value', $decoded)) {
                        $details = sprintf("%s gewijzigd: %s → %s", $decoded['field'], $decoded['old_value'], $decoded['new_value']);
                    } else {
                        $details = json_encode($decoded, JSON_UNESCAPED_UNICODE);
                    }
                } else {
                    $details = (string) $raw;
                }
            } elseif (isset($item->new_values) && $item->new_values) {
                $details = json_encode($item->new_values, JSON_UNESCAPED_UNICODE);
            } elseif (isset($item->old_values) && $item->old_values) {
                $details = json_encode($item->old_values, JSON_UNESCAPED_UNICODE);
            }

            return [
                'id' => $id,
                'log_id' => $id,
                'user' => ['name' => $userName],
                'user_name' => $userName,
                'action' => $item->action ?? null,
                'auditable_type' => $entityType,
                'entity_type' => $entityDisplay,
                'entity_type_raw' => $entityType,
                'auditable_id' => $entityId,
                'entity_id' => $entityId,
                'details' => $details,
                'old_values' => $item->old_values ?? null,
                'new_values' => $item->new_values ?? null,
                'created_at' => $createdAt,
                'timestamp' => $createdAt,
            ];
        });

        return response()->json($paginator);
    }

    public function show($id)
    {
        $log = AuditLog::with('user')->findOrFail($id);
        return response()->json($log);
    }

    public function getEntityLogs($entityType, $entityId)
    {
        $logs = AuditLog::where('auditable_type', $entityType)
            ->where('auditable_id', $entityId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($logs);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'action' => 'required|string',
            'auditable_type' => 'nullable|string',
            'auditable_id' => 'nullable|integer',
            'old_values' => 'nullable|array',
            'new_values' => 'nullable|array',
            'user_id' => 'nullable|integer',
            'message' => 'nullable|string',
        ]);

        // translate action to Dutch before storing
        $actionMap = [
            'created' => 'toegevoegd',
            'updated' => 'bewerkt',
            'deleted' => 'verwijderd',
            'approved' => 'goedgekeurd',
            'rejected' => 'afgekeurd',
            'restored' => 'hersteld',
            'force_deleted' => 'permanent verwijderd',
        ];
        $providedAction = mb_strtolower((string) $data['action']);
        $storedAction = $actionMap[$providedAction] ?? $data['action'];

        $createData = [
            'user_id' => $data['user_id'] ?? (auth()->check() ? auth()->id() : null),
            'action' => $storedAction,
            'auditable_type' => $data['auditable_type'] ?? null,
            'auditable_id' => $data['auditable_id'] ?? null,
            'old_values' => $data['old_values'] ?? null,
            'new_values' => $data['new_values'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ];

        // If a plain message was provided, prefer storing it in `details` as JSON
        if (!empty($data['message']) && \Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'details')) {
            $createData['details'] = json_encode(['message' => $data['message']], JSON_UNESCAPED_UNICODE);
        }

        $log = AuditLog::create($createData);

        return response()->json($log, 201);
    }
}

