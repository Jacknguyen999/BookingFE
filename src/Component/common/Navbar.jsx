import React from 'react';
import ApiService from "../../Config/ApiService";
import {NavLink, useNavigate} from "react-router-dom";

function Navbar() {

    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        const isLogout = window.confirm("Are you sure you want to logout?");

        if (isLogout) {
            ApiService.logout();
            navigate("/home");
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/home">Thomas Hotel </NavLink>

            </div>
            <ul className="navbar-ul">
                <li>
                    <NavLink to="/home" activeclassname="active">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/rooms" activeclassname="active">Room</NavLink>
                </li>
                <li>
                    <NavLink to="/find-booking" activeclassname="active">Find Booking</NavLink>
                </li>
                {isUser && <li>
                    <NavLink to="/profile" activeclassname="active">Profile</NavLink>
                </li>

                }
                {isAdmin && <li>
                    <NavLink to="/admin" activeclassname="active">Admin</NavLink>
                </li>}
                {!isAuthenticated && <li>
                    <NavLink to="/login" activeclassname="active">Login</NavLink>
                </li>}
                {!isAuthenticated &&
                    <li>
                        <NavLink to="/register" activeclassname="active">Register</NavLink>
                    </li>
                }
                {isAuthenticated &&
                    <li onClick={handleLogout}>
                        Logout
                    </li>}


            </ul>
        </nav>

    );
}

export default Navbar;