import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaCheckCircle, FaClock } from 'react-icons/fa';

function AdminInquiry() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/inquiries");
      setInquiries(res.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/inquiries/status/${id}`, { status: newStatus });
      fetchInquiries(); 
    } catch (err) { alert("Status update fail!"); }
  };

  // ✅ 1. Naya Delete Function
  const deleteInquiry = async (id) => {
    if (window.confirm("Bhai, pakka delete karna hai? Phir wapas nahi aayega!")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/inquiries/${id}`);
        fetchInquiries(); // List refresh karo
      } catch (err) {
        alert("Delete karne mein panga ho gaya!");
      }
    }
  };

  if (loading) return <div style={{padding: '40px'}}>Bhai, messages load ho rahe hain...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Customer Inquiries</h2>
      <p style={styles.subtitle}>Manage your elite clientele messages</p>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              <th>DATE</th>
              <th>CUSTOMER</th>
              <th>SUBJECT</th>
              <th>MESSAGE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((item) => (
              <tr key={item._id} style={styles.tableRow}>
                <td style={{fontSize: '11px', color: '#999'}}>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <span style={styles.customerName}>{item.name}</span><br/>
                  <span style={styles.customerEmail}>{item.email}</span>
                </td>
                <td style={{fontWeight: '600'}}>{item.subject}</td>
                <td style={styles.messageCell}>{item.message}</td>
                <td>
                  <span style={{
                    ...styles.statusBadge,
                    background: item.status === 'Resolved' ? '#ebfbee' : '#fff4e5',
                    color: item.status === 'Resolved' ? '#2f9e44' : '#d9480f'
                  }}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div style={{display: 'flex', gap: '15px'}}>
                    <button onClick={() => updateStatus(item._id, 'Resolved')} style={styles.actionBtn} title="Mark as Resolved">
                      <FaCheckCircle color="#2f9e44" />
                    </button>
                    
                    {/* ✅ 2. Delete Button par function lagaya */}
                    <button onClick={() => deleteInquiry(item._id)} style={styles.actionBtn} title="Delete">
                      <FaTrash color="#e03131" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {inquiries.length === 0 && <p style={{textAlign:'center', padding:'40px', color:'#999'}}>Koi message nahi hai bhai! 📭</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', background: '#f8f9fa', minHeight: '100vh' },
  title: { fontSize: '24px', fontWeight: '800', color: '#333', marginBottom: '5px' },
  subtitle: { fontSize: '13px', color: '#007bff', fontWeight: '600', textTransform: 'uppercase', marginBottom: '30px', letterSpacing: '1px' },
  tableWrapper: { background: '#fff', borderRadius: '15px', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHead: { background: '#fafafa', borderBottom: '1px solid #eee', padding: '15px', fontSize: '11px', color: '#666', letterSpacing: '1px' },
  tableRow: { borderBottom: '1px solid #f8f9fa' },
  customerName: { fontSize: '14px', fontWeight: '700', color: '#333' },
  customerEmail: { fontSize: '12px', color: '#888' },
  messageCell: { maxWidth: '300px', fontSize: '13px', color: '#555', padding: '15px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', transition: '0.2s' }
};

export default AdminInquiry;