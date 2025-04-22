import axios from "axios";
import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

  
export const getToken = () => {
  return localStorage.getItem('token');
};
  
  
export const getUser = () => {
  const user = localStorage.getItem('ROLE_USER');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};



export function getUserIdFromToken() {
  if (localStorage.getItem('token') == null) return null;
  
  try {
    const decoded = jwtDecode(localStorage.getItem('token'));
    return decoded.userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
