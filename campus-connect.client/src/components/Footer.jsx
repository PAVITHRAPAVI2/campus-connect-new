import React from 'react';
import './Styless/footer.css'; // or separate Footer CSS if needed

function Footer() {
    return (
        <footer className="footer">
            © {new Date().getFullYear()} Your College Name. All rights reserved.
        </footer>
    );
}

export default Footer;