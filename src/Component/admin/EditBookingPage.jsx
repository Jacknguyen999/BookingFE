import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../Config/ApiService";
import { useToast } from "../../contexts/ToastContext";

export const EditBookingPage = () => {
  const navigate = useNavigate();
  const { bookingCode } = useParams();
  const toast = useToast();
  const [bookingDetails, setBookingDetails] = useState(null); // State variable for booking details
  const [error, setError] = useState(null); // Track any errors

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await ApiService.getBookingByConfirmationCode(
          bookingCode
        );
        setBookingDetails(response.booking);
      } catch (e) {
        const errorMessage = e.message;
        setError(errorMessage);
        toast.error(`Error loading booking details: ${errorMessage}`);
      }
    };
    fetchBookingDetails();
  }, [bookingCode, toast]);

  const achieveBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to archive this booking?")) {
      return; // Do nothing if the user cancels
    }
    try {
      const response = await ApiService.cancelBooking(bookingId);
      if (response.statusCode === 200) {
        toast.success("The booking was successfully archived");
        setTimeout(() => {
          navigate("/admin/manage-bookings");
        }, 3000);
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message;
      setError(errorMessage);
      toast.error(`Error archiving booking: ${errorMessage}`);
    }
  };
  return (
    <div className="find-booking-page">
      <h2>Booking Detail</h2>
      {error && <p className="error-message">{error}</p>}
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
            className="archive-booking"
            onClick={() => achieveBooking(bookingDetails.id)}
          >
            Archive Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default EditBookingPage;
