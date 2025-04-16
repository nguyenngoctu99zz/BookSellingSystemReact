import { Route, Routes } from "react-router-dom";
import App from "./App";
import Login from "./components/auth/Login";
import Home from "./pages/Home";
import Signup from "./components/auth/SignUp";

const Layout = ()=>{
    return(
        <>
            <Routes>
                <Route path='/' element={<App/>}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Signup/>}/>
                </Route>
            </Routes>
        </>
    )
}

export default Layout;
