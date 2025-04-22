// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../assets/styles/BestSelling.css';
// import { bookByDiscount } from '../../service/bookAPI';
// export const BestDiscount = () => {
//   let [products,setProducts] = useState([])
//   useEffect(()=>{
//     bookByDiscount(1,5).then((res)=>{
//       setProducts(res.data.bookList);
//     })
//   },[])

//   return (
//     <div className="container product-list">
//       <h2 className="text-center mb-4">Best Discount</h2>
      
//       <div className="row row001">
//         {products.map((product, index) => (
//           <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
//             <div className="card h-100 product-card">
//               <div className="card-body text-center d-flex flex-column">
//                 <img src={`http://localhost:8080/api/v1/image/show?imageName=${product.bookImage}`} alt="" />
//                 <h5 className="card-title">{product.bookTitle}</h5>
//                 <h5 className='price'>
//                   {product.price}
//                 </h5>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/styles/BestSelling.css';
import { bookByDiscount } from '../../service/bookAPI';
import { useNavigate } from 'react-router-dom';
export const BestDiscount = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    bookByDiscount(1, 5).then((res) => {
      setProducts(res.data.bookList);
    });
  }, []);

  return (
    <div className="container py-5 best-discount-section">
      <div className="text-center mb-4">
        <h2 className="mb-2 section-title">Best Discounts</h2>
        <p className="text-muted section-subtitle">Limited time offers - grab them before they're gone!</p>
      </div>
      
      <div className="row g-4 discount-products-grid discount-books">
        {products.map((product, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3 col-xl-2">
            <div className="card h-100 position-relative discount-product-card">
              <div className="position-absolute top-0 end-0 m-2 discount-badge">
                {product.discountPercentage}% OFF
              </div>
              <div className="card-img-top p-3 product-image-container d-flex align-items-center justify-content-center">
                <img 
                  src={`http://localhost:8080/api/v1/image/show?imageName=${product.bookImage}`} 
                  alt={product.bookTitle}
                  className="img-fluid product-image"
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title product-title">{product.bookTitle}</h5>
                <div className="mt-auto">
                  <div className="price-container mb-2">
                    <span className="current-price">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="original-price text-decoration-line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button className="btn btn-primary w-100 btn-add-to-cart" onClick={()=>{
                      navigate(`/book-detail/${product.bookId}`)
                  }}>View Detail</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <button className="btn btn-outline-primary btn-view-all" onClick={()=>{
                      navigate(`/list?page=best-discount`)
                  }}>View All Discounted Items</button>
      </div>
    </div>
  );
};

