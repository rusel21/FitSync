<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link
     */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        try {
            // Generate reset token
            $token = Str::random(60);
            
            // Delete any existing tokens for this email
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            
            // Create new token
            DB::table('password_reset_tokens')->insert([
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => Carbon::now()
            ]);

            // Get user details
            $user = User::where('email', $request->email)->first();

            // Generate reset URL (for frontend)
            $resetUrl = "http://localhost:5173/reset-password?token=" . $token . "&email=" . urlencode($request->email);

            // Send email
            Mail::send('emails.password-reset', [
                'user' => $user,
                'resetUrl' => $resetUrl,
                'token' => $token
            ], function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('FitSync - Password Reset Request')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info("Password reset link sent to: " . $request->email);

            return response()->json([
                'success' => true,
                'message' => 'Password reset link has been sent to your email.'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send password reset email: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send password reset link. Please try again.'
            ], 500);
        }
    }

    /**
     * Verify reset token
     */
    public function verifyToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string'
        ]);

        try {
            $resetRecord = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$resetRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired reset token.'
                ], 422);
            }

            // Check if token is expired (1 hour)
            if (Carbon::parse($resetRecord->created_at)->addHour()->isPast()) {
                // Delete expired token
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();
                
                return response()->json([
                    'success' => false,
                    'message' => 'Reset token has expired. Please request a new one.'
                ], 422);
            }

            // Verify token
            if (!Hash::check($request->token, $resetRecord->token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid reset token.'
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => 'Token is valid.'
            ]);

        } catch (\Exception $e) {
            Log::error('Token verification failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Token verification failed.'
            ], 500);
        }
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed'
        ]);

        try {
            DB::beginTransaction();

            $resetRecord = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$resetRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired reset token.'
                ], 422);
            }

            // Check if token is expired (1 hour)
            if (Carbon::parse($resetRecord->created_at)->addHour()->isPast()) {
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();
                
                return response()->json([
                    'success' => false,
                    'message' => 'Reset token has expired. Please request a new one.'
                ], 422);
            }

            // Verify token
            if (!Hash::check($request->token, $resetRecord->token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid reset token.'
                ], 422);
            }

            // Update user password
            $user = User::where('email', $request->email)->first();
            $user->password = Hash::make($request->password);
            $user->save();

            // Delete used token
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            // Send confirmation email
            Mail::send('emails.password-reset-confirmation', [
                'user' => $user
            ], function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('FitSync - Password Reset Successful')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info("Password reset successfully for user: " . $user->email);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Password has been reset successfully. You can now login with your new password.'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Password reset failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset password. Please try again.'
            ], 500);
        }
    }
}