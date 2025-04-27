import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import { requestToAddNewBook } from "../../service/bookAPI";
import { getAllCategories } from "../../service/categoryAPI";

function AddNewBook() {
  const [formData, setFormData] = useState({
    bookTitle: "",
    publisher: "",
    author: "",
    quantity: 0,
    price: 0,
    bookImage: null,
    description: "",
    publishDate: "",
    categoryIds: [],
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const categoriesData = response.data?.data || response.data || [];
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      bookImage: e.target.files[0],
    }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          categoryIds: [...prev.categoryIds, parseInt(value)],
        };
      } else {
        return {
          ...prev,
          categoryIds: prev.categoryIds.filter((id) => id !== parseInt(value)),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("bookTitle", formData.bookTitle);
      formDataToSend.append("publisher", formData.publisher);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("publishDate", formData.publishDate);

      formData.categoryIds.forEach((id) => {
        formDataToSend.append("categoryIds", id);
      });

      if (formData.bookImage) {
        formDataToSend.append("bookImage", formData.bookImage);
      }

      await requestToAddNewBook(formDataToSend, token);

      setSuccess("Book added successfully!");

      // Reset form
      setFormData({
        bookTitle: "",
        publisher: "",
        author: "",
        quantity: 0,
        price: 0,
        bookImage: null,
        description: "",
        publishDate: "",
        categoryIds: [],
      });

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div
              className="card-body p-4"
              style={{
                borderColor: "black",
                // backgroundColor: "#F2F0EA",
              }}
            >
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <h1
                  className="card-title text-center mb-4"
                  style={{ fontFamily: "Sans serif", fontSize: "30px" }}
                >
                  Create New Book
                </h1>
                <div className="mb-3">
                  <label htmlFor="bookTitle" className="form-label">
                    Book Title
                  </label>
                  <input
                    type="text"
                    id="bookTitle"
                    name="bookTitle"
                    value={formData.bookTitle}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="publisher" className="form-label">
                    Publisher
                  </label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="author" className="form-label">
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-12 col-sm-6">
                    <label htmlFor="quantity" className="form-label">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      min="0"
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="price" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="bookImage" className="form-label">
                    Book Image
                  </label>
                  <input
                    type="file"
                    id="bookImage"
                    name="bookImage"
                    onChange={handleFileChange}
                    className="form-control"
                    accept="image/*"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="form-control"
                    rows="4"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="publishDate" className="form-label">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    id="publishDate"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                {/* <div className="mb-3">
                  <label className="form-label">Categories</label>
                  <div className="d-flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <div key={category.categoryId} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`category-${category.categoryId}`}
                          value={category.categoryId}
                          checked={formData.categoryIds.includes(
                            category.categoryId
                          )}
                          onChange={handleCategoryChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`category-${category.categoryId}`}
                        >
                          {category.categoryName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div> */}
                <div className="mb-3">
                  <label htmlFor="categories" className="form-label">
                    Categories
                  </label>
                  <select
                    multiple
                    id="categories"
                    name="categories"
                    value={formData.categoryIds.map(String)} // Chuyển số thành chuỗi để so khớp với value
                    onChange={(e) => {
                      const options = e.target.options;
                      const selectedValues = [];
                      for (let i = 0; i < options.length; i++) {
                        if (options[i].selected) {
                          selectedValues.push(parseInt(options[i].value));
                        }
                      }
                      setFormData((prev) => ({
                        ...prev,
                        categoryIds: selectedValues,
                      }));
                    }}
                    className="form-select"
                    style={{ height: "auto" }}
                    required
                  >
                    {categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Hold Ctrl (Windows) or Command (Mac) to select multiple
                    categories
                  </small>
                </div>

                <div className="mb-4">
                  <button
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                    }}
                    type="submit"
                    className="btn btn-primary1 w-100 btn-custom1"
                  >
                    Add Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewBook;
