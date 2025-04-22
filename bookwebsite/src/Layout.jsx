import { Route, Routes } from "react-router-dom";
import App from "./App";
import Login from "./components/auth/Login";
import Home from "./pages/Home";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Signup from "./components/auth/SignUp";
import BookDetail from "./components/book/BookDetail";
import MyCart from "./components/cart/MyCart";
import AddNewBook from "./components/book/AddNewBook";
import MyRequestBook from "./components/book/MyRequestBook";
import MyShop from "./components/book/MyShop";
import { SearchResult } from "./pages/SearchResultPage";
import { ListingPage } from "./pages/Listing";
import PaymentSuccess from "./components/Payment/PaymentSuccess";
import PaymentFail from "./components/Payment/PaymentFail";
const Layout = ()=>{
    return(
        <>
            <Routes>
                <Route path='/' element={<App/>}>
                    <Route index element={<><Header /><Home /> </>} />
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Signup/>}/>  
                    <Route path="book-detail/:bookId" element={<><Header /><BookDetail /></>} /> 
                    <Route path="my-cart" element={<><Header /><MyCart /></>} />
                    <Route path="seller/request-book" element={<><Header /><AddNewBook /></>} />   
                    <Route path="seller/my-request" element={<><Header /><MyRequestBook /></>} /> 
                    <Route path="seller/my-shop" element={<><Header /><MyShop /></>} />          
                    <Route path="search" element={<SearchResult/>}/>   
                    <Route path="list" element={<ListingPage/>}/>
                    <Route path="book-detail/success" element={<><Header /><PaymentSuccess/></>}/>
                    <Route path="book-detail/fail" element={<><Header /><PaymentFail/></>}/>
                </Route>
            </Routes>
        </>
    )
}

export default Layout;
