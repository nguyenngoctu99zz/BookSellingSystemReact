import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/users";

const getAllUsers = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

const deleteUser = async (userId, token) => {
  try {
    await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

const toggleUserStatus = async (userId, active, token) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/v1/users/status/${userId}?isActive=${active}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to toggle user status";
    throw new Error(message);
  }
};

const updateUser = async (userId, formData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to update user";
    throw new Error(errorMessage);
  }
};

export { getAllUsers, deleteUser, toggleUserStatus, updateUser };
