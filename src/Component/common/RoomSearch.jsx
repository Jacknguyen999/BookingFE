import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ApiService from "../../Config/ApiService";
import { useToast } from "../../contexts/ToastContext";

const RoomSearch = ({ handleSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchRoomsTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        toast.error("Error fetching room types: " + error.message);
      }
    };
    fetchRoomsTypes();
  }, []);

  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      toast.error("Please enter valid information");
      return false;
    }
    try {
      const formattedStartDate = startDate
        ? startDate.toISOString().split("T")[0]
        : null;
      const formattedEndDate = endDate
        ? endDate.toISOString().split("T")[0]
        : null;

      const response = await ApiService.getAvailableRoomsByDateAndType(
        formattedStartDate,
        formattedEndDate,
        roomType
      );

      if (response.statusCode === 200) {
        if (response.roomList.length === 0) {
          toast.warning("No available rooms");
          return;
        }
        handleSearchResult(response.roomList);
      }
    } catch (error) {
      toast.error(
        "Error searching rooms: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <section>
      <div className="search-container">
        <div className="search-field">
          <label>Check-in Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Check-in Date"
          />
        </div>
        <div className="search-field">
          <label>Check-out Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Check-out Date"
          />
        </div>

        <div className="search-field">
          <label>Room Type </label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option disabled value="">
              Select Room Type
            </option>
            {roomTypes.map((roomType) => (
              <option key={roomType} value={roomType}>
                {roomType}
              </option>
            ))}
          </select>
        </div>
        <button className="home-search-button" onClick={handleInternalSearch}>
          Search Rooms
        </button>
      </div>
    </section>
  );
};

export default RoomSearch;
