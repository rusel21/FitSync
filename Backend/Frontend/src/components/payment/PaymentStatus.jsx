import React, { useState, useEffect } from 'react';
import { usePaymentApi } from '../../hooks/usePaymentApi';
import { usePayment } from '../../contexts/PaymentContext';

const PaymentStatus = ({ payment, onComplete }) => {
  const { checkPaymentStatus, loading } = usePaymentApi();
  const { dispatch } = usePayment();
  const [status, setStatus] = useState(payment?.status || 'pending');
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    let interval;

    if (polling && payment?.id) {
      interval = setInterval(async () => {
        try {
          const response = await checkPaymentStatus(payment.id);
          setStatus(response.status);

          if (response.status === 'completed' || response.status === 'failed') {
            setPolling(false);
            dispatch({ type: 'SET_PAYMENT', payload: response });

            if (response.status === 'completed' && onComplete) {
              onComplete(response);
            }
          }
        } catch (err) {
          console.error('Error checking payment status:', err);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [polling, payment?.id, checkPaymentStatus, dispatch, onComplete]);

  const getStatusInfo = () => {
    switch (status) {
      case 'pending_otp':
        return {
          color: 'yellow',
          icon: '⏳',
          title: 'Waiting for OTP Verification',
          message: 'Please complete OTP verification to proceed with payment.',
        };
      case 'pending':
        return {
          color: 'blue',
          icon: '⏳',
          title: 'Payment Processing',
          message: 'Your payment is being processed. This may take a few moments.',
        };
      case 'completed':
        return {
          color: 'green',
          icon: '✅',
          title: 'Payment Successful',
          message: 'Your payment has been processed successfully. Your membership has been activated.',
        };
      case 'failed':
        return {
          color: 'red',
          icon: '❌',
          title: 'Payment Failed',
          message: 'We encountered an issue processing your payment. Please try again.',
        };
      default:
        return {
          color: 'gray',
          icon: '❓',
          title: 'Unknown Status',
          message: 'Unable to determine payment status.',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        <div className={`text-4xl mb-4 text-${statusInfo.color}-500`}>
          {statusInfo.icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{statusInfo.title}</h3>
        <p className="text-gray-600 mb-4">{statusInfo.message}</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <span className="text-gray-500">Reference:</span>
              <p className="font-semibold">{payment?.reference_number}</p>
            </div>
            <div className="text-left">
              <span className="text-gray-500">Amount:</span>
              <p className="font-semibold">₱{payment?.amount}</p>
            </div>
            <div className="text-left">
              <span className="text-gray-500">Method:</span>
              <p className="font-semibold capitalize">{payment?.payment_method}</p>
            </div>
            <div className="text-left">
              <span className="text-gray-500">Status:</span>
              <p className="font-semibold capitalize">{status}</p>
            </div>
          </div>
        </div>

        {polling && status === 'pending' && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm">Checking status...</span>
          </div>
        )}

        {status === 'completed' && (
          <button
            onClick={() => onComplete && onComplete(payment)}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Continue
          </button>
        )}

        {status === 'failed' && (
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;