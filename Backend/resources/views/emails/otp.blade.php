<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FitSync OTP Verification</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content { 
            padding: 30px; 
        }
        .otp-code { 
            font-size: 32px; 
            font-weight: bold; 
            color: #667eea; 
            text-align: center; 
            letter-spacing: 5px; 
            margin: 20px 0; 
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            border: 2px dashed #667eea;
        }
        .payment-details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .payment-details ul {
            margin: 0;
            padding-left: 20px;
        }
        .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 12px; 
            color: #666; 
            padding: 20px;
            background: #f8f9fa;
        }
        .warning {
            background: #fff3cd;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>FitSync OTP Verification</h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->name ?? 'Valued Customer' }},</p>
            
            <p>Your One-Time Password (OTP) for your FitSync membership payment is:</p>
            
            <div class="otp-code">{{ $otpCode }}</div>
            
            <div class="warning">
                <strong>⚠️ Important:</strong> This OTP will expire in <strong>10 minutes</strong>.
            </div>
            
            <div class="payment-details">
                <p><strong>Payment Details:</strong></p>
                <ul>
                    <li><strong>Reference Number:</strong> {{ $payment->reference_number }}</li>
                    <li><strong>Amount:</strong> ₱{{ number_format($payment->amount, 2) }}</li>
                    <li><strong>Membership:</strong> {{ $payment->description }}</li>
                    <li><strong>Payment Method:</strong> {{ ucfirst($payment->payment_method) }}</li>
                    <li><strong>Date:</strong> {{ $payment->created_at->format('F d, Y \a\t h:i A') }}</li>
                </ul>
            </div>
            
            <p><strong>Need help?</strong></p>
            <p>If you didn't request this OTP or need assistance, please contact our support team immediately or ignore this email.</p>
            
            <p>Thank you for choosing FitSync!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} FitSync. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>