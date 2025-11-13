import React, { createContext, useContext, useReducer } from 'react';

const PaymentContext = createContext();

const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PAYMENT':
      return { ...state, currentPayment: action.payload };
    case 'SET_OTP_VERIFICATION':
      return { ...state, otpVerification: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_PAYMENT':
      return { ...state, currentPayment: null, otpVerification: null, error: null };
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  currentPayment: null,
  otpVerification: null,
  error: null,
};

export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  return (
    <PaymentContext.Provider value={{ state, dispatch }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};