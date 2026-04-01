import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserEdit, FaSignOutAlt, FaMapMarkerAlt, 
  FaEnvelope, FaPhone, FaCheck, FaTimes, FaSync, 
  FaExclamationTriangle, FaCheckCircle 
} from 'react-icons/fa';

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem('user')); 
  const userId = loggedInUser?._id; 

  const fetchUserProfile = async () => {
    if (!userId) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/user/profile/${userId}`);
      setUser(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:5000/api/user/update/${userId}`, formData);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setIsEditing(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (err) {
      console.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading && !user) return (
    <div style={styles.container}>
      <FaSync className="spin" style={{color: '#f3cf7a', fontSize: '30px'}} />
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
        
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .profile-card {
          background: linear-gradient(145deg, rgba(15,15,15,0.95), rgba(5,5,5,1));
          border: 1px solid rgba(243, 207, 122, 0.15);
          backdrop-filter: blur(20px);
          border-radius: 24px; padding: 50px;
          max-width: 850px; width: 90%; margin: 50px auto;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8);
          animation: scaleUp 0.6s ease;
        }

        .luxury-btn:hover { background: #f3cf7a; color: #000; }

        /* ✅ POPUP BUTTONS HOVER */
        .btn-logout { background: #ff4d4d !important; color: #fff !important; transition: 0.3s; }
        .btn-logout:hover { background: #cc0000 !important; transform: translateY(-2px); }
        
        .btn-stay { 
          background: rgba(255,255,255,0.05) !important; 
          border: 1px solid rgba(255,255,255,0.2) !important; 
          color: #fff !important; 
          transition: 0.3s; 
        }
        .btn-stay:hover { 
          background: rgba(255,255,255,0.1) !important; 
          border-color: #f3cf7a !important; 
          color: #f3cf7a !important;
          transform: translateY(-2px);
        }

        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.92); backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; animation: fadeIn 0.3s ease;
        }
        .premium-popup {
          background: #0d0d0d; border: 1px solid rgba(243, 207, 122, 0.2);
          padding: 45px 40px; border-radius: 24px; width: 400px;
          text-align: center; box-shadow: 0 0 60px rgba(0,0,0,1);
          animation: scaleUp 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        }

        @media (max-width: 768px) {
          .profile-card { padding: 30px 20px !important; }
          .header-flex { flex-direction: column !important; text-align: center !important; }
          .info-grid { grid-template-columns: 1fr !important; }
          .premium-popup { width: 85% !important; padding: 35px 25px !important; }
        }
      `}</style>

      {/* --- ✅ LOGOUT CONFIRMATION POPUP --- */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="premium-popup">
            <div style={{ background: 'rgba(243, 207, 122, 0.05)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '1px solid rgba(243, 207, 122, 0.2)' }}>
              <FaExclamationTriangle size={30} color="#f3cf7a" />
            </div>
            <h2 style={{fontFamily: 'Marcellus', color: '#f3cf7a', fontSize: '26px', marginBottom: '12px'}}>Sign Out?</h2>
            <p style={{color: '#aaa', fontSize: '14px', marginBottom: '35px', lineHeight: '1.6', fontWeight: '300'}}>Bhai, are you sure you want to end your elite session at Archi?</p>
            
            <div style={{display: 'flex', gap: '15px'}}>
              <button onClick={() => setShowLogoutModal(false)} className="btn-stay" style={styles.modalBtn}>
                NO, STAY
              </button>
              <button onClick={confirmLogout} className="btn-logout" style={styles.modalBtn}>
                YES, LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ✅ SUCCESS UPDATE POPUP --- */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="premium-popup" style={{borderColor: '#4bb543'}}>
            <FaCheckCircle size={45} color="#4bb543" style={{marginBottom: '20px'}}/>
            <h2 style={{fontFamily: 'Marcellus', color: '#fff', fontSize: '24px', marginBottom: '10px'}}>Profile Refined</h2>
            <p style={{color: '#888', fontSize: '13px', marginBottom: '20px'}}>Your elite credentials have been successfully updated.</p>
            <div style={{width: '100%', height: '2px', background: '#4bb543', opacity: 0.3}}></div>
          </div>
        </div>
      )}

      <div className="profile-card">
        {/* Profile Header */}
        <div className="header-flex" style={styles.header}>
          <div style={styles.avatarBox}>
            <div style={styles.avatarHalo}></div>
            <div style={styles.avatarText}>{user?.name?.charAt(0)}</div>
          </div>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <input name="name" className="edit-input" style={{fontSize: '24px', fontFamily: 'Marcellus', borderBottom: '1px solid #f3cf7a', color: '#fff', background: 'transparent', outline: 'none'}} value={formData.name} onChange={handleChange} />
            ) : (
              <h2 className="user-name" style={styles.userName}>{user?.name}</h2>
            )}
            <p style={styles.memberDate}>Archi Elite Member</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {isEditing ? (
              <>
                <button onClick={handleSave} style={{...styles.actionBtn, color: '#4bb543', borderColor: '#4bb543'}}><FaCheck /></button>
                <button onClick={() => setIsEditing(false)} style={{...styles.actionBtn, color: '#ff4d4d', borderColor: '#ff4d4d'}}><FaTimes /></button>
              </>
            ) : (
              <button className="luxury-btn" onClick={() => setIsEditing(true)} style={styles.luxuryBtnFixed}>
                <FaUserEdit /> Edit
              </button>
            )}
          </div>
        </div>

        <hr style={styles.divider} />

        {/* Profile Info */}
        <div className="info-grid" style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <FaEnvelope style={styles.icon} />
            <div style={{width: '100%'}}>
              <small style={styles.label}>Email Address</small>
              {isEditing ? <input name="email" style={styles.editInput} value={formData.email} onChange={handleChange} /> : <p style={styles.value}>{user?.email}</p>}
            </div>
          </div>

          <div style={styles.infoItem}>
            <FaPhone style={styles.icon} />
            <div style={{width: '100%'}}>
              <small style={styles.label}>Phone Number</small>
              {isEditing ? <input name="phone" style={styles.editInput} value={formData.phone} onChange={handleChange} /> : <p style={styles.value}>{user?.phone || 'Not Provided'}</p>}
            </div>
          </div>

          <div style={{...styles.infoItem, gridColumn: 'span 2'}}>
            <FaMapMarkerAlt style={styles.icon} />
            <div style={{width: '100%'}}>
              <small style={styles.label}>Home Residence</small>
              {isEditing ? <textarea name="address" style={{...styles.editInput, height: '60px', resize: 'none'}} value={formData.address} onChange={handleChange} /> : <p style={styles.value}>{user?.address || 'Address not set'}</p>}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {!isEditing && (
          <div className="bottom-actions" style={styles.actions}>
            <button className="luxury-btn" onClick={() => navigate('/myorder')} style={styles.luxuryBtnFixed}>Order History</button>
            <button className="luxury-btn" onClick={() => setShowLogoutModal(true)} style={{ ...styles.luxuryBtnFixed, borderColor: '#ff4d4d', color: '#ff4d4d', marginLeft: 'auto' }}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  header: { display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '10px' },
  avatarBox: { position: 'relative', width: '90px', height: '90px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  avatarHalo: { position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px solid #f3cf7a', opacity: 0.5 },
  avatarText: { fontSize: '38px', fontFamily: 'Marcellus', color: '#f3cf7a' },
  userName: { fontFamily: 'Marcellus', fontSize: '36px', color: '#f3cf7a', margin: 0 },
  memberDate: { color: '#666', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' },
  divider: { border: 'none', borderBottom: '1px solid rgba(243, 207, 122, 0.1)', margin: '40px 0' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' },
  infoItem: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  icon: { color: '#f3cf7a', marginTop: '6px' },
  label: { fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#555' },
  value: { fontSize: '16px', color: '#ccc', marginTop: '5px' },
  actions: { marginTop: '50px', display: 'flex', gap: '20px' },
  editInput: { background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '8px 0', width: '100%', outline: 'none', fontSize: '15px' },
  actionBtn: { background: 'transparent', border: '1px solid', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  luxuryBtnFixed: { background: 'transparent', border: '1px solid', padding: '12px 24px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '10px' },
  modalBtn: { flex: 1, padding: '16px', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer', borderRadius: '12px', border: 'none', fontWeight: '700', textTransform: 'uppercase' }
};

export default UserProfile;