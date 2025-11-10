<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Membership;
use App\Services\PaymentService;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
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
     * Create GCash payment
     */
    public function createGcashPayment(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'phone_number' => 'required|string',
            'membership_type' => 'required|string|in:Premium,Yearly,Quarterly,Monthly,Semi-Monthly Plan,Daily Plan'
        ]);

        // Validate GCash number
        $validatedNumber = $this->paymentService->validateGcashNumber($request->phone_number);
        if (!$validatedNumber) {
            return response()->json([
                'message' => 'Please enter a valid 11-digit Philippine mobile number (09XXXXXXXXX)'
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Get or create membership
            $membership = $user->currentMembership ?? Membership::create([
                'user_id' => $user->id,
                'type' => $request->membership_type,
                'price' => Membership::getPrice($request->membership_type),
                'start_date' => now(),
                'end_date' => Membership::calculateEndDate($request->membership_type, now()),
                'status' => 'pending'
            ]);

            // Calculate amount in PHP
            $usdAmount = Membership::getPrice($request->membership_type);
            $phpAmount = $this->paymentService->convertToPHP($usdAmount);

            // Create payment record
            $payment = Payment::create([
                'user_id' => $user->id,
                'membership_id' => $membership->id,
                'reference_number' => Payment::generateReferenceNumber(),
                'amount' => $phpAmount,
                'currency' => 'PHP',
                'payment_method' => 'gcash',
                'phone_number' => $validatedNumber,
                'status' => 'pending',
                'description' => "FitSync {$request->membership_type} Membership Payment"
            ]);

            // Create GCash payment request
            $gcashResponse = $this->paymentService->createGcashPayment($payment, $validatedNumber);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'GCash payment request created successfully',
                'payment' => [
                    'id' => $payment->id,
                    'reference_number' => $payment->reference_number,
                    'amount' => $payment->formatted_amount,
                    'phone_number' => $this->paymentService->formatPhoneNumber($validatedNumber),
                    'gcash_details' => $gcashResponse,
                    'membership_type' => $request->membership_type
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check payment status
     */
    public function checkPaymentStatus(Request $request, $paymentId)
    {
        $user = $request->user();
        
        $payment = Payment::where('user_id', $user->id)
            ->where('id', $paymentId)
            ->firstOrFail();

        // Check GCash status
        $status = $this->paymentService->checkGcashPaymentStatus($payment);

        // Refresh payment data
        $payment->refresh();

        return response()->json([
            'payment_id' => $payment->id,
            'reference_number' => $payment->reference_number,
            'status' => $payment->status,
            'amount' => $payment->formatted_amount,
            'paid_at' => $payment->paid_at?->toISOString(),
            'membership_activated' => $payment->membership->status === 'active'
        ]);
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
                    'membership_type' => $payment->membership->type
                ];
            });

        return response()->json([
            'payments' => $payments
        ]);
    }

    /**
     * Cancel pending payment
     */
    public function cancelPayment(Request $request, $paymentId)
    {
        $user = $request->user();
        
        $payment = Payment::where('user_id', $user->id)
            ->where('id', $paymentId)
            ->where('status', 'pending')
            ->firstOrFail();

        $payment->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Payment cancelled successfully'
        ]);
    }

    /**
     * Get payment details
     */
    public function getPaymentDetails(Request $request, $paymentId)
    {
        $user = $request->user();
        
        $payment = Payment::where('user_id', $user->id)
            ->with('membership')
            ->findOrFail($paymentId);

        return response()->json([
            'payment' => [
                'id' => $payment->id,
                'reference_number' => $payment->reference_number,
                'amount' => $payment->formatted_amount,
                'payment_method' => $payment->payment_method,
                'phone_number' => $this->paymentService->formatPhoneNumber($payment->phone_number),
                'status' => $payment->status,
                'description' => $payment->description,
                'created_at' => $payment->created_at->format('M d, Y H:i'),
                'paid_at' => $payment->paid_at?->format('M d, Y H:i'),
                'gcash_details' => $payment->payment_details,
                'membership' => [
                    'type' => $payment->membership->type,
                    'status' => $payment->membership->status
                ]
            ]
        ]);
    }
}