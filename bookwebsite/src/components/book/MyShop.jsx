import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import { Container, Table, Button, Alert, Form, Card } from "react-bootstrap";
import {
  showMyShop,
  editMyBookShop,
  changeBookStatus,
} from "../../service/bookAPI";
import coverIcon from "../../assets/staticImage/cover-page.jpg";
import { Image } from "react-bootstrap";

function MyShop() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [editFormData, setEditFormData] = useState({
    bookTitle: "",
    publisher: "",
    author: "",
    quantity: 0,
    price: 0,
    description: "",
    publishDate: "",
    bookImage: null,
    discountPercentage: 0,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyShopBooks();
  }, []);

  const fetchMyShopBooks = async () => {
    try {
      const response = await showMyShop(token);
      setBooks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shop books:", error);
      setError("Failed to fetch shop books");
      setLoading(false);
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book.bookId);
    setEditFormData({
      bookTitle: book.bookTitle,
      publisher: book.publisher,
      author: book.author,
      quantity: book.quantity,
      price: book.price,
      description: book.description,
      publishDate: book.publishDate.split("T")[0],
      bookImage: null,
      discountPercentage: book.discountPercentage,
    });
    setPreviewImage(
      `http://localhost:8080/api/v1/image/show?imageName=${book.bookImage}`
    );
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({
        ...editFormData,
        bookImage: file,
      });

      // Tạo preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (bookId) => {
    try {
      const formData = new FormData();
      formData.append("bookTitle", editFormData.bookTitle);
      formData.append("publisher", editFormData.publisher);
      formData.append("author", editFormData.author);
      formData.append("quantity", editFormData.quantity);
      formData.append("price", editFormData.price);
      formData.append("description", editFormData.description);
      formData.append("publishDate", editFormData.publishDate);
      formData.append("discountPercentage", editFormData.discountPercentage);

      if (editFormData.bookImage) {
        formData.append("bookImage", editFormData.bookImage);
      }

      await editMyBookShop(token, bookId, formData);
      setEditingBook(null);
      fetchMyShopBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      setError("Failed to update book");
    }
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  const handleToggleStatus = async (bookId, currentStatus) => {
    try {
      await changeBookStatus(token, bookId, !currentStatus);
      fetchMyShopBooks();
    } catch (error) {
      console.error("Error changing book status:", error);
      setError("Failed to change book status");
    }
  };

  if (loading) {
    return (
      <Container className="shop-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="shop-container">
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="shop-container">
      <h1 className="shop-title" style={{ fontFamily: "Sans serif" }}>
        My Shop
      </h1>

      {books.length === 0 ? (
        <Card className="empty-shop-card">
          <Card.Body>
            <h5>No books in your shop yet</h5>
            <p className="text-muted mt-2">Add books to start selling!</p>
            <Button
              variant="primary"
              onClick={() => navigate("/seller/request-book")}
              className="mt-3"
            >
              Add New Book
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="table-responsive">
          <Table className="shop-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <React.Fragment key={book.bookId}>
                  <tr data-label="My Shop Item">
                    <td className="book-image">
                      <Image
                        src={`http://localhost:8080/api/v1/image/show?imageName=${book.bookImage}`}
                        alt={book.bookTitle}
                        className="book-img img-fluid"
                        // thumbnail
                        // style={{ maxWidth: "100px" }}
                      />
                    </td>
                    <td className="book-title" data-label="Book Title: ">
                      {book.bookTitle}
                    </td>
                    <td className="book-detail" data-label="Author: ">
                      {book.author}
                    </td>
                    <td className="book-detail" data-label="Publisher: ">
                      {book.publisher}
                    </td>
                    <td className="book-detail" data-label="Price: ">
                      ${book.price.toFixed(2)}
                    </td>
                    <td className="book-detail" data-label="Quantity: ">
                      {book.quantity}
                    </td>
                    <td data-label="Book status: ">
                      <span
                        className={`status-badge ${
                          book.active ? "status-active" : "status-inactive"
                        }`}
                      >
                        {book.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttonss">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEditClick(book)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant={book.active ? "danger" : "success"}
                          size="sm"
                          onClick={() =>
                            handleToggleStatus(book.bookId, book.active)
                          }
                        >
                          {book.active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {editingBook === book.bookId && (
                    <tr>
                      <td className="form-table" colSpan="8">
                        <div className="edit-form-container">
                          <h5>Edit Book: {book.bookTitle}</h5>
                          <Form>
                            <div className="form-row">
                              <div className="form-col">
                                <Form.Group>
                                  <Form.Label>Title</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="bookTitle"
                                    value={editFormData.bookTitle}
                                    onChange={handleEditFormChange}
                                  />
                                </Form.Group>
                              </div>
                              <div className="form-col">
                                <Form.Group>
                                  <Form.Label>Publisher</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="publisher"
                                    value={editFormData.publisher}
                                    onChange={handleEditFormChange}
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            {/* <Form.Group>
                              <Form.Label>Author</Form.Label>
                              <Form.Control
                                type="text"
                                name="author"
                                value={editFormData.author}
                                onChange={handleEditFormChange}
                              />
                            </Form.Group> */}
                            <div className="form-row">
                              <div className="form-col">
                                <Form.Label>Author</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="author"
                                  value={editFormData.author}
                                  onChange={handleEditFormChange}
                                />
                              </div>

                              <div className="form-col">
                                <Form.Group>
                                  <Form.Label>Quantity</Form.Label>
                                  <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={editFormData.quantity}
                                    onChange={handleEditFormChange}
                                  />
                                </Form.Group>
                              </div>
                              <div className="form-col">
                                <Form.Group>
                                  <Form.Label>Price</Form.Label>
                                  <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={editFormData.price}
                                    onChange={handleEditFormChange}
                                  />
                                </Form.Group>
                              </div>

                              <div className="form-col">
                                <Form.Group>
                                  <Form.Label>Discount</Form.Label>
                                  <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="discountPercentage"
                                    value={editFormData.discountPercentage}
                                    onChange={handleEditFormChange}
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <Form.Group>
                              <Form.Label>Publish Date</Form.Label>
                              <Form.Control
                                type="date"
                                name="publishDate"
                                value={editFormData.publishDate}
                                onChange={handleEditFormChange}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Description</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditFormChange}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Book Image</Form.Label>
                              <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                              {previewImage && (
                                <div className="mt-2">
                                  <Image
                                    src={previewImage}
                                    alt="Preview"
                                    thumbnail
                                    style={{ maxWidth: "150px" }}
                                  />
                                  <p className="text-muted small mt-1">
                                    New image preview
                                  </p>
                                </div>
                              )}
                            </Form.Group>
                            <div className="form-actions">
                              <Button
                                variant="outline-secondary"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                onClick={() => handleEditSubmit(book.bookId)}
                              >
                                Save Changes
                              </Button>
                            </div>
                          </Form>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}

export default MyShop;
