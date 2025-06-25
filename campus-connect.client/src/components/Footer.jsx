import React from 'react';
import '../styles/footer.css'; // fixed path

function Footer() {
    return (
        <footer className="footer">
            © {new Date().getFullYear()} Your College Name. All rights reserved.
        </footer>
    );
}

export default Footer;
