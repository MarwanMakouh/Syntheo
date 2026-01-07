<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    protected array $actionMap = [
        // Dutch -> stored actions
        'toevoegen' => 'created',
        'toegevoegd' => 'created',
        'toevoeging' => 'created',
        'aanmaken' => 'created',
        'maken' => 'created',
        'toevoeg' => 'created',

        'verwijderen' => 'deleted',
        'verwijderd' => 'deleted',
        'delete' => 'deleted',

        'bewerkt' => 'updated',
        'bewerken' => 'updated',
        'bewerk' => 'updated',

        'goedgekeurd' => 'approved',
        'goedkeuren' => 'approved',
        'approve' => 'approved',

        'afgekeurd' => 'rejected',
        'afkeuren' => 'rejected',
        'reject' => 'rejected',

        'restored' => 'restored',
        'force_deleted' => 'force_deleted',
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

        return response()->json($query->orderBy('created_at', 'desc')->paginate($perPage));
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
        ]);

        $log = AuditLog::create([
            'user_id' => $data['user_id'] ?? (auth()->check() ? auth()->id() : null),
            'action' => $data['action'],
            'auditable_type' => $data['auditable_type'] ?? null,
            'auditable_id' => $data['auditable_id'] ?? null,
            'old_values' => $data['old_values'] ?? null,
            'new_values' => $data['new_values'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ]);

        return response()->json($log, 201);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * Get all audit logs
     * Supports filtering by entity type, entity ID, user, action, and date range
     */
    public function index(Request $request)
    {
        $query = AuditLog::with('user');

        // Filter by entity type
        if ($request->has('entity_type') && $request->entity_type) {
            $query->where('entity_type', $request->entity_type);
        }

        // Filter by entity ID
        if ($request->has('entity_id') && $request->entity_id) {
            $query->where('entity_id', $request->entity_id);
        }

        // Filter by user
        if ($request->has('user_id') && $request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by action
        if ($request->has('action') && $request->action) {
            $query->where('action', $request->action);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('timestamp', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('timestamp', '<=', $request->date_to);
        }

        $logs = $query->orderBy('timestamp', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    /**
     * Get a specific audit log by ID
     */
    public function show($id)
    {
        $log = AuditLog::with('user')->find($id);

        if (!$log) {
            return response()->json([
                'success' => false,
                'message' => 'Audit log niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $log
        ]);
    }

    /**
     * Create a new audit log entry
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'entity_type' => 'required|string|max:255',
            'entity_id' => 'required|integer',
            'action' => 'required|in:create,update,delete,view,approve,reject',
            'details' => 'nullable|array',
        ]);

        $validated['timestamp'] = now();

        $log = AuditLog::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Audit log succesvol aangemaakt',
            'data' => $log->load('user')
        ], 201);
    }

    /**
     * Get audit logs for a specific entity
     */
    public function getEntityLogs($entityType, $entityId)
    {
        $logs = AuditLog::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->with('user')
            ->orderBy('timestamp', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }
}
