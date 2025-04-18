import React, { useState, useEffect } from "react";

import logo from "../assets/staticImage/logo-web1.png";
import searchIcon from "../assets/staticImage/search.png";
import userIcon from "../assets/staticImage/user.png";
import cartIcon from "../assets/staticImage/cart-icon.png";

function Header() {
    return (
      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
  
        <input type="text" className="search-bar" placeholder="Search here..." />
        <img className="searchIcon" src={searchIcon} alt="Search Icon" />
  
        <div className="header-right">
          <img className="navi2" src={userIcon} alt="User Icon" />
          <img className="navi2" src={cartIcon} alt="Cart Icon" />
        </div>
      </header>
    );
  }
export default Header;