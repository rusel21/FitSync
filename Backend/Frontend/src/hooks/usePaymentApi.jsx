import { useState } from 'react';
import { usePayment } from '../contexts/PaymentContext';

export const usePaymentApi = () => {
  const { dispatch } = usePayment();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiRequest = async (url, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      dispatch({ type: 'SET_LOADING', payload: true });

      const token = localStorage.getItem('auth_token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        ...options,
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (err) {
      setError(err.message);
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    } finally {
      setLoading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Create GCash payment and request OTP
  const createGcashPayment = async (paymentData) => {
    return await apiRequest('/payments/gcash', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  };

  // Verify OTP and complete payment
  const verifyOtpAndCompletePayment = async (verificationData) => {
    return await apiRequest('/payments/gcash/verify-otp', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  };

  // Resend OTP
  const resendOtp = async (paymentId) => {
    return await apiRequest('/payments/gcash/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ payment_id: paymentId }),
    });
  };

  // Check payment status
  const checkPaymentStatus = async (paymentId) => {
    return await apiRequest(`/payments/${paymentId}/status`);
  };

  // Get payment history
  const getPaymentHistory = async () => {
    return await apiRequest('/payments/history');
  };

  // Cancel payment
  const cancelPayment = async (paymentId) => {
    return await apiRequest(`/payments/${paymentId}/cancel`, {
      method: 'POST',
    });
  };

  return {
    loading,
    error,
    createGcashPayment,
    verifyOtpAndCompletePayment,
    resendOtp,
    checkPaymentStatus,
    getPaymentHistory,
    cancelPayment,
  };
};