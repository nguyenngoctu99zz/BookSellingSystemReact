import axios from "axios";

export function searchBook(keyword) {
  return axios
    .get(`http://localhost:8080/api/v1/search?keyword=${keyword}`, {})
    .catch((err) => {
      console.log(err);
    });
}
