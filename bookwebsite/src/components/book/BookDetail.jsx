import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getBookDetails } from "../../service/bookAPI";
import { addToCart } from "../../service/cartAPI";
import { isAuthenticated, getToken } from "../../utils/auth";


function BookDetail() {

    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

 
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await getBookDetails(bookId);
                setBook(response.data.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch book details: " + err.message);
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [bookId]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= book?.quantity) {
            setQuantity(value);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated()) {
            navigate('/login', { state: { from: `/book-detail/${bookId}` } });
            return;
        }

        try {
            const token = getToken();
            const response = await addToCart(book.bookId, quantity, token);
            console.log("Added to cart:", response.data);
            alert("Book added to cart successfully!");
        } catch (err) {
            console.error("Failed to add to cart:", err);
            alert("Failed to add book to cart: " + (err.response?.data?.message || err.message));
        }
    };

    const handleOrderNow = () => {
        if (!isAuthenticated()) {
            navigate('/login', { state: { from: `/book-detail/${bookId}` } });
            return;
        }
        console.log(`Ordered ${quantity} copies of ${book?.bookTitle}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{book?.bookTitle}</h1>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                    {book?.bookImage && book.bookImage.length > 0 ? (
                        <img
                            src={book.bookImage[0]}
                            alt={book.bookTitle}
                            className="w-full h-64 object-cover rounded"
                        />
                    ) : (
                        <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                            No Image Available
                        </div>
                    )}
                </div>
                <div className="md:w-2/3">
                    <p className="text-lg mb-2"><strong>Author:</strong> {book?.author}</p>
                    <p className="text-lg mb-2"><strong>Publisher:</strong> {book?.publisher}</p>
                    <p className="text-lg mb-2"><strong>Publish Date:</strong> {book?.publishDate}</p>
                    <p className="text-lg mb-2"><strong>Price:</strong> ${book?.price}</p>
                    <p className="text-lg mb-2"><strong>Available Quantity:</strong> {book?.quantity}</p>
                    <p className="text-lg mb-4"><strong>Description:</strong> {book?.description}</p>

                    <div className="flex items-center gap-4 mb-4">
                        <label htmlFor="quantity" className="text-lg">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            max={book?.quantity}
                            className="w-16 p-1 border rounded"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={handleOrderNow}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookDetail;
