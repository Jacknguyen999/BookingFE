import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ApiService from "../../Config/ApiService";

const AddRoomPage = () => {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });

    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        }));
    };

    const handleRoomTypeChange = (e) => {
        if (e.target.value === 'new') {
            setNewRoomType(true);
            setRoomDetails(prevState => ({...prevState, roomType: ''}));
        } else {
            setNewRoomType(false);
            setRoomDetails(prevState => ({...prevState, roomType: e.target.value}));
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setFiles(selectedFiles);
            
            // Create preview URLs for all selected files
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            
            // Clean up old preview URLs to prevent memory leaks
            previews.forEach(preview => URL.revokeObjectURL(preview));
            
            setPreviews(newPreviews);
        } else {
            setFiles([]);
            setPreviews([]);
        }
    };

    // Cleanup preview URLs when component unmounts
    useEffect(() => {
        return () => {
            previews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [previews]);

    const addRoom = async () => {
        if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription) {
            setError('All room details must be provided.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        if (!window.confirm('Do you want to add this room?')) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('roomType', roomDetails.roomType);
            formData.append('roomPrice', roomDetails.roomPrice);
            formData.append('roomDescription', roomDetails.roomDescription);

            // Append all selected files
            files.forEach((file, index) => {
                formData.append('photos', file);
            });

            const result = await ApiService.addRoom(formData);
            if (result.statusCode === 200) {
                setSuccess('Room Added successfully.');

                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className='edit-room-container'>
            <h2>Add new Room</h2>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
            <div className='edit-room-form'>
                <div className='form-group'>
                    <div className="preview-container">
                        {previews.map((preview, index) => (
                            <img 
                                key={index}
                                src={preview} 
                                alt={`Room Preview ${index + 1}`} 
                                className='room-photo-preview'
                            />
                        ))}
                    </div>
                    <input
                        type='file'
                        name='roomPhotos'
                        onChange={handleFileChange}
                        multiple // Enable multiple file selection
                        accept="image/*" // Accept only image files
                    />
                </div>
                <div className='form-group'>
                    <label>Room Type</label>
                    <select value={roomDetails.roomType} onChange={handleRoomTypeChange}>
                        <option value="">Select a room type</option>
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
                        type="number"
                        name='roomPrice'
                        value={roomDetails.roomPrice}
                        onChange={handleChange}
                    />
                </div>
                <div className='form-group'>
                    <label>Room Description</label>
                    <textarea
                        name='roomDescription'
                        value={roomDetails.roomDescription}
                        onChange={handleChange}
                    />
                </div>

                <button className='update-button' onClick={addRoom}>Add Room</button>
            </div>
        </div>
    );
};

export default AddRoomPage;