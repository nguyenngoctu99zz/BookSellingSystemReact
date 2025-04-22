import React, { useState, useEffect } from "react";

import logo from "../assets/staticImage/logo-web1.png";
import searchIcon from "../assets/staticImage/search.png";
import userIcon from "../assets/staticImage/userIcon.png";
import cartIcon from "../assets/staticImage/cart-icon.png";
import { isAuthenticated, getUser, logout } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";

// function Header() {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated()) {
//       const user = getUser();
//       console.log("Current user from storage:", user); // Debug
//       setCurrentUser(user);
//     }
//   }, []);

//   const handleUserIconClick = () => {
//     if (!isAuthenticated()) {
//       navigate("/login");
//     } else {
//       setShowDropdown(!showDropdown);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setCurrentUser(null);
//     setShowDropdown(false);
//     navigate("/");
//   };

//   const closeDropdown = () => {
//     setShowDropdown(false);
//   };

//   return (
//     <header>
//       <div className="logo">
//         <img src={logo} alt="Logo" />
//       </div>

//       <input type="text" className="search-bar" placeholder="Search here..." />
//       <img className="searchIcon" src={searchIcon} alt="Search Icon" />

//       <div className="header-right">
//         <div className="user-dropdown-container">
//           <img
//             className="navi2"
//             src={userIcon}
//             alt="User Icon"
//             onClick={handleUserIconClick}
//             style={{ cursor: "pointer" }}
//           />
         

//           {showDropdown && (
//             <div className="user-dropdown">
//               {currentUser?.role === "USER" ? (
//                 <>
//                   <Link to="/my-account" onClick={closeDropdown}>
//                     My Account
//                   </Link>
//                   <Link to="/my-orders" onClick={closeDropdown}>
//                     My Orders
//                   </Link>
//                 </>
//               ) : currentUser?.role === "SELLER" ? (
//                 <>
//                   <Link to="/seller/my-shop" onClick={closeDropdown}>
//                     My Shop
//                   </Link>
//                   <Link to="/seller/my-request" onClick={closeDropdown}>
//                     My Request
//                   </Link>
//                   <Link to="/seller/pending-orders" onClick={closeDropdown}>
//                     Pending Orders
//                   </Link>
//                 </>
//               ) : null}
//               <button onClick={handleLogout}>Logout</button>
//             </div>
//           )}
//         </div>
//         <img className="navi2" src={cartIcon} alt="Cart Icon" />
//       </div>
//     </header>
//   );
// }

// function Header() {
//     return (
//       <header>
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>

//         <input type="text" className="search-bar" placeholder="Search here..." />
//         <img className="searchIcon" src={searchIcon} alt="Search Icon" />

//         <div className="header-right">
//           <img className="navi2" src={userIcon} alt="User Icon" />
//           <img className="navi2" src={cartIcon} alt="Cart Icon" />
//         </div>
//       </header>
//     );
//   }
// export default Header;

function Header() {
    let [keyword,setKeyword] = useState("");
    const navigate = useNavigate();
    return (
      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
  
        <input type="text" className="search-bar" placeholder="Search here..." onChange={(e)=>{
        setKeyword(e.target.value)
    }}/>
        <img className="searchIcon" src={searchIcon} alt="Search Icon" onClick={()=>{
            navigate(`/search?keyword=${keyword}`);
        }} />
  
        <div className="header-right">
          <img className="navi2" src={userIcon} alt="User Icon" />
          <img className="navi2" src={cartIcon} alt="Cart Icon" />
        </div>
      </header>
    );
  }
export default Header;