import { Route, Routes } from "react-router-dom";
import App from "./App";
import Login from "./components/auth/Login";
// import Home from "./pages/Home";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Signup from "./components/auth/SignUp";
import BookDetail from "./components/book/BookDetail";
import MyCart from "./components/cart/MyCart";
import AddNewBook from "./components/book/AddNewBook";
import MyRequestBook from "./components/book/MyRequestBook";
import MyShop from "./components/book/MyShop";
import MyOrder from "./components/order/MyOrder";
import ManageOrder from "./components/order/ManageOrder";
import { SearchResult } from "./pages/SearchResultPage";
import { ListingPage } from "./pages/Listing";
import PaymentSuccess from "./components/Payment/PaymentSuccess";
import PaymentFail from "./components/Payment/PaymentFail";
import ManageBook from "./components/admin/book/ManageBook";
import ManageUser from "./components/admin/user/ManageUser";
import ApproveBook from "./components/admin/book/ApproveBook";
import BookReview from "./components/review/BookReview";
import UserProfile from "./components/profile/UserProfile";
import Dashboard from "./components/admin/dashboard/DashBoard";
import Home from "./components/book/Home";

const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            index
            element={
              <>
                <Header />
                <Home /> <Footer />
              </>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Signup />} />
          <Route path="profile" element={<><Header /><UserProfile /></>} />
          <Route
            path="book-detail/:bookId"
            element={
              <>
                <Header />
                <BookDetail />
                <BookReview/>
                <Footer />
              </>
            }
          />
          <Route
            path="my-cart"
            element={
              <>
                <Header />
                <MyCart />
                <Footer />
              </>
            }
          />
          <Route
            path="seller/request-book"
            element={
              <>
                <Header />
                <AddNewBook />
                <Footer />
              </>
            }
          />
          <Route
            path="seller/my-request"
            element={
              <>
                <Header />
                <MyRequestBook />
                <Footer />
              </>
            }
          />
          <Route
            path="admin/manage-book"
            element={
              <>
                <ManageBook />
              </>
            }
          />
          <Route
            path="admin/manage-user"
            element={
              <>
                <ManageUser />
              </>
            }
          />
          <Route
            path="admin/approve-book"
            element={
              <>
                <ApproveBook />
              </>
            }
          />
          <Route
            path="admin/dashboard"
            element={
              <>
                <Dashboard />
              </>
            }
          />
          <Route
            path="my-order"
            element={
              <>
                <Header />
                <MyOrder />
                <Footer />
              </>
            }
          />
          <Route
            path="/seller/manage-order"
            element={
              <>
                <Header />
                <ManageOrder />
                <Footer />
              </>
            }
          />
          <Route
            path="seller/my-shop"
            element={
              <>
                <Header />
                <MyShop />
                <Footer />
              </>
            }
          />
          <Route path="search" element={<SearchResult />} />

          <Route path="list" element={<ListingPage />} />
          <Route
            path="book-detail/success"
            element={
              <>
                <Header />
                <PaymentSuccess />
                <Footer />
              </>
            }
          />
          <Route
            path="book-detail/fail"
            element={
              <>
                <Header />
                <PaymentFail />
              </>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default Layout;
