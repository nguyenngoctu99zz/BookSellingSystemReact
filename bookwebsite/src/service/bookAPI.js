import axios from "axios";

export const getBooks = () => {
    return axios.get("http://localhost:8080/api/v1/book");
};

export const getBookDetails = (bookId) => {
    return axios.get(`http://localhost:8080/api/v1/book/${bookId}`);
};