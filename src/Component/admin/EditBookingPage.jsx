import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../Config/ApiService";
import previews from "../../dev/previews";

export const EditBookingPage = () => {
  const navigate = useNavigate();
  const { bookingCode } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null); // State variable for booking details
  const [error, setError] = useState(null); // Track any errors
  const [success, setSuccessMessage] = useState(null); // Track any errors

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await ApiService.getBookingByConfirmationCode(
          bookingCode
        );
        setBookingDetails(response.booking);
      } catch (e) {
        setError(e.message);
      }
    };
    fetchBookingDetails();
  }, [bookingCode]);

  const achieveBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to Acheive this booking?")) {
      return; // Do nothing if the user cancels
    }
    try {
      const response = await ApiService.cancelBooking(bookingId);
      if (response.statusCode === 200) {
        setSuccessMessage("The booking was deleted");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/admin/manage-bookings");
        }, 3000);
      }
    } catch (e) {
      setError(error.response?.data?.message || error.message);
      setTimeout(() => setError(""), 5000);
    }
  };
  return (
    <div className="find-booking-page">
      <h2>Booking Detail</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {bookingDetails && (
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p>Confirmation Code: {bookingDetails.bookingConfirmationCode}</p>
          <p>Check-in Date: {bookingDetails.checkInDate}</p>
          <p>Check-out Date: {bookingDetails.checkOutDate}</p>
          <p>Num Of Adults: {bookingDetails.numOfAdults}</p>
          <p>Num Of Children: {bookingDetails.numOfChildren}</p>

          <br />
          <hr />
          <br />
          <h3>Booker Details</h3>
          <div>
            <p> Name: {bookingDetails.user.name}</p>
            <p> Email: {bookingDetails.user.email}</p>
            <p> Phone Number: {bookingDetails.user.phoneNum}</p>
          </div>

          <br />
          <hr />
          <br />
          <h3>Room Details</h3>
          <div>
            <p> Room Type: {bookingDetails.room.roomType}</p>
            <p> Room Price: ${bookingDetails.room.roomPrice}</p>
            <p> Room Description: {bookingDetails.room.roomDescription}</p>
            <img
              src={
                Array.isArray(bookingDetails.room.roomImageUrl) &&
                bookingDetails.room.roomImageUrl.length > 0
                  ? bookingDetails.room.roomImageUrl[0]
                  : "https://via.placeholder.com/600x400?text=No+Image+Available"
              }
              className="room-photo"
              alt={bookingDetails.room.roomType || "Room Image"}
            />
          </div>
          <button
            className="acheive-booking"
            onClick={() => achieveBooking(bookingDetails.id)}
          >
            Achieve Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default EditBookingPage;
