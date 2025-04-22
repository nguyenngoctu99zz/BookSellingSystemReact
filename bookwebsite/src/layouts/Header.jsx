import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBox, FaHeart, FaSignOutAlt, FaTachometerAlt, FaStore } from "react-icons/fa";
import logo from "../assets/staticImage/logo-web1.png";
import searchIcon from "../assets/staticImage/search.png";
import userIcon from "../assets/staticImage/userIcon.png";
import cartIcon from "../assets/staticImage/cart-icon.png";
import { postLogout } from "../service/securityAPI";
import { getToken, getRoleFromToken, isAuthenticated } from "../utils/auth";

function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const loggedIn = isAuthenticated();

  useEffect(() => {
    const role = getRoleFromToken();
    setUserRole(role);
    if (!role && loggedIn) {
      navigate("/login");
    }
  }, [navigate, loggedIn]);

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
    try {
      const res = await postLogout(token);
      if (res.data.code === 0) {
        localStorage.removeItem("token");
        setUserRole(null); // Reset role
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token"); // Xóa token nếu lỗi
      setUserRole(null);
      navigate("/login");
    }
  };

  const renderMenuByRole = () => {
    if (!loggedIn) {
      return (
        <a
          className="dropdown-item d-flex align-items-center"
          onClick={() => navigate("/login")}
        >
          <FaUser className="me-2" />
          Login
        </a>
      );
    }

    switch (userRole) {
      case "ROLE_ADMIN":
        return (
          <>
            <a
              className="dropdown-item d-flex align-items-center"
              onClick={() => navigate("/dashboard")}
            >
              <FaTachometerAlt className="me-2" />
              Admin Dashboard
            </a>
            <a
              className="dropdown-item d-flex align-items-center"
              onClick={() => navigate("/")}
            >
              <FaUser className="me-2" />
              Home
            </a>
            <button
              className="dropdown-item d-flex align-items-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </>
        );
      case "ROLE_SELLER":
        return (
          <>
            <a
              className="dropdown-item d-flex align-items-center"
              onClick={() => navigate("/dashboard")}
            >
              <FaStore className="me-2" />
              Seller Dashboard
            </a>
            <a
              className="dropdown-item d-flex align-items-center"
              onClick={() => navigate("/profile")}
            >
              <FaUser className="me-2" />
              Home
            </a>
          
            <button
              className="dropdown-item d-flex align-items-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </>
        );
      case "ROLE_USER":
      default:
        return (
          <>
            <a
              className="dropdown-item d-flex align-items-center"
              onClick={() => navigate("/profile")}
            >
              <FaUser className="me-2" />
              Profile
            </a>
            <a
              className="dropdown-item d-flex align-items-center"
              onClick={() => navigate("/orders")}
            >
              <FaBox className="me-2" />
              Orders
            </a>
            <a
              className="dropdown-item d-flex align-items-center"
              onClick={() => navigate("/wishlist")}
            >
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
        );
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
              {renderMenuByRole()}
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