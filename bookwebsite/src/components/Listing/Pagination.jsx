import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/styles/BestSelling.css';

export function HandlePagination(props) {
  const renderedItems = [];
  console.log("page:"+props.numberOfPage)
  
  for (let i = 0; i < props.numberOfPage; i++) {
    renderedItems.push(<li className="page-item" onClick={()=>{
      props.setPageNumber(i+1);
    }}><div className="page-link">{i+1}</div></li>);
  }
  return (
    <nav aria-label="Page navigation example">
    <ul className="pagination">
      {renderedItems}
    </ul>
  </nav>
  );
}