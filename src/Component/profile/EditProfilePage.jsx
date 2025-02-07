import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ApiService from "../../Config/ApiService";


const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getCurrentUser();
                console.log("Response", response);
                setUser(response.user)

            } catch (e) {
                setError(e.message);
            }
        }

        fetchUserProfile();
    }, []);

    console.log(user)


    const handleDeleteProfile = async () => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        try {
            await ApiService.deleteUser(user.id);
            navigate('/signup');
        } catch (e) {
            setError(e.message)
        }
    };


    return (
        <div>
            <h2>Edit Profile</h2>
            {error && <p className="error-message">{error}</p>}
            {user &&
                (
                    <div className='edit-profile-page'>
                        <p><strong>Name :</strong> {user.name}</p>
                        <p><strong>Email :</strong> {user.email}</p>
                        <p><strong>Phone Number :</strong> {user.phoneNum}</p>
                        <button className='delete-profile-button' onClick={handleDeleteProfile}> Delete profile</button>

                    </div>
                )
            }


        </div>
    );
}

export default EditProfilePage;