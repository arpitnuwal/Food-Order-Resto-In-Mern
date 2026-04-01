import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCheckCircle, FaArrowRight, FaLock, FaSync, FaUserShield } from 'react-icons/fa';

function Checkout() {
  const { cartItems, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!loggedInUser; 

  // States
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(loggedInUser?.address || "Please set your delivery destination");
  const [tempAddress, setTempAddress] = useState(address);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState(loggedInUser?.name || "");
  const [phone, setPhone] = useState(loggedInUser?.phone || "");

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return navigate('/login');
    if (cartItems.length === 0) return alert("Your plate is empty!");

    setLoading(true);
    try {
      const orderData = {
        userId: loggedInUser._id,
        userEmail: loggedInUser.email, // ✅ For Backend Notification
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: total,
        address: address,
        contactName: fullName,
        contactPhone: phone
      };

      const response = await axios.post("http://localhost:5000/api/order/add", orderData);
      
      if (response.status === 201 || response.status === 200) {
        setOrderPlaced(true);
        clearCart();
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Order failed! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = () => {
    setAddress(tempAddress);
    setIsEditing(false);
  };

  // --- UI: LOGIN REQUIRED ---
  if (!isLoggedIn) {
    return (
      <div style={styles.authWrapper}>
        <div style={styles.authCard}>
          <div style={styles.lockCircle}><FaUserShield size={40} color="#f3cf7a" /></div>
          <h2 style={styles.authTitle}>Access Restricted</h2>
          <p style={styles.authText}>Archi's culinary experience is exclusive to our members. Please sign in to proceed.</p>
          <div style={styles.authActions}>
            <button onClick={() => navigate('/login')} style={styles.primaryBtn}>SIGN IN TO CHECKOUT</button>
            <button onClick={() => navigate('/register')} style={styles.secondaryBtn}>JOIN THE CLUB</button>
          </div>
        </div>
      </div>
    );
  }

  // --- UI: SUCCESS STATE ---
  if (orderPlaced) {
    return (
      <div style={styles.successWrapper}>
        <div style={styles.successCard}>
          <FaCheckCircle size={60} color="#f3cf7a" />
          <h1 style={styles.successTitle}>Order Confirmed</h1>
          <p style={styles.successText}>Bhai, aapka order receive ho gaya hai! Humne confirmation bill aapki email par bhej diya hai.</p>
          <button onClick={() => navigate('/')} style={styles.primaryBtn}>BACK TO HOME <FaArrowRight /></button>
        </div>
      </div>
    );
  }

  if (cartCount === 0) return <div style={styles.emptyContainer}><h2>Your plate is empty!</h2></div>;

  return (
    <div style={styles.pageContainer}>
      <style>{`
        .edit-input { width: 100%; height: 80px; background: #000; border: 1px solid #222; color: #fff; padding: 10px; font-family: 'Montserrat'; resize: none; outline: none; border-radius: 8px; }
        .action-link { background: none; border: none; color: #f3cf7a; cursor: pointer; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }

        @media (max-width: 992px) {
          .checkout-grid { grid-template-columns: 1fr !important; gap: 30px !important; }
          .summary-box { order: -1; }
        }
      `}</style>

      <div className="checkout-grid" style={styles.grid}>
        <div style={styles.formBox}>
          <h2 style={styles.sectionTitle}>Finalizing Order</h2>
          
          <div style={styles.addressCard}>
            <div style={{display: 'flex', justifyContent: 'space-between', gap: '20px'}}>
              <div style={{flex: 1}}>
                <h4 style={styles.cardHeading}> <FaMapMarkerAlt color="#f3cf7a" /> Delivery Hub</h4>
                {!isEditing ? <p style={styles.addressText}>{address}</p> : 
                <textarea className="edit-input" value={tempAddress} onChange={(e) => setTempAddress(e.target.value)} />}
              </div>
              <button className="action-link" onClick={isEditing ? saveAddress : () => setIsEditing(true)}>
                {isEditing ? "CONFIRM" : "EDIT"}
              </button>
            </div>
          </div>

          <form onSubmit={handleOrder} style={{marginTop: '30px'}}>
             <div style={styles.inputGroup}>
               <label style={styles.label}>Recipient Name</label>
               <input type="text" style={styles.input} value={fullName} onChange={e => setFullName(e.target.value)} required />
             </div>
             <div style={styles.inputGroup}>
               <label style={styles.label}>Member Contact</label>
               <input type="text" style={styles.input} value={phone} onChange={e => setPhone(e.target.value)} required />
             </div>
             
             <button type="submit" style={styles.checkoutBtn} disabled={loading || isEditing}>
               {loading ? <FaSync className="spin" /> : `CONFIRM ORDER - ₹${total}`}
             </button>
             <p style={{textAlign:'center', fontSize:'10px', color:'#333', marginTop:'15px', letterSpacing:'1px'}}>
               <FaLock /> SECURED BY ARCHI ENCRYPTION
             </p>
          </form>
        </div>

        {/* Summary Card */}
        <div className="summary-box" style={styles.summaryBox}>
          <h2 style={styles.sectionTitle}>Summary</h2>
          {cartItems.map(item => (
            <div key={item._id} style={styles.summaryItem}>
              <span>{item.name} <small style={{color: '#555'}}>x{item.quantity}</small></span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={styles.totalLine}>
            <span style={{fontSize: '12px', letterSpacing: '2px', color: '#888'}}>TOTAL VALUATION</span>
            <span style={{color: '#f3cf7a', fontSize: '28px', fontFamily: 'Marcellus'}}>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { background: "#050505", minHeight: "100vh", padding: "160px 8% 80px 8%", color: "#fff", fontFamily: "'Montserrat'" },
  grid: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px" },
  sectionTitle: { fontFamily: "'Marcellus'", color: "#f3cf7a", fontSize: "28px", marginBottom: "40px", letterSpacing: '2px', textTransform: 'uppercase' },
  formBox: { background: "rgba(255,255,255,0.01)", padding: "40px", border: "1px solid rgba(243, 207, 122, 0.1)", borderRadius: '20px' },
  addressCard: { background: '#0a0a0a', padding: '25px', border: '1px solid #1a1a1a', borderRadius: '12px' },
  cardHeading: { color: '#f3cf7a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px' },
  addressText: { color: '#666', fontSize: '14px', lineHeight: '1.6' },
  inputGroup: { marginBottom: '25px' },
  label: { fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' },
  input: { width: "100%", padding: "16px", background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#fff", outline: 'none', borderRadius: '8px' },
  summaryBox: { background: "linear-gradient(145deg, #0a0a0a, #050505)", padding: "40px", border: "1px solid rgba(243, 207, 122, 0.1)", height: "fit-content", borderRadius: '20px' },
  summaryItem: { display: "flex", justifyContent: "space-between", marginBottom: "18px", color: "#888", fontSize: '15px' },
  totalLine: { borderTop: "1px solid rgba(243, 207, 122, 0.15)", paddingTop: "25px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: '25px' },
  checkoutBtn: { width: "100%", background: "#f3cf7a", color: "#000", border: "none", padding: "20px", cursor: "pointer", fontWeight: "800", letterSpacing: '3px', fontSize: '13px', borderRadius: '10px' },
  
  authWrapper: { height: '100vh', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  authCard: { textAlign: 'center', background: '#050505', padding: '70px 50px', border: '1px solid rgba(243, 207, 122, 0.2)', borderRadius: '30px', maxWidth: '500px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  lockCircle: { width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(243, 207, 122, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 30px auto', border: '1px solid rgba(243, 207, 122, 0.1)' },
  authTitle: { fontFamily: 'Marcellus', color: '#f3cf7a', fontSize: '32px', marginBottom: '15px', letterSpacing: '2px' },
  authText: { color: '#666', fontSize: '14px', lineHeight: '1.7', marginBottom: '40px' },
  authActions: { display: 'flex', flexDirection: 'column', gap: '15px' },
  primaryBtn: { background: '#f3cf7a', color: '#000', padding: '16px 30px', cursor: 'pointer', border: 'none', fontWeight: '800', letterSpacing: '2px', borderRadius: '8px', fontSize: '12px' },
  secondaryBtn: { background: 'transparent', color: '#f3cf7a', padding: '16px 30px', cursor: 'pointer', border: '1px solid rgba(243, 207, 122, 0.3)', fontWeight: '800', letterSpacing: '2px', borderRadius: '8px', fontSize: '12px' },

  successWrapper: { height: '100vh', background: '#050505', display: 'flex', justifyContent: 'center', alignItems: 'center', padding:'20px' },
  successCard: { background: '#0a0a0a', padding: '60px 40px', textAlign: 'center', border: '1px solid rgba(243, 207, 122, 0.3)', borderRadius: '30px', maxWidth: '600px' },
  successTitle: { fontFamily: 'Marcellus', color: '#f3cf7a', fontSize: '42px', marginTop: '25px', letterSpacing: '3px' },
  successText: { color: '#666', margin: '20px 0 40px 0', lineHeight: '1.8', fontSize: '16px' },
  emptyContainer: { height: "100vh", background: "#050505", display: "flex", justifyContent: "center", alignItems: "center", color: "#888" }
};

export default Checkout;