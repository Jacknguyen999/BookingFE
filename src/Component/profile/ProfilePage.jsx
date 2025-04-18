import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ApiService from "../../Config/ApiService";


const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getCurrentUser();
                console.log("Response", response);

                const userPlusBooking = await ApiService.getUserBooking(response.user.id);
                setUser(userPlusBooking.user)
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        }
        fetchUserProfile();

    }, []);


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
                    {user && user.bookings.length > 0 ? (
                            user.bookings.map((booking) => (
                                <div key={booking.id} className='booking-item'>
                                    <p><strong>Booking Code:</strong> {booking.bookingConfirmationCode}</p>
                                    <p><strong>Check-in Date:</strong> {booking.checkInDate}</p>
                                    <p><strong>Check-out Date:</strong> {booking.checkOutDate}</p>
                                    <p><strong>Total Guests:</strong> {booking.totalNumberOfGuests}</p>
                                    <p><strong>Room Type:</strong> {booking.room.roomType}</p>
                                    <img src={booking.room.roomImageUrl} alt="Room" className="room-photo"/>

                                </div>
                            ))
                        ) :
                        (
                            <p>No Booking found.</p>
                        )
                    }
                </div>

            </div>


        </div>
    )
}

export default ProfilePage;