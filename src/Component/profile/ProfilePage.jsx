import {useState} from "react";
import {useNavigate} from "react-router-dom";
import ApiService from "../../Config/ApiService";


const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/edit-profile');
    }

    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    }
    return (
        <div className='profile-page'>
            {user && <h2> Hello , {user.name}</h2>}
            <div className='profile-actions'>
                <button className='edit-profile-button' onClick={handleEditProfile}>Edit Profile</button>
                <button className='logout-button' onClick={handleLogout}>Logout</button>

            </div>

            {error && <p className='error-message'> {error}</p>}

            {user && (
                <div className='profile-details'>
                    <h3>My profile detail</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone Number:</strong> {user.phoneNum}</p>

                </div>
            )}
            <div className='bookings-section'>
                <h3>My Booking History </h3>
                <div className='booking-list'>
                    {/*{user && user.bookings.length >0 ? (*/}
                    {/*    */}
                    {/*)}*/}
                </div>

            </div>


        </div>
    )
}

export default ProfilePage;