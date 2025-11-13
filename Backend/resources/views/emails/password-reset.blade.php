<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FitSync - Password Reset</title>
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
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }
        .warning {
            background: #fff3cd;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
        }
        .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 12px; 
            color: #666; 
            padding: 20px;
            background: #f8f9fa;
        }
        .token-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            word-break: break-all;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>FitSync Password Reset</h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->name }},</p>
            
            <p>We received a request to reset your password for your FitSync account. Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="reset-button">Reset Your Password</a>
            </div>
            
            <p>Or copy and paste this URL in your browser:</p>
            <div class="token-info">
                {{ $resetUrl }}
            </div>
            
            <div class="warning">
                <strong>⚠️ Important:</strong> This password reset link will expire in 1 hour.
            </div>
            
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p>Thank you,<br>FitSync Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} FitSync. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>