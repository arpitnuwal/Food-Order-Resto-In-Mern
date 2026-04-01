import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUtensils, FaGlassCheers, FaTruck, FaHome, 
  FaChevronRight, FaTimes, FaCalendarAlt, FaUsers, FaClock, 
  FaCheckCircle, FaEnvelope, FaChair 
} from 'react-icons/fa';

function Services() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [showBooking, setShowBooking] = useState(false);
  const [showEventBooking, setShowEventBooking] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [bookingData, setBookingData] = useState({ guests: 2, date: '', time: '19:00', tableNumber: '' });
  const [eventData, setEventData] = useState({ 
    email: user?.email || '', 
    eventType: 'Birthday Party', 
    guests: 10, 
    eventDate: '', 
    eventTime: '18:00', 
    specialRequest: '' 
  });

  const tableList = [
    { id: 1, seats: 2 }, { id: 2, seats: 2 }, { id: 3, seats: 2 }, { id: 4, seats: 2 },
    { id: 5, seats: 4 }, { id: 6, seats: 4 }, { id: 7, seats: 4 }, { id: 8, seats: 4 },
    { id: 9, seats: 6 }, { id: 10, seats: 6 }, { id: 11, seats: 6 }, { id: 12, seats: 6 },
    { id: 13, seats: 8 }, { id: 14, seats: 8 }, { id: 15, seats: 8 }, { id: 16, seats: 8 },
    { id: 17, seats: 12 }, { id: 18, seats: 12 }, { id: 19, seats: 12 }, { id: 20, seats: 12 }
  ];

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/booking/all");
      setAllBookings(res.data);
    } catch (err) { console.error("Error fetching bookings:", err); }
  };

  useEffect(() => { fetchAllBookings(); }, []);

  const isTableOccupied = (tableId) => {
    if (!bookingData.date || !bookingData.time) return false;
    return allBookings.some(b => {
      if (Number(b.tableNumber) !== tableId || b.date !== bookingData.date || b.status === "Cancelled") return false;
      const existingStart = new Date(`${b.date}T${b.time}`);
      const existingEnd = new Date(existingStart.getTime() + 3 * 60 * 60 * 1000);
      const requestedTime = new Date(`${bookingData.date}T${bookingData.time}`);
      return requestedTime >= existingStart && requestedTime < existingEnd;
    });
  };

  const serviceList = [
    { id: 1, icon: <FaUtensils />, title: "Fine Dining", desc: "Experience an architectural journey of flavors with our 5-star multi-cuisine dining.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop" },
    { id: 2, icon: <FaGlassCheers />, title: "Private Events", desc: "From corporate meetings to intimate gatherings, we provide a sophisticated venue.", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop" },
    { id: 3, icon: <FaTruck />, title: "Gourmet Delivery", desc: "Bring the Archi experience to your doorstep with our premium contactless delivery.", image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=600&auto=format&fit=crop" }
  ];

  const handleCardClick = (id) => {
    if (!user) { alert("Bhai, pehle login toh kar lo!"); navigate('/login'); return; }
    if (id === 1) setShowBooking(true);
    if (id === 2) setShowEventBooking(true);
    if (id === 3) navigate('/menu'); 
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if(!bookingData.tableNumber) return alert("Please select a table.");
    setLoading(true);
    try {
      const finalData = { ...bookingData, userId: user._id, name: user.name, email: user.email };
      await axios.post("http://localhost:5000/api/booking/add", finalData);
      setShowBooking(false);
      setShowSuccessModal(true);
      fetchAllBookings();
    } catch (err) { alert("Booking failed."); } 
    finally { setLoading(false); }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalEventData = { ...eventData, userId: user._id, userName: user.name, phone: user.phone || "Not Provided" };
      await axios.post("http://localhost:5000/api/events/book", finalEventData);
      setShowEventBooking(false);
      setShowSuccessModal(true);
    } catch (err) { alert("Enquiry failed."); } 
    finally { setLoading(false); }
  };

  return (
    <div style={styles.pageContainer}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
        .breadcrumb-link { color: rgba(255, 255, 255, 0.5); text-decoration: none; transition: 0.3s; display: flex; align-items: center; gap: 8px; font-size: 10px; letter-spacing: 2px; }
        .service-card { position: relative; background: #0a0a0a; border: 1px solid rgba(243, 207, 122, 0.1); overflow: hidden; transition: 0.5s all ease; cursor: pointer; }
        .service-card:hover { border-color: #f3cf7a; transform: translateY(-10px); }
        .service-img { width: 100%; height: 200px; object-fit: cover; opacity: 0.4; transition: 0.8s; }
        .booking-input { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(243,207,122,0.2); color: #fff; margin-bottom: 15px; outline: none; border-radius: 4px; font-family: 'Montserrat'; }
        .animate-popup { animation: fadeInScale 0.4s ease-out; }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

        /* ✅ RESPONSIVE MEDIA QUERIES */
        @media (max-width: 992px) {
          .grid-container { grid-template-columns: 1fr 1fr !important; padding: 0 5% 60px !important; }
          .main-title { font-size: 42px !important; letter-spacing: 6px !important; }
        }

        @media (max-width: 768px) {
          .hero-banner { height: 350px !important; }
          .grid-container { grid-template-columns: 1fr !important; gap: 20px !important; }
          .modal-content { width: 90% !important; padding: 40px 20px !important; }
          .main-title { font-size: 32px !important; }
        }

        @media (max-width: 480px) {
          .cta-title { font-size: 22px !important; }
          .reserve-btn { font-size: 11px !important; }
        }
      `}</style>

      {/* --- HERO --- */}
      <div className="hero-banner" style={styles.heroBanner}>
        <img src="/9a55dcc0af24ad05f76206bf8bb3363a.jpg" alt="Services BG" style={styles.heroImage} />
        <div style={styles.heroOverlay}>
          <div style={styles.heroTextContainer}>
            <span style={styles.goldLine}></span>
            <h1 className="main-title" style={styles.mainTitle}>Premium Services</h1>
            <p style={styles.subtitle}>Beyond Dining — An Architectural Experience</p>
          </div>
          <nav style={styles.breadcrumb}>
            <Link to="/" className="breadcrumb-link"><FaHome size={12}/> HOME</Link>
            <FaChevronRight size={8} color="rgba(243, 207, 122, 0.5)" />
            <span style={{color: "#f3cf7a", fontSize: '10px', letterSpacing: '2px', fontWeight: '600'}}>OUR SERVICES</span>
          </nav>
        </div>
      </div>

      {/* --- HEADER --- */}
      <div style={styles.gridHeader}>
          <p style={{ color: '#f3cf7a', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase' }}>What We Offer</p>
          <h2 style={{ fontFamily: 'Marcellus', color: '#fff', fontSize: '32px', marginTop: '10px' }}>Elite Hospitality</h2>
      </div>

      {/* --- GRID --- */}
      <div className="grid-container" style={styles.gridContainer}>
        {serviceList.map((service) => (
          <div key={service.id} className="service-card" onClick={() => handleCardClick(service.id)}>
            <img src={service.image} alt={service.title} className="service-img" />
            <div style={styles.cardContent}>
              <div style={styles.iconBox}>{service.icon}</div>
              <h3 style={styles.cardTitle}>{service.title}</h3>
              <p style={styles.cardDesc}>{service.desc}</p>
              {(service.id === 1 || service.id === 2) && (
                <span style={styles.bookTag}>Reserve Now</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ BOOKING MODAL */}
      {showBooking && (
        <div style={styles.modalOverlay}>
          <div className="modal-content" style={styles.modalContent}>
            <button style={styles.closeBtn} onClick={() => setShowBooking(false)}><FaTimes /></button>
            <FaUtensils color="#f3cf7a" size={30} />
            <h2 style={styles.modalTitle}>Reserve a Table</h2>
            <form onSubmit={handleBookingSubmit} style={{marginTop: '25px', textAlign: 'left'}}>
              <label style={styles.smallLabel}>CHOOSE YOUR TABLE</label>
              <select className="booking-input" value={bookingData.tableNumber} onChange={e => setBookingData({...bookingData, tableNumber: e.target.value})} required>
                   <option value="">Select a Table</option>
                   {tableList.map(t => {
                     const occupied = isTableOccupied(t.id);
                     return (
                       <option key={t.id} value={t.id} disabled={occupied}>
                         Table #{t.id} — ({t.seats} Seater) {occupied ? " (BOOKED)" : ""}
                       </option>
                     );
                   })}
              </select>
              <div style={{display: 'flex', gap: '10px'}}>
                <div style={{flex: 1}}>
                  <label style={styles.smallLabel}>GUESTS</label>
                  <input type="number" className="booking-input" min="1" max="20" value={bookingData.guests} onChange={e => setBookingData({...bookingData, guests: e.target.value})} required />
                </div>
                <div style={{flex: 1}}>
                    <label style={styles.smallLabel}>DATE</label>
                    <input type="date" className="booking-input" value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value, tableNumber: ''})} required />
                </div>
              </div>
              <label style={styles.smallLabel}>ARRIVAL TIME</label>
              <input type="time" className="booking-input" value={bookingData.time} onChange={e => setBookingData({...bookingData, time: e.target.value, tableNumber: ''})} required />
              <button className="reserve-btn" type="submit" disabled={loading} style={styles.reserveBtn}>{loading ? "PROCESSING..." : "CONFIRM RESERVATION"}</button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ EVENT ENQUIRY MODAL */}
      {showEventBooking && (
        <div style={styles.modalOverlay}>
          <div className="modal-content" style={styles.modalContent}>
            <button style={styles.closeBtn} onClick={() => setShowEventBooking(false)}><FaTimes /></button>
            <FaGlassCheers color="#f3cf7a" size={35} />
            <h2 style={styles.modalTitle}>Private Event Enquiry</h2>
            <form onSubmit={handleEventSubmit} style={{marginTop: '25px', textAlign: 'left'}}>
              <label style={styles.smallLabel}>NOTIFICATION EMAIL</label>
              <input type="email" className="booking-input" value={eventData.email} onChange={e => setEventData({...eventData, email: e.target.value})} required />
              <label style={styles.smallLabel}>EVENT TYPE</label>
              <select className="booking-input" value={eventData.eventType} onChange={e => setEventData({...eventData, eventType: e.target.value})}>
                <option value="Birthday Party">Birthday Party</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Wedding Gala">Wedding Gala</option>
              </select>
              <div style={{display: 'flex', gap: '10px'}}>
                <div style={{flex: 1}}>
                  <label style={styles.smallLabel}>GUESTS</label>
                  <input type="number" className="booking-input" value={eventData.guests} onChange={e => setEventData({...eventData, guests: e.target.value})} required />
                </div>
                <div style={{flex: 1}}>
                  <label style={styles.smallLabel}>DATE</label>
                  <input type="date" className="booking-input" value={eventData.eventDate} onChange={e => setEventData({...eventData, eventDate: e.target.value})} required />
                </div>
              </div>
              <label style={styles.smallLabel}>SPECIAL REQUESTS</label>
              <textarea className="booking-input" rows="2" value={eventData.specialRequest} onChange={e => setEventData({...eventData, specialRequest: e.target.value})} />
              <button className="reserve-btn" type="submit" disabled={loading} style={styles.reserveBtn}>{loading ? "SENDING..." : "REQUEST QUOTATION"}</button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS POP-UP */}
      {showSuccessModal && (
        <div style={styles.modalOverlay} onClick={() => setShowSuccessModal(false)}>
          <div className="animate-popup" style={styles.successBox} onClick={e => e.stopPropagation()}>
            <FaCheckCircle color="#f3cf7a" size={60} style={{marginBottom: '20px'}} />
            <h2 style={{...styles.modalTitle, marginTop: 0}}>Request Sent!</h2>
            <p style={{color: '#aaa', fontSize: '14px', lineHeight: '1.6', margin: '15px 0 25px'}}>Bhai, humne aapka request receive kar liya hai. <br/>Ek confirmation mail bhej diya gaya hai.</p>
            <button className="reserve-btn" style={styles.reserveBtn} onClick={() => setShowSuccessModal(false)}>PERFECT</button>
          </div>
        </div>
      )}

      {/* --- BOTTOM CTA --- */}
      <div style={styles.ctaSection}>
        <h2 className="cta-title" style={styles.ctaTitle}>Planning a special occasion?</h2>
        <button className="cta-btn" style={styles.ctaButton} onClick={() => setShowEventBooking(true)}>Connect with our Concierge</button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { background: "#050505", minHeight: "100vh", color: "#fff", fontFamily: "'Montserrat', sans-serif" },
  heroBanner: { position: 'relative', height: '420px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', textAlign: 'center' },
  heroTextContainer: { textAlign: 'center' },
  goldLine: { display: "block", width: "40px", height: "1px", background: "#f3cf7a", margin: "0 auto 20px auto", opacity: 0.6 },
  mainTitle: { fontFamily: "'Marcellus', serif", fontSize: "56px", color: "#f3cf7a", letterSpacing: "10px", textTransform: "uppercase", margin: 0 },
  subtitle: { fontSize: "11px", letterSpacing: "5px", textTransform: "uppercase", opacity: 0.6, marginTop: '10px' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '40px', background: 'rgba(255,255,255,0.03)', padding: '10px 25px', borderRadius: '2px', backdropFilter: 'blur(10px)', border: '1px solid rgba(243, 207, 122, 0.1)' },
  gridHeader: { textAlign: 'center', padding: '80px 0 40px 0' },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px", padding: "0 10% 80px 10%" },
  cardContent: { padding: "30px", textAlign: "center" },
  iconBox: { fontSize: "30px", color: "#f3cf7a", marginBottom: "15px" },
  cardTitle: { fontFamily: "'Marcellus', serif", fontSize: "22px", color: "#f3cf7a", marginBottom: "15px" },
  cardDesc: { fontSize: "14px", color: "#b0b0b0", lineHeight: "1.6" },
  bookTag: { fontSize: '9px', color: '#f3cf7a', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '15px', display: 'block', fontWeight: '800' },
  ctaSection: { textAlign: "center", padding: "80px 10%", background: "linear-gradient(to top, #0a0a0a, transparent)" },
  ctaTitle: { fontFamily: "'Marcellus', serif", fontSize: "28px", marginBottom: "30px" },
  ctaButton: { padding: "15px 40px", background: "transparent", border: "1px solid #f3cf7a", color: "#f3cf7a", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", transition: "0.4s" },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 100000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' },
  modalContent: { background: '#0a0a0a', border: '1px solid rgba(243, 207, 122, 0.2)', padding: '50px 40px', borderRadius: '15px', width: '450px', textAlign: 'center', position: 'relative' },
  closeBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px' },
  modalTitle: { fontFamily: 'Marcellus', color: '#f3cf7a', fontSize: '28px', marginTop: '15px' },
  smallLabel: { fontSize: '9px', color: '#f3cf7a', letterSpacing: '2px', marginBottom: '5px', display: 'block', fontWeight: '600' },
  reserveBtn: { width: '100%', padding: '15px', background: '#f3cf7a', color: '#000', border: 'none', fontWeight: '800', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px' },
  successBox: { background: '#0a0a0a', border: '1px solid #f3cf7a', padding: '50px 40px', borderRadius: '20px', width: '350px', textAlign: 'center', boxShadow: '0 0 40px rgba(243, 207, 122, 0.2)' }
};

export default Services;