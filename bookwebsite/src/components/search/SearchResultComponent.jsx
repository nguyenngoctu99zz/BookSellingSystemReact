import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../../assets/styles/Search.css';
import { useNavigate } from 'react-router-dom';
export function SearchResultComponent(props) {
    const books = props.result;

    const navigate = useNavigate()
    
    return (
        <Container className="search-result-container" >
            <h2 className="text-center mb-4">Result</h2>
            {books.length === 0 ? (
                <div className="text-center no-results">
                    <p>No results found</p>
                    <p>Search here...</p>
                </div>
            ) : (
                <Row 
                    xs={1} 
                    sm={books.length === 1 ? 1 : 2} 
                    md={books.length === 1 ? 1 : 3} 
                    lg={books.length === 1 ? 1 : 4} 
                    className="books-row g-4 justify-content-center"
                >
                    {books.map((book, index) => (
                        <Col key={index} className="book-col">
                            <Card className="h-100 book-card" onClick={()=>{
            navigate(`/book-detail/${book.bookId}`)
        }}>
                                <Card.Body className="text-center">
                                    <img 
                                        src={`http://localhost:8080/api/v1/image/show?imageName=${book.bookImage}`} 
                                        alt={book.bookTitle}
                                        className="img-fluid book-image"
                                    />
                                    <Card.Title className="book-title">{book.bookTitle}</Card.Title>
                                    <div className="book-price">{book.price}</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}