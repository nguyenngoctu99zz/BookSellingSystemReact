import React, { useState } from 'react';
import axios from 'axios';
import "../../assets/styles/PaymentFail.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
function PaymentFail() {
  const navigate = useNavigate();
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="error-box bg-danger text-center p-4 rounded-4 shadow-lg position-relative">
        <div className="error-face position-relative mx-auto mb-4">
          <div className="error-eye position-absolute start-25"></div>
          <div className="error-eye position-absolute end-25"></div>
          <div className="error-mouth position-absolute start-50 translate-middle-x"></div>
        </div>
        
        <div className="error-message text-white mb-4">
          <h1 className="fw-bold mb-3">PAYMENT FAILED!</h1>
          <p className="mb-0">OH NO, SOMETHING WENT WRONG</p>
        </div>
        <button className="btn btn-light fw-bold px-4 py-2 rounded-pill text-danger shadow-sm" onClick={()=>{
        navigate("/");
      }}>
          Go Home
        </button>
      </div>
    </div>
  );
}

export default PaymentFail;