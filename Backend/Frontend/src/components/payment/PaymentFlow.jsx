import React, { useState } from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import GcashPaymentForm from './GcashPaymentForm';
import OtpVerification from './OtpVerification';
import PaymentStatus from './PaymentStatus';

const PaymentFlow = ({ membershipType, price, onComplete, onCancel }) => {
  const { state } = usePayment();
  const [currentStep, setCurrentStep] = useState('payment'); // payment -> otp -> status

  const handlePaymentSuccess = (payment) => {
    setCurrentStep('otp');
  };

  const handleOtpSuccess = (payment) => {
    setCurrentStep('status');
  };

  const handleOtpBack = () => {
    setCurrentStep('payment');
  };

  const handlePaymentComplete = (payment) => {
    if (onComplete) {
      onComplete(payment);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'payment':
        return (
          <GcashPaymentForm
            membershipType={membershipType}
            price={price}
            onSuccess={handlePaymentSuccess}
            onCancel={onCancel}
          />
        );
      case 'otp':
        return (
          <OtpVerification
            payment={state.currentPayment}
            onVerificationSuccess={handleOtpSuccess}
            onBack={handleOtpBack}
          />
        );
      case 'status':
        return (
          <PaymentStatus
            payment={state.currentPayment}
            onComplete={handlePaymentComplete}
          />
        );
      default:
        return null;
    }
  };

  const getStepProgress = () => {
    const steps = [
      { name: 'Payment Details', status: currentStep === 'payment' ? 'current' : currentStep > 'payment' ? 'complete' : 'upcoming' },
      { name: 'OTP Verification', status: currentStep === 'otp' ? 'current' : currentStep > 'otp' ? 'complete' : 'upcoming' },
      { name: 'Confirmation', status: currentStep === 'status' ? 'current' : 'upcoming' },
    ];

    return steps;
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {getStepProgress().map((step, index) => (
            <div key={step.name} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.status === 'complete'
                    ? 'bg-green-600 text-white'
                    : step.status === 'current'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.status === 'complete' ? '✓' : index + 1}
              </div>
              {index < getStepProgress().length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step.status === 'complete' ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {getStepProgress().map((step) => (
            <div
              key={step.name}
              className={`text-center ${
                step.status === 'current' ? 'text-blue-600 font-medium' : ''
              }`}
              style={{ width: '33.333%' }}
            >
              {step.name}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      {renderStep()}
    </div>
  );
};

export default PaymentFlow;