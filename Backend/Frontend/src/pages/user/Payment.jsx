import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserLayout from "./UserLayout";
import api from "../../utils/axiosConfig";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  
  // Get the selected plan from navigation state
  const selectedPlan = location.state?.selectedPlan;
  const startDate = location.state?.startDate;

  useEffect(() => {
    // If no plan selected, redirect back to membership page
    if (!selectedPlan) {
      navigate('/user/membership');
      return;
    }

    fetchPaymentMethods();
  }, [selectedPlan, navigate]);

  // OTP Timer effect
  useEffect(() => {
    let interval;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const fetchPaymentMethods = async () => {
    try {
      // ✅ FIXED: Use consistent '/payments' endpoint
      const response = await api.get('/payments/methods');
      setPaymentMethods(response.data.payment_methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      alert("Please enter your GCash registered mobile number");
      return;
    }

    if (!email) {
      alert("Please enter your email address for OTP verification");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setProcessing(true);

    try {
      // ✅ FIXED: Use consistent '/payments' endpoint
      console.log('Creating GCash payment with:', { phoneNumber, email, membershipType: selectedPlan.type });
      
      const response = await api.post('/payments/gcash', {
        phone_number: phoneNumber,
        email: email,
        membership_type: selectedPlan.type
      });

      console.log('Payment creation response:', response.data);

      if (response.data.success) {
        setCurrentPayment(response.data.payment);
        setStep(3); // Move to OTP verification step
      } else {
        throw new Error(response.data.message);
      }
      
    } catch (error) {
      console.error('Payment error details:', error);
      console.error('Payment error response:', error.response);
      alert(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      alert("Please enter the complete 6-digit OTP");
      return;
    }

    setOtpVerifying(true);

    try {
      // ✅ FIXED: Use consistent '/payments' endpoint
      console.log('Verifying OTP for payment:', currentPayment.id);
      
      const response = await api.post('/payments/gcash/verify-otp', {
        payment_id: currentPayment.id,
        otp_code: otpCode
      });

      console.log('OTP verification response:', response.data);

      if (response.data.success) {
        setCurrentPayment(response.data.payment);
        setStep(4); // Move to payment processing status
        // Start polling for payment status
        await pollPaymentStatus(response.data.payment.id);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      console.error('OTP verification response:', error.response);
      alert(error.response?.data?.message || "OTP verification failed. Please try again.");
      // Clear OTP on failure
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      // ✅ FIXED: Use consistent '/payments' endpoint
      console.log('Resending OTP for payment:', currentPayment.id);
      
      const response = await api.post('/payments/gcash/resend-otp', {
        payment_id: currentPayment.id
      });

      console.log('Resend OTP response:', response.data);

      if (response.data.success) {
        setTimer(600); // Reset to 10 minutes
        setCanResendOtp(false);
        setOtp(["", "", "", "", "", ""]);
        alert("OTP has been resent to your email.");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      console.error('Resend OTP response:', error.response);
      alert(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const pollPaymentStatus = async (paymentId) => {
    const maxAttempts = 30; // 3 minutes maximum
    let attempts = 0;

    const checkStatus = async () => {
      try {
        // ✅ FIXED: Use consistent '/payments' endpoint
        const response = await api.get(`/payments/${paymentId}/status`);
        const { status, membership_activated } = response.data;

        console.log(`Payment status check [${attempts}]:`, status);

        if (status === 'completed') {
          alert(`Payment successful! Your ${selectedPlan.name} membership has been activated.`);
          setPhoneNumber("");
          setEmail("");
          setStep(1);
          setCurrentPayment(null);
          // Redirect back to membership page after successful payment
          setTimeout(() => navigate('/user/membership'), 2000);
          return true;
        } else if (status === 'failed') {
          alert("Payment failed. Please try again.");
          setStep(2);
          return true;
        }

        return false;
      } catch (error) {
        console.error('Status check error:', error);
        return false;
      }
    };

    const interval = setInterval(async () => {
      attempts++;
      const completed = await checkStatus();

      if (completed || attempts >= maxAttempts) {
        clearInterval(interval);
        if (attempts >= maxAttempts) {
          alert("Payment timeout. Please check your GCash app and try again.");
          setStep(2);
        }
      }
    }, 6000); // Check every 6 seconds
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhoneNumber(value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
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

  const formatPhoneNumber = (number) => {
    if (number.length <= 3) return number;
    if (number.length <= 7) return `${number.slice(0, 4)} ${number.slice(4)}`;
    return `${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(7)}`;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRenewalText = (planType) => {
    switch(planType) {
      case 'Daily Plan': return 'Single day access';
      case 'Semi-Monthly Plan': return 'Every 15 days';
      case 'Monthly Plan': return 'Every 30 days';
      default: return 'Every 30 days';
    }
  };

  if (!selectedPlan) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Redirecting to membership page...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  const hasDiscount = selectedPlan.original_price && selectedPlan.original_price > selectedPlan.price;
  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  return (
    <UserLayout>
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Payment</h1>
          <p className="text-gray-300">Secure payment for your FitSync membership</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step > stepNumber
                      ? 'bg-green-600 text-white'
                      : step === stepNumber
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {step > stepNumber ? '✓' : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > stepNumber ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-300">
            <div className="text-center" style={{ width: '25%' }}>Payment Method</div>
            <div className="text-center" style={{ width: '25%' }}>GCash Details</div>
            <div className="text-center" style={{ width: '25%' }}>OTP Verify</div>
            <div className="text-center" style={{ width: '25%' }}>Confirmation</div>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-gray-800 rounded-xl border border-red-600/50 shadow-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Payment Details</h2>
          </div>

          <div className="p-6">
            {/* Order Summary */}
            <div className="bg-gray-750 rounded-lg p-4 border border-gray-600 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Membership:</span>
                  <span className="text-white font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Duration:</span>
                  <span className="text-white font-medium">{selectedPlan.duration}</span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Original Price:</span>
                    <span className="text-gray-400 line-through">₱{selectedPlan.original_price?.toFixed(0) || selectedPlan.price.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-white font-medium">₱{selectedPlan.price.toFixed(0)}</span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">You Save:</span>
                    <span className="text-green-400 font-medium">{selectedPlan.discount || '0%'}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-300">Renewal:</span>
                  <span className="text-white font-medium">{getRenewalText(selectedPlan.type)}</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-red-400 font-bold">₱{selectedPlan.price.toFixed(0)}</span>
                  </div>
                  <p className="text-xs text-gray-400 text-right mt-1">Philippine Peso</p>
                </div>
              </div>
            </div>

            {/* Step 1: Payment Method Selection */}
            {step === 1 && (
              <div className="text-center">
                <h4 className="text-lg font-semibold text-white mb-4">Select Payment Method</h4>
                <p className="text-gray-300 text-sm mb-6">Choose how you'd like to pay for your membership</p>
                
                <div className="space-y-4 mb-6">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="block">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                        disabled={!method.available}
                      />
                      <div className={`bg-gray-750 border-2 rounded-lg p-4 transition-all duration-200 ${
                        method.available 
                          ? paymentMethod === method.id 
                            ? 'border-red-500 cursor-pointer bg-gray-700 shadow-lg' 
                            : 'border-gray-600 cursor-pointer hover:bg-gray-700 hover:border-gray-500'
                          : 'border-gray-600 opacity-50 cursor-not-allowed'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 ${
                              method.color === 'green' ? 'bg-green-500' :
                              method.color === 'purple' ? 'bg-purple-500' :
                              'bg-blue-500'
                            } rounded-full flex items-center justify-center`}>
                              <span className="text-white font-bold text-lg">{method.icon}</span>
                            </div>
                            <div className="text-left">
                              <h5 className="text-white font-semibold">{method.name}</h5>
                              <p className="text-gray-300 text-sm">{method.description}</p>
                            </div>
                          </div>
                          
                          {/* Selection Indicator */}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.id 
                              ? 'border-red-500 bg-red-500' 
                              : 'border-gray-500'
                          }`}>
                            {paymentMethod === method.id && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        {!method.available && (
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            <p className="text-yellow-400 text-xs">Coming soon - We're working on adding this payment method</p>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Continue Button - Only show if a payment method is selected and available */}
                {paymentMethod && selectedMethod?.available && (
                  <div className="space-y-3 mb-4">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all duration-200 border border-red-500 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/25"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Continue with {selectedMethod?.name}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <p className="text-gray-400 text-sm">
                      Secure payment processed through {selectedMethod?.name}
                    </p>
                  </div>
                )}

                {/* No selection state */}
                {!paymentMethod && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                    <p className="text-yellow-400 text-sm">
                      Please select a payment method to continue
                    </p>
                  </div>
                )}

                {/* Back to Membership Button */}
                <button
                  onClick={() => navigate('/user/membership')}
                  className="w-full px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
                >
                  ← Back to Membership Selection
                </button>
              </div>
            )}

            {/* Step 2: GCash Payment Form */}
            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">G</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">GCash Payment</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Enter your GCash registered mobile number and email for OTP verification
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mobile Number
                  </label>
                  <input 
                    type="tel"
                    value={formatPhoneNumber(phoneNumber)}
                    onChange={handlePhoneNumberChange}
                    placeholder="09XX XXX XXXX"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-center text-lg"
                    maxLength={13}
                  />
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Enter your 11-digit mobile number (09XXXXXXXXX)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="your-email@example.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    We'll send the OTP verification code to this email
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h5 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How it works:
                  </h5>
                  <ul className="text-green-300 text-sm space-y-1">
                    <li>• Enter your GCash registered mobile number</li>
                    <li>• Enter your email address for OTP verification</li>
                    <li>• You will receive an OTP via email</li>
                    <li>• Enter the OTP to confirm your payment</li>
                    <li>• Payment will be processed securely</li>
                    <li>• Your membership will be activated immediately</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!phoneNumber || phoneNumber.length !== 11 || !email || processing}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 disabled:bg-green-400 text-white rounded-lg transition-colors duration-200 border border-green-500 font-semibold disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Continue to OTP
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: OTP Verification */}
            {step === 3 && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Verify Payment</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Enter the 6-digit OTP sent to your email
                  </p>
                  {email && (
                    <p className="text-green-400 text-sm font-medium">
                      OTP sent to: {email}
                    </p>
                  )}
                </div>

                {/* OTP Input Fields */}
                <div className="space-y-4">
                  <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className="w-12 h-12 text-center text-xl font-semibold bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={otpVerifying}
                      />
                    ))}
                  </div>

                  {/* Timer and Resend */}
                  <div className="text-center">
                    <p className="text-gray-300 text-sm">
                      Time remaining: <span className="font-semibold">{formatTime(timer)}</span>
                    </p>
                    {canResendOtp && (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h5 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Check your email:
                  </h5>
                  <ul className="text-blue-300 text-sm space-y-1">
                    <li>• Look for an email from FitSync</li>
                    <li>• Subject: "FitSync Payment OTP Verification"</li>
                    <li>• Check your spam folder if you don't see it</li>
                    <li>• Enter the 6-digit code above</li>
                    <li>• Code expires in 10 minutes</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={otpVerifying}
                    className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200 disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={otp.join('').length !== 6 || otpVerifying}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 border border-blue-500 font-semibold disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {otpVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify OTP
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Processing & Status */}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                <h4 className="text-lg font-semibold text-white mb-2">Processing Payment</h4>
                <p className="text-gray-300 mb-4">
                  Your payment is being processed securely...
                </p>
                {currentPayment && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-300 text-sm">
                      OTP verified successfully. Processing GCash payment...
                    </p>
                    <p className="text-green-300 text-xs mt-1">
                      Reference: {currentPayment.reference_number}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
            <svg className="w-5 h-5 text-green-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-gray-300">Email OTP</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
            <svg className="w-5 h-5 text-green-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs text-gray-300">Secure Payment</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
            <svg className="w-5 h-5 text-green-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs text-gray-300">Money Back</p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}