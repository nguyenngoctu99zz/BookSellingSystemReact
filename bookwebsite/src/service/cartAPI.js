import axios from "axios";

export const addToCart = (bookId, quantity, token) => {
    return axios.post(
        "http://localhost:8080/api/v1/cart/add-cart",
        { bookId, quantity },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};

export const showMyCart = (token) => {
    return axios.get(
        "http://localhost:8080/api/v1/cart/my-cart",
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};

export const removeItemFormCart = (cartId, token) => {
    return axios.delete(
        `http://localhost:8080/api/v1/cart/remove-item/${cartId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};

export const clearCartItem = (token) => {
    return axios.delete(
        "http://localhost:8080/api/v1/cart/clear",
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};

export const editCartItem = (cartId, token, quantity) => {
    return axios.put(
        `http://localhost:8080/api/v1/cart/update-quantity/${cartId}?quantity=${quantity}`,
        null, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};