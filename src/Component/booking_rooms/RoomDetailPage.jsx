import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import ApiService from "../../Config/ApiService";

const RoomDetailPage = () => {
    const navigate = useNavigate();
    const {roomId} = useParams();
    const [roomDetails, setRoomDetails] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [checkInDate, setCheckInDate] = useState(null)
    const [checkOutDate, setCheckOutDate] = useState(null)
    const [numAdults, setNumAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0); // State variable for total booking price
    const [totalGuests, setTotalGuests] = useState(1); // State variable for total number of guests
    const [showDatePicker, setShowDatePicker] = useState(false); // State variable to control date picker visibility
    const [userId, setUserId] = useState(''); // Set user id
    const [showMessage, setShowMessage] = useState(false); // State variable to control message visibility
    const [confirmationCode, setConfirmationCode] = useState(''); // State variable for booking confirmation code
    const [errorMessage, setErrorMessage] = useState(''); // State variable for error message

    const {roomType, roomPrice, roomImageUrl, roomDescription, bookings} = roomDetails || {};

    const handleConfirmBooking = async () => {
        if (!checkInDate || !checkOutDate) {
            setErrorMessage("Pls select check-in and check-out date");
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        if (isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
            setErrorMessage("Pls enter valid number for adults and children");
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        const oneDay = 24 * 60 * 60 * 1000;
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);

        const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;


        const totalGuests = numAdults + numChildren;

        const roomPricePerNight = roomDetails.roomPrice;
        const totalPrice = roomPricePerNight * totalDays;

        setTotalPrice(totalPrice);
        setTotalGuests(totalGuests);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await ApiService.getRoomById(roomId);
                console.log("response--", response)
                setRoomDetails(response.room);
                const userProfile = await ApiService.getCurrentUser();
                setUserId(userProfile.user.id);
            } catch (e) {
                setError(e.response?.data?.message || e.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [roomId]);

    const acceptBooking = async () => {
        try {
            const startDate = new Date(checkInDate);
            const endDate = new Date(checkOutDate);

            // Log the original dates for debugging
            console.log("Original Check-in Date:", startDate);
            console.log("Original Check-out Date:", endDate);

            const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 6000)).toISOString().split('T')[0];
            const formattedCheckOutDate = new Date(endDate.getTime() - (startDate.getTimezoneOffset() * 6000)).toISOString().split('T')[0];

            // Log the original dates for debugging
            console.log("Formated Check-in Date:", formattedCheckInDate);
            console.log("Formated Check-out Date:", formattedCheckOutDate);

            const booking = {
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
                numOfAdults: numAdults,
                numOfChildren: numChildren
            }
            console.log('booking---', booking)
            console.log('checkoutdate---', checkOutDate)


            // Create Booking

            const response = await ApiService.bookRoom(roomId, userId, booking);
            if (response.statusCode === 200) {
                setConfirmationCode(response.bookingConfirmationCode);
                setShowMessage(true);

                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/profile')
                }, 5000)

            }


        } catch (e) {
            setErrorMessage(e.response?.data?.message || e.message)
            console.log()
            setTimeout(() => setErrorMessage(''), 5000)

        }
    };

    if (isLoading) {
        return <p className='room-detail-loading'>Loading room details...</p>
    }
    if (error) {
        return <p className='room-detail-loading'>{error}</p>;
    }
    if (!roomDetails) {
        return <p className='room-detail-loading'>Room not found.</p>;
    }


    return (
        <div className='room-details-booking'>
            {showMessage && (
                <p className='booking-success-message'> Booking successful! Your Confirmation code : {confirmationCode}.
                    An receipt of your bookings details have been sent to you</p>
            )}
            {errorMessage && (
                <p className='error-message'>
                    {errorMessage}
                </p>
            )}
            <h2>Room Details</h2>
            <br/>
            <img src={roomImageUrl} alt={roomType} className='room-details-image'/>
            <div className='room-details-info'>
                <h3>{roomType}</h3>
                <p>Price : {roomPrice}$ / night</p>
                <p>{roomDescription}</p>
            </div>
            {bookings && bookings.length > 0 && (
                <div>
                    <h3>Existing Booking Details</h3>
                    <ul className='booking-list'>
                        {bookings.map((booking, index) => (
                            <li key={booking.id} className='booking-item'>
                                <span className='booking-number'>Booking {index + 1}: </span>
                                <br/>
                                <span className='booking-text'>Check-in:{booking.checkInDate}</span>
                                <br/>
                                <span className='booking-text'>Check-out: {booking.checkOutDate}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className='booking-info'>
                <button className='book-now-button' onClick={() => setShowDatePicker(true)}>Book Now</button>
                <button className='go-back-button'
                        onClick={() => {
                            if (showDatePicker) {
                                setShowDatePicker(false); // Hide the date picker
                            } else {
                                navigate('/rooms'); // Navigate back to the rooms page
                            }
                        }}
                >
                    Go Back
                </button>
                {showDatePicker && (
                    <div className='date-picker-container'>
                        <div className="date-picker-wrapper">
                            <DatePicker
                                className='detail-search-field'
                                selected={checkInDate}
                                onChange={(date) => setCheckInDate(date)}
                                startDate={checkInDate}
                                endDate={checkOutDate}
                                placeholderText="Check-in date"
                                dateFormat='dd/MM/yyyy'
                                showPopperArrow={false}
                            />
                            <DatePicker
                                className='detail-search-field'
                                selected={checkOutDate}
                                onChange={(date) => setCheckOutDate(date)}
                                startDate={checkInDate}
                                endDate={checkOutDate}
                                minDate={checkInDate}
                                placeholderText="Check-out date"
                                dateFormat='dd/MM/yyyy'
                                showPopperArrow={false}
                            />
                        </div>

                        <div className='guest-container'>
                            <div className='guest-div'>
                                <label>Adults: </label>
                                <input
                                    type='number'
                                    min='1'
                                    value={numAdults}
                                    onChange={(e) => setNumAdults(parseInt(e.target.value))}
                                    className="input-field"
                                />
                            </div>
                            <div className='guest-div'>
                                <label>Children: </label>
                                <input
                                    type='number'
                                    min='0'
                                    value={numChildren}
                                    onChange={(e) => setNumChildren(parseInt(e.target.value))}
                                    className="input-field"
                                />
                            </div>
                            <button className='confirm-booking' onClick={handleConfirmBooking}>Confirm Booking</button>
                        </div>
                    </div>
                )}

                {totalPrice > 0 && (
                    <div className='total-price-container'>
                        <div className='total-price-info'>
                            <p className='total-price-text'>Total Price: <span
                                className='price-value'>${totalPrice}</span></p>
                            <p className='total-price-text'>Total Guests: <span
                                className='guests-value'>{totalGuests}</span></p>
                        </div>
                        <button className='accept-booking' onClick={acceptBooking}>Accept Booking</button>
                    </div>
                )}


            </div>
        </div>
    )
}
export default RoomDetailPage;
