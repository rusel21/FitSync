<?php

use Illuminate\Http\Request;
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

// ==================
// Public Auth Routes
// ==================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/staff/login', [StaffAuthController::class, 'login']);

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
    
    // Attendance Routes
    Route::get('/attendance', [UserAttendanceLogController::class, 'index']);
    Route::post('/attendance/checkin', [UserAttendanceLogController::class, 'checkIn']);
    Route::put('/attendance/checkout/{id}', [UserAttendanceLogController::class, 'checkOut']);

    // Membership Routes
    Route::get('/membership/current', [MembershipController::class, 'getCurrentMembership']);
    Route::get('/membership/history', [MembershipController::class, 'getMembershipHistory']);
    Route::get('/membership/plans', [MembershipController::class, 'getMembershipPlans']);
    Route::post('/membership/update', [MembershipController::class, 'updateMembership']);
    Route::post('/membership/cancel', [MembershipController::class, 'cancelMembership']);

    // Payment Routes
    Route::get('/payment/methods', [PaymentController::class, 'getPaymentMethods']);
    Route::get('/payment/history', [PaymentController::class, 'getPaymentHistory']);
    Route::get('/payment/{paymentId}', [PaymentController::class, 'getPaymentDetails']);
    Route::post('/payment/gcash', [PaymentController::class, 'createGcashPayment']);
    Route::get('/payment/{paymentId}/status', [PaymentController::class, 'checkPaymentStatus']);
    Route::post('/payment/{paymentId}/cancel', [PaymentController::class, 'cancelPayment']);

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
    
    // Staff Management (Admin only) - FIXED: Remove duplicate 'management' prefix
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