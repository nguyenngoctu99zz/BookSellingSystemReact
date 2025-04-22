import React, { useState, useEffect } from "react";
import { Container, Card, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import { myRequestAddNewBook } from "../../service/bookAPI";
import coverIcon from "../../assets/staticImage/cover-page.jpg";

const MyRequestBook = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
  
      const fetchRequests = async () => {
        try {
          const response = await myRequestAddNewBook(token);
          if (response.data.code === 200) {
            setRequests(response.data.data);
          } else {
            setError(response.data.message);
          }
        } catch (err) {
          setError("Failed to fetch book requests");
        } finally {
          setLoading(false);
        }
      };
  
      fetchRequests();
    }, [navigate]);
  
    if (loading) {
      return (
        <div className="container request-container">
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
        <div className="container request-container">
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="container request-container">
        <h2 className="request-title" style={{  fontFamily: 'Sans serif'}}>My Book Requests</h2>
  
        {requests.length === 0 ? (
          <div className="card empty-request-card shadow-sm">
            <div className="card-body text-center">
              <h5>You haven't made any book requests yet</h5>
              <p className="text-muted">Start requesting books now!</p>
              <a href="/books" className="btn btn-primary">Browse Books</a>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table request-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Book Title</th>
                      <th>Author</th>
                      <th>Publisher</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.bookId} data-label="Book Request">
                        <td className="book-image" data-label="Image">
                          {/* <img
                            src={request.bookImage && request.bookImage.length > 0 ? request.bookImage[0] : "https://via.placeholder.com/50"}
                            alt={request.bookTitle}
                            className="book-img img-fluid"
                          />  */}
                          <img
                            src={coverIcon}
                            className="book-img img-fluid"
                          /> 
                          
                        </td>
                        <td className="book-title align-middle" data-label="Book Title">{request.bookTitle}</td>
                        <td className="align-middle" data-label="Author">{request.author}</td>
                        <td className="align-middle" data-label="Publisher">{request.publisher}</td>
                        <td className="price-text align-middle" data-label="Price">${request.price.toFixed(2)}</td>
                        <td className="quantity-text align-middle" data-label="Quantity">{request.quantity}</td>
                        <td className="align-middle" data-label="Status">Pending</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };


export default MyRequestBook;