<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Membership;
use App\Models\MembershipPlan;
use App\Models\OtpVerification;
use App\Services\PaymentService;
use App\Services\OtpService;
use App\Services\EmailOtpService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    protected $paymentService;
    protected $otpService;
    protected $emailOtpService;

    public function __construct(
        PaymentService $paymentService, 
        OtpService $otpService,
        EmailOtpService $emailOtpService
    ) {
        $this->paymentService = $paymentService;
        $this->otpService = $otpService;
        $this->emailOtpService = $emailOtpService;
    }

    /**
     * Get payment methods
     */
    public function getPaymentMethods()
    {
        $methods = [
            [
                'id' => 'gcash',
                'name' => 'GCash',
                'description' => 'Pay using your GCash wallet',
                'icon' => 'G',
                'color' => 'green',
                'available' => true
            ],
            [
                'id' => 'paymaya',
                'name' => 'Maya',
                'description' => 'Pay using your Maya wallet',
                'icon' => 'M',
                'color' => 'purple',
                'available' => false
            ],
            [
                'id' => 'bank_transfer',
                'name' => 'Bank Transfer',
                'description' => 'Transfer from any local bank',
                'icon' => 'B',
                'color' => 'blue',
                'available' => false
            ]
        ];

        return response()->json([
            'payment_methods' => $methods
        ]);
    }

    /**
     * Create GCash payment and send OTP
     */
    public function createGcashPayment(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'required|string|max:20',
            'email' => 'required|email',
            'membership_type' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            Log::info("Starting GCash payment creation", $validated);

            // Get authenticated user
            $user = $request->user();
            
            if (!$user) {
                Log::error("No authenticated user found for payment creation");
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            Log::info("User making payment: " . $user->id);

            // Get membership plan for pricing
            $membershipPlan = MembershipPlan::where('type', $validated['membership_type'])->first();
            
            if (!$membershipPlan) {
                Log::error("Membership plan type not found: " . $validated['membership_type']);
                return response()->json([
                    'success' => false,
                    'message' => 'Membership type not found'
                ], 404);
            }

            // Create a temporary membership record
            $membership = Membership::create([
                'user_id' => $user->id,
                'type' => $validated['membership_type'],
                'price' => $membershipPlan->price,
                'start_date' => now(),
                'end_date' => now()->addDays(1),
                'status' => 'inactive',
            ]);

            Log::info("Temporary membership created", [
                'membership_id' => $membership->id,
                'type' => $membership->type,
                'status' => $membership->status
            ]);

            // Create payment with pending_otp status
            $payment = Payment::create([
                'user_id' => $user->id,
                'membership_id' => $membership->id,
                'reference_number' => Payment::generateReferenceNumber(),
                'amount' => $membershipPlan->price,
                'currency' => 'PHP',
                'payment_method' => 'gcash',
                'phone_number' => $validated['phone_number'],
                'email' => $validated['email'],
                'status' => 'pending_otp',
                'description' => "FitSync {$membershipPlan->name} Membership Payment",
            ]);

            Log::info("Payment created successfully", [
                'payment_id' => $payment->id,
                'reference' => $payment->reference_number,
                'membership_id' => $membership->id
            ]);

            // Generate OTP
            $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            Log::info("📧 OTP for payment {$payment->id}: {$otpCode} - Sent to: {$validated['email']}");
            
            // Create OTP record
            OtpVerification::create([
                'payment_id' => $payment->id,
                'user_id' => $user->id,
                'otp_code' => $otpCode,
                'phone_number' => $validated['phone_number'],
                'expires_at' => now()->addMinutes(10),
                'attempts' => 0
            ]);

            // SEND OTP EMAIL via Gmail
            try {
                Mail::send('emails.otp', [
                    'otpCode' => $otpCode,
                    'payment' => $payment,
                    'user' => $user
                ], function ($message) use ($validated, $payment) {
                    $message->to($validated['email'])
                            ->subject('Your FitSync OTP Verification Code')
                            ->from(config('mail.from.address'), config('mail.from.name'));
                });

                Log::info("OTP email sent successfully to: " . $validated['email']);

            } catch (\Exception $emailException) {
                Log::error('Failed to send OTP email: ' . $emailException->getMessage());
                // Don't rollback the transaction - the payment was created successfully
                // Just log the error and continue
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully to your email',
                'payment' => [
                    'id' => $payment->id,
                    'reference_number' => $payment->reference_number,
                    'status' => $payment->status
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('GCash payment creation failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify OTP and complete payment
     */
    public function verifyOtpAndCompletePayment(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'otp_code' => 'required|string|size:6'
        ]);

        DB::beginTransaction();

        try {
            $payment = Payment::where('user_id', $user->id)
                ->where('id', $request->payment_id)
                ->where('status', 'pending_otp')
                ->firstOrFail();

            Log::info("Verifying OTP for payment", [
                'payment_id' => $payment->id,
                'user_id' => $user->id
            ]);

            // Get the OTP verification record
            $otpVerification = OtpVerification::where('payment_id', $payment->id)
                ->where('otp_code', $request->otp_code)
                ->first();

            if (!$otpVerification) {
                Log::warning("Invalid OTP attempt for payment", [
                    'payment_id' => $payment->id,
                    'otp_attempt' => $request->otp_code
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid OTP code'
                ], 422);
            }

            // Check if OTP is expired
            if ($otpVerification->expires_at->isPast()) {
                Log::warning("Expired OTP attempt for payment", [
                    'payment_id' => $payment->id,
                    'expired_at' => $otpVerification->expires_at
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'OTP has expired. Please request a new one.'
                ], 422);
            }

            // Check if OTP is already verified
            if ($otpVerification->verified_at) {
                Log::warning("Already verified OTP attempt for payment", [
                    'payment_id' => $payment->id
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'OTP has already been verified'
                ], 422);
            }

            // Mark OTP as verified
            $otpVerification->update([
                'verified_at' => now(),
                'attempts' => $otpVerification->attempts + 1
            ]);

            // Update payment status to pending (waiting for payment processing)
            $payment->update([
                'status' => 'pending',
                'otp_verified_at' => now()
            ]);

            Log::info("OTP verified successfully for payment", [
                'payment_id' => $payment->id
            ]);

            // Process payment and activate membership
            $this->processGcashPayment($payment);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'OTP verified successfully. Payment processing...',
                'payment' => [
                    'id' => $payment->id,
                    'reference_number' => $payment->reference_number,
                    'status' => $payment->status,
                    'otp_verified_at' => $payment->otp_verified_at
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error verifying OTP and completing payment: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process GCash payment (simulated for now)
     */
    protected function processGcashPayment(Payment $payment)
    {
        try {
            Log::info("Processing GCash payment", [
                'payment_id' => $payment->id,
                'amount' => $payment->amount
            ]);

            // Simulate payment processing delay
            sleep(2);

            // Simulate successful payment (90% success rate for testing)
            $success = rand(1, 10) <= 9;

            if ($success) {
                $payment->update([
                    'status' => 'completed',
                    'paid_at' => now(),
                    'payment_details' => [
                        'gateway' => 'gcash',
                        'transaction_id' => 'GC' . time() . rand(1000, 9999),
                        'processed_at' => now()->toISOString(),
                        'status' => 'success'
                    ]
                ]);

                // Activate membership
                $this->activateMembership($payment);

                Log::info("GCash payment completed successfully", [
                    'payment_id' => $payment->id
                ]);
            } else {
                $payment->update([
                    'status' => 'failed',
                    'payment_details' => [
                        'gateway' => 'gcash',
                        'error' => 'Payment failed - Insufficient balance',
                        'processed_at' => now()->toISOString(),
                        'status' => 'failed'
                    ]
                ]);

                Log::warning("GCash payment failed", [
                    'payment_id' => $payment->id
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Error processing GCash payment: ' . $e->getMessage());
            $payment->update([
                'status' => 'failed',
                'payment_details' => [
                    'gateway' => 'gcash',
                    'error' => $e->getMessage(),
                    'processed_at' => now()->toISOString(),
                    'status' => 'error'
                ]
            ]);
        }
    }

    /**
     * Activate membership after successful payment
     */
    protected function activateMembership(Payment $payment)
    {
        try {
            $user = $payment->user;
            $membership = $payment->membership;

            // Calculate proper end date based on membership type
            $startDate = now();
            $endDate = $this->calculateMembershipEndDate($membership->type, $startDate);

            // Update the membership to active status with correct dates
            $membership->update([
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'active'
            ]);

            // Update user's membership type
            $user->update([
                'membership_type' => $membership->type,
                'membership_id' => $membership->id,
                'membership_start_date' => $startDate,
                'membership_end_date' => $endDate,
                'membership_status' => 'active'
            ]);

            Log::info("Membership activated for user", [
                'user_id' => $user->id,
                'membership_id' => $membership->id,
                'start_date' => $startDate,
                'end_date' => $endDate
            ]);

        } catch (\Exception $e) {
            Log::error('Error activating membership: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Calculate membership end date based on type
     */
    protected function calculateMembershipEndDate($type, $startDate)
    {
        switch ($type) {
            case 'Daily Plan':
                return $startDate->copy()->addDay();
            case 'Semi-Monthly Plan':
                return $startDate->copy()->addDays(15);
            case 'Monthly Plan':
                return $startDate->copy()->addMonth();
            default:
                return $startDate->copy()->addMonth();
        }
    }

    /**
     * Resend OTP with email sending
     */
    public function resendOtp(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'payment_id' => 'required|exists:payments,id'
        ]);

        try {
            $payment = Payment::where('user_id', $user->id)
                ->where('id', $request->payment_id)
                ->where('status', 'pending_otp')
                ->firstOrFail();

            Log::info("Resending OTP for payment", [
                'payment_id' => $payment->id,
                'user_id' => $user->id
            ]);

            // Generate new OTP
            $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Update existing OTP record or create new one
            OtpVerification::updateOrCreate(
                ['payment_id' => $payment->id],
                [
                    'otp_code' => $otpCode,
                    'expires_at' => now()->addMinutes(10),
                    'verified_at' => null,
                    'attempts' => 0
                ]
            );

            Log::info("📧 New OTP generated for payment {$payment->id}: {$otpCode}");

            // SEND RESEND OTP EMAIL via Gmail
            try {
                Mail::send('emails.otp', [
                    'otpCode' => $otpCode,
                    'payment' => $payment,
                    'user' => $user
                ], function ($message) use ($payment) {
                    $message->to($payment->email)
                            ->subject('Your FitSync OTP Verification Code - Resent')
                            ->from(config('mail.from.address'), config('mail.from.name'));
                });

                Log::info("OTP resend email sent successfully to: " . $payment->email);

            } catch (\Exception $emailException) {
                Log::error('Failed to resend OTP email: ' . $emailException->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'OTP generated but failed to send email. Please try again.'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'OTP resent to your email.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error resending OTP: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to resend OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check payment status
     */
    public function checkPaymentStatus(Request $request, $paymentId)
    {
        $user = $request->user();
        
        try {
            $payment = Payment::where('user_id', $user->id)
                ->where('id', $paymentId)
                ->firstOrFail();

            // Refresh payment data
            $payment->refresh();

            $response = [
                'success' => true,
                'payment_id' => $payment->id,
                'reference_number' => $payment->reference_number,
                'status' => $payment->status,
                'amount' => $payment->formatted_amount,
                'paid_at' => $payment->paid_at?->toISOString(),
                'otp_verified' => !is_null($payment->otp_verified_at),
                'membership_activated' => $payment->status === 'completed' && $user->membership_status === 'active'
            ];

            Log::info("Payment status checked", [
                'payment_id' => $payment->id,
                'status' => $payment->status
            ]);

            return response()->json($response);

        } catch (\Exception $e) {
            Log::error('Error checking payment status: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to check payment status'
            ], 500);
        }
    }

    /**
     * Get payment history
     */
    public function getPaymentHistory(Request $request)
    {
        $user = $request->user();
        
        $payments = $user->payments()
            ->with('membership')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'reference_number' => $payment->reference_number,
                    'amount' => $payment->formatted_amount,
                    'payment_method' => $payment->payment_method,
                    'status' => $payment->status,
                    'description' => $payment->description,
                    'created_at' => $payment->created_at->format('M d, Y H:i'),
                    'paid_at' => $payment->paid_at?->format('M d, Y H:i'),
                    'membership_type' => $payment->membership->type,
                    'otp_verified' => !is_null($payment->otp_verified_at)
                ];
            });

        return response()->json([
            'payments' => $payments
        ]);
    }

    /**
     * Get payment details
     */
    public function getPaymentDetails(Request $request, $paymentId)
    {
        $user = $request->user();
        
        $payment = $user->payments()
            ->with(['membership', 'otpVerification'])
            ->where('id', $paymentId)
            ->firstOrFail();

        return response()->json([
            'payment' => [
                'id' => $payment->id,
                'reference_number' => $payment->reference_number,
                'amount' => $payment->formatted_amount,
                'payment_method' => $payment->payment_method,
                'status' => $payment->status,
                'description' => $payment->description,
                'phone_number' => $payment->phone_number,
                'email' => $payment->email,
                'created_at' => $payment->created_at->format('M d, Y H:i'),
                'paid_at' => $payment->paid_at?->format('M d, Y H:i'),
                'otp_verified_at' => $payment->otp_verified_at?->format('M d, Y H:i'),
                'membership' => [
                    'name' => $payment->membership->type,
                    'type' => $payment->membership->type,
                    'duration' => $this->getDurationFromType($payment->membership->type)
                ],
                'payment_details' => $payment->payment_details
            ]
        ]);
    }

    /**
     * Get duration from membership type
     */
    private function getDurationFromType($type)
    {
        return match($type) {
            'Daily Plan' => '1 Day',
            'Semi-Monthly Plan' => '15 Days',
            'Monthly Plan' => '30 Days',
            default => '30 Days',
        };
    }

    /**
     * Cancel pending payment (including OTP pending)
     */
    public function cancelPayment(Request $request, $paymentId)
    {
        $user = $request->user();
        
        try {
            $payment = Payment::where('user_id', $user->id)
                ->where('id', $paymentId)
                ->whereIn('status', ['pending', 'pending_otp'])
                ->firstOrFail();

            $payment->update(['status' => 'cancelled']);

            // Also update the associated membership status
            if ($payment->membership) {
                $payment->membership->update(['status' => 'cancelled']);
            }

            Log::info("Payment cancelled", [
                'payment_id' => $payment->id,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment cancelled successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error cancelling payment: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel payment'
            ], 500);
        }
    }
}