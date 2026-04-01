import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    FaGlassCheers, FaCalendarAlt, FaUserFriends, FaCheck, FaTimes, 
    FaSyncAlt, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaMinusCircle 
} from "react-icons/fa";

function PrivateEventAdmin() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/events/all");
            setEvents(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchEvents(); }, []);

    const updateStatus = async (id, status) => {
        const confirmMsg = `Are you sure you want to mark this enquiry as ${status}?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            await axios.put(`http://localhost:5000/api/events/status/${id}`, { status });
            alert(`Inquiry ${status} successfully! ✨`);
            fetchEvents(); // List refresh taaki buttons hat jayein
        } catch (err) { alert("Failed to update status"); }
    };

    return (
        <div style={styles.mainWrapper}>
            <style>{`
                .spin { animation: rotate 1s linear infinite; }
                @keyframes rotate { 100% { transform: rotate(360deg); } }
                .action-btn { transition: 0.3s transform ease; }
                .action-btn:hover { transform: scale(1.1); }
                .completed-label { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
            `}</style>
            
            <div style={styles.contentBody}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Private Event Enquiries</h1>
                        <p style={styles.subtitle}>Archi Luxury Dining • Exclusive Gatherings Monitor</p>
                    </div>
                    <button onClick={fetchEvents} style={styles.btnSync} disabled={loading}>
                        <FaSyncAlt className={loading ? "spin" : ""} /> {loading ? "Syncing..." : "Sync Enquiries"}
                    </button>
                </header>

                <div style={styles.listContainer}>
                    <div style={styles.listHeader}>
                        <span>EVENT TYPE</span>
                        <span>CLIENT INFO</span>
                        <span>DATE & GUESTS</span>
                        <span>REQUEST</span>
                        <span>STATUS</span>
                        <span>ACTIONS</span>
                    </div>

                    {events.length === 0 && !loading ? (
                        <div style={{padding: '50px', textAlign: 'center', color: '#999'}}>No event inquiries found.</div>
                    ) : (
                        events.map((ev) => (
                            <div key={ev._id} style={{
                                ...styles.row,
                                borderLeft: ev.status === "Confirmed" ? "8px solid #2e7d32" : 
                                            ev.status === "Rejected" ? "8px solid #c62828" : "8px solid #f57f17"
                            }}>
                                <div style={styles.eventType}>
                                    <FaGlassCheers /> {ev.eventType}
                                </div>
                                <div style={styles.clientInfo}>
                                    <strong style={{fontSize: '16px', color: '#111'}}>{ev.userName}</strong>
                                    <span style={{fontSize: '13px', color: '#777', display: 'flex', alignItems: 'center', gap: '5px'}}><FaPhoneAlt size={10}/> {ev.phone}</span>
                                    <span style={{fontSize: '12px', color: '#999', display: 'flex', alignItems: 'center', gap: '5px'}}><FaEnvelope size={10}/> {ev.email}</span>
                                </div>
                                <div style={styles.dateTime}>
                                    <span style={{fontWeight: '700'}}><FaCalendarAlt /> {ev.eventDate}</span>
                                    <span><FaUserFriends /> {ev.guests} Elite Guests</span>
                                </div>
                                <div style={styles.requestBox}>
                                    <p style={{margin: 0}}>{ev.specialRequest || "No special dietary or decor requests."}</p>
                                </div>
                                <div>
                                    <span style={{...styles.badge, 
                                        background: ev.status === "Confirmed" ? "#e8f5e9" : ev.status === "Rejected" ? "#ffebee" : "#fff8e1",
                                        color: ev.status === "Confirmed" ? "#2e7d32" : ev.status === "Rejected" ? "#c62828" : "#f57f17"
                                    }}>{ev.status}</span>
                                </div>

                                {/* ✅ Dynamic Actions Logic */}
                                <div style={styles.actions}>
                                    {ev.status === "Pending" ? (
                                        <>
                                            <button 
                                                onClick={() => updateStatus(ev._id, "Confirmed")} 
                                                style={styles.confirmBtn} 
                                                className="action-btn"
                                                title="Approve"
                                            ><FaCheck /></button>
                                            <button 
                                                onClick={() => updateStatus(ev._id, "Rejected")} 
                                                style={styles.rejectBtn} 
                                                className="action-btn"
                                                title="Reject"
                                            ><FaTimes /></button>
                                        </>
                                    ) : (
                                        <div className="completed-label" style={{ color: ev.status === "Confirmed" ? "#2e7d32" : "#c62828" }}>
                                            {ev.status === "Confirmed" ? <FaCheckCircle /> : <FaMinusCircle />}
                                            Processed
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    mainWrapper: { width: '100%', minHeight: '100vh', background: '#fcfdfe', display: 'flex' },
    contentBody: { marginLeft: '50px', width: 'calc(100% - 50px)', padding: '50px 60px', boxSizing: 'border-box' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px', background: '#fff', padding: '30px 40px', borderRadius: '20px', border: '1px solid #eee' },
    title: { fontSize: '32px', color: '#111', margin: 0, fontWeight: '950', letterSpacing: '-1px' },
    subtitle: { color: '#999', fontSize: '15px', marginTop: '6px' },
    btnSync: { background: '#000', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700', fontSize: '14px' },
    listContainer: { width: '100%' },
    listHeader: { display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.5fr 2fr 1fr 1fr', padding: '0 30px 15px', color: '#bbb', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' },
    row: { background: '#fff', padding: '25px 30px', borderRadius: '15px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.5fr 2fr 1fr 1fr', alignItems: 'center', border: '1px solid #f0f0f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', transition: '0.3s' },
    eventType: { fontWeight: '900', color: '#007bff', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px' },
    clientInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    dateTime: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: '#444' },
    requestBox: { fontSize: '13px', color: '#888', fontStyle: 'italic', paddingRight: '30px', lineHeight: '1.5' },
    badge: { padding: '8px 16px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', textAlign: 'center', display: 'inline-block', width: '100px' },
    actions: { display: 'flex', gap: '12px', minWidth: '100px', justifyContent: 'center' },
    confirmBtn: { background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontSize: '16px' },
    rejectBtn: { background: '#ffebee', color: '#c62828', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontSize: '16px' }
};

export default PrivateEventAdmin;