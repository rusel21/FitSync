<?php

namespace App\Services;

use App\Models\OtpVerification;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class OtpService
{
    /**
     * Generate and send OTP to user
     */
    public function generateAndSendOtp(User $user, Payment $payment)
    {
        // Delete any existing OTPs for this payment
        OtpVerification::where('payment_id', $payment->id)->delete();

        // Generate 6-digit OTP
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Create OTP record
        $otp = OtpVerification::create([
            'user_id' => $user->id,
            'payment_id' => $payment->id,
            'otp_code' => $otpCode,
            'expires_at' => Carbon::now()->addMinutes(10), // OTP valid for 10 minutes
            'attempts' => 0
        ]);

        // Send OTP via email
        $this->sendOtpEmail($user, $otpCode, $payment);

        return $otp;
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(User $user, $otpCode, $paymentId)
    {
        $otp = OtpVerification::where('user_id', $user->id)
            ->where('payment_id', $paymentId)
            ->where('otp_code', $otpCode)
            ->where('expires_at', '>', Carbon::now())
            ->where('used', false)
            ->first();

        if (!$otp) {
            // Increment attempts if OTP exists but is invalid
            $existingOtp = OtpVerification::where('user_id', $user->id)
                ->where('payment_id', $paymentId)
                ->where('used', false)
                ->first();
                
            if ($existingOtp) {
                $existingOtp->increment('attempts');
                
                // Lock after 3 failed attempts
                if ($existingOtp->attempts >= 3) {
                    $existingOtp->update(['used' => true]);
                    throw new \Exception('Too many failed attempts. Please request a new OTP.');
                }
            }
            
            return false;
        }

        // Mark OTP as used
        $otp->update([
            'used' => true,
            'used_at' => Carbon::now()
        ]);

        return $otp;
    }

    /**
     * Send OTP email
     */
    private function sendOtpEmail(User $user, $otpCode, Payment $payment)
    {
        try {
            Mail::send('emails.payment-otp', [
                'user' => $user,
                'otpCode' => $otpCode,
                'payment' => $payment,
                'expiryMinutes' => 10
            ], function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('FitSync Payment OTP Verification');
            });

            Log::info("OTP email sent to {$user->email} for payment {$payment->reference_number}");

        } catch (\Exception $e) {
            Log::error('Failed to send OTP email: ' . $e->getMessage());
            throw new \Exception('Failed to send OTP email. Please try again.');
        }
    }

    /**
     * Check if OTP is required for payment
     */
    public function isOtpRequired(Payment $payment)
    {
        return $payment->status === 'pending_otp';
    }

    /**
     * Clean up expired OTPs
     */
    public function cleanupExpiredOtps()
    {
        return OtpVerification::where('expires_at', '<', Carbon::now())
            ->orWhere('created_at', '<', Carbon::now()->subHours(24))
            ->delete();
    }
}