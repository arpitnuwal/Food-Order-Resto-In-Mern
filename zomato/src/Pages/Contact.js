import React, { useState } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle, FaTimes } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // ✅ Pop-up state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/contact/send", formData);
      
      if (res.status === 200) {
        setShowPopup(true); // ✅ Pop-up show karo
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error("Contact Error:", err);
      alert(err.response?.data?.message || "Kuch panga ho gaya, message nahi gaya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
        
        .contact-container { display: flex; gap: 50px; max-width: 1200px; margin: 0 auto; padding: 100px 20px; }
        .info-card { flex: 1; display: flex; flex-direction: column; gap: 40px; }
        .form-card { flex: 1.5; background: rgba(255, 255, 255, 0.03); padding: 50px; border: 1px solid rgba(243, 207, 122, 0.1); backdrop-filter: blur(10px); }
        .input-group { display: flex; gap: 20px; }
        
        .input-field {
          width: 100%; padding: 15px 0; background: transparent; border: none; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff; font-family: 'Montserrat', sans-serif; font-size: 13px; outline: none; transition: 0.3s; margin-bottom: 30px;
        }
        .input-field:focus { border-bottom-color: #f3cf7a; }
        
        .submit-btn {
          background: #f3cf7a; color: #000; border: none; padding: 15px 40px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: 0.4s; display: flex; align-items: center; gap: 10px;
        }
        .submit-btn:hover { background: #fff; transform: translateY(-3px); }

        /* ✅ Luxury Pop-up Animations */
        @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9);
          display: flex; align-items: center; justify-content: center; z-index: 100001; backdrop-filter: blur(8px);
        }
        .modal-content {
          background: #0a0a0a; border: 1px solid #f3cf7a; padding: 50px; text-align: center;
          width: 90%; max-width: 450px; position: relative; animation: modalFadeIn 0.5s ease-out;
        }

        @media (max-width: 968px) {
          .contact-container { flex-direction: column; padding: 60px 20px; }
          .input-group { flex-direction: column; gap: 0; }
        }
      `}</style>

      {/* --- Success Pop-up (Modal) --- */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div 
              style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', color: '#666' }}
              onClick={() => setShowPopup(false)}
            >
              <FaTimes size={20} />
            </div>
            <FaCheckCircle size={60} color="#f3cf7a" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontFamily: 'Marcellus', color: '#f3cf7a', letterSpacing: '3px', marginBottom: '15px' }}>MESSAGE SENT</h2>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px' }}>
              Namaste! Humne aapka inquiry receive kar li hai. Hamara Elite Concierge jald hi aapse contact karega.
            </p>
            <button 
              onClick={() => setShowPopup(false)} 
              style={{ ...styles.submitBtn, width: '100%', padding: '12px' }}
            >
              UNDERSTOOD
            </button>
          </div>
        </div>
      )}

      {/* --- Header Section --- */}
      <div style={styles.headerSection}>
        <h1 style={styles.title}>Get In Touch</h1>
        <p style={styles.subtitle}>EXPERIENCE BEYOND DINING — REACH OUT TO US</p>
      </div>

      <div className="contact-container">
        <div className="info-card">
          <div style={styles.infoItem}>
            <div style={styles.iconBox}><FaMapMarkerAlt /></div>
            <div>
              <h4 style={styles.infoTitle}>Location</h4>
              <p style={styles.infoText}>Bhilwara, Rajasthan, India</p>
            </div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.iconBox}><FaPhoneAlt /></div>
            <div>
              <h4 style={styles.infoTitle}>Reservation</h4>
              <p style={styles.infoText}>+91 78498 90313</p>
            </div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.iconBox}><FaEnvelope /></div>
            <div>
              <h4 style={styles.infoTitle}>Email</h4>
              <p style={styles.infoText}>izharpathan7786@gmail.com</p>
            </div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.iconBox}><FaClock /></div>
            <div>
              <h4 style={styles.infoTitle}>Hours</h4>
              <p style={styles.infoText}>11:00 AM - 11:30 PM</p>
            </div>
          </div>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input className="input-field" placeholder="YOUR NAME" name="name" value={formData.name} onChange={handleChange} required />
              <input className="input-field" placeholder="EMAIL" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <input className="input-field" placeholder="SUBJECT" name="subject" value={formData.subject} onChange={handleChange} required />
            <textarea className="input-field" placeholder="MESSAGE" name="message" rows="4" style={{ resize: 'none' }} value={formData.message} onChange={handleChange} required ></textarea>
            
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "SENDING..." : <><FaPaperPlane /> SEND MESSAGE</>}
            </button>
          </form>
        </div>
      </div>

      <div style={styles.mapWrapper}>
        <iframe title="Archi Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115456.40112423377!2d74.5516053444005!3d25.337340003050962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3968c2368c232f9d%3A0x6b44788c03780d0d!2sBhilwara%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000" width="100%" height="450" style={{ border: 0, filter: 'grayscale(1) invert(1) contrast(1.2)' }} allowFullScreen="" loading="lazy"></iframe>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { background: '#000', color: '#fff', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" },
  headerSection: { textAlign: 'center', padding: '150px 20px 50px 20px', background: 'linear-gradient(to bottom, #0a0a0a, #000)' },
  title: { fontFamily: "'Marcellus', serif", fontSize: '50px', color: '#f3cf7a', letterSpacing: '5px', marginBottom: '10px' },
  subtitle: { fontSize: '11px', letterSpacing: '3px', color: '#666' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '20px' },
  iconBox: { width: '50px', height: '50px', border: '1px solid #f3cf7a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f3cf7a' },
  infoTitle: { fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px', color: '#f3cf7a' },
  infoText: { fontSize: '13px', color: '#888' },
  mapWrapper: { width: '100%', marginTop: '50px', borderTop: '1px solid rgba(243, 207, 122, 0.1)' },
  submitBtn: { background: '#f3cf7a', color: '#000', border: 'none', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }
};

export default Contact;