import React, { useState, useEffect } from "react";
import { getBooks } from "../../service/bookAPI"; 

function Home() {
    const [books, setBooks] = useState([]);
    useEffect(() => {
      getBooks()
        .then((response) => {
          if (response.data.code === 200) {
            setBooks(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
        });
    }, []);

    return (
      <>
        <h1>All product !!!!</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
          {books.map((book) => (
            <div
              key={book.bookID}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                width: "300px",
                borderRadius: "5px",
              }}
            >
              {book.bookImage && book.bookImage.length > 0 && (
                <img
                  src={book.bookImage[0]}
                  alt={book.bookTitle}
                  style={{ width: "100%", height: "auto", maxHeight: "150px" }}
                />
              )}

              <h3>{book.bookTitle}</h3>
              <p>Author: {book.author}</p>
              <p>Publisher: {book.publisher}</p>
              <p>Price: ${book.price}</p>
              
            </div>
          ))}
        </div>
      </>
    );
  }


export default Home;