import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import { requestToAddNewBook } from "../../service/bookAPI";


function AddNewBook() {
    const [formData, setFormData] = useState({
        bookTitle: "",
        publisher: "",
        author: "",
        quantity: 0,
        price: 0,
        bookImage: "",
        description: "",
        publishDate: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

            await requestToAddNewBook({
                ...formData,
                // bookImage: formData.bookImage.split(",").map(img => img.trim())
            }, token);

            setSuccess("Book added successfully!");
            
            // Reset form
            setFormData({
                bookTitle: "",
                publisher: "",
                author: "",
                quantity: 0,
                price: 0,
                bookImage: "",
                description: "",
                publishDate: ""
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
                <h1 className="card-title text-center mb-4" style={{  fontFamily: 'Sans serif'}}>Add New Book</h1>
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            
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
                            
                            <form onSubmit={handleSubmit}>
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
                                        Book Images (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        id="bookImage"
                                        name="bookImage"
                                        value={formData.bookImage}
                                        onChange={handleChange}
                                        placeholder="image1.jpg, image2.jpg"
                                        className="form-control"
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
                                
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 btn-custom"
                                >
                                    Add Book
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AddNewBook;