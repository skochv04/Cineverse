import './styles/Footer.css'

function Footer() {
    return (
        <div id="Footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-section about">
                        <h2>CineVerse</h2>
                        <p>Your movie center. Watch, discover and enjoy </p>
                        <p>cinematography from the best places in the world.</p>
                    </div>
                    <div className="footer-section contact-form">
                        <h2>Contacts</h2>
                        <p>Call us: +48 123 456 789</p>
                        <p>Email: contact@cineverse.com</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 CineVerse. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default Footer