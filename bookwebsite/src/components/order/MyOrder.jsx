import { useState, useEffect } from "react";
import coverIcon from "../../assets/staticImage/cover-page.jpg";
import { showMyOrder, cancelOrder, rejectOrder } from "../../service/orderAPI";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await showMyOrder(token);
        if (response.data.code === 0) {
          setOrders(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderItemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await cancelOrder(token, orderItemId);
      if (response.data.code === 0) {
        setOrders(
          orders.map((order) =>
            order.orderItemId === orderItemId
              ? { ...order, orderStatus: "CANCELLED" }
              : order
          )
        );
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to cancel order");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      case "PENDING":
        return "bg-warning";
      case "COMPLETED":
        return "bg-primary";
      case "REJECTED":
        return "bg-secondary";
      default:
        return "bg-info";
    }
  };

  if (loading) {
    return (
      <div className="container order-container">
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
      <div className="container order-container">
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
    <div className="container order-container">
      <h2 className="order-title">My Orders</h2>

      {orders.length === 0 ? (
        <div className="card empty-order-card shadow-sm">
          <div className="card-body text-center">
            <h5>You have no orders yet</h5>
            <p className="text-muted">
              Start shopping to see your orders here!
            </p>
            <a href="/" className="btn btn-primary">
              Shop Now
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table order-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Book Title</th>
                      <th>Quantity</th>
                      <th>Order Date</th>
                      <th>Status</th>
                      <th>Total Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.orderItemId} data-label="Order Item">
                        <td className="book-image" data-label="Image">
                          <img
                            // src={coverIcon}
                            className="book-img img-fluid"
                            // alt={order.bookTitle}
                            src={`http://localhost:8080/api/v1/image/show?imageName=${order.bookImage}`}
                            alt={order.bookTitle}
                          />
                        </td>
                        <td
                          className="book-title align-middle"
                          data-label="Title: "
                        >
                          {order.bookTitle}
                        </td>
                        <td
                          className="quantity-text align-middle"
                          data-label="Quantity: "
                          style={{ color: "#555555" }}
                        >
                          {order.quantity}
                        </td>
                        <td
                          className="order-date align-middle"
                          data-label="Added on: "
                          style={{ color: "#555555" }}
                        >
                          {formatDate(order.orderDate)}
                        </td>
                        <td
                          className="status-text align-middle"
                          data-label="Status"
                        >
                          <span
                            className={`badge ${getStatusBadgeClass(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td
                          className="total-text align-middle"
                          data-label="Total Price: "
                          style={{ color: "#f16325" }}
                        >
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td
                          className="action-buttons align-middle"
                          data-label="Actions"
                        >
                          {order.orderStatus !== "CANCELLED" && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                handleCancelOrder(order.orderItemId)
                              }
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-start mt-4">
            <a href="/" className="btn btn-outline-secondary">
              Continue Shopping
            </a>
          </div>
        </>
      )}
    </div>
  );
};
export default MyOrder;
