import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentConfirmation = () => {
  const { id } = useParams(); // Order ID
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error

  useEffect(() => {
    const confirmOrder = async () => {
      const paymentIntentId = searchParams.get('payment_intent');
      const updatedOrderData = sessionStorage.getItem('finalOrderData');

      if (!paymentIntentId || !updatedOrderData) {
        setStatus('error');
        return;
      }

      try {
        const res = await axios.put(`http://localhost:5000/api/orders/update-on-success/${id}`, {
          paymentIntentId,
          updatedOrderData: JSON.parse(updatedOrderData),
        });

        if (res.data.success) {
          setStatus('success');
          sessionStorage.removeItem('finalOrderData'); // Clean up
          // Automatically redirect to the final order review page after a short delay
          setTimeout(() => {
            navigate(`/order-details/${id}`, { state: { orderData: res.data.order } });
          }, 3000);
        }
      } catch (err) {
        setStatus('error');
      }
    };

    confirmOrder();
  }, [id, searchParams, navigate]);

  if (status === 'processing') {
    return <div style={{ textAlign: 'center', padding: '50px' }}><h2>Confirming your payment and updating your order...</h2></div>;
  }

  if (status === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>❌ Order Update Failed</h1>
        <p>There was an issue confirming your payment. Please contact support.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>✅ Payment Successful!</h1>
      <p>Your order has been confirmed. You will be redirected shortly.</p>
    </div>
  );
};

export default PaymentConfirmation;