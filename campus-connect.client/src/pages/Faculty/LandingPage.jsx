import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../components/styles/LandingPage.css";
import landingbg from '../../assets/landingbgimage.png';
import Navbar from '../../components/Navbar';

const LandingPage = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');

    const handleGetStarted = () => {
        if (userName) {
            navigate('/faculty');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="landing-page">
            <Navbar />
            <div className="hero">
                <div
                    className="hero-content"
                    style={{ backgroundImage: `url(${landingbg})` }}
                >
                    <h1>Connect, Explore, and Thrive on Campus</h1>
                    <p>
                        Join Campus Connect to discover groups, clubs, and events that match your interests.
                        Make new friends and stay informed about campus life.
                    </p>
                    <button className="get-started" onClick={handleGetStarted}>
                        {userName ? 'Go to Dashboard' : 'Get Started'}
                    </button>
                </div>
            </div>

            <div className="features-section">
                <h2>Discover the Power of Campus Connect</h2>
                <p>
                    Campus Connect offers a range of features designed to enhance your college experience.
                    Connect with peers, explore groups and clubs, and stay updated on campus events.
                </p>

                <div className="features-grid">
                    <div className="feature-box">
                        <h3>👥 Connect with Peers</h3>
                        <p>Find and connect with students who share your interests and passions.</p>
                    </div>
                    <div className="feature-box">
                        <h3>🏛 Explore Groups & Clubs</h3>
                        <p>Discover student organizations and join activities that align with your hobbies.</p>
                    </div>
                    <div className="feature-box">
                        <h3>🗓 Stay Updated on Events</h3>
                        <p>Never miss out on happenings, workshops, and campus activities.</p>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <h2>Ready to Get Connected?</h2>
                <p>Join Campus Connect today and start exploring your campus community.</p>
                <button className="sign-up" onClick={handleGetStarted}>
                    {userName ? 'Go to Dashboard' : 'Sign Up Now'}
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
