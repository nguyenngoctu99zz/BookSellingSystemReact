import axios from "axios";
import { getToken } from "../utils/auth";

export const getBooks = () => {
  return axios.get("http://localhost:8080/api/v1/book");
};

export const getBookDetails = (bookId) => {
  return axios.get(`http://localhost:8080/api/v1/book/${bookId}`);
};

export const requestToAddNewBook = (formData, token) => {
  return axios.post("http://localhost:8080/api/v1/add-book", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const myRequestAddNewBook = (token) => {
  return axios.get("http://localhost:8080/api/v1/add-book/my-requests", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const cancelRequestAddNewBook = (token, bookId) => {
  return axios.delete(`http://localhost:8080/api/v1/add-book/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const showMyShop = (token) => {
  return axios.get("http://localhost:8080/api/v1/manage-book/my-shop", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editMyBookShop = (token, bookId, formData) => {
  return axios.put(
    `http://localhost:8080/api/v1/manage-book/${bookId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const changeBookStatus = (token, bookId, isActive) => {
  return axios.patch(
    `http://localhost:8080/api/v1/manage-book/${bookId}/status?isActive=${isActive}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteBook = (bookId, token) => {
  return axios.patch(
    `http://localhost:8080/api/v1/admin/books/${bookId}/status?isActive=false`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const bookByReview = (pageNumber, numberOfBookEachPage) => {
  return axios
    .get(
      `http://localhost:8080/api/v1/book/best-review?pageNumber=${pageNumber}&numberOfBookEachPage=${numberOfBookEachPage}`,
      {}
    )
    .catch((err) => {
      console.log(err);
    });
};

export const bookByDiscount = (pageNumber, numberOfBookEachPage) => {
  return axios
    .get(
      `http://localhost:8080/api/v1/book/best-discount?pageNumber=${pageNumber}&numberOfBookEachPage=${numberOfBookEachPage}`,
      {}
    )
    .catch((err) => {
      console.log(err);
    });
};

export const newestBooks = (pageNumber, numberOfBookEachPage) => {
  return axios
    .get(
      `http://localhost:8080/api/v1/book/new-book?pageNumber=${pageNumber}&numberOfBookEachPage=${numberOfBookEachPage}`,
      {}
    )
    .catch((err) => {
      console.log(err);
    });
};
const API_URL = "http://localhost:8080/api/v1";

export const filterBooksByCategories = async (categoryIds) => {
  try {
    const response = await axios.post(
      `${API_URL}/book/filter-by-categories`,
      categoryIds
    );
    return response.data;
  } catch (error) {
    console.error("Error filtering books by categories:", error);
    throw error;
  }
};
const BASE_URL = "http://localhost:8080/api/v1/admin/books";

export const getAllPendingBooks = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch pending books"
    );
  }
};

export const approveBook = async (token, bookId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${bookId}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to approve book");
  }
};
export const rejectBook = async (token, bookId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${bookId}/reject`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to reject book");
  }
};
export const updateBookStatus = async (bookId, isActive) => {
  const token = getToken();
  return await axios.patch(
    `${BASE_URL}/${bookId}/status?isActive=${isActive}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
