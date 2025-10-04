<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StaffController; // ✅ add this

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ==================
// Auth Routes
// ==================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ==================
// User Management (Gym Members)
// ==================
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// ==================
// Staff Management 
// ==================
Route::get('/staff', [StaffController::class, 'index']);        // get all staff
Route::get('/staff/{staff_id}', [StaffController::class, 'show']);    // get single staff
Route::post('/staff', [StaffController::class, 'store']);       // add new staff
Route::put('/staff/{staff_id}', [StaffController::class, 'update']);  // update staff
Route::delete('/staff/{staff_id}', [StaffController::class, 'destroy']); // delete staff
Route::post('/staff/upload-picture/{staff_id}',[StaffController::class,'uploadPicture']); //upload picture staff
