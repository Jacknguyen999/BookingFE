import DatePicker from "react-datepicker";
import {useEffect, useState} from "react";
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from "../../Config/ApiService";


const RoomSearch = ({handleSearchResult}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState('');
    const [error, setError] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);


    useEffect(() => {
        const fetchRoomsTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.log("Error fetch Room Type : " + error.message);
            }
        };
        fetchRoomsTypes();
    }, []);


    const showError = (message, timeout = 5000) => {

        setError(message);
        setTimeout(() => {
            setError('');
        }, timeout);

    }


    const handleInternalSearch = async () => {
        if (!startDate || !endDate || !roomType) {
            showError("Please enter a valid infor");
            return false;
        }
        try {

            const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
            const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

            const response = await ApiService.getAvailableRoomsByDateAndType(formattedStartDate, formattedEndDate, roomType);

            console.log(
                "Response room list : ", response
            )
            if (response.statusCode === 200) {
                if (response.roomList.length === 0) {
                    showError("No available rooms");
                    return;
                }
                handleSearchResult(response.roomList);
                setError('')
            }
        } catch (error) {
            showError("Unknown error" + error.response.data.message);
        }

    }


    return (
        <section>
            <div className='search-container'>
                <div className='search-field'>
                    <label>Check-in Date</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Check-in Date"
                    />
                </div>
                <div className='search-field'>
                    <label>Check-out Date</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Check-out Date"
                    />

                </div>

                <div className='search-field'>
                    <label>Room Type </label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
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
            {error && <p className="error-message"> {error}</p>}
        </section>
    )

}

export default RoomSearch;