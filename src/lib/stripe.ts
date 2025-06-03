import { loadStripe } from '@stripe/stripe-js';

// This is your test publishable API key.
const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef');

export default stripePromise;

export const STRIPE_CONFIG = {
  currency: 'usd',
  country: 'US',
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#8B4513',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
    },
  },
};