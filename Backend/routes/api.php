<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StaffController; 
use App\Http\Controllers\UserAttendanceLogController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StaffAuthController;
use App\Http\Controllers\StaffDashboardController;  
use App\Http\Controllers\AdminDashboardController; 
use App\Http\Controllers\AdminMemberController;
use App\Http\Controllers\AdminMembershipController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\EquipmentManagementController;
use App\Http\Controllers\StaffCommunicationsController;
use App\Http\Controllers\PasswordResetController;
// Add this right after the opening PHP tag in your routes/api.php
Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['message' => 'CSRF cookie set']);
});
// ==================
// PUBLIC CORS TEST ROUTES (NO AUTH REQUIRED - ADDED AT TOP)
// ==================
Route::get('/test-cors', function () {
    return response()->json([
        'message' => 'CORS is working! 🎉',
        'timestamp' => now()->toDateTimeString(),
        'status' => 'success',
        'cors_configured' => true,
        'allowed_origin' => 'http://localhost:5173'
    ]);
});

Route::get('/test-route', function () {
    return response()->json([
        'message' => 'Route is working!',
        'file' => 'Current routes file is loaded',
        'timestamp' => now()
    ]);
});

Route::get('/debug-simple', function () {
    return response()->json([
        'message' => 'Simple debug route - no auth required',
        'server_time' => now()->toDateTimeString(),
        'cors_working' => true
    ]);
});

// Public membership plans (for payment page without auth)
Route::get('/membership/plans', [MembershipController::class, 'getMembershipPlans']);

// ==================
// Public Auth Routes
// ==================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/staff/login', [StaffAuthController::class, 'login']);


// ==================
// Password Reset Routes (Public)
// ==================
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/verify-reset-token', [PasswordResetController::class, 'verifyToken']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
// ==================
// Public Staff Image Access
// ==================
Route::get('/staff/image/{filename}', [StaffController::class, 'getImage']);

// ==================
// USER PROTECTED ROUTES
// ==================
Route::middleware(['auth:sanctum'])->group(function () {
    // User Profile Routes
    Route::get('/profile', [UserController::class, 'getCurrentUser']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::post('/profile/picture', [UserController::class, 'uploadProfilePicture']);
    Route::get('/profile/dashboard', [UserController::class, 'getDashboardData']);
    
    // ✅ FIXED: User Personal Attendance Routes (ONLY for users checking themselves in/out)
    Route::prefix('user/attendance')->group(function () {
        Route::get('/', [UserAttendanceLogController::class, 'index']);
        Route::get('/today-status', [UserAttendanceLogController::class, 'getTodayStatus']);
        Route::post('/checkin', [UserAttendanceLogController::class, 'checkIn']);
        Route::put('/checkout/{id}', [UserAttendanceLogController::class, 'checkOut']);
    });

    // Membership Routes (REMOVED DUPLICATE membership/plans - now public above)
    Route::get('/membership/current', [MembershipController::class, 'getCurrentMembership']);
    Route::get('/membership/history', [MembershipController::class, 'getMembershipHistory']);
    Route::post('/membership/update', [MembershipController::class, 'updateMembership']);
    Route::post('/membership/cancel', [MembershipController::class, 'cancelMembership']);

    // Payment Routes - ALL PAYMENT ROUTES SHOULD BE PROTECTED
    Route::get('/payments/methods', [PaymentController::class, 'getPaymentMethods']);
    Route::get('/payments/history', [PaymentController::class, 'getPaymentHistory']);
    Route::get('/payments/{paymentId}', [PaymentController::class, 'getPaymentDetails']);
    Route::post('/payments/gcash', [PaymentController::class, 'createGcashPayment']);
    Route::get('/payments/{paymentId}/status', [PaymentController::class, 'checkPaymentStatus']);
    Route::post('/payments/{paymentId}/cancel', [PaymentController::class, 'cancelPayment']);
    
    // ✅ MOVED: OTP Payment Routes INSIDE auth middleware
    Route::post('/payments/gcash/verify-otp', [PaymentController::class, 'verifyOtpAndCompletePayment']);
    Route::post('/payments/gcash/resend-otp', [PaymentController::class, 'resendOtp']);

    // Dashboard Routes
    Route::get('/dashboard', [DashboardController::class, 'getUserDashboard']);
    Route::get('/dashboard/quick-stats', [DashboardController::class, 'getQuickStats']);
    Route::post('/dashboard/renew-membership', [DashboardController::class, 'renewMembership']);
});

// ==================
// STAFF PROTECTED ROUTES (Both Staff and Admin)
// ==================
Route::middleware(['auth:sanctum'])->prefix('staff')->group(function () {
    // Staff Profile & Auth
    Route::post('/logout', [StaffAuthController::class, 'logout']);
    Route::get('/profile', [StaffAuthController::class, 'getProfile']);
    Route::put('/profile', [StaffAuthController::class, 'updateProfile']);
    Route::post('/change-password', [StaffAuthController::class, 'changePassword']);
    Route::post('/upload-picture', [StaffAuthController::class, 'uploadPicture']);
    
    // Staff Dashboard (accessible to both Staff and Admin)
    Route::get('/dashboard', [StaffDashboardController::class, 'getDashboard']);
    Route::get('/today-attendance', [StaffDashboardController::class, 'getTodayAttendance']);
    
    // ✅ FIXED: Staff Attendance Management Routes (Staff checking users in/out)
    Route::prefix('attendance')->group(function () {
        Route::get('/', [UserAttendanceLogController::class, 'getAllAttendance']);
        Route::post('/checkin', [UserAttendanceLogController::class, 'checkInByUserId']);
        Route::put('/checkout/{id}', [UserAttendanceLogController::class, 'checkOutByLogId']);
    });
    
    // Staff Payment Routes
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'getAllPayments']);
        Route::post('/mark-paid', [PaymentController::class, 'markAsPaid']);
        Route::post('/send-reminders', [PaymentController::class, 'sendReminders']);
    });

    // Equipment Management Routes
    Route::prefix('equipment')->group(function () {
        Route::get('/management', [EquipmentManagementController::class, 'getEquipmentManagementData']);
        Route::get('/statistics', [EquipmentManagementController::class, 'getEquipmentStatistics']);
        Route::post('/equipment', [EquipmentManagementController::class, 'createEquipment']);
        Route::put('/equipment/{id}', [EquipmentManagementController::class, 'updateEquipment']);
        Route::post('/equipment/{id}/maintenance', [EquipmentManagementController::class, 'performMaintenance']);
        Route::post('/maintenance-requests', [EquipmentManagementController::class, 'createMaintenanceRequest']);
        Route::put('/maintenance-requests/{id}', [EquipmentManagementController::class, 'updateMaintenanceRequest']);
    });

    // Staff Communications Routes
    Route::prefix('communications')->group(function () {
        Route::get('/', [StaffCommunicationsController::class, 'getCommunicationsData']);
        Route::post('/send-bulk', [StaffCommunicationsController::class, 'sendBulkMessage']);
        Route::post('/templates', [StaffCommunicationsController::class, 'createTemplate']);
        Route::put('/templates/{id}', [StaffCommunicationsController::class, 'updateTemplate']);
        Route::post('/reminder-settings', [StaffCommunicationsController::class, 'updateReminderSettings']);
        Route::get('/message-history', [StaffCommunicationsController::class, 'getMessageHistory']);
    });

    // Staff Management (Admin only)
    Route::middleware('admin')->group(function () {
        Route::post('/register', [StaffAuthController::class, 'register']);
        Route::get('/', [StaffController::class, 'index']); // GET /staff
        Route::get('/{staff_id}', [StaffController::class, 'show']); // GET /staff/{id}
        Route::put('/{staff_id}', [StaffController::class, 'update']); // PUT /staff/{id}
        Route::delete('/{staff_id}', [StaffController::class, 'destroy']); // DELETE /staff/{id}
        Route::post('/{staff_id}/upload-picture', [StaffController::class, 'uploadPicture']);
        Route::get('/stats/overview', [StaffController::class, 'getStats']);
    });
});

// ==================
// ADMIN DASHBOARD ROUTES (Admin only)
// ==================
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard routes
    Route::get('/dashboard', [AdminDashboardController::class, 'getDashboardData']);
    Route::get('/dashboard/simple', [AdminDashboardController::class, 'getSimpleDashboardData']);
    Route::get('/dashboard/detailed-stats', [AdminDashboardController::class, 'getDetailedStats']);
    
    // Member management routes
    Route::get('/users', [AdminMemberController::class, 'getUsers']);
    Route::put('/users/{id}', [AdminMemberController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminMemberController::class, 'deleteUser']);
    Route::get('/members/analytics', [AdminMemberController::class, 'getAnalytics']);
    Route::post('/reports/analytics', [AdminMemberController::class, 'generateAnalyticsReport']);
    Route::get('/members/{id}', [AdminMemberController::class, 'getMemberDetails']);
    
    // Membership plan routes
    Route::get('/membership-plans', [AdminMembershipController::class, 'getPlans']);
    Route::post('/membership-plans', [AdminMembershipController::class, 'createPlan']);
    Route::get('/membership-plans/types', [AdminMembershipController::class, 'getPlanTypes']);
    Route::put('/membership-plans/{id}', [AdminMembershipController::class, 'updatePlan']);
    Route::delete('/membership-plans/{id}', [AdminMembershipController::class, 'deletePlan']);
    
    // ✅ FIXED: Admin Attendance Routes (Separate from staff attendance)
    Route::prefix('attendance')->group(function () {
        Route::get('/', [UserAttendanceLogController::class, 'adminIndex']);
        Route::post('/export', [UserAttendanceLogController::class, 'adminExport']);
    });

    // Analytics routes
    Route::get('/analytics', [AnalyticsController::class, 'getAnalyticsData']);
    Route::post('/analytics/export', [AnalyticsController::class, 'exportReport']);
});

// ==================
// DEBUG ROUTES (Temporary - Remove in production)
// ==================
Route::get('/staff/debug', [StaffAuthController::class, 'debug']);
Route::post('/staff/debug-create', function (Request $request) {
    // Temporary route to test staff creation without auth
    try {
        $staff = \App\Models\Staff::create([
            'name' => $request->name ?? 'Test Staff',
            'email' => $request->email ?? 'test@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make($request->password ?? 'password123'),
            'role' => $request->role ?? 'Staff',
        ]);
        
        return response()->json([
            'success' => true,
            'staff' => $staff->toArray()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Temporary debug route - REMOVE IN PRODUCTION
Route::get('/debug/users', function (Request $request) {
    Log::info('Debug users route called');
    
    try {
        $users = \App\Models\User::all();
        return response()->json([
            'success' => true,
            'users' => $users,
            'count' => $users->count(),
            'message' => 'Debug route working'
        ]);
    } catch (\Exception $e) {
        Log::error('Debug route error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'message' => 'Debug route failed'
        ], 500);
    }
});

// Test routes
Route::get('/test-communications-route', function (Request $request) {
    return response()->json([
        'message' => 'Communications route test successful!',
        'route_working' => true,
        'timestamp' => now()->toDateTimeString(),
        'next_step' => 'Test the actual communications endpoint'
    ]);
});

Route::get('/test-communications-controller', [StaffCommunicationsController::class, 'getCommunicationsData']);

// CORS Test Routes (REMOVED DUPLICATES - already at top)
Route::get('/test-auth-cors', function (Request $request) {
    return response()->json([
        'message' => 'CORS with auth is working!',
        'user' => $request->user() ? $request->user()->only(['id', 'name', 'email']) : null,
        'authenticated' => (bool) $request->user(),
        'timestamp' => now()->toDateTimeString()
    ]);
})->middleware('auth:sanctum');


// Add this to your routes/api.php temporarily
Route::get('/debug/membership-types', function() {
    $types = \App\Models\MembershipPlan::pluck('type')->toArray();
    $memberships = \App\Models\Membership::pluck('type')->toArray();
    
    return response()->json([
        'membership_plan_types' => $types,
        'membership_types' => $memberships,
        'all_plans' => \App\Models\MembershipPlan::all(),
        'all_memberships' => \App\Models\Membership::all()
    ]);
});


// Add to routes/api.php
Route::get('/debug/membership-enum-values', function() {
    try {
        // Method 1: Get ENUM values from information_schema
        $enumResult = DB::select("
            SELECT COLUMN_TYPE 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'memberships' 
            AND COLUMN_NAME = 'status'
        ");
        
        $enumDefinition = $enumResult[0]->COLUMN_TYPE ?? 'Not found';
        
        // Method 2: Try to get actual values used in the table
        $usedValues = DB::select("
            SELECT DISTINCT status 
            FROM memberships 
            ORDER BY status
        ");
        
        $usedStatuses = array_map(fn($item) => $item->status, $usedValues);
        
        // Method 3: Try to insert different values to see what works
        $testValues = ['active', 'inactive', 'pending', 'expired', 'cancelled', 'pending_payment'];
        $workingValues = [];
        
        foreach ($testValues as $value) {
            try {
                DB::table('memberships')->insert([
                    'user_id' => 1,
                    'type' => 'test',
                    'price' => 0,
                    'start_date' => now(),
                    'end_date' => now(),
                    'status' => $value,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                $workingValues[] = $value;
                DB::table('memberships')->where('type', 'test')->delete(); // Clean up
            } catch (\Exception $e) {
                // This value doesn't work
            }
        }
        
        return response()->json([
            'enum_definition' => $enumDefinition,
            'currently_used_statuses' => $usedStatuses,
            'working_status_values' => $workingValues,
            'suggestion' => count($workingValues) > 0 ? "Use: '" . $workingValues[0] . "'" : "No working values found"
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
});