import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../Config/ApiService";
import Pagination from "../common/Pagination";
import { useToast } from "../../contexts/ToastContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(3);
  const toast = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getCurrentUser();
        console.log("Response", response);

        const userPlusBooking = await ApiService.getUserBooking(
          response.user.id
        );
        setUser(userPlusBooking.user);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };
    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleLogout = () => {
    ApiService.logout();
    navigate("/home");
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return; // Do nothing if the user cancels
    }
    try {
      console.log("Attempting to cancel booking with ID:", bookingId);

      const response = await ApiService.cancelBooking(bookingId);
      console.log("Cancel booking response:", response);

      if (response.statusCode === 200) {
        toast.success("Your booking was successfully cancelled");

        // Refresh user data to update the booking list
        const userResponse = await ApiService.getCurrentUser();
        const userPlusBooking = await ApiService.getUserBooking(
          userResponse.user.id
        );
        setUser(userPlusBooking.user);
      } else {
        // Handle non-200 responses
        toast.error(`Error: ${response.message || "Unknown error"}`);
      }
    } catch (e) {
      console.error("Error cancelling booking:", e);
      const errorMessage = e.response?.data?.message || e.message;
      setError(errorMessage);
      toast.error(`Error cancelling booking: ${errorMessage}`);
    }
  };

  // Check if a booking can be cancelled based on payment status and check-in date
  const canCancelBooking = (booking) => {
    // Check payment status - only allow cancellation if NOT paid
    const paymentStatus = (booking.paymentStatus || "").toUpperCase();
    if (paymentStatus === "PAID") {
      return false; // Cannot cancel paid bookings
    }

    // Check if check-in date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for fair comparison

    // Handle different date formats
    let checkInDate;
    try {
      // Try to parse the date - handle YYYY-MM-DD format
      if (typeof booking.checkInDate === "string") {
        const parts = booking.checkInDate.split("-");
        if (parts.length === 3) {
          // Create date from parts and set to beginning of day
          checkInDate = new Date(
            parseInt(parts[0]),
            parseInt(parts[1]) - 1,
            parseInt(parts[2])
          );
          checkInDate.setHours(0, 0, 0, 0);
        } else {
          checkInDate = new Date(booking.checkInDate);
          checkInDate.setHours(0, 0, 0, 0);
        }
      } else {
        checkInDate = new Date(booking.checkInDate);
        checkInDate.setHours(0, 0, 0, 0);
      }

      return checkInDate >= today; // Can only cancel future bookings
    } catch (e) {
      console.error("Error parsing date:", e);
      return false; // If there's an error parsing the date, don't allow cancellation
    }
  };

  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings =
    user?.bookings?.slice(indexOfFirstBooking, indexOfLastBooking) || [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="profile-page">
      {user && <h2> Hello , {user.name}</h2>}
      <div className="profile-actions">
        <button className="edit-profile-button" onClick={handleEditProfile}>
          Edit Profile
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <p className="error-message"> {error}</p>}

      {user && (
        <div className="profile-details">
          <h3>My profile detail</h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {user.phoneNum}
          </p>
        </div>
      )}
      <div className="bookings-section">
        <h3>My Booking History </h3>
        <p className="booking-info-message">
          Note: You can only cancel bookings that are not yet paid and have
          future check-in dates.
        </p>
        <div className="booking-list">
          {user && user.bookings.length > 0 ? (
            currentBookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <p>
                  <strong>Booking Code:</strong>{" "}
                  {booking.bookingConfirmationCode}
                </p>
                <p>
                  <strong>Check-in Date:</strong> {booking.checkInDate}
                </p>
                <p>
                  <strong>Check-out Date:</strong> {booking.checkOutDate}
                </p>
                <p>
                  <strong>Total Guests:</strong> {booking.totalNumberOfGuests}
                </p>
                <p>
                  <strong>Room Type:</strong> {booking.room.roomType}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  <span
                    className={`payment-status ${
                      booking.paymentStatus?.toLowerCase() || "pending"
                    }`}
                  >
                    {booking.paymentStatus || "PENDING"}
                  </span>
                </p>
                <img
                  src={
                    Array.isArray(booking.room.roomImageUrl) &&
                    booking.room.roomImageUrl.length > 0
                      ? booking.room.roomImageUrl[0]
                      : "https://via.placeholder.com/600x400?text=No+Image+Available"
                  }
                  alt="Room"
                  className="room-photo"
                />
                {canCancelBooking(booking) && (
                  <button
                    className="cancel-booking-button"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No Booking found.</p>
          )}
        </div>
        {user && user.bookings.length > 0 && (
          <Pagination
            roomsPerPage={bookingsPerPage}
            totalRooms={user.bookings.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
