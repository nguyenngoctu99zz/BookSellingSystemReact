import { useState, useEffect } from "react";
import { Container, Card, Table, Button, Alert, Form } from "react-bootstrap";
import coverIcon from "../../assets/staticImage/cover-page.jpg";
import {
  showMyCart,
  removeItemFormCart,
  clearCartItem,
  editCartItem,
} from "../../service/cartAPI";
import { useNavigate } from "react-router-dom";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await showMyCart(token);
        if (response.data.code === 0) {
          setCartItems(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleRemoveItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await removeItemFormCart(cartItemId, token);
      if (response.data.code === 0) {
        setCartItems(
          cartItems.filter((item) => item.cartItemId !== cartItemId)
        );
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to remove item from cart");
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await clearCartItem(token);
      if (response.data.code === 0) {
        setCartItems([]);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to clear cart");
    }
  };

  const handleCheckoutItem = (cartItemId) => {
    navigate(`/checkout/${cartItemId}`);
  };

  const startEditing = (item) => {
    setEditingId(item.cartItemId);
    setEditQuantity(item.quantity);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditQuantity(1);
    setError(null);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setEditQuantity(value);
    }
  };

  const saveEdit = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await editCartItem(cartItemId, token, editQuantity);
      if (response.data.code === 0) {
        setCartItems(
          cartItems.map((item) =>
            item.cartItemId === cartItemId
              ? {
                  ...item,
                  quantity: editQuantity,
                  totalPrice: item.bookPrice * editQuantity,
                }
              : item
          )
        );
        setEditingId(null);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to update quantity");
    }
  };

  if (loading) {
    return (
      <div className="container cart-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container cart-container">
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-container">
      <h2 className="cart-title" style={{ fontFamily: "Sans serif" }}>
        My Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="card empty-cart-card shadow-sm">
          <div className="card-body text-center">
            <h5>Your cart is empty</h5>
            <p className="text-muted">Start adding books to your cart!</p>
            <a href="/books" className="btn btn-primary">
              Shop Now
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table cart-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Book Title</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.cartItemId} data-label="Cart Item">
                        <td className="book-image" data-label="Image">
                          <img
                            className="book-img img-fluid"
                            src={`http://localhost:8080/api/v1/image/show?imageName=${item.bookImage}`}
                            alt={item.bookTitle}
                          />
                        </td>
                        <td
                          style={{ fontWeight: "bold" }}
                          className="book-title3 align-middle1"
                          data-label="Title: "
                        >
                          {item.bookTitle}
                        </td>
                        <td
                          className="price-text align-middle"
                          data-label="Price: "
                        >
                          ${item.bookPrice.toFixed(2)}
                        </td>
                        <td
                          className="quantity-text align-middle"
                          data-label="Quantity: "
                        >
                          {editingId === item.cartItemId ? (
                            <Form.Control
                              type="number"
                              min="1"
                              value={editQuantity}
                              onChange={handleQuantityChange}
                              style={{ width: "70px", margin: "0 auto" }}
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>
                        <td
                          className="total-text align-middle"
                          data-label="Total: "
                          style={{ color: "#f16325" }}
                        >
                          $
                          {(
                            item.bookPrice *
                            (editingId === item.cartItemId
                              ? editQuantity
                              : item.quantity)
                          ).toFixed(2)}
                        </td>
                        <td
                          className="action-buttons align-middle"
                          data-label="Actions"
                          style={{ color: "#555555" }}
                        >
                          {editingId === item.cartItemId ? (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={() => saveEdit(item.cartItemId)}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={cancelEditing}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => startEditing(item)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="me-2"
                                onClick={() =>
                                  handleRemoveItem(item.cartItemId)
                                }
                              >
                                Remove
                              </Button>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() =>
                                  handleCheckoutItem(item.cartItemId)
                                }
                              >
                                Checkout
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <a href="/books" className="btn btn-outline-secondary">
              Continue Shopping
            </a>
            <button
              className="btn btn-danger clear-cart-btn"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default MyCart;
