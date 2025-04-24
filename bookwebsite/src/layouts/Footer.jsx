import React from "react";
import logo from "../assets/staticImage/logo-web.png";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="container">
        <div className="row gy-4">
          {/* Logo and Social Icons */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <div className="footer-logo">
              <img src={logo} alt="Logo" className="img-fluid" />
            </div>
            {/* <div className="social-icons mt-3">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div> */}
          </div>

          <div className="col-12 col-md-4">
            <div className="footer-info">
              <h3>Other Links</h3>
              <ul className="list-unstyled">
                <li>
                  <a href="#">Marketing</a>
                </li>
                <li>
                  <a href="#">Social</a>
                </li>
                <li>
                  <a href="#">Fairy Tale</a>
                </li>
                <li>
                  <a href="#">History</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="footer-info">
              <h3>Contact</h3>
              <p>
                <strong>Address:</strong>
              </p>
              <p>Branch 1: 828 Duong Lang – Dong Da – Hanoi</p>
              <p>Branch 2: 36 Xuan Thuy – Cau Giay – Hanoi</p>
              <p>Branch 3: 424 Nguyen Trai – Thanh Xuan – Hanoi</p>
              <p>Branch 4: 697 Giai Phong – Hoang Mai – Hanoi</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
