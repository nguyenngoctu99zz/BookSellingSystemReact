// import React, { useEffect, useState } from 'react';
// import { Container, Row, Col, Card } from 'react-bootstrap';
// import '../../assets/styles/Listing.css';
// import { bookByReview,bookByDiscount,newestBooks } from '../../service/bookAPI';
// import { HandlePagination } from './Pagination';
// export const BookListing = (props) => {
//   let [pageNumber,setPageNumber] = useState(1);
//   let [books,setBooks] = useState([])
//   let [numberOfPage,setNumberOfPage] = useState(1);
//   let page = props.page;
//   if(page =="best-review"){
//   useEffect(()=>{
//   bookByReview(pageNumber,12).then((response)=>{
//     setBooks(response.data.bookList)
//     setNumberOfPage(response.data.numberOfPage)
//       return response.data.bookList;
//     })
//   },[pageNumber,page])
// }

// if(page == "best-discount"){
//   useEffect(()=>{
//     bookByDiscount(pageNumber,12).then((response)=>{
//       setBooks(response.data.bookList)
//       setNumberOfPage(response.data.numberOfPage)
//         return response.data.bookList;
//       })
//     },[pageNumber,page])
// }

// if(page == "newest-book"){
//   useEffect(()=>{
//     newestBooks(pageNumber,12).then((response)=>{
//       setBooks(response.data.bookList)
//       setNumberOfPage(response.data.numberOfPage)
//         return response.data.bookList;
//       })
//     },[pageNumber,page])
// }
 
//   return (
//     <Container className="book-references mt-4">
//       <h2 className="text-center mb-4">{page}</h2>
//       <Row xs={2} sm={2} md={3} lg={4} className="g-4 rown2">
//         {books.map((book, index) => (
//           <Col key={index}>
//             <Card className="h-100 card001">
//               <Card.Body className="text-center">
//                 <img src={`http://localhost:8080/api/v1/image/show?imageName=${book.bookImage}`} alt="" />
//                 <Card.Title className="book-title">{book.bookTitle}</Card.Title>
//                  <div className="contact-link">{book.price}</div>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
// <HandlePagination numberOfPage={numberOfPage} setPageNumber={setPageNumber}/>
//     </Container>
//   );
// };

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../../assets/styles/Listing.css';
import { bookByReview, bookByDiscount, newestBooks } from '../../service/bookAPI';
import { HandlePagination } from './Pagination';
import { useNavigate } from 'react-router-dom';
export const BookListing = (props) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [books, setBooks] = useState([]);
  const [numberOfPage, setNumberOfPage] = useState(1);
  const page = props.page;
  const navigate = useNavigate();

  // Map page types to titles
  const pageTitles = {
    "best-review": "Top Rated Books",
    "best-discount": "Best Discounts",
    "newest-book": "New Releases"
  };

  // Map page types to subtitles
  const pageSubtitles = {
    "best-review": "Highly praised by our readers",
    "best-discount": "Limited time offers - don't miss out!",
    "newest-book": "Discover our latest additions"
  };

  // Map page types to badge colors
  const badgeStyles = {
    "best-review": { background: "linear-gradient(135deg, #f9d423, #ff4e50)", text: "★ TOP" },
    "best-discount": { background: "linear-gradient(135deg, #ff416c, #ff4b2b)", text: "SALE" },
    "newest-book": { background: "linear-gradient(135deg, #4facfe, #00f2fe)", text: "NEW" }
  };

  useEffect(() => {
    const fetchData = async () => {
      let response;
      if (page === "best-review") {
        response = await bookByReview(pageNumber, 12);
      } else if (page === "best-discount") {
        response = await bookByDiscount(pageNumber, 12);
      } else if (page === "newest-book") {
        response = await newestBooks(pageNumber, 12);
      }
      
      if (response) {
        setBooks(response.data.bookList);
        setNumberOfPage(response.data.numberOfPage);
      }
    };

    fetchData();
  }, [pageNumber, page]);

  return (
    <Container fluid className="py-5 book-listing-section">
      <div className="text-center mb-5">
        <h2 className="section-title mb-3">{pageTitles[page]}</h2>
        <p className="section-subtitle text-muted">{pageSubtitles[page]}</p>
      </div>
      
      <Row xs={2} md={3} lg={4} xl={4} className="g-4 justify-content-center">
        {books.map((book, index) => (
          <Col key={index} className="d-flex justify-content-center">
            <Card className="h-100 book-listing-card">
              
              <div className="book-image-container">
                <Card.Img 
                  variant="top" 
                  src={`http://localhost:8080/api/v1/image/show?imageName=${book.bookImage}`} 
                  alt={book.bookTitle}
                  className="book-image"
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="book-title mb-2">{book.bookTitle}</Card.Title>
                <div className="mt-auto">
                  <div className="price-container mb-3">
                    <span className="current-price">${book.price?.toFixed(2)}</span>
                    {book.originalPrice && page === "best-discount" && (
                      <span className="original-price text-decoration-line-through">${book.originalPrice?.toFixed(2)}</span>
                    )}
                  </div>
                  <Button variant="primary" className="w-100 btn-details" onClick={()=>{
                        navigate(`/book-detail/${book.bookId}`)
                  }}>View Details</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div className="d-flex justify-content-center mt-5">
        <HandlePagination numberOfPage={numberOfPage} setPageNumber={setPageNumber} />
      </div>
    </Container>
  );
};
