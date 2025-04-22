import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRoleFromToken = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  const decoded = jwtDecode(token);
  return decoded.roles || null;
};

export const getUser = () => {
  const user = localStorage.getItem("ROLE_USER");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("token");
};
