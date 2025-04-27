import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  ProgressBar,
  Button,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import { FaStar, FaUserCircle } from "react-icons/fa";
import {
  getBookReviews,
  postReview,
  deleteReview,
  updateReview,
} from "../../service/reviewAPI";

const BookReview = () => {
  const { bookId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editReview, setEditReview] = useState({
    reviewId: null,
    rating: 0,
    comment: "",
  });

  const currentUserId = parseInt(localStorage.getItem("userId"));

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getBookReviews(bookId);
        const reviews = Array.isArray(data.reviews)
          ? data.reviews
          : [data.reviews];
        setReviews(reviews);
        setAverageRating(data.averageRating);
        setRatingDistribution(calculateDistribution(reviews));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reviews");
      }
    };
    loadReviews();
  }, [bookId]);

  const calculateDistribution = (reviews) => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const total = reviews.filter((r) => r.rating).length;
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        dist[r.rating]++;
      }
    });
    Object.keys(dist).forEach(
      (k) => (dist[k] = total ? (dist[k] / total) * 100 : 0)
    );
    return dist;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setFormError("Please select a rating");
    setIsSubmitting(true);
    try {
      await postReview(bookId, rating, comment);
      const updatedData = await getBookReviews(bookId);
      setReviews(updatedData.reviews);
      setAverageRating(updatedData.averageRating);
      setRatingDistribution(calculateDistribution(updatedData.reviews));
      setComment("");
      setRating(0);
      setFormError(null);
    } catch (err) {
      setFormError(err.response?.data?.message);
      navigate("/login");
      alert("Please login to review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      const updatedData = await getBookReviews(bookId);
      setReviews(updatedData.reviews);
      setAverageRating(updatedData.averageRating);
      setRatingDistribution(calculateDistribution(updatedData.reviews));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review");
    }
  };

  const handleUpdate = async (reviewId, updatedComment, updatedRating) => {
    try {
      const updatedReview = {
        bookId: bookId,
        rating: updatedRating,
        comment: updatedComment,
      };

      await updateReview(reviewId, updatedReview);
      const updatedData = await getBookReviews(bookId);
      setReviews(updatedData.reviews);
      setAverageRating(updatedData.averageRating);
      setRatingDistribution(calculateDistribution(updatedData.reviews));
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update review");
    }
  };

  const handleEditClick = (review) => {
    setEditReview({
      reviewId: review.reviewId,
      rating: review.rating,
      comment: review.comment,
    });
    setShowEditModal(true);
  };

  const getUserColor = (userId) => {
    const colors = ["#a3e4ff", "#f4a8ff", "#ffabab"];
    return colors[userId % colors.length];
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="book-review-section p-4 bg-light">
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={4}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Rating Summary</Card.Title>
              <div className="d-flex align-items-center mb-3">
                <h2 className="me-2 mb-0">{averageRating.toFixed(1)}</h2>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={
                        i < Math.round(averageRating) ? "#ffc107" : "#e4e5e9"
                      }
                      size={20}
                    />
                  ))}
                </div>
                <span className="ms-2 text-muted">
                  ({reviews.length} reviews)
                </span>
              </div>

              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="d-flex align-items-center mb-2">
                  <span className="me-2">{star}</span>
                  <ProgressBar
                    now={ratingDistribution[star]}
                    style={{ width: "70%" }}
                    variant="warning"
                  />
                  <span className="ms-2">
                    {Math.round(ratingDistribution[star])}%
                  </span>
                </div>
              ))}

              <hr className="my-4" />

              <Card.Subtitle className="mb-2">Write a Review</Card.Subtitle>
              {formError && <Alert variant="danger">{formError}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <div className="d-flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={26}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        color={
                          (hoverRating || rating) >= star
                            ? "#ffc107"
                            : "#e4e5e9"
                        }
                        style={{ cursor: "pointer", marginRight: "8px" }}
                      />
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                  />
                </Form.Group>
                <Button
                  variant="warning"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-100"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <h3>Customer Feedback</h3>
          {currentReviews && currentReviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            currentReviews.map((review) => (
              <Card key={review.reviewId} className="mb-3 p-3">
                <div className="d-flex align-items-center mb-2">
                  <FaUserCircle
                    size={40}
                    color={getUserColor(review.userId)}
                    className="me-3"
                  />
                  <div>
                    <h6 className="mb-0">User {review.userId}</h6>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="ms-auto">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                        size={16}
                      />
                    ))}
                  </div>
                </div>
                <p>{review.comment}</p>
                <div className="d-flex justify-content-end">
                  {review.userId === currentUserId && (
                    <>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleEditClick(review)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleDelete(review.reviewId)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))
          )}

          <div className="d-flex justify-content-center align-items-center mt-4">
            <Button
              variant="light"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="mx-1 border"
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "20px",
              }}
            >
              ‹
            </Button>

            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "warning" : "light"}
                onClick={() => setCurrentPage(index + 1)}
                className="mx-1 border"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </Button>
            ))}

            <Button
              variant="light"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="mx-1 border"
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "20px",
              }}
            >
              ›
            </Button>
          </div>
        </Col>
      </Row>

      {/* Edit Review Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={26}
                    onClick={() =>
                      setEditReview({ ...editReview, rating: star })
                    }
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    color={
                      (hoverRating || editReview.rating) >= star
                        ? "#ffc107"
                        : "#e4e5e9"
                    }
                    style={{ cursor: "pointer", marginRight: "8px" }}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editReview.comment}
                onChange={(e) =>
                  setEditReview({ ...editReview, comment: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              handleUpdate(
                editReview.reviewId,
                editReview.comment,
                editReview.rating
              )
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookReview;
