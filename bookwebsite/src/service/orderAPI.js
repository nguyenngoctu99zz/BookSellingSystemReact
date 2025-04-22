import axios from "axios";

export const showMyOrder = (token) => {
    return axios.get(
        `http://localhost:8080/api/v1/order/my-orders`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};

export const addToOrder = (token) => {
    return axios.post(
        `http://localhost:8080/api/v1/order`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};

export const cancelOrder = (token, orderId) => {
    return axios.delete(
        `http://localhost:8080/api/v1/order/cancel/${orderId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};

export const showPendingOrder = (token) => {
    return axios.get(
        `http://localhost:8080/api/v1/manage-order/seller/pending`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};

export const acceptOrder = (token, orderId) => {
    return axios.put(
        `http://localhost:8080/api/v1/manage-order/${orderId}/approve`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};

export const rejectOrder = (token, orderId) => {
    return axios.put(
        `http://localhost:8080/api/v1/manage-order/${orderId}/reject`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
};