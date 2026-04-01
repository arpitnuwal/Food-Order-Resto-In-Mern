import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    FaChevronLeft, FaCalendarAlt, FaClock, FaUsers, 
    FaChair, FaUtensils, FaUserShield, FaCheckCircle, FaTimes, FaInfoCircle, FaTimesCircle, FaPen 
} from 'react-icons/fa';

function BookTable() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [formData, setFormData] = useState({ guests: 2, date: '', time: '19:00' });
    
    const [cancellingId, setCancellingId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [otherReason, setOtherReason] = useState(""); 
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'success' });

    const tables = [
        { id: 1, capacity: 2 }, { id: 2, capacity: 2 }, { id: 3, capacity: 2 }, { id: 4, capacity: 2 },
        { id: 5, capacity: 4 }, { id: 6, capacity: 4 }, { id: 7, capacity: 4 }, { id: 8, capacity: 4 },
        { id: 9, capacity: 6 }, { id: 10, capacity: 6 }, { id: 11, capacity: 6 }, { id: 12, capacity: 6 },
        { id: 13, capacity: 8 }, { id: 14, capacity: 8 }, { id: 15, capacity: 8 }, { id: 16, capacity: 8 },
        { id: 17, capacity: 12 }, { id: 18, capacity: 12 }, { id: 19, capacity: 12 }, { id: 20, capacity: 12 }
    ];

    const fetchBookings = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/booking/all");
            setBookings(res.data);
        } catch (err) { console.error("Fetch Error:", err); }
    };

    useEffect(() => {
        if (!user) navigate('/login');
        else fetchBookings();
    }, [user, navigate]);

    const isTableBooked = (tableId) => {
        if (!formData.date || !formData.time) return false;
        return bookings.some(b => {
            if (Number(b.tableNumber) !== tableId || b.date !== formData.date || b.status === "Cancelled") return false;
            const existingStart = new Date(`${b.date}T${b.time}`);
            const existingEnd = new Date(existingStart.getTime() + 3 * 60 * 60 * 1000);
            const newRequestedTime = new Date(`${formData.date}T${formData.time}`);
            return newRequestedTime >= existingStart && newRequestedTime < existingEnd;
        });
    };

    // ✅ HANDLE BOOKING + EMAIL TRIGGER
    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedTable) return setModal({ show: true, title: 'Selection Required', message: 'Bhai, pehle ek table toh choose karo!', type: 'error' });

        setLoading(true);
        try {
            const finalData = { 
                userId: user._id, 
                name: user.name, 
                email: user.email, // User ki email backend par jayegi
                tableNumber: Number(selectedTable), 
                guests: Number(formData.guests),
                date: formData.date, 
                time: formData.time
            };
            
            const res = await axios.post("http://localhost:5000/api/booking/add", finalData);
            
            if (res.status === 201 || res.status === 200) {
                setModal({ 
                    show: true, 
                    title: 'Reserved!', 
                    message: `Table #${selectedTable} secured. A confirmation email has been sent to ${user.email}.`, 
                    type: 'success' 
                });
                setSelectedTable(null); 
                setFormData({ ...formData, time: '19:00' });
                fetchBookings();
            }
        } catch (err) { 
            setModal({ show: true, title: 'Error', message: 'Booking failed! Check if server is running.', type: 'error' }); 
        } finally { setLoading(false); }
    };

    const confirmCancel = async (id) => {
        const finalReason = cancelReason === "Other" ? otherReason : cancelReason;
        if (!finalReason || finalReason.trim() === "") return alert("Wajah batana zaroori hai!");
        try {
            const res = await axios.put(`http://localhost:5000/api/booking/cancel/${id}`, { reason: finalReason });
            if (res.status === 200) {
                setModal({ show: true, title: 'Cancelled', message: 'Table has been released successfully.', type: 'success' });
                setCancellingId(null); setCancelReason(""); setOtherReason("");
                fetchBookings();
            }
        } catch (err) { alert("Cancellation failed!"); }
    };

    return (
        <div style={styles.container}>
            <style>{`
                .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px); border: 1px solid rgba(243, 207, 122, 0.1); border-radius: 24px; padding: 40px; }
                .luxury-input-group { position: relative; margin-bottom: 25px; }
                .luxury-input-group label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #555; display: block; margin-bottom: 10px; }
                .luxury-input-group input, .luxury-input-group select { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 15px 15px 15px 45px; color: #fff; border-radius: 12px; outline: none; transition: 0.3s; }
                .luxury-input-group input:focus { border-color: #f3cf7a; }
                .input-icon { position: absolute; left: 18px; bottom: 16px; color: #f3cf7a; font-size: 14px; }
                .history-card { background: rgba(10, 10, 10, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); padding: 18px; border-radius: 16px; margin-bottom: 12px; transition: 0.4s; }
                .history-card.cancelling { border-color: #ff4d4d; background: rgba(255, 77, 77, 0.02); }
                .cancel-trigger { color: rgba(255, 255, 255, 0.2); cursor: pointer; transition: 0.3s; }
                .cancel-trigger:hover { color: #ff4d4d; transform: rotate(90deg); }
                .reason-dropdown, .other-input { background: #000; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 8px; font-size: 11px; outline: none; width: 100%; transition: 0.3s; }
                .other-input { border-style: dashed; margin-top: 10px; }
                .confirm-btn-small { background: #ff4d4d; color: #fff; border: none; padding: 12px; border-radius: 6px; font-size: 10px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }
            `}</style>

            <header style={styles.header}>
                <button onClick={() => navigate(-1)} style={styles.backBtn}><FaChevronLeft /> Return</button>
                <h1 style={styles.title}>The Grand Hall</h1>
                <p style={styles.subtitle}>Curated vantage points for elite dining</p>
            </header>

            <div style={styles.layout}>
                <div style={styles.floorPlan}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
                        <h3 style={styles.sectionLabel}>Architectural Floor Plan</h3>
                        <div style={{display: 'flex', gap: '20px'}}>
                            <div style={styles.legend}><span style={{...styles.dot, background: '#111'}}></span> Booked</div>
                            <div style={styles.legend}><span style={{...styles.dot, background: '#f3cf7a'}}></span> Selected</div>
                        </div>
                    </div>

                    <div style={styles.tableGrid}>
                        {tables.map(t => {
                            const booked = isTableBooked(t.id);
                            const active = selectedTable === t.id;
                            return (
                                <div key={t.id} onClick={() => !booked && setSelectedTable(t.id)}
                                    style={{ ...styles.tableCard, background: booked ? '#111' : (active ? '#f3cf7a' : 'transparent'), color: active ? '#000' : '#fff', borderColor: active ? '#f3cf7a' : (booked ? '#222' : 'rgba(255,255,255,0.1)'), opacity: booked ? 0.3 : 1 }}>
                                    <FaChair size={t.capacity > 8 ? 26 : 18} />
                                    <span style={{fontSize: '11px', fontWeight: '800', marginTop: '5px'}}>T-{t.id}</span>
                                    <small style={{fontSize: '8px', opacity: 0.6}}>{t.capacity} SEATS</small>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={styles.sideBar}>
                    <div className="glass-card">
                        <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px'}}>
                            <div style={styles.goldIconCircle}><FaUtensils /></div>
                            <div><h3 style={{margin: 0, fontFamily: 'Marcellus', color: '#f3cf7a'}}>Reservation</h3><p style={{margin: 0, fontSize: '10px', color: '#666'}}>Elite Service</p></div>
                        </div>

                        <form onSubmit={handleBooking}>
                            <div className="luxury-input-group"><label>Guest Count</label><FaUsers className="input-icon" /><input type="number" value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} /></div>
                            <div className="luxury-input-group"><label>Dining Date</label><FaCalendarAlt className="input-icon" /><input type="date" value={formData.date} onChange={e => {setFormData({...formData, date: e.target.value}); setSelectedTable(null);}} required /></div>
                            <div className="luxury-input-group"><label>Arrival Hour</label><FaClock className="input-icon" /><input type="time" value={formData.time} onChange={e => {setFormData({...formData, time: e.target.value}); setSelectedTable(null);}} required /></div>
                            <button type="submit" disabled={loading || !selectedTable} style={styles.submitBtn}>{loading ? "SECURING..." : `BOOK TABLE ${selectedTable ? '#' + selectedTable : '(CHOOSE)'}`}</button>
                        </form>

                        <div style={{marginTop: '40px'}}>
                            <h4 style={styles.historyTitle}><FaUserShield size={12} /> Active Reservations</h4>
                            <div style={styles.historyList}>
                                {bookings.filter(b => b.userId === user?._id && b.status === "Confirmed").length === 0 ? (
                                    <p style={{color: '#444', fontSize: '11px', textAlign: 'center'}}>No active stays found.</p>
                                ) : (
                                    bookings.filter(b => b.userId === user?._id && b.status === "Confirmed").map(b => (
                                        <div key={b._id} className={`history-card ${cancellingId === b._id ? 'cancelling' : ''}`}>
                                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                                <div>
                                                    <p style={{fontSize: '12px', margin: 0, fontWeight: 'bold', color: '#f3cf7a'}}>Table #{b.tableNumber}</p>
                                                    <small style={{color: '#888'}}>{b.date} | {b.time}</small>
                                                </div>
                                                <FaTimesCircle className="cancel-trigger" size={18} onClick={() => { setCancellingId(cancellingId === b._id ? null : b._id); setCancelReason(""); setOtherReason(""); }} />
                                            </div>
                                            {cancellingId === b._id && (
                                                <div className="inline-cancel-box">
                                                    <select className="reason-dropdown" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
                                                        <option value="">Choose Reason</option>
                                                        <option value="Change of Plans">Change of Plans</option>
                                                        <option value="Mistake in Booking">Booking Mistake</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    {cancelReason === "Other" && <input className="other-input" placeholder="Wajah batayein..." value={otherReason} onChange={(e) => setOtherReason(e.target.value)} />}
                                                    <div style={{display:'flex', gap:'10px'}}>
                                                        <button onClick={() => confirmCancel(b._id)} className="confirm-btn-small" style={{flex:2}}>Confirm Release</button>
                                                        <button onClick={() => setCancellingId(null)} className="confirm-btn-small" style={{flex:1, background:'#222'}}>Back</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modal.show && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <button style={styles.closeModalBtn} onClick={() => setModal({ ...modal, show: false })}><FaTimes /></button>
                        {modal.type === 'success' ? <FaCheckCircle color="#f3cf7a" size={60} /> : <FaInfoCircle color="#ff4d4d" size={60} />}
                        <h2 style={styles.modalTitle}>{modal.title}</h2>
                        <p style={styles.modalText}>{modal.message}</p>
                        <button style={styles.modalPrimaryBtn} onClick={() => setModal({ ...modal, show: false })}>Okay</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#000', color: '#fff', padding: '140px 8% 60px 8%', fontFamily: 'Montserrat' },
    header: { textAlign: 'left', marginBottom: '60px' },
    backBtn: { background: 'none', border: 'none', color: '#f3cf7a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px', marginBottom: '20px' },
    title: { fontFamily: 'Marcellus', fontSize: '56px', color: '#f3cf7a', margin: 0 },
    subtitle: { color: '#444', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '11px', marginTop: '5px' },
    layout: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '80px', alignItems: 'start' },
    floorPlan: { padding: '20px' },
    sectionLabel: { fontSize: '11px', color: '#fff', textTransform: 'uppercase', letterSpacing: '4px', borderBottom: '1px solid #222', paddingBottom: '15px' },
    legend: { fontSize: '10px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' },
    dot: { width: '8px', height: '8px', borderRadius: '50%' },
    tableGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' },
    tableCard: { height: '110px', border: '1px solid', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: '0.4s', cursor:'pointer' },
    sideBar: { position: 'sticky', top: '140px' },
    goldIconCircle: { width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(243, 207, 122, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#f3cf7a' },
    submitBtn: { width: '100%', padding: '20px', background: '#f3cf7a', color: '#000', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '10px' },
    historyTitle: { fontSize: '10px', color: '#f3cf7a', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    historyList: { maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.92)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, backdropFilter: 'blur(12px)' },
    modalContent: { background: '#0a0a0a', border: '1px solid rgba(243, 207, 122, 0.2)', padding: '50px', borderRadius: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '450px' },
    closeModalBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '20px' },
    modalTitle: { fontFamily: 'Marcellus', color: '#f3cf7a', fontSize: '36px', margin: '20px 0 10px 0' },
    modalText: { color: '#888', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px' },
    modalPrimaryBtn: { width: '100%', padding: '15px', background: '#f3cf7a', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }
};

export default BookTable;