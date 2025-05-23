import axios from "axios";

const postLogin = (username, password) => {
  return axios.post("http://localhost:8080/api/v1/auth/log-in", {
    username,
    password,
  });
};
const postRegister = (data) => {
  return axios.post("http://localhost:8080/api/v1/users", data);
};
const postLogout = (token) => {
  return axios.post("http://localhost:8080/api/v1/auth/log-out", { token });
};
export { postLogin, postRegister, postLogout };
