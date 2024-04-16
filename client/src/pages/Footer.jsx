import './styles/Footer.css'

function Footer() {
    return (
        <div id="Footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-section about">
                        <h2>CineVerse</h2>
                        <p>Twoje centrum filmowe. Oglądaj, odkrywaj i ciesz się </p>
                        <p>kinematografią z najlepszych miejsc na świecie. </p>
                    </div>
                    <div className="footer-section contact-form">
                        <h2>Kontakt</h2>
                        <p>Zadzwoń do nas: +48 123 456 789</p>
                        <p>Email: kontakt@cineverse.com</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 CineVerse. Wszystkie prawa zastrzeżone.</p>
                </div>
            </div>
        </div>
    );
}

export default Footer