import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useStripe, useElements, CardElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

const CreditPurchaseModal = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [customCredits, setCustomCredits] = useState(0);
  const [customDKK, setCustomDKK] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  const handleCustomCreditChange = (e) => {
    const credits = Math.max(0, e.target.value); // Ensure credits don't go below 0
    setCustomCredits(credits);
    setCustomDKK(credits * 5);
  };

  const packages = [
    { credits: 50, price: 200 },  // Save 20%
    { credits: 100, price: 375 }, // Save 25%
    { credits: 200, price: 700 }, // Save 30%
    { credits: 500, price: 1500 } // Save 40%
  ];

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'DK',
        currency: 'dkk',
        total: {
          label: 'Total',
          amount: customDKK,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
          setCanMakePayment(true);
        }
      });
    }
  }, [stripe, customDKK]);

  const handlePurchase = async (amount) => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
    const { data: { clientSecret } } = await createPaymentIntent({ amount });

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    });

    if (error) {
      setError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      // Handle post-payment actions (e.g., update user credits)
      onClose();
    }

    setLoading(false);
  };

  return (
    <Modal>
      <div className="relative bg-white bg-opacity-95 rounded-3xl shadow-lg p-6 md:p-8 m-4 max-w-2xl w-full text-center">
        <button onClick={onClose} className="absolute top-4 left-4 text-2xl font-bold text-red-500 hover:text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-6 mochiy-pop-one-regular" style={{ WebkitTextStroke: '1px black', textShadow: '1px 1px 2px black' }}>Vælg en pakke!</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {packages.map((pkg, index) => (
            <button key={index} onClick={() => handlePurchase(pkg.price)} className="bg-yellow-500 text-white py-4 px-6 rounded-full shadow-md hover:bg-yellow-600">
              {pkg.credits} Credits - {pkg.price} DKK
            </button>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4 mochiy-pop-one-regular" style={{ WebkitTextStroke: '1px black', textShadow: '1px 1px 2px black' }}>Eller vælg antal credits (🎉)</h2>
        <input
          type="number"
          value={customCredits}
          onChange={handleCustomCreditChange}
          placeholder="Antal credits"
          className="border p-2 rounded-full w-full mb-4"
        />
        <p className="mb-4 text-gray-500" style={{ fontWeight: '300' }}>(= {customDKK.toFixed(2).replace('.', ',')} kroner)</p>
        <CardElement className="border p-2 rounded-full w-full mb-4" />
        {canMakePayment && paymentRequest && (
          <PaymentRequestButtonElement
            options={{ paymentRequest }}
            className="mb-4"
          />
        )}
        <button
          onClick={() => handlePurchase(customDKK)}
          className="border-2 border-green-500 text-green-500 py-3 px-6 rounded-full shadow-md hover:bg-green-500 hover:text-white mb-4 text-xl w-full"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Køb'}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </Modal>
  );
};

export default CreditPurchaseModal;
