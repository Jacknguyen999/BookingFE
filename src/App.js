import './App.css';
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom";
import Navbar from "./Component/common/Navbar";
import Footer from "./Component/common/footer";
import Homepage from "./Component/Home/homepage";
import SignIn from "./Component/auth/SignIn";
import SignUp from "./Component/auth/SignUp";
import {CustomerRoute} from "./Config/Authen";
import ProfilePage from "./Component/profile/ProfilePage";

function Layout() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="App">
            {/* Conditionally render Navbar and Footer */}
            {!isAuthPage && <Navbar/>}
            <div className="content">
                <Routes>
                    {/* Public Routes */}
                    <Route exact path="/home" element={<Homepage/>}/>
                    <Route exact path="/login" element={<SignIn/>}/>
                    {/* Add Register route here if necessary */}
                    <Route path="/register" element={<SignUp/>}/>


                    {/* Protected Routes */}
                    <Route path="/profile" element={<CustomerRoute element={<ProfilePage/>}/>}/>

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/login"/>}/>
                </Routes>
            </div>
            {/* Conditionally render Footer */}
            {!isAuthPage && <Footer/>}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Layout/>
        </BrowserRouter>
    );
}

export default App;
