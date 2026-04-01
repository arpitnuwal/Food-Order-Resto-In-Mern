import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ Axios import kar lena
import { 
  FaUsers, FaClipboardList, FaUtensils, FaChartLine, 
  FaBell, FaSearch, FaChevronRight 
} from 'react-icons/fa';

function AdminDashboard() {
  const navigate = useNavigate();
  // ✅ Live Stats State
  const [stats, setStats] = useState({ users: 0, bookings: 0, orders: 0, products: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchLiveStats();
    }
  }, [navigate]);

  // ✅ Real-time Data Fetch Function
  const fetchLiveStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/stats");
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Data nahi mil raha bhai:", err);
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loader}>System Load Ho Raha Hai...</div>;

  return (
    <div style={styles.container}>
      {/* --- HEADER --- */}
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>Live Dashboard Overview</h2>
        <div style={styles.headerRight}>
          <div style={styles.adminInfo}>
            <span style={styles.adminName}>Izhar Pathan</span>
            <span style={styles.adminRole}>Super Admin</span>
          </div>
          <div style={styles.avatar}>I</div>
        </div>
      </header>

      {/* --- LIVE STATS GRID --- */}
      <div style={styles.statsGrid}>
        {/* User Stat */}
        <div style={styles.statCard}>
          <div style={{ ...styles.iconCircle, background: '#e7f1ff', color: '#007bff' }}><FaUsers /></div>
          <div>
            <p style={styles.statLabel}>Total Bakre (Users)</p>
            <h3 style={styles.statNumber}>{stats.users}</h3>
          </div>
        </div>

        {/* Menu Stat */}
        <div style={styles.statCard}>
          <div style={{ ...styles.iconCircle, background: '#f3e5f5', color: '#9c27b0' }}><FaUtensils /></div>
          <div>
            <p style={styles.statLabel}>Active Menu Items</p>
            <h3 style={styles.statNumber}>{stats.products}</h3>
          </div>
        </div>

        {/* Bookings Stat */}
        <div style={styles.statCard}>
          <div style={{ ...styles.iconCircle, background: '#fff4e5', color: '#ff9800' }}><FaClipboardList /></div>
          <div>
            <p style={styles.statLabel}>Pending Bookings</p>
            <h3 style={styles.statNumber}>{stats.bookings}</h3>
          </div>
        </div>

        {/* Revenue/Events Stat */}
        <div style={styles.statCard}>
          <div style={{ ...styles.iconCircle, background: '#ebfbee', color: '#4caf50' }}><FaChartLine /></div>
          <div>
            <p style={styles.statLabel}>Private Events</p>
            <h3 style={styles.statNumber}>{stats.events || 0}</h3>
          </div>
        </div>
      </div>

      {/* --- QUICK LINKS SECTION --- */}
      <div style={styles.contentGrid}>
          <div style={styles.tableCard}>
            <h3 style={styles.cardTitle}>Quick Management</h3>
            <div style={styles.actionList}>
                <div style={styles.actionRow} onClick={() => navigate('/productlist')}>
                    <span>Check Menu List</span> <FaChevronRight size={12}/>
                </div>
                <div style={styles.actionRow} onClick={() => navigate('/admintabledashboard')}>
                    <span>View All Reservations</span> <FaChevronRight size={12}/>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}

// ... Styles same rahenge jo Sidebar se match karte hain
const styles = {
    container: { padding: '40px', background: '#f8f9fa', minHeight: '100vh', marginLeft: '0' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
    adminInfo: { textAlign: 'right' },
    adminName: { display: 'block', fontSize: '14px', fontWeight: '700' },
    adminRole: { fontSize: '11px', color: '#007bff' },
    avatar: { width: '40px', height: '40px', background: '#007bff', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' },
    statCard: { background: '#fff', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #eee' },
    iconCircle: { width: '45px', height: '45px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
    statLabel: { fontSize: '12px', color: '#888', margin: 0 },
    statNumber: { fontSize: '20px', fontWeight: '800', color: '#333', margin: '5px 0 0 0' },
    loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#007bff' },
    pageTitle: { fontSize: '22px', fontWeight: '800', color: '#333' },
    contentGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' },
    tableCard: { background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #eee' },
    cardTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '15px' },
    actionList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    actionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f9f9f9', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }
};

export default AdminDashboard;