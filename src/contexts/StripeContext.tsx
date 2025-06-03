import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise, { STRIPE_CONFIG } from '@/lib/stripe';

interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

interface StripeContextType {
  paymentIntent: PaymentIntent | null;
  isProcessing: boolean;
  createPaymentIntent: (amount: number, items: any[]) => Promise<PaymentIntent>;
  confirmPayment: (clientSecret: string, paymentMethod: any) => Promise<any>;
  setProcessing: (processing: boolean) => void;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider = ({ children }: StripeProviderProps) => {
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log('StripeProvider initialized');

  const createPaymentIntent = async (amount: number, items: any[]): Promise<PaymentIntent> => {
    console.log('Creating payment intent for amount:', amount, 'items:', items);
    
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate the response
      const response = await simulatePaymentIntentCreation(amount, items);
      
      const intent: PaymentIntent = {
        id: response.id,
        clientSecret: response.client_secret,
        amount: response.amount,
        currency: response.currency,
        status: response.status
      };
      
      setPaymentIntent(intent);
      console.log('Payment intent created:', intent);
      return intent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  };

  const confirmPayment = async (clientSecret: string, paymentMethod: any) => {
    console.log('Confirming payment with client secret:', clientSecret);
    
    try {
      // In a real app, this would use the actual Stripe API
      // For demo purposes, we'll simulate a successful payment
      const result = await simulatePaymentConfirmation(clientSecret, paymentMethod);
      console.log('Payment confirmed:', result);
      return result;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  };

  const setProcessing = (processing: boolean) => {
    setIsProcessing(processing);
  };

  const value = {
    paymentIntent,
    isProcessing,
    createPaymentIntent,
    confirmPayment,
    setProcessing
  };

  return (
    <StripeContext.Provider value={value}>
      <Elements stripe={stripePromise} options={STRIPE_CONFIG}>
        {children}
      </Elements>
    </StripeContext.Provider>
  );
};

// Simulate backend API calls for demo purposes
const simulatePaymentIntentCreation = async (amount: number, items: any[]) => {
  console.log('Simulating payment intent creation...');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `pi_${Math.random().toString(36).substr(2, 9)}`,
    client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    status: 'requires_payment_method'
  };
};

const simulatePaymentConfirmation = async (clientSecret: string, paymentMethod: any) => {
  console.log('Simulating payment confirmation...');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate success (90% success rate for demo)
  if (Math.random() > 0.1) {
    return {
      paymentIntent: {
        id: clientSecret.split('_')[0],
        status: 'succeeded',
        amount_received: paymentMethod.amount
      }
    };
  } else {
    throw new Error('Your card was declined. Please try a different payment method.');
  }
};