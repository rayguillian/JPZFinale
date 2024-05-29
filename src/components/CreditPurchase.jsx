import React, { useState } from 'react';
import { stripePromise } from '../stripe';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

const CreditPurchase = () => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const stripe = await stripePromise;
    const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
    
    try {
      const { data: { clientSecret } } = await createPaymentIntent({ amount });

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // Placeholder for actual card details input
          }
        }
      });

      if (stripeError) {
        setError('Payment failed. Please try again.');
        console.error('Payment failed', stripeError);
      } else {
        setSuccess('Payment successful!');
        setAmount(0);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Error creating payment intent', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Purchase Credits</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handlePurchase}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Purchase'}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </div>
    </div>
  );
};

export default CreditPurchase;
