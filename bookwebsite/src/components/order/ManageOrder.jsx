import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import coverIcon from "../../assets/staticImage/cover-page.jpg";
import {
  showPendingOrder,
  acceptOrder,
  rejectOrder,
} from "../../service/orderAPI";
import { getToken } from "../../utils/auth";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken()
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPendingOrders = async () => {
      try {
        const response = await showPendingOrder(token);
        if (response.data.code === 0) {
          setOrders(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch pending orders");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, [navigate]);

  const handleAcceptOrder = async (orderItemId) => {
    try {
      const token = getToken();
      setLoading(true);
      const response = await acceptOrder(token, orderItemId);

      if (response.data.code === 0) {
        setOrders(orders.filter((order) => order.orderItemId !== orderItemId));
        setSuccess(`Order #${orderItemId} accepted successfully`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to accept order");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOrder = async (orderItemId) => {
    try {
      const token = getToken();
      setLoading(true);
      const response = await rejectOrder(token, orderItemId);

      if (response.data.code === 0) {
        setOrders(orders.filter((order) => order.orderItemId !== orderItemId));
        setSuccess(`Order #${orderItemId} rejected successfully`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to reject order");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="container manage-order-container">
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
      <div className="container manage-order-container">
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      </div>
    );
  }

  return (
    <div className="container manage-order-container">
      <h2 className="manage-order-title">Pending Orders</h2>

      {success && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card empty-order-card shadow-sm">
          <div className="card-body text-center">
            <h5>No pending orders</h5>
            <p className="text-muted">All orders have been processed</p>
          </div>
        </div>
      ) : (
        <>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table manage-order-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Book Title</th>
                      <th>Quantity</th>
                      <th>Order Date</th>
                      <th>Total Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.orderItemId} data-label="Order Item">
                        <td className="book-image" data-label="Image">
                          <img
                            src={`http://localhost:8080/api/v1/image/show?imageName=${order.bookImage}`}
                            alt={order.bookTitle}
                            className="book-img img-fluid"
                          />
                        </td>
                        <td
                          className="book-title align-middle"
                          data-label="Book Title"
                        >
                          {order.bookTitle}
                        </td>
                        <td
                          className="quantity-text align-middle"
                          data-label="Quantity"
                        >
                          {order.quantity}
                        </td>
                        <td
                          className="order-date align-middle"
                          data-label="Order Date"
                        >
                          {formatDate(order.orderDate)}
                        </td>
                        <td
                          className="total-text align-middle"
                          data-label="Total Price"
                        >
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td
                          className="action-buttons align-middle"
                          data-label="Actions"
                        >
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                handleAcceptOrder(order.orderItemId)
                              }
                              disabled={loading}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                handleRejectOrder(order.orderItemId)
                              }
                              disabled={loading}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageOrder;
