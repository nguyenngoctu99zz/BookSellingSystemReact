import axios from "axios";

export const getBooks = () => {
  return axios.get("http://localhost:8080/api/v1/book");
};

export const getBookDetails = (bookId) => {
  return axios.get(`http://localhost:8080/api/v1/book/${bookId}`);
};

// export const requestToAddNewBook = (bookData, token) => {
//     return axios.post(
//         "http://localhost:8080/api/v1/add-book",
//         {
//             bookTitle: bookData.bookTitle,
//             publisher: bookData.publisher,
//             author: bookData.author,
//             quantity: bookData.quantity,
//             price: bookData.price,
//             bookImage: [],
//             description: bookData.description,
//             publishDate: bookData.publishDate
//         },
//         {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         }
//     );
// };

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

export const editMyBookShop = (token, bookId, bookData) => {
  return axios.put(
    `http://localhost:8080/api/v1/manage-book/${bookId}`,
    bookData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
