import React, { useState } from "react";
import axios from "axios";
import { FaGlassCheers, FaCalendarAlt, FaUsers, FaClock, FaCommentDots, FaCheckCircle } from "react-icons/fa";

function PrivateEvent() {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        phone: "",
        eventType: "Birthday Party",
        guests: 10,
        eventDate: "",
        eventTime: "",
        specialRequest: ""
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/events/book", formData);
            if (res.status === 201) {
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            alert("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={styles.successWrapper}>
                <FaCheckCircle size={80} color="#f3cf7a" />
                <h1 style={styles.marcellusTitle}>Inquiry Sent!</h1>
                <p style={styles.successText}>Thank you for choosing Archi. Our events team will contact you within 24 hours to finalize your elite celebration.</p>
                <button style={styles.btnGold} onClick={() => window.location.href = "/"}>Return Home</button>
            </div>
        );
    }

    return (
        <div style={styles.pageContainer}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
                
                .event-input { 
                    background: rgba(255,255,255,0.05) !important; 
                    border: 1px solid rgba(243, 207, 122, 0.2) !important; 
                    color: #fff !important; 
                    padding: 15px !important; 
                    border-radius: 8px !important; 
                    width: 100%; 
                    outline: none; 
                    transition: 0.3s; 
                    font-family: 'Montserrat', sans-serif;
                }
                .event-input:focus { 
                    border-color: #f3cf7a !important; 
                    background: rgba(255,255,255,0.1) !important; 
                }
                .event-label { 
                    font-size: 11px; 
                    letter-spacing: 2px; 
                    color: #f3cf7a; 
                    text-transform: uppercase; 
                    margin-bottom: 8px; 
                    display: block; 
                    font-weight: 600; 
                }

                /* ✅ RESPONSIVE QUERIES */
                @media (max-width: 992px) {
                    .hero-title { font-size: 42px !important; }
                    .glass-card { padding: 40px !important; }
                }

                @media (max-width: 768px) {
                    .hero-section { height: 40vh !important; }
                    .hero-title { font-size: 32px !important; }
                    .grid-form { grid-template-columns: 1fr !important; gap: 20px !important; }
                    .span-mobile { grid-column: span 1 !important; }
                    .form-section { margin-top: -60px !important; }
                    .glass-card { border-radius: 15px !important; padding: 30px 20px !important; }
                }

                @media (max-width: 480px) {
                    .hero-title { font-size: 28px !important; letter-spacing: 2px !important; }
                    .card-heading { font-size: 24px !important; }
                    .btn-gold { width: 100% !important; padding: 15px !important; }
                }
            `}</style>

            <div className="hero-section" style={styles.heroSection}>
                <div style={styles.overlay}></div>
                <div style={styles.heroContent}>
                    <p style={styles.preTitle}>Exclusive Gatherings</p>
                    <h1 className="hero-title" style={styles.marcellusTitle}>Private Events at Archi</h1>
                    <div style={styles.goldLine}></div>
                </div>
            </div>

            <div className="form-section" style={styles.formSection}>
                <div className="glass-card" style={styles.glassCard}>
                    <h2 className="card-heading" style={styles.cardHeading}>Reserve Your Moment</h2>
                    <p style={styles.cardSub}>Fill the details below and our curator will reach out to you.</p>

                    <form onSubmit={handleSubmit} className="grid-form" style={styles.gridForm}>
                        <div style={styles.inputGrp}>
                            <label className="event-label">Full Name</label>
                            <input name="userName" required className="event-input" placeholder="Your Name" onChange={handleChange} />
                        </div>

                        <div style={styles.inputGrp}>
                            <label className="event-label">Email Address</label>
                            <input name="email" type="email" required className="event-input" placeholder="email@example.com" onChange={handleChange} />
                        </div>

                        <div style={styles.inputGrp}>
                            <label className="event-label">Phone Number</label>
                            <input name="phone" required className="event-input" placeholder="+91 ..." onChange={handleChange} />
                        </div>

                        <div style={styles.inputGrp}>
                            <label className="event-label">Event Type</label>
                            <select name="eventType" className="event-input" onChange={handleChange} style={{appearance: 'none'}}>
                                <option value="Birthday Party">Birthday Party</option>
                                <option value="Corporate Event">Corporate Event</option>
                                <option value="Anniversary">Anniversary</option>
                                <option value="Wedding Gala">Wedding Gala</option>
                                <option value="Private Dinner">Private Dinner</option>
                            </select>
                        </div>

                        <div style={styles.inputGrp}>
                            <label className="event-label"><FaUsers size={12} style={{marginRight: '5px'}}/> Number of Guests</label>
                            <input name="guests" type="number" required className="event-input" placeholder="Min 10 Guests" onChange={handleChange} />
                        </div>

                        <div style={styles.inputGrp}>
                            <label className="event-label"><FaCalendarAlt size={12} style={{marginRight: '5px'}}/> Preferred Date</label>
                            <input name="eventDate" type="date" required className="event-input" onChange={handleChange} />
                        </div>

                        <div className="span-mobile" style={{ ...styles.inputGrp, gridColumn: 'span 2' }}>
                            <label className="event-label"><FaCommentDots size={12} style={{marginRight: '5px'}}/> Special Requirements</label>
                            <textarea name="specialRequest" rows="4" className="event-input" placeholder="Tell us about themes, dietary needs, or decor requirements..." onChange={handleChange}></textarea>
                        </div>

                        <div className="span-mobile" style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '20px' }}>
                            <button type="submit" disabled={loading} className="btn-gold" style={styles.btnGold}>
                                {loading ? "SENDING..." : "REQUEST PROPOSAL"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: { background: "#050505", minHeight: "100vh", color: "#fff", fontFamily: "'Montserrat', sans-serif" },
    heroSection: { height: '50vh', position: 'relative', background: 'url("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600") center/cover no-repeat', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), #050505)' },
    heroContent: { position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px' },
    preTitle: { fontSize: '12px', letterSpacing: '6px', color: '#f3cf7a', textTransform: 'uppercase', marginBottom: '15px' },
    marcellusTitle: { fontFamily: "'Marcellus', serif", fontSize: '56px', color: '#f3cf7a', margin: '0', lineHeight: '1.2' },
    goldLine: { width: '80px', height: '2px', background: '#f3cf7a', margin: '20px auto' },
    formSection: { padding: '0 5% 100px 5%', marginTop: '-100px', position: 'relative', zIndex: 10 },
    glassCard: { background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(20px)', padding: '60px', borderRadius: '24px', border: '1px solid rgba(243, 207, 122, 0.1)', maxWidth: '900px', margin: '0 auto', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' },
    cardHeading: { fontFamily: "'Marcellus', serif", fontSize: '32px', color: '#fff', textAlign: 'center', marginBottom: '10px' },
    cardSub: { color: '#888', textAlign: 'center', marginBottom: '50px', fontSize: '14px' },
    gridForm: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
    btnGold: { padding: '18px 40px', background: '#f3cf7a', color: '#000', border: 'none', fontWeight: '800', letterSpacing: '2px', cursor: 'pointer', borderRadius: '4px', transition: '0.4s' },
    successWrapper: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050505', textAlign: 'center', padding: '20px' },
    successText: { color: '#aaa', maxWidth: '500px', margin: '20px 0 40px 0', lineHeight: '1.6' }
};

export default PrivateEvent;