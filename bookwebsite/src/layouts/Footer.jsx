import React, { useState, useEffect } from "react";
import logo from "../assets/staticImage/logo-web.png";

function Footer (){
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-logo">
                    <div className="logo-placeholder">
                      <img src={logo} alt="Logo" />
                    </div>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div className="footer-info">
                    <div className="contact-info">
                        <h3>Other link</h3>
                        <p className="underline"></p>
                        <p>Makerting</p>
                        <p>Social</p>
                        <p>Fairy Tale</p>
                        <p>History</p>
                    </div>
                    <div className="address-info">
                        <h3>Contact</h3>
                        <p className="underline"></p>
                        <p><strong>Address:</strong></p>
                        <p>Cở số 1: 828 Dương Lăng – Đông Đa – Hà Nội</p>
                        <p>Cở số 2: 36 Xuân Thủy – Cầu Giấy – Hà Nội</p>
                        <p>Cở số 3: 424 Nguyễn Trãi – Thanh Xuân – Hà Nội</p>
                        <p>Cở số 4: 697 Giải Phóng – Hoàng Mai – Hà Nội</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;