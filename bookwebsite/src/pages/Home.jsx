import React, { useState, useEffect } from "react";
import Header from "../layouts/Header";
import { BestDiscount } from "../components/homePageCom/BestDiscount";
import { BestReview } from "../components/homePageCom/BestReviewBook";
import { NewestBook } from "../components/homePageCom/NewestBook";
import Footer from "../layouts/Footer";
import ExploreKnowledgeButton from "../components/homePageCom/Explore";
function Home1() {
  return (
    <> <ExploreKnowledgeButton/>
      <BestDiscount />
      <BestReview />
      <NewestBook /> 
    </>
  );
}

export default Home1;
