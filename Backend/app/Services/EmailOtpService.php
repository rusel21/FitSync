<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\OtpVerification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailOtpService
{
    /**
     * Send OTP via email
     */
    public function sendOtp($email, $paymentId)
    {
        try {
            Log::info("Attempting to send OTP email to: {$email} for payment: {$paymentId}");

            // Find payment
            $payment = Payment::find($paymentId);
            
            if (!$payment) {
                Log::error("Payment not found for ID: {$paymentId}");
                return false;
            }

            // Generate OTP
            $otpCode = OtpVerification::generateOtp();
            $expiresAt = now()->addMinutes(10);

            Log::info("Generated OTP: {$otpCode} for payment: {$paymentId}");

            // Create or update OTP verification
            OtpVerification::updateOrCreate(
                ['payment_id' => $payment->id],
                [
                    'otp_code' => $otpCode,
                    'phone_number' => $payment->phone_number,
                    'expires_at' => $expiresAt,
                    'verified_at' => null,
                    'attempts' => 0
                ]
            );

            Log::info("OTP record created for payment: {$paymentId}");

            // For development: Log the OTP instead of sending email
            if (app()->environment('local')) {
                Log::info("📧 [DEV] OTP Email would be sent to: {$email}");
                Log::info("📧 [DEV] OTP Code: {$otpCode}");
                Log::info("📧 [DEV] Payment Reference: {$payment->reference_number}");
                return true;
            }

            // For production: Actually send email
            Mail::send('emails.otp', [
                'otpCode' => $otpCode,
                'referenceNumber' => $payment->reference_number,
                'expiresAt' => $expiresAt->format('F j, Y g:i A'),
                'amount' => $payment->amount,
                'membership' => $payment->membership->name ?? 'Unknown Membership'
            ], function ($message) use ($email) {
                $message->to($email)
                        ->subject('FitSync - OTP Verification for Your Payment');
            });

            Log::info("OTP email sent successfully to: {$email}");
            return true;

        } catch (\Exception $e) {
            Log::error("Email OTP failed for {$email}: " . $e->getMessage());
            Log::error("Stack trace: " . $e->getTraceAsString());
            return false;
        }
    }
}