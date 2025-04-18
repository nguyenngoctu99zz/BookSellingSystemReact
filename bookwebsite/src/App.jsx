import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/Header.css";
import "./assets/styles/Footer.css";
import "./assets/styles/MyCart.css";
import "./assets/styles/BookDetail.css";

function App() {

  
  return (
    <>
      <Outlet />
    </>
  )
}

export default App;
