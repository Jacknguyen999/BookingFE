import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ApiService from "../../Config/ApiService";


const AddRoomPage = () => {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomImageUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    })

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSucess] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error('Error fetching room types:', error.message);
            }
        };
        fetchRoomTypes();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }))
    };

    const handleRoomTypeChange = (e) => {
        if (e.target.value === 'new') {
            setRoomTypes(true);
            setRoomDetails(prevState => ({...prevState, roomType: ''}));
        } else {
            setRoomTypes(false);
            setRoomDetails(prevState => ({...prevState, roomType: e.target.value}))
        }

    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.file[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(null);
        }
    }
    return (
        <div className='edit-room-container'>
            <h2>Add new Room</h2>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
            <div className='edit-room-form'>
                <div className='form-group'>
                    {preview && (
                        <img src={preview} alt="Room Preview" className='room-photo-preview'/>
                    )}
                    <input
                        type='file'
                        name='roomPhoto'
                        onChange={handleFileChange}
                    />
                </div>
                <div className='form-group'>
                    <label>Room Type</label>
                    <select value={roomDetails.roomType} onChange={handleRoomTypeChange}>
                        <option>Select a room type</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        <option value='new'>Other (Please Specify)</option>
                    </select>
                    {newRoomType && (
                        <input
                            type="text"
                            name='roomType'
                            placeholder="Enter new room type"
                            value={roomDetails.roomType}
                            onChange={handleChange}
                        />
                    )}
                </div>
                <div className='form-group'>
                    <label>Room Price</label>
                    <input
                        type="text"
                        name='roomPrice'
                        value={roomDetails.roomPrice}
                        onChange={handleChange}
                    />

                </div>

            </div>

        </div>
    )

}