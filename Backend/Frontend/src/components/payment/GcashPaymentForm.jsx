import React, { useState } from 'react';
import { usePaymentApi } from '../../hooks/usePaymentApi';
import { usePayment } from '../../contexts/PaymentContext';

const GcashPaymentForm = ({ membershipType, price, onSuccess, onCancel }) => {
  const { createGcashPayment, loading, error } = usePaymentApi();
  const { dispatch } = usePayment();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^09\d{9}$/.test(phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid 11-digit Philippine mobile number (09XXXXXXXXX)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await createGcashPayment({
        phone_number: phoneNumber,
        membership_type: membershipType,
      });

      dispatch({ 
        type: 'SET_PAYMENT', 
        payload: response.payment 
      });

      // Move to OTP verification step
      if (onSuccess) {
        onSuccess(response.payment);
      }
    } catch (err) {
      // Error is handled by the hook
      console.error('Payment creation failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">GCash Payment</h3>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Membership:</span>
          <span className="font-semibold">{membershipType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="text-xl font-bold text-green-600">₱{price.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            GCash Mobile Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="09XXXXXXXXX"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {formErrors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> You will receive an OTP via email to verify this payment.
        </p>
      </div>
    </div>
  );
};

export default GcashPaymentForm;