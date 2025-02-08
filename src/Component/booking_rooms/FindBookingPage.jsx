import {useState} from "react";
import ApiService from "../../Config/ApiService";


const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);

    // console.log("Booking details", bookingDetails)


    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            setError('pls enter a booking confirmation code')
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode.trim());

            setBookingDetails(response.booking);
            setError(null);
        } catch (e) {
            setError(e.response?.data?.message || e.message)
            setTimeout(() => setError(''), 5000)
        }

    }

    return (
        <div className='find-booking-page'>

            <h2>Find Booking</h2>
            <div className='search-container'>
                <input
                    required
                    placeholder='Enter your booking cofnirmation code'
                    value={confirmationCode.trim()}
                    type="text"
                    onChange={(e) => setConfirmationCode(e.target.value)}
                />
                <button onClick={handleSearch}>
                    Find
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {bookingDetails && (
                    <div>
                        <h3>Booking Details</h3>
                        <p>Confirmation Code: {bookingDetails.bookingConfirmationCode}</p>
                        <p>Check-in Date: {bookingDetails.checkInDate}</p>
                        <p>Check-out Date: {bookingDetails.checkOutDate}</p>
                        <p>Num Of Adults: {bookingDetails.numOfAdults}</p>
                        <p>Num Of Children: {bookingDetails.numOfChildren}</p>
                        <br/>
                        <hr/>
                        <br/>

                        <h3>Booker Details</h3>
                        <div>
                            <p> Name: {bookingDetails.user.name}</p>
                            <p> Email: {bookingDetails.user.email}</p>
                            <p> Phone Number: {bookingDetails.user.phoneNum}</p>
                        </div>

                        <br/>
                        <hr/>
                        <br/>

                        <h3>Room Details</h3>
                        <div>
                            <p> Room Type: {bookingDetails.room.roomType}</p>
                            <img src={bookingDetails.room.roomImageUrl} alt="" sizes="" srcSet=""/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FindBookingPage;