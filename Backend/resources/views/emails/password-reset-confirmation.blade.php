<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FitSync - Password Reset Successful</title>
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
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
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
        .success-icon {
            text-align: center;
            font-size: 48px;
            color: #4CAF50;
            margin: 20px 0;
        }
        .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 12px; 
            color: #666; 
            padding: 20px;
            background: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Successful</h1>
        </div>
        <div class="content">
            <div class="success-icon">✓</div>
            
            <p>Hello {{ $user->name }},</p>
            
            <p>Your FitSync password has been successfully reset.</p>
            
            <p><strong>What to do next:</strong></p>
            <ul>
                <li>You can now login to your account using your new password</li>
                <li>Keep your password secure and don't share it with anyone</li>
                <li>If you didn't make this change, please contact support immediately</li>
            </ul>
            
            <p>Thank you for using FitSync!</p>
            
            <p>Best regards,<br>FitSync Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} FitSync. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>