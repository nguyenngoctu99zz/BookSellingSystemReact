import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBox, FaHeart, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/staticImage/logo-web1.png";
import searchIcon from "../assets/staticImage/search.png";
import userIcon from "../assets/staticImage/userIcon.png";
import cartIcon from "../assets/staticImage/cart-icon.png";
import { postLogout } from "../service/securityAPI";
import { getToken, isAuthenticated } from "../utils/auth";

function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const loggedIn = isAuthenticated(); // renamed to avoid shadowing

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const token = getToken();
    if (!token) {
      console.warn("No token found, redirecting to login");
      navigate("/login");
      return;
    }
    const res = await postLogout(token);
    console.log(res);

    if (res.data.code === 0) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <input type="text" className="search-bar" placeholder="Search here..." />
      <img className="searchIcon" src={searchIcon} alt="Search Icon" />

      <div className="header-right">
        <div className="user-dropdown-container" ref={dropdownRef}>
          <img
            className="navi2"
            src={userIcon}
            alt="User Icon"
            onClick={toggleUserMenu}
            style={{ cursor: "pointer" }}
          />
          {isUserMenuOpen && (
            <div className="user-dropdown dropdown-menu show">
              {loggedIn ? (
                <>
                  <a className="dropdown-item d-flex align-items-center" href="/profile">
                    <FaUser className="me-2" />
                    Profile
                  </a>
                  <a className="dropdown-item d-flex align-items-center" href="/orders">
                    <FaBox className="me-2" />
                    Orders
                  </a>
                  <a className="dropdown-item d-flex align-items-center" href="/wishlist">
                    <FaHeart className="me-2" />
                    Wishlist
                  </a>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a className="dropdown-item d-flex align-items-center" href="/login">
                    <FaUser className="me-2" />
                    Login
                  </a>
                </>
              )}
            </div>
          )}
        </div>
        <img
          className="navi2"
          src={cartIcon}
          alt="Cart Icon"
          onClick={() => navigate("/my-cart")}
        />
      </div>
    </header>
  );
}

export default Header;
