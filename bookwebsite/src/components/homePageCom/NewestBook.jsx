
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../../assets/styles/NewestBook.css';
import { newestBooks } from '../../service/bookAPI';
import { useNavigate } from 'react-router-dom';

export const NewestBook = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    newestBooks(1, 8).then((res) => {
      setBooks(res.data.bookList);
    });
  }, []);

  return (
    <Container fluid className="py-5 newest-books-section">
      <div className="text-center mb-5">
        <h2 className="section-title mb-3">Newest Releases</h2>
        <p className="section-subtitle text-muted">Discover our latest additions</p>
      </div>
      
      <Row xs={2} md={3} lg={4} xl={4} className="g-4 justify-content-center">
        {books.map((book, index) => (
          <Col key={index} className="d-flex justify-content-center">
            <Card className="h-100 newest-book-card">
              <div className="new-badge">NEW</div>
              <div className="book-image-container">
                <Card.Img 
                  variant="top" 
                  src={`http://localhost:8080/api/v1/image/show?imageName=${book.bookImage}`} 
                  alt={book.bookTitle}
                  className="book-image"
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="book-title mb-2">{book.bookTitle}</Card.Title>
                <div className="mt-auto">
                  <div className="price-container mb-3">
                    <span className="current-price">${book.price?.toFixed(2)}</span>
                    {book.originalPrice && (
                      <span className="original-price text-decoration-line-through">${book.originalPrice?.toFixed(2)}</span>
                    )}
                  </div>
                  <Button variant="primary" className="w-100 btn-details" onClick={()=>{
                      navigate(`/book-detail/${book.bookId}`)
                  }}>View Details</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div className="text-center mt-5">
        <Button variant="outline-primary" className="btn-view-all" onClick={()=>{
         navigate("/list?page=newest-book")
        }}>Browse All New Releases</Button>
      </div>
    </Container>
  );
};