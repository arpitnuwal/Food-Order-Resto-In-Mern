import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTrash, FaUserCircle, FaUtensils, FaInfoCircle } from 'react-icons/fa';

function AdminReviewApproval() {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAllReviews(); }, []);

  const fetchAllReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/reviews/all");
      setAllReviews(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/reviews/approve/${id}`);
      fetchAllReviews(); // List refresh karo
    } catch (err) {
      alert("Approval fail ho gaya!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, pakka delete karna hai? Ye website se hat jayega.")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/reviews/${id}`);
        fetchAllReviews(); // List refresh karo
      } catch (err) {
        alert("Delete karne mein panga ho gaya!");
      }
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Review records load ho rahe hain...</div>;

  return (
    <div style={styles.container}>
      <header style={{marginBottom: '40px'}}>
        <h2 style={styles.title}>Manage All Reviews</h2>
        <p style={styles.subtitle}>Approve new feedback or moderate existing ones</p>
      </header>

      <div style={styles.listGrid}>
        {allReviews.map(rev => (
          <div key={rev._id} style={{
            ...styles.reviewCard,
            borderLeft: rev.status === 'Approved' ? '5px solid #2f9e44' : '5px solid #f08c00'
          }}>
            {/* 1. Product Info */}
            <div style={styles.productSection}>
              {rev.productId?.image ? (
                <img src={`http://localhost:5000/image/${rev.productId.image}`} alt="" style={styles.productImg} />
              ) : (
                <div style={styles.imgPlaceholder}><FaUtensils /></div>
              )}
              <h4 style={styles.productName}>{rev.productId?.name || "Dish Deleted"}</h4>
            </div>

            {/* 2. Review Content */}
            <div style={styles.contentSection}>
              <div style={styles.userInfo}>
                <FaUserCircle size={18} color="#ccc" />
                <span style={styles.userName}>{rev.userName}</span>
                <span style={{
                    ...styles.statusBadge,
                    background: rev.status === 'Approved' ? '#ebfbee' : '#fff4e5',
                    color: rev.status === 'Approved' ? '#2f9e44' : '#f08c00'
                }}>
                  {rev.status}
                </span>
                <span style={styles.ratingStars}>{[...Array(rev.rating)].map((_, i) => "★")}</span>
              </div>
              <p style={styles.comment}>"{rev.comment}"</p>
              <span style={styles.date}>{new Date(rev.createdAt).toLocaleDateString()}</span>
            </div>

            {/* 3. persistent Actions */}
            <div style={styles.actionSection}>
              {rev.status === 'Pending' && (
                <button onClick={() => handleApprove(rev._id)} style={styles.approveBtn} title="Approve Review">
                  <FaCheck /> Approve
                </button>
              )}
              <button onClick={() => handleDelete(rev._id)} style={styles.deleteBtn} title="Delete Forever">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {allReviews.length === 0 && (
          <div style={styles.emptyState}>
             <FaInfoCircle size={40} style={{marginBottom:'20px'}}/>
             <p>Abhi tak koi reviews nahi aaye hain bhai.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', background: '#f8f9fa', minHeight: '100vh' },
  title: { fontSize: '26px', fontWeight: '800', color: '#333', marginBottom: '5px' },
  subtitle: { fontSize: '13px', color: '#007bff', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' },
  listGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  reviewCard: { 
    background: '#fff', padding: '20px', borderRadius: '12px', 
    display: 'grid', gridTemplateColumns: '140px 1fr auto', 
    alignItems: 'center', gap: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
  },
  productSection: { textAlign: 'center', borderRight: '1px solid #f0f0f0', paddingRight: '15px' },
  productImg: { width: '65px', height: '65px', borderRadius: '8px', objectFit: 'cover' },
  imgPlaceholder: { width: '65px', height: '65px', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', margin: '0 auto' },
  productName: { fontSize: '13px', color: '#555', marginTop: '8px', fontWeight: '600' },
  contentSection: { paddingRight: '20px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  userName: { fontSize: '14px', fontWeight: '700', color: '#333' },
  statusBadge: { padding: '2px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase' },
  ratingStars: { color: '#f08c00', fontSize: '12px' },
  comment: { color: '#666', fontStyle: 'italic', fontSize: '14px', lineHeight: '1.5', margin: 0 },
  date: { fontSize: '10px', color: '#bbb', marginTop: '8px', display: 'block' },
  actionSection: { display: 'flex', gap: '10px' },
  approveBtn: { background: '#2f9e44', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600' },
  deleteBtn: { background: '#fff', color: '#e03131', border: '1px solid #ffd8d8', padding: '10px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' },
  emptyState: { textAlign: 'center', padding: '100px', color: '#bbb' }
};

export default AdminReviewApproval;