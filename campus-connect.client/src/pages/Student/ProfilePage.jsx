import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext.jsx';
import UserProfile from '../../components/Styless/UserProfile';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    return <UserProfile user={user} />;
};

export default ProfilePage;
