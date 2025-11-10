<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Membership;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    private $gcashBaseUrl;
    private $gcashSecretKey;

    public function __construct()
    {
        // In a real application, these would be in your .env file
        $this->gcashBaseUrl = config('services.gcash.base_url', 'https://api.gcash.com');
        $this->gcashSecretKey = config('services.gcash.secret_key');
    }

    /**
     * Create GCash payment request
     */
    public function createGcashPayment(Payment $payment, $phoneNumber)
    {
        try {
            // In a real implementation, you would call GCash API here
            // This is a simulation of GCash API integration
            
            $gcashResponse = [
                'success' => true,
                'payment_id' => 'GCASH_' . uniqid(),
                'qr_code' => 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($payment->reference_number),
                'expires_at' => now()->addMinutes(15)->toISOString(),
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'status' => 'pending'
            ];

            // Update payment with GCash details
            $payment->update([
                'payment_details' => $gcashResponse,
                'phone_number' => $phoneNumber
            ]);

            return $gcashResponse;

        } catch (\Exception $e) {
            Log::error('GCash payment creation failed: ' . $e->getMessage());
            throw new \Exception('Failed to create GCash payment');
        }
    }

    /**
     * Check GCash payment status
     */
    public function checkGcashPaymentStatus(Payment $payment)
    {
        try {
            // Simulate GCash status check
            // In real implementation, you would call GCash API
            
            $randomStatus = rand(1, 10) > 2 ? 'completed' : 'pending'; // 80% success rate
            
            if ($randomStatus === 'completed') {
                $payment->update([
                    'status' => 'completed',
                    'paid_at' => now(),
                    'payment_details' => array_merge(
                        $payment->payment_details ?? [],
                        ['confirmed_at' => now()->toISOString()]
                    )
                ]);

                // Activate membership
                $this->activateMembership($payment);
            }

            return $randomStatus;

        } catch (\Exception $e) {
            Log::error('GCash status check failed: ' . $e->getMessage());
            return 'failed';
        }
    }

    /**
     * Activate membership after successful payment
     */
    private function activateMembership(Payment $payment)
    {
        $membership = $payment->membership;
        
        if ($membership) {
            $membership->update([
                'status' => 'active',
                'start_date' => now(),
                'end_date' => Membership::calculateEndDate($membership->type, now())
            ]);
        }
    }

    /**
     * Convert USD to PHP (simplified conversion)
     */
    public function convertToPHP($usdAmount)
    {
        // In real implementation, use current exchange rate API
        $exchangeRate = 56.50; // Example rate
        return round($usdAmount * $exchangeRate, 2);
    }

    /**
     * Validate GCash phone number
     */
    public function validateGcashNumber($phoneNumber)
    {
        // Remove any non-digit characters
        $cleanNumber = preg_replace('/\D/', '', $phoneNumber);
        
        // Check if it's a valid Philippine mobile number
        if (strlen($cleanNumber) !== 11 || !preg_match('/^09\d{9}$/', $cleanNumber)) {
            return false;
        }

        return $cleanNumber;
    }

    /**
     * Format phone number for display
     */
    public function formatPhoneNumber($phoneNumber)
    {
        $cleanNumber = preg_replace('/\D/', '', $phoneNumber);
        
        if (strlen($cleanNumber) === 11) {
            return substr($cleanNumber, 0, 4) . ' ' . substr($cleanNumber, 4, 3) . ' ' . substr($cleanNumber, 7);
        }
        
        return $phoneNumber;
    }
}