import React, { useState, useEffect, useRef } from 'react';
import { usePaymentApi } from '../../hooks/usePaymentApi';
import { usePayment } from '../../contexts/PaymentContext';

const OtpVerification = ({ payment, onVerificationSuccess, onBack }) => {
  const { verifyOtpAndCompletePayment, resendOtp, loading, error } = usePaymentApi();
  const { dispatch } = usePayment();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 6).split('');
    
    if (pastedOtp.every(char => /^\d?$/.test(char))) {
      const newOtp = [...otp];
      pastedOtp.forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      dispatch({ type: 'SET_ERROR', payload: 'Please enter the complete 6-digit OTP' });
      return;
    }

    try {
      const response = await verifyOtpAndCompletePayment({
        payment_id: payment.id,
        otp_code: otpCode,
      });

      dispatch({ 
        type: 'SET_PAYMENT', 
        payload: response.payment 
      });

      if (onVerificationSuccess) {
        onVerificationSuccess(response.payment);
      }
    } catch (err) {
      // Error is handled by the hook
      console.error('OTP verification failed:', err);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp(payment.id);
      setTimer(600); // Reset to 10 minutes
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
      
      // Show success message
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (err) {
      console.error('Resend OTP failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Verify Payment</h3>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600">We sent a 6-digit OTP to your email</p>
          <p className="text-lg font-semibold mt-1">{payment?.reference_number}</p>
          <p className="text-2xl font-bold text-green-600 mt-2">₱{payment?.amount}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter 6-digit OTP
          </label>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Time remaining: <span className="font-semibold">{formatTime(timer)}</span>
          </p>
          {canResend && (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Complete Payment'}
          </button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800 text-center">
          Check your email for the OTP code. The code will expire in 10 minutes.
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;