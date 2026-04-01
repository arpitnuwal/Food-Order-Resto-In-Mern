import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, 
  FaPhoneAlt, FaEnvelope, FaChevronRight, FaArrowUp // ✅ FaArrowUp add kiya
} from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Scroll Logic: Button tab dikhao jab 300px scroll ho jaye
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer style={styles.footerContainer}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');

        .footer-link {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 12px;
          transition: 0.4s;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .footer-link:hover {
          color: #f3cf7a;
          transform: translateX(8px);
        }

        .social-icon {
          color: #f3cf7a;
          font-size: 18px;
          margin-right: 20px;
          transition: 0.4s;
          cursor: pointer;
        }

        .social-icon:hover {
          color: #fff;
          transform: translateY(-5px);
        }

        /* ✅ Scroll to Top Button Style */
        .scroll-btn {
          position: fixed;
          bottom: 40px;
          right: 40px;
          background: #f3cf7a;
          color: #000;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          box-shadow: 0 10px 25px rgba(243, 207, 122, 0.3);
          transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 1000;
          opacity: ${isVisible ? '1' : '0'};
          transform: ${isVisible ? 'translateY(0)' : 'translateY(100px)'};
        }

        .scroll-btn:hover {
          background: #fff;
          transform: scale(1.1) translateY(-5px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(243, 207, 122, 0.1);
          padding-top: 30px;
          margin-top: 50px;
          text-align: center;
          color: rgba(255, 255, 255, 0.3);
          font-size: 10px;
          letter-spacing: 3px;
        }

        @media (max-width: 768px) {
          .scroll-btn { bottom: 20px; right: 20px; width: 40px; height: 40px; }
        }
      `}</style>

      {/* ✅ Scroll To Top Button Component */}
      <button className="scroll-btn" onClick={scrollToTop}>
        <FaArrowUp />
      </button>

      <div style={styles.footerGrid}>
        <div style={styles.column}>
          <h2 style={styles.brandTitle}>Archi</h2>
          <p style={styles.brandDesc}>
            Crafting culinary architecture with passion and precision. 
            Bhilwara's finest elite dining experience.
          </p>
          <div style={{ marginTop: '25px' }}>
            <FaFacebookF className="social-icon" />
            <FaInstagram className="social-icon" />
            <FaTwitter className="social-icon" />
          </div>
        </div>

        <div style={styles.column}>
          <h4 style={styles.columnTitle}>Discover</h4>
          <Link to="/" className="footer-link"><FaChevronRight size={8}/> Home</Link>
          <Link to="/about" className="footer-link"><FaChevronRight size={8}/> About Us</Link>
          <Link to="/menu" className="footer-link"><FaChevronRight size={8}/> Curation (Menu)</Link>
          <Link to="/services" className="footer-link"><FaChevronRight size={8}/> Services</Link>
          <Link to="/blog" className="footer-link"><FaChevronRight size={8}/> Journal (Blog)</Link>
        </div>

        <div style={styles.column}>
          <h4 style={styles.columnTitle}>Guest Relations</h4>
          <Link to="/booktable" className="footer-link"><FaChevronRight size={8}/> Table Booking</Link>
          <Link to="/privateevent" className="footer-link"><FaChevronRight size={8}/> Private Events</Link>
          <Link to="/myorder" className="footer-link"><FaChevronRight size={8}/> My Orders</Link>
          <Link to="/wishlist" className="footer-link"><FaChevronRight size={8}/> Wishlist</Link>
          <Link to="/contact" className="footer-link"><FaChevronRight size={8}/> Contact & Help</Link>
        </div>

        <div style={styles.column}>
          <h4 style={styles.columnTitle}>Reach Us</h4>
          <p style={styles.contactItem}>
            <FaMapMarkerAlt style={styles.goldIcon} /> Bhilwara, Rajasthan, India
          </p>
          <p style={styles.contactItem}>
            <FaPhoneAlt style={styles.goldIcon} /> +91 9610229171
          </p>
          <p style={styles.contactItem}>
            <FaEnvelope style={styles.goldIcon} /> hello@archi-dining.com
          </p>
          <Link to="/userprofile" className="footer-link" style={{marginTop: '10px'}}>
             <FaChevronRight size={8}/> My Profile
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {currentYear} ARCHI LUXURY DINING. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}

const styles = {
  footerContainer: { background: "#050505", padding: "80px 10% 40px 10%", borderTop: "1px solid rgba(243, 207, 122, 0.1)", position: "relative", zIndex: 10 },
  footerGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "40px" },
  brandTitle: { fontFamily: "'Marcellus', serif", color: "#f3cf7a", fontSize: "32px", letterSpacing: "8px", textTransform: "uppercase", marginBottom: "20px" },
  brandDesc: { color: "rgba(255, 255, 255, 0.4)", fontSize: "13px", lineHeight: "1.8", maxWidth: "280px" },
  columnTitle: { fontFamily: "'Marcellus', serif", color: "#fff", fontSize: "16px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "30px", borderBottom: "1px solid rgba(243, 207, 122, 0.2)", display: "inline-block", paddingBottom: "5px" },
  contactItem: { display: "flex", alignItems: "center", gap: "12px", color: "rgba(255, 255, 255, 0.5)", fontSize: "13px", marginBottom: "15px", fontFamily: "'Montserrat', sans-serif" },
  goldIcon: { color: "#f3cf7a", fontSize: "14px" }
};

export default Footer;