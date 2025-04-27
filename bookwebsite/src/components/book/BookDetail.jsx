import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getBookDetails } from "../../service/bookAPI";
import { addToCart } from "../../service/cartAPI";
import { isAuthenticated, getToken } from "../../utils/auth";
import Popup from "../Popup";
import PaymentForm from "../Payment/PaymentFormComponent";
import coverIcon from "../../assets/staticImage/cover-page.jpg";

function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await getBookDetails(bookId);
        setBook(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch book details: " + err.message);
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [bookId]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= book?.quantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: `/book-detail/${bookId}` } });
      return;
    }

    try {
      const token = getToken();
      const response = await addToCart(book.bookId, quantity, token);
      console.log("Added to cart:", response.data);
      alert("Book added to cart successfully!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert(
        "Failed to add book to cart: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleOrderNow = () => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: `/book-detail/${bookId}` } });
      return;
    }
    setShowPaymentPopup(true);
  };
  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
  };
  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container py-4 py-md-5 book-detail-container">
      {/* <h1 className="mb-4 text-center text-md-start">{book?.bookTitle}</h1> */}
      <h1
        className="mb-4 text-center text-md-start"
        style={{ fontFamily: "Sans serif" }}
      >
        Book details
      </h1>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <img
            src={`http://localhost:8080/api/v1/image/show?imageName=${book?.bookImage}`}
            alt={book?.bookTitle}
            className="img-fluid rounded shadow book-image1"
          />
        </div>
        <div className="col-12 col-md-8">
          <div
            className="card h-100 border-0 shadow-sm p-3"
            // style={{
            //   boxShadow: "2px 0 5px rgba(0.5, 0, 0, 0.2)",
            //   borderColor: "black",
            //   backgroundColor: "red",
            // }}
          >
            <div className="card-body">
              <p className="card-text" style={{ fontFamily: "Sans serif" }}>
                <strong>Book's name:</strong> {book?.bookTitle}
              </p>
              <p className="card-text" style={{ fontFamily: "Sans serif" }}>
                <strong>Author:</strong> {book?.author}
              </p>
              <p className="card-text" style={{ fontFamily: "Sans serif" }}>
                <strong>Publisher:</strong> {book?.publisher}
              </p>
              <p className="card-text" style={{ fontFamily: "Sans serif" }}>
                <strong>Publish Date:</strong> {book?.publishDate}
              </p>
              <p className="card-text" style={{ fontFamily: "Sans serif" }}>
                <strong>Price:</strong> ${book?.price}
              </p>
              <p className="card-text" style={{ fontFamily: "Sans serif" }}>
                <strong>Quantity:</strong> {book?.quantity}
              </p>
              <p className="card-text" style={{ fontFamily: "Sans serif" }}>
                <strong>Description:</strong> {book?.description}
              </p>
              <div className="d-flex align-items-center gap-3 mb-4">
                <label
                  htmlFor="quantity"
                  className="form-label mb-0"
                  style={{ fontFamily: "Sans serif" }}
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={book?.quantity}
                  className="form-control w-auto"
                />
              </div>
              <div className="d-flex gap-3 flex-wrap">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-lg"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleOrderNow}
                  className="btn btn-success btn-lg"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popup isOpen={showPaymentPopup} onClose={closePaymentPopup}>
        <PaymentForm
          onSuccess={closePaymentPopup} // Close popup on successful payment
          onCancel={closePaymentPopup} // Close popup when canceled
          bookDetails={{
            id: parseInt(book?.bookId),
            title: book?.bookTitle,
            price: book?.price,
            quantity,
          }}
        />
      </Popup>
    </div>
  );
}

export default BookDetail;
