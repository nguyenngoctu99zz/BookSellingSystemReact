import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BookListing } from "../components/Listing/ListComponent";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
export function ListingPage(){
    const [searchParams] = useSearchParams();
    const query = searchParams.get('page');

    return(<>
    <Header/>
    <BookListing page = {query}></BookListing>
    
    </>)
}