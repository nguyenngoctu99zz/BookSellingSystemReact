import axios from "axios";
import { SearchResultComponent } from "../components/search/SearchResultComponent";
import Header from "../layouts/Header";
import { searchBook } from "../service/searchBook";
import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import Footer from "../layouts/Footer";
export function SearchResult(props){
    const [searchParams] = useSearchParams();
    const query = searchParams.get('keyword');
    let [result, setResult] = useState([]);
    let [totalNumber, setTotalNumber] = useState(0);
    useEffect(()=>{
        searchBook(query).then((response)=>{
            setResult(response.data.books)
            setTotalNumber(response.data.totalNumber)
        })
    },[query])
    
    
    return(<>
    <Header/>
    <SearchResultComponent totalNumber={totalNumber} result={result} />
   
    </>)

}