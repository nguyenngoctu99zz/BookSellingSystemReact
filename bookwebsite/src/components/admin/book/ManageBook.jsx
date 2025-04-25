import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Nav, Card, Form,
  Table, Button, Spinner, Alert, Navbar, Offcanvas, Dropdown
} from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiBook, FiShoppingCart, FiEdit, FiTrash2, FiMenu } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getToken } from '../../../utils/auth';
import { deleteBook, getBooks } from '../../../service/bookAPI';

const ManageBook = () => {
  const [books, setBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const booksPerPage = 5;

  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('Manage Book');
  const token = getToken();

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBooks();
      const data = response?.data?.data || [];
      const bookList = Array.isArray(data) ? data : [];
      setBooks(bookList);
    } catch (err) {
      setError(err.message || 'Failed to fetch books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('manage-user')) {
      setActiveSection('Manage User');
    } else if (path.includes('manage-book')) {
      setActiveSection('Manage Book');
    } else if (path.includes('approve-requests')) {
      setActiveSection('Approve Requests');
    }
  }, [location.pathname]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const handleNavigation = (section, path) => {
    setActiveSection(section);
    navigate(path);
    setShowSidebar(false);
  };

  const handleEditBook = (book) => {
    console.log('Edit book:', book);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await deleteBook(bookId, token);
      await fetchBooks();
      alert('Book deleted successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete book. Please try again.');
      console.error('Delete book error:', err);
    }
  };

  const handleDropdownSelect = (action) => {
    if (action === 'home') {
      navigate('/');
    } else if (action === 'logout') {
      localStorage.removeItem("token");
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <style>
        {`
          @media (max-width: 768px) {
            .table th, .table td {
              font-size: 0.85rem;
              padding: 0.5rem;
            }
            .form-control {
              margin-bottom: 0.5rem;
            }
            .action-btn {
              font-size: 1.1rem;
              padding: 0.5rem;
            }
            .pagination-btn {
              font-size: 1.2rem;
              padding: 0.5rem;
            }
          }
        `}
      </style>

      {/* Mobile Navbar */}
      <Navbar bg="white" className="shadow-sm d-md-none">
        <Container fluid>
          <Navbar.Brand className="fw-bold text-dark fs-5">Admin Dashboard</Navbar.Brand>
          <div className="d-flex align-items-center">
            <Dropdown align="end">
              <Dropdown.Toggle as="div" style={{ cursor: 'pointer' }} className="d-flex align-items-center">
                <span className="fw-semibold text-dark">Hello Admin</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDropdownSelect('home')}>Home</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDropdownSelect('logout')}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="link" onClick={() => setShowSidebar(true)} className="ms-2">
              <FiMenu size={20} className="text-dark" />
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Sidebar for Mobile */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        className="d-md-none"
        style={{ width: '250px' }}
      >
        <Offcanvas.Header closeButton>
          <div className="d-flex align-items-center">
            <span className="fw-bold text-dark fs-5">Admin Dashboard</span>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-white p-4">
          <Nav className="flex-column">
            {[
              { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
              { name: 'Manage User', path: '/admin/manage-user', icon: <FiUsers /> },
              { name: 'Manage Book', path: '/admin/manage-book', icon: <FiBook /> },
             { name: 'Approve Book', path: '/admin/approve-book', icon: <FiBook /> },
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => handleNavigation(item.name, item.path)}
                className={`d-flex align-items-center p-2 rounded cursor-pointer ${
                  activeSection === item.name ? 'bg-primary text-white' : 'text-muted'
                }`}
                style={{ cursor: 'pointer' }}
              >
                <div className="me-2 fs-5">{item.icon}</div>
                {item.name}
              </div>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Container fluid>
        <Row>
          {/* Sidebar for Desktop */}
          <Col md={3} lg={2} className="bg-white p-4 shadow-sm d-none d-md-block" style={{ height: '100vh' }}>
            <div className="d-flex align-items-center mb-4">
              <span className="fw-bold text-dark fs-5">Admin Dashboard</span>
            </div>
            <Nav className="flex-column">
              {[
                { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
                { name: 'Manage User', path: '/admin/manage-user', icon: <FiUsers /> },
                { name: 'Manage Book', path: '/admin/manage-book', icon: <FiBook /> },
                { name: 'Approve Book', path: '/admin/approve-book', icon: <FiBook /> },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleNavigation(item.name, item.path)}
                  className={`d-flex align-items-center p-2 rounded cursor-pointer ${
                    activeSection === item.name ? 'bg-primary text-white' : 'text-muted'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="me-2 fs-5">{item.icon}</div>
                  {item.name}
                </div>
              ))}
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                Manage Book
              </h1>
              <Dropdown align="end">
                <Dropdown.Toggle as="div" style={{ cursor: 'pointer' }} className="d-flex align-items-center">
                  <span className="fw-semibold text-dark">Hello Admin</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleDropdownSelect('home')}>Home</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDropdownSelect('logout')}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Form>
                  <Row className="align-items-center flex-column flex-md-row">
                    <Col md={5} className="mb-2 mb-md-0">
                      <Form.Control
                        type="text"
                        placeholder="Book name : Please enter"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                      />
                    </Col>
                    <Col md={5} className="mb-2 mb-md-0">
                      <Form.Control
                        type="text"
                        placeholder="Author: Please enter"
                        value={searchAuthor}
                        onChange={(e) => setSearchAuthor(e.target.value)}
                      />
                    </Col>
                    <Col md={2} className="d-flex justify-content-md-end">
                      <Button variant="secondary" className="me-2">
                        Reset
                      </Button>
                      <Button variant="primary">
                        Query
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-4">Book List</Card.Title>
                <div style={{ overflowX: 'auto' }}>
                  {loading ? (
                    <div className="text-center my-4">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : (
                    <Table bordered hover>
                      <thead>
                        <tr>
                          <th>Id</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Author</th>
                          <th>Price</th>
                          <th>Seller</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBooks.length > 0 ? (
                          currentBooks.map(book => (
                            <tr key={book.bookId}>
                              <td>{book.bookId}</td>
                              <td>{book.bookTitle}</td>
                              <td>{book.description}</td>
                              <td>{book.author}</td>
                              <td>${book.price}</td>
                              <td>{book.sellerId}</td>
                              <td className="text-center">
                                <Button
                                  variant="link"
                                  className="text-danger p-0 action-btn"
                                  onClick={() => handleDeleteBook(book.bookId)}
                                >
                                  <FiTrash2 />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
                              No books found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-end align-items-center mt-2">
                  <Button
                    variant="link"
                    className="text-primary p-0 me-2 pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {'<'}
                  </Button>
                  <span className="me-2">{currentPage}</span>
                  <Button
                    variant="link"
                    className="text-primary p-0 me-2 pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {'>'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManageBook;