import React, { useState, useEffect } from "react";
import UserLayout from "./UserLayout";
import api from "../../utils/axiosConfig";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [membershipType, setMembershipType] = useState("Premium");

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get('/payment/methods');
      setPaymentMethods(response.data.payment_methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      alert("Please enter your GCash registered mobile number");
      return;
    }

    setStep(3);
    setProcessing(true);

    try {
      // Create GCash payment
      const response = await api.post('/payment/gcash', {
        phone_number: phoneNumber,
        membership_type: membershipType
      });

      if (response.data.success) {
        setCurrentPayment(response.data.payment);
        
        // Poll for payment status
        await pollPaymentStatus(response.data.payment.id);
      } else {
        throw new Error(response.data.message);
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || "Payment failed. Please try again.");
      setStep(2);
    } finally {
      setProcessing(false);
    }
  };

  const pollPaymentStatus = async (paymentId) => {
    const maxAttempts = 30; // 3 minutes maximum
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const response = await api.get(`/payment/${paymentId}/status`);
        const { status, membership_activated } = response.data;

        if (status === 'completed') {
          alert(`Payment successful! Your ${membershipType} membership has been activated.`);
          setPhoneNumber("");
          setStep(1);
          setCurrentPayment(null);
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

  const formatPhoneNumber = (number) => {
    if (number.length <= 3) return number;
    if (number.length <= 7) return `${number.slice(0, 4)} ${number.slice(4)}`;
    return `${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(7)}`;
  };

  const getMembershipPrice = (type) => {
    const prices = {
      'Premium': 99.00,
      'Yearly': 79.00,
      'Quarterly': 89.00,
      'Monthly': 99.00,
      'Semi-Monthly Plan': 45.00,
      'Daily Plan': 10.00
    };
    return prices[type] || 99.00;
  };

  const convertToPHP = (usdAmount) => {
    const exchangeRate = 56.50;
    return (usdAmount * exchangeRate).toFixed(2);
  };

  const usdPrice = getMembershipPrice(membershipType);
  const phpAmount = convertToPHP(usdPrice);

  return (
    <UserLayout>
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Payment</h1>
          <p className="text-gray-300">Secure payment for your FitSync membership</p>
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
                  <span className="text-white font-medium">{membershipType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount (USD):</span>
                  <span className="text-white font-medium">${usdPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Renewal:</span>
                  <span className="text-white font-medium">Every 30 days</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-red-400 font-bold">₱{phpAmount}</span>
                  </div>
                  <p className="text-xs text-gray-400 text-right mt-1">*Converted to Philippine Peso</p>
                </div>
              </div>
            </div>

            {/* Membership Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Membership Type
              </label>
              <select
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                <option value="Premium">Premium - $99/month</option>
                <option value="Yearly">Yearly - $79/month</option>
                <option value="Quarterly">Quarterly - $89/month</option>
                <option value="Monthly">Monthly - $99/month</option>
                <option value="Semi-Monthly Plan">Semi-Monthly - $45/15 days</option>
                <option value="Daily Plan">Daily - $10/day</option>
              </select>
            </div>

            {/* Step 1: Payment Method Selection */}
            {step === 1 && (
              <div className="text-center">
                <h4 className="text-lg font-semibold text-white mb-4">Select Payment Method</h4>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="block">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                          if (method.available) {
                            setStep(2);
                          }
                        }}
                        className="sr-only"
                        disabled={!method.available}
                      />
                      <div className={`bg-gray-750 border-2 rounded-lg p-4 transition-colors ${
                        method.available 
                          ? paymentMethod === method.id 
                            ? 'border-green-500 cursor-pointer' 
                            : 'border-gray-600 cursor-pointer hover:bg-gray-700'
                          : 'border-gray-600 opacity-50 cursor-not-allowed'
                      }`}>
                        <div className="flex items-center justify-center space-x-3">
                          <div className={`w-12 h-12 bg-${method.color}-500 rounded-full flex items-center justify-center`}>
                            <span className="text-white font-bold text-lg">{method.icon}</span>
                          </div>
                          <div className="text-left">
                            <h5 className="text-white font-semibold">{method.name}</h5>
                            <p className="text-gray-300 text-sm">{method.description}</p>
                            {!method.available && (
                              <p className="text-yellow-400 text-xs mt-1">Coming soon</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: GCash Payment Form */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">G</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">GCash Payment</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Enter your GCash registered mobile number
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

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h5 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How it works:
                  </h5>
                  <ul className="text-green-300 text-sm space-y-1">
                    <li>• Enter your GCash registered mobile number</li>
                    <li>• You will receive a payment request via GCash app</li>
                    <li>• Confirm the payment in your GCash app</li>
                    <li>• Payment will be processed instantly</li>
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
                    disabled={!phoneNumber || phoneNumber.length !== 11}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 disabled:bg-green-400 text-white rounded-lg transition-colors duration-200 border border-green-500 font-semibold disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pay ₱{phpAmount}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Processing */}
            {step === 3 && (
              <div className="text-center py-8">
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <h4 className="text-lg font-semibold text-white mb-2">Processing Payment</h4>
                    <p className="text-gray-300">
                      Please check your GCash app to confirm the payment...
                    </p>
                    {currentPayment && (
                      <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-green-300 text-sm">
                          A payment request for ₱{phpAmount} has been sent to {formatPhoneNumber(phoneNumber)}
                        </p>
                        <p className="text-green-300 text-xs mt-1">
                          Reference: {currentPayment.reference_number}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Payment Successful!</h4>
                    <p className="text-gray-300 mb-4">
                      Your {membershipType} membership has been activated successfully.
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors duration-200 border border-green-500 font-semibold"
                    >
                      Make Another Payment
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
            <svg className="w-5 h-5 text-green-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs text-gray-300">GCash Secure</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
            <svg className="w-5 h-5 text-green-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs text-gray-300">Instant Payment</p>
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