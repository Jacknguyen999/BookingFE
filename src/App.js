import './App.css';
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom";
import Navbar from "./Component/common/Navbar";
import Footer from "./Component/common/footer";
import Homepage from "./Component/Home/homepage";
import SignIn from "./Component/auth/SignIn";
import SignUp from "./Component/auth/SignUp";
import {CustomerRoute} from "./Config/Authen";
import ProfilePage from "./Component/profile/ProfilePage";
import EditProfilePage from "./Component/profile/EditProfilePage";
import AllRoomPage from "./Component/booking_rooms/AllRoomPage";

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
                    <Route path="/register" element={<SignUp/>}/>
                    <Route path="/rooms" element={<AllRoomPage/>}/>


                    {/* Protected Routes */}
                    <Route path="/profile" element={<CustomerRoute element={<ProfilePage/>}/>}/>

                    <Route path="/edit-profile" element={<CustomerRoute element={<EditProfilePage/>}/>}/>

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
