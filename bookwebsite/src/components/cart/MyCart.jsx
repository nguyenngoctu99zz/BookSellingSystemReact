import { useState, useEffect } from "react";
import { Container, Card, Table, Button, Alert } from "react-bootstrap";
import { 
  showMyCart, 
  removeItemFormCart, 
  clearCartItem 
} from "../../service/cartAPI";
import { useNavigate } from "react-router-dom";

const MyCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
          setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
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
  
    if (loading) {
      return <Container className="cart-container">Loading...</Container>;
    }
  
    if (error) {
      return (
        <Container className="cart-container">
          <Alert variant="danger">{error}</Alert>
        </Container>
      );
    }
  
    return (
      <Container className="cart-container">
        <h2 className="cart-title">My Shopping Cart</h2>
        
        {cartItems.length === 0 ? (
          <Card className="empty-cart-card">
            <Card.Body>Your cart is empty</Card.Body>
          </Card>
        ) : (
          <>
            <Table className="cart-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Book Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.cartItemId}>
                    <td className="book-image">
                    <img 
                      src={item.imageUrl || "https://via.placeholder.com/50"} 
                      className="book-img"
                    /></td>
                    <td className="book-title">{item.bookTitle}</td>
                    <td className="price-text">${item.bookPrice.toFixed(2)}</td>
                    <td className="quantity-text">{item.quantity}</td>
                    <td className="total-text">${item.totalPrice.toFixed(2)}</td>
                    <td className="action-buttons">
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleRemoveItem(item.cartItemId)}
                      >
                        Remove
                      </Button>
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleCheckoutItem(item.cartItemId)}
                      >
                        Checkout
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <div className="d-flex justify-content-end mt-3">
              <Button 
                className="clear-cart-btn"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </Container>
    );
  };
  
  export default MyCart;
