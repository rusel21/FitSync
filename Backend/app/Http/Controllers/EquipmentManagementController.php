<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Equipment;
use App\Models\MaintenanceRequest;

class EquipmentManagementController extends Controller
{
    /**
     * Get all equipment management data
     */
    public function getEquipmentManagementData(Request $request)
    {
        try {
            $view = $request->get('view', 'inventory');

            $data = [
                'equipment' => [],
                'maintenanceRequests' => [],
                'reports' => [],
                'categories' => $this->getEquipmentCategories()
            ];

            switch ($view) {
                case 'inventory':
                    $data['equipment'] = $this->getEquipmentInventory();
                    break;
                case 'maintenance':
                    $data['maintenanceRequests'] = $this->getMaintenanceRequests();
                    break;
                case 'reports':
                    $data['reports'] = $this->getEquipmentReports();
                    break;
                default:
                    $data['equipment'] = $this->getEquipmentInventory();
            }

            return response()->json($data);

        } catch (\Exception $e) {
            Log::error('Equipment management data error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to load equipment management data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get equipment inventory
     */
    private function getEquipmentInventory()
    {
        return Equipment::withCount(['maintenanceRequests'])
            ->orderBy('name')
            ->get()
            ->map(function ($equipment) {
                return [
                    'id' => $equipment->id,
                    'name' => $equipment->name,
                    'type' => $equipment->type,
                    'category' => $equipment->category,
                    'model' => $equipment->model,
                    'location' => $equipment->location,
                    'status' => $equipment->status,
                    'last_maintenance' => $equipment->last_maintenance?->format('Y-m-d'),
                    'next_maintenance' => $equipment->next_maintenance?->format('Y-m-d'),
                    'needs_maintenance' => $equipment->needs_maintenance,
                    'days_until_maintenance' => $equipment->days_until_maintenance,
                    'under_warranty' => $equipment->under_warranty,
                    'warranty_expiry' => $equipment->warranty_expiry?->format('Y-m-d'),
                    'usage_hours' => $equipment->usage_hours,
                    'condition_notes' => $equipment->condition_notes,
                    'maintenance_requests_count' => $equipment->maintenance_requests_count,
                    'serial_number' => $equipment->serial_number
                ];
            });
    }

    /**
     * Get maintenance requests
     */
    private function getMaintenanceRequests()
    {
        return MaintenanceRequest::with(['equipment', 'assignedStaff'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'equipment_id' => $request->equipment_id,
                    'equipment_name' => $request->equipment ? $request->equipment->name : 'Unknown Equipment',
                    'title' => $request->title,
                    'description' => $request->description,
                    'reported_by' => $request->reported_by,
                    'reported_by_type' => $request->reported_by_type,
                    'date' => $request->created_at->format('Y-m-d'),
                    'priority' => $request->priority,
                    'status' => $request->status,
                    'assigned_to' => $request->assignedStaff ? $request->assignedStaff->name : 'Unassigned',
                    'assigned_staff_id' => $request->assigned_to,
                    'estimated_completion' => $request->estimated_completion?->format('Y-m-d'),
                    'estimated_hours' => $request->estimated_hours,
                    'actual_hours' => $request->actual_hours,
                    'total_cost' => $request->total_cost,
                    'is_overdue' => $request->is_overdue,
                    'technician_notes' => $request->technician_notes
                ];
            });
    }

    /**
     * Get equipment reports
     */
    private function getEquipmentReports()
    {
        $totalEquipment = Equipment::count();
        $operationalEquipment = Equipment::operational()->count();
        $maintenanceEquipment = Equipment::underMaintenance()->count();
        $needsMaintenance = Equipment::needsMaintenance()->count();

        $pendingRequests = MaintenanceRequest::pending()->count();
        $inProgressRequests = MaintenanceRequest::inProgress()->count();
        $highPriorityRequests = MaintenanceRequest::highPriority()->count();
        $criticalRequests = MaintenanceRequest::critical()->count();

        // Category breakdown
        $categories = Equipment::select('category', DB::raw('COUNT(*) as count'))
            ->groupBy('category')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->category => $item->count];
            });

        // Maintenance cost this month
        $monthlyMaintenanceCost = MaintenanceRequest::where('status', 'Completed')
            ->whereMonth('actual_completion', now()->month)
            ->sum('total_cost');

        return [
            'equipment_operational_rate' => $totalEquipment > 0 ? round(($operationalEquipment / $totalEquipment) * 100) : 0,
            'active_maintenance_tasks' => $inProgressRequests + $pendingRequests,
            'monthly_maintenance_cost' => $monthlyMaintenanceCost,
            'total_equipment' => $totalEquipment,
            'operational_equipment' => $operationalEquipment,
            'maintenance_equipment' => $maintenanceEquipment,
            'needs_maintenance' => $needsMaintenance,
            'pending_requests' => $pendingRequests,
            'high_priority_requests' => $highPriorityRequests,
            'critical_requests' => $criticalRequests,
            'categories' => $categories,
            'avg_maintenance_cost' => $totalEquipment > 0 ? round($monthlyMaintenanceCost / $totalEquipment, 2) : 0
        ];
    }

    /**
     * Get equipment categories
     */
    private function getEquipmentCategories()
    {
        return [
            'Cardio',
            'Strength Training',
            'Free Weights',
            'Functional Training',
            'Group Exercise',
            'Accessories',
            'Monitoring',
            'Other'
        ];
    }

    /**
     * Create new equipment
     */
    public function createEquipment(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'model' => 'nullable|string|max:255',
                'serial_number' => 'nullable|string|max:255|unique:equipment,serial_number',
                'location' => 'required|string|max:255',
                'purchase_date' => 'nullable|date',
                'purchase_price' => 'nullable|numeric|min:0',
                'maintenance_interval_days' => 'nullable|integer|min:1',
                'warranty_expiry' => 'nullable|date',
                'specifications' => 'nullable|array'
            ]);

            $equipment = Equipment::create($validated);

            // Schedule first maintenance if interval is set
            if ($equipment->maintenance_interval_days) {
                $equipment->scheduleNextMaintenance();
            }

            return response()->json([
                'success' => true,
                'equipment' => $equipment,
                'message' => 'Equipment added successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Create equipment error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to create equipment',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update equipment
     */
    public function updateEquipment(Request $request, $id)
    {
        try {
            $equipment = Equipment::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'type' => 'sometimes|required|string|max:255',
                'category' => 'sometimes|required|string|max:255',
                'location' => 'sometimes|required|string|max:255',
                'status' => 'sometimes|required|in:Operational,Maintenance,Out of Service',
                'condition_notes' => 'nullable|string',
                'usage_hours' => 'nullable|integer|min:0'
            ]);

            $equipment->update($validated);

            return response()->json([
                'success' => true,
                'equipment' => $equipment,
                'message' => 'Equipment updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Update equipment error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to update equipment',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create maintenance request
     */
    public function createMaintenanceRequest(Request $request)
    {
        try {
            $validated = $request->validate([
                'equipment_id' => 'required|exists:equipment,id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'reported_by' => 'required|string|max:255',
                'reported_by_type' => 'required|in:member,staff,system',
                'priority' => 'required|in:Low,Medium,High,Critical'
            ]);

            $maintenanceRequest = MaintenanceRequest::create($validated);

            // Update equipment status if priority is high or critical
            if (in_array($validated['priority'], ['High', 'Critical'])) {
                $equipment = Equipment::find($validated['equipment_id']);
                $equipment->status = 'Maintenance';
                $equipment->save();
            }

            return response()->json([
                'success' => true,
                'maintenance_request' => $maintenanceRequest,
                'message' => 'Maintenance request created successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Create maintenance request error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to create maintenance request',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update maintenance request
     */
    public function updateMaintenanceRequest(Request $request, $id)
    {
        try {
            $maintenanceRequest = MaintenanceRequest::with('equipment')->findOrFail($id);

            $validated = $request->validate([
                'status' => 'sometimes|required|in:Pending,In Progress,Completed,Cancelled',
                'assigned_to' => 'nullable|exists:staff,id',
                'estimated_hours' => 'nullable|numeric|min:0',
                'estimated_completion' => 'nullable|date',
                'technician_notes' => 'nullable|string',
                'labor_cost' => 'nullable|numeric|min:0',
                'parts_cost' => 'nullable|numeric|min:0'
            ]);

            $maintenanceRequest->update($validated);

            // If completed, update equipment
            if ($validated['status'] === 'Completed' && $maintenanceRequest->equipment) {
                $maintenanceRequest->markAsCompleted();
            }

            return response()->json([
                'success' => true,
                'maintenance_request' => $maintenanceRequest,
                'message' => 'Maintenance request updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Update maintenance request error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to update maintenance request',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Perform maintenance on equipment
     */
    public function performMaintenance(Request $request, $id)
    {
        try {
            $equipment = Equipment::findOrFail($id);

            $validated = $request->validate([
                'maintenance_notes' => 'required|string',
                'next_maintenance_date' => 'nullable|date'
            ]);

            $equipment->markAsMaintained($validated['maintenance_notes']);

            if ($validated['next_maintenance_date']) {
                $equipment->next_maintenance = $validated['next_maintenance_date'];
                $equipment->save();
            }

            return response()->json([
                'success' => true,
                'equipment' => $equipment,
                'message' => 'Maintenance performed successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Perform maintenance error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to perform maintenance',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get equipment statistics
     */
    public function getEquipmentStatistics()
    {
        try {
            return response()->json($this->getEquipmentReports());
        } catch (\Exception $e) {
            Log::error('Get equipment statistics error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to load equipment statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}