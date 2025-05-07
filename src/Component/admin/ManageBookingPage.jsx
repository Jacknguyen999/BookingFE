import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../Config/ApiService";
import Pagination from "../common/Pagination";

export const ManageBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(6);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await ApiService.getAllBookings();

        console.log("response fetch booking", response);
        const allBooking = response.bookingList;
        setBookings(allBooking);
        setFilteredBooking(allBooking);
      } catch (e) {
        console.error("error fetching bookings", e.message);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings(searchTerm);
  }, [searchTerm, bookings]);

  const filterBookings = (term) => {
    if (term === "") {
      setFilteredBooking(bookings);
    } else {
      const filtered = bookings.filter(
        (booking) =>
          booking.bookingConfirmationCode &&
          booking.bookingConfirmationCode
            .toLowerCase()
            .includes(term.toLowerCase())
      );
      setFilteredBooking(filtered);
    }

    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBooking.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bookings-container">
      <h2>All Booking</h2>
      <div className="search-div">
        <label>Filter By Booking Code :</label>
        <input
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter Booking Code"
          type="text"
        />
      </div>

      <div className="booking-results">
        {currentBookings.map((booking) => (
          <div className="booking-result-item" key={booking.id}>
            <p>
              <strong>Booking Code:</strong> {booking.bookingConfirmationCode}
            </p>
            <p>
              <strong>Check In Date:</strong> {booking.checkInDate}
            </p>
            <p>
              <strong>Check out Date:</strong> {booking.checkOutDate}
            </p>
            <p>
              <strong>Total Guests:</strong> {booking.totalNumberOfGuests}
            </p>
            <button
              className="edit-room-button"
              onClick={() =>
                navigate(
                  `/admin/edit-booking/${booking.bookingConfirmationCode}`
                )
              }
            >
              ManageBooking
            </button>
          </div>
        ))}
      </div>
      <Pagination
        roomsPerPage={bookingsPerPage}
        totalRooms={filterBookings.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default ManageBookingPage;
