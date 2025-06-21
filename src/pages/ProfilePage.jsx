import React from 'react';
import Header from '../components/Header';
import Profile from '../components/Profile';
import Footer from '../components/Footer';

const ProfilePage = () => {
    return (
        <div>
            <Header />
            <div style={{ marginBottom: '100px' }}>
                <Profile />
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;
