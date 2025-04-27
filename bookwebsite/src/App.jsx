import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/Header.css";
import "./assets/styles/Footer.css";
import "./assets/styles/MyCart.css";
import "./assets/styles/BookDetail.css";
import "./assets/styles/MyRequestBook.css";
import "./assets/styles/MyShop.css";
import "./assets/styles/MyOrder.css";
import "./assets/styles/ManageOrder.css";

function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
