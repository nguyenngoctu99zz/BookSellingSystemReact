import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Form,
  Card,
  Spinner,
} from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getBooks,
  bookByDiscount,
  bookByReview,
  newestBooks,
  filterBooksByCategories,
} from "../../service/bookAPI";
import { getAllCategories } from "../../service/categoryAPI";
import { getBookReviews } from "../../service/reviewAPI";
import { HandlePagination } from "../Listing/Pagination";

function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const booksPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchBooksByTab(activeTab);
  }, [activeTab, currentPage]);

  const fetchCategories = async () => {
    try {
      const categoryResponse = await getAllCategories();
      if (
        categoryResponse.code === 200 &&
        Array.isArray(categoryResponse.data)
      ) {
        setCategories(categoryResponse.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBooksByTab = async (tab) => {
    setLoading(true);
    try {
      let bookResponse;
      if (tab === "all") {
        bookResponse = await getBooks();
      } else if (tab === "best-discount") {
        bookResponse = await bookByDiscount(currentPage, booksPerPage);
      } else if (tab === "best-review") {
        bookResponse = await bookByReview(currentPage, booksPerPage);
      } else if (tab === "newest") {
        bookResponse = await newestBooks(currentPage, booksPerPage);
      }

      if (bookResponse?.data?.code === 200 || bookResponse?.data?.bookList) {
        const booksData = bookResponse.data.data || bookResponse.data.bookList;
        const activeBooks = booksData.filter((book) => book.active === true);
        const booksWithRating = await Promise.all(
          activeBooks.map(async (book) => {
            if (!book.bookId)
              return { ...book, averageRating: 0, reviewCount: 0 };
            const ratingResponse = await getBookReviews(book.bookId);
            return {
              ...book,
              averageRating: ratingResponse?.averageRating || 0,
              reviewCount: ratingResponse?.reviews?.length || 0,
            };
          })
        );

        setBooks(booksWithRating);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (e) => {
    const { value, checked } = e.target;
    let updatedSelectedCategories = [];

    if (checked) {
      updatedSelectedCategories = [...selectedCategories, parseInt(value)];
    } else {
      updatedSelectedCategories = selectedCategories.filter(
        (catId) => catId !== parseInt(value)
      );
    }

    setSelectedCategories(updatedSelectedCategories);

    if (updatedSelectedCategories.length > 0) {
      setLoading(true);
      try {
        const response = await filterBooksByCategories(
          updatedSelectedCategories
        );
        if (response?.data) {
          const booksData = response.data;
          const activeBooks = booksData.filter((book) => book.active === true);
          const booksWithRating = await Promise.all(
            activeBooks.map(async (book) => {
              if (!book.bookId)
                return { ...book, averageRating: 0, reviewCount: 0 };
              const ratingResponse = await getBookReviews(book.bookId);
              return {
                ...book,
                averageRating: ratingResponse?.averageRating || 0,
                reviewCount: ratingResponse?.reviews?.length || 0,
              };
            })
          );

          setBooks(booksWithRating);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      fetchBooksByTab(activeTab);
    }
  };

  const handleTabSelect = (k) => {
    setCurrentPage(1);
    setSelectedCategories([]);
    setActiveTab(k);
  };

  const totalPages = Math.ceil(books.length / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ maxWidth: "93%" }}>
      <Row className="gx-5 gy-4" style={{ minHeight: "80vh" }}>
        {/* Sidebar */}
        <Col xs={12} md={4} lg={3}>
          <div
            className="p-4 border rounded bg-white sticky-top"
            style={{
              top: "90px",
              maxHeight: "calc(100vh - 150px)",
              overflowY: "auto",
            }}
          >
            <h5 className="mb-4">Search Filters</h5>
            <Form>
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <Form.Check
                    key={idx}
                    type="checkbox"
                    label={cat.categoryName}
                    value={cat.categoryId}
                    onChange={handleCategoryChange}
                    checked={selectedCategories.includes(cat.categoryId)}
                    className="mb-2"
                  />
                ))
              ) : (
                <p>Loading...</p>
              )}
            </Form>
          </div>
        </Col>

        {/* Nội dung sách */}
        <Col xs={12} md={8} lg={9}>
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            id="book-tabs"
            className="mb-4"
          >
            <Tab eventKey="all" title="All">
              {renderBooks()}
            </Tab>
            <Tab eventKey="best-discount" title="Best Discount">
              {renderBooks()}
            </Tab>
            <Tab eventKey="best-review" title="Top Rated">
              {renderBooks()}
            </Tab>
            <Tab eventKey="newest" title="Newest">
              {renderBooks()}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );

  function renderBooks() {
    const currentBooks = books.slice(
      (currentPage - 1) * booksPerPage,
      currentPage * booksPerPage
    );
    return (
      <>
        {currentBooks.length > 0 ? (
          <Row className="g-3">
            {currentBooks.map((book) => (
              <Col key={book.bookId} xs={6} sm={4} md={3} className="d-flex">
                <Card
                  className="h-100 w-100 position-relative"
                  onClick={() => navigate(`/book-detail/${book.bookId}`)}
                  style={{ cursor: "pointer", minHeight: "320px" }}
                >
                  {activeTab === "best-discount" &&
                    book.discountPercentage > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "red",
                          color: "white",
                          fontSize: "0.65rem",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          padding: "2px 5px",
                        }}
                      >
                        -{book.discountPercentage}%
                      </div>
                    )}

                  {book.bookImage && (
                    <Card.Img
                      variant="top"
                      src={
                        book.bookImage.startsWith("http")
                          ? book.bookImage
                          : `http://localhost:8080/api/v1/image/show?imageName=${book.bookImage}`
                      }
                      alt={book.bookTitle}
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  )}

                  <Card.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "0.75rem",
                      flexGrow: 1,
                    }}
                  >
                    <div style={{ marginBottom: "auto" }}>
                      <Card.Title
                        style={{
                          fontSize: "0.9rem",
                          minHeight: "40px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {book.bookTitle}
                      </Card.Title>
                      <div
                        className="text-muted"
                        style={{
                          fontSize: "0.8rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginBottom: "4px",
                        }}
                      >
                        {book.author}
                      </div>
                      <div className="d-flex align-items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={12}
                            color={
                              i < Math.round(book.averageRating || 0)
                                ? "gold"
                                : "#e4e5e9"
                            }
                          />
                        ))}
                        <small className="text-muted">
                          ({book.reviewCount || 0})
                        </small>
                      </div>
                    </div>
                    <div>
                      <strong style={{ fontSize: "1rem" }}>
                        {book.price?.toLocaleString()} $
                      </strong>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center my-5">
            <h5>No books found.</h5>
          </div>
        )}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <HandlePagination
              numberOfPage={totalPages}
              setPageNumber={handlePageChange}
            />
          </div>
        )}
      </>
    );
  }
}

export default Home;
