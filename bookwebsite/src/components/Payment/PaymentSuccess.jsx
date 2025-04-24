import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/styles/PaymentSuccess.css';
import { useNavigate } from 'react-router-dom';
function PaymentSuccess() {
  const navigate = useNavigate();
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="success-box bg-success text-center p-4 rounded-4 shadow-lg position-relative">
        <div className="success-face position-relative mx-auto mb-4">
          <div className="success-eye position-absolute start-25"></div>
          <div className="success-eye position-absolute end-25"></div>
          <div className="success-mouth position-absolute start-50 translate-middle-x"></div>
        </div>
        <div className="success-message text-white mb-4">
          <h1 className="fw-bold mb-3">PAYMENT SUCCESSFUL!</h1>
          <p className="mb-0">THANK YOU FOR YOUR PURCHASE</p>
        </div>
        <button className="btn btn-light fw-bold px-4 py-2 rounded-pill text-success shadow-sm" onClick={()=>{
        navigate("/");
      }}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;