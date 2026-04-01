import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaChair, FaCheckCircle, FaSyncAlt 
} from 'react-icons/fa';

function AdminTableDashboard() {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ active: 0, cancelled: 0 });
    const [loading, setLoading] = useState(true);

    const fetchAllBookings = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/booking/admin/all");
            setBookings(res.data);
            const active = res.data.filter(b => b.status === "Confirmed").length;
            const cancelled = res.data.filter(b => b.status === "Cancelled").length;
            setStats({ active, cancelled });
        } catch (err) { console.error("Fetch Error:", err); } 
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchAllBookings();
        const interval = setInterval(fetchAllBookings, 60000); 
        return () => clearInterval(interval);
    }, []);

    const getRemainingTime = (date, time) => {
        const start = new Date(`${date}T${time}`);
        const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
        const now = new Date();
        const diff = end - now;
        if (diff <= 0) return "Slot Expired";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m left`;
    };

    return (
        <div style={styles.mainWrapper}>
            <div style={styles.contentBody}>
                <style>{`
                    .stat-card { background: #fff; padding: 30px; border-radius: 16px; border: 1px solid #eee; flex: 1; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
                    
                    .booking-row { 
                        background: #fff; 
                        border: 1px solid #f0f0f0; 
                        padding: 0 40px;
                        border-radius: 20px; 
                        margin-bottom: 20px; 
                        display: grid; 
                        grid-template-columns: 1fr 2.5fr 2fr 1.5fr 1.2fr 2.1fr; 
                        column-gap: 20px;
                        height: 110px; 
                        align-items: center; 
                        transition: 0.3s;
                    }
                    .booking-row:hover { border-color: #007bff; box-shadow: 0 8px 25px rgba(0,0,0,0.05); }
                    
                    .info-box {
                        padding: 10px 15px;
                        border-radius: 10px;
                        font-weight: 800;
                        font-size: 13px;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        white-space: nowrap;
                    }

                    /* ✅ ID Section Fix: Horizontal & Vertical Center */
                    .id-section {
                        display: flex;
                        flex-direction: row; /* Icon and text in one line */
                        align-items: center; 
                        gap: 12px;
                        color: #007bff;
                        font-weight: 900;
                        font-size: 20px;
                    }
                    
                    .spin { animation: spin 1s linear infinite; }
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                `}</style>

                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Reservation Live-Feed</h1>
                        <p style={styles.subtitle}>Archi Luxury Dining • Live Table Occupancy Monitor</p>
                    </div>
                    <button onClick={fetchAllBookings} style={styles.btnRefresh}>
                        <FaSyncAlt className={loading ? "spin" : ""} /> Sync Data
                    </button>
                </header>

                <div style={styles.statsRow}>
                    <div className="stat-card" style={{borderTop: '6px solid #007bff'}}>
                        <p style={styles.statLabel}>Active Stays</p>
                        <h2 style={{color: '#1a1a1a', margin: 0, fontSize: '32px'}}>{stats.active} <span style={{fontSize:'16px', color:'#999'}}>Occupied</span></h2>
                    </div>
                    <div className="stat-card" style={{borderTop: '6px solid #dc3545'}}>
                        <p style={styles.statLabel}>Cancelled Total</p>
                        <h2 style={{color: '#1a1a1a', margin: 0, fontSize: '32px'}}>{stats.cancelled} <span style={{fontSize:'16px', color:'#999'}}>Bookings</span></h2>
                    </div>
                    <div className="stat-card" style={{borderTop: '6px solid #28a745'}}>
                        <p style={styles.statLabel}>Tracking</p>
                        <h2 style={{color: '#28a745', margin: 0, fontSize: '22px'}}>● Operational</h2>
                    </div>
                </div>

                <div style={styles.listContainer}>
                    <div style={styles.listHeader}>
                        <span>ID</span>
                        <span>Customer Information</span>
                        <span>Time Slot</span>
                        <span>Availability</span>
                        <span>Status</span>
                        <span>Cancellation Log</span>
                    </div>

                    {loading && bookings.length === 0 ? (
                        <div style={{padding: '100px', textAlign: 'center', color: '#bbb'}}>Initialising Live Stream...</div>
                    ) : (
                        bookings.map(b => (
                            <div key={b._id} className="booking-row">
                                
                                {/* 1. Table ID - Strictly Aligned */}
                                <div className="id-section">
                                    <FaChair />
                                    <span>T-{b.tableNumber}</span>
                                </div>
                                
                                {/* 2. Customer Information */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontWeight: '800', fontSize: '18px', color: '#1a1a1a' }}>{b.name}</div>
                                    <div style={{ color: '#777', fontSize: '13px' }}>{b.email}</div>
                                </div>

                                {/* 3. Time Slot */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: '#bbb', fontSize: '10px', textTransform: 'uppercase', fontWeight: '800' }}>Reservation</span>
                                    <span style={{ fontSize: '15px', color: '#333', fontWeight: '700' }}>{b.date}</span>
                                    <span style={{ fontSize: '14px', color: '#666' }}>{b.time}</span>
                                </div>

                                {/* 4. Availability Box */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {b.status === "Confirmed" ? (
                                        <div className="info-box" style={{ background: '#f0f7ff', color: '#007bff' }}>
                                            {getRemainingTime(b.date, b.time)}
                                        </div>
                                    ) : (
                                        <span style={{ color: '#ddd', fontWeight: 'bold' }}>--:--</span>
                                    )}
                                </div>

                                {/* 5. Status Badge */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="info-box" style={{ 
                                        background: b.status === "Confirmed" ? "#e8f5e9" : "#ffebee",
                                        color: b.status === "Confirmed" ? "#2e7d32" : "#c62828"
                                    }}>
                                        {b.status}
                                    </span>
                                </div>

                                {/* 6. Cancellation Log */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {b.status === "Cancelled" ? (
                                        <div style={{ background: '#fff5f5', color: '#dc3545', padding: '10px 15px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', border: '1px solid #ffebeb', width: '100%', textAlign: 'center' }}>
                                            {b.cancelReason}
                                        </div>
                                    ) : (
                                        <div style={{ color: '#28a745', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle /> Stay in Progress
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
    contentBody: {
        marginLeft: '50px', 
        width: 'calc(100% - 50px)', 
        padding: '50px 60px', 
        boxSizing: 'border-box'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px', background: '#fff', padding: '30px 45px', borderRadius: '24px', border: '1px solid #f0f0f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' },
    title: { fontSize: '34px', color: '#111', margin: 0, fontWeight: '950', letterSpacing: '-1px' },
    subtitle: { color: '#999', fontSize: '16px', marginTop: '6px' },
    statsRow: { display: 'flex', gap: '25px', marginBottom: '45px' },
    statLabel: { fontSize: '12px', textTransform: 'uppercase', color: '#bbb', fontWeight: '900', letterSpacing: '1.5px', marginBottom: '10px' },
    listContainer: { width: '100%' },
    listHeader: { 
        display: 'grid', 
        gridTemplateColumns: '1fr 2.5fr 2fr 1.5fr 1.2fr 2.1fr', 
        columnGap: '20px',
        padding: '0 40px 15px 40px', 
        fontSize: '12px', 
        textTransform: 'uppercase', 
        color: '#ccc', 
        fontWeight: '900', 
        letterSpacing: '1px' 
    },
    btnRefresh: { background: '#007bff', color: '#fff', border: 'none', padding: '14px 30px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }
};

export default AdminTableDashboard;