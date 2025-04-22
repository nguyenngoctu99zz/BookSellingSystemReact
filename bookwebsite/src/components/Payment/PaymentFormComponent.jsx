import React, { useState } from 'react';
import axios from 'axios';
import { getUserIdFromToken, getToken } from '../../utils/auth';
const PaymentForm = ({ onSuccess, onCancel, bookDetails }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/v1/payment/submitOrder",
      {
        paymentMethod: paymentMethod,
        orderInfo: `user:${getUserIdFromToken()},product:${bookDetails.id},quantity:${bookDetails.quantity}`,
        amount: 100000
        // bookDetails.price * bookDetails.quantity
      },
      {
        headers: {
          'Content-Type': 'application/json',
          "Authorization":`Bearer ${getToken()}`
        }
      });

      console.log(response.data);
      if (response.data.message) {
        window.location.href = response.data.message;
      } else {
        onSuccess(); // Close popup on success
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  return (
    <div>
      <h5 className="text-center mb-4">Payment for: {bookDetails.title}</h5>
      <p className="text-center mb-4">Total: ${(bookDetails.price * bookDetails.quantity).toFixed(2)}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="radio"
            name="payment"
            id="cod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label className="form-check-label" htmlFor="cod">
            Cash on Delivery (COD)
          </label>
        </div>
        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="radio"
            name="payment"
            id="vnpay"
            value="VNPAY"
            checked={paymentMethod === "VNPAY"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label className="form-check-label" htmlFor="vnpay">
            VNPAY
          </label>
        </div>
        <div className="d-flex justify-content-between">
          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;