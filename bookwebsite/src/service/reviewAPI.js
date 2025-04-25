import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";

const authHeader = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getBookReviews = async (bookId) => {
  const res = await axios.get(
    `${API_BASE}/reviews/book/${bookId}`,
    authHeader()
  );
  return res.data.data;
};

export const postReview = async (bookId, rating, comment) => {
  const res = await axios.post(
    `${API_BASE}/reviews`,
    { bookId, rating, comment },
    authHeader()
  );
  return res.data;
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(
      `${API_BASE}/reviews/book/${reviewId}`,
      authHeader()
    );
    console.log("Review deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
};

export const updateReview = async (reviewId, updatedReview) => {
  try {
    // Send the updated review as the body of the PUT request
    const response = await axios.put(
      `http://localhost:8080/api/v1/reviews/book/${reviewId}`,
      updatedReview
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
