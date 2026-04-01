import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBoxOpen, FaClock, FaCheckCircle, FaMapMarkerAlt, FaSync, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchOrders = async () => {
        if (!user?._id) {
            navigate('/login');
            return;
        }
        try {
            const res = await axios.get(`http://localhost:5000/api/orders/user/${user._id}`);
            setOrders(res.data);
        } catch (err) {
            console.error("Order Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user?._id]);

    if (loading) return (
        <div style={styles.center}><FaSync className="spin" color="#f3cf7a" size={30} /></div>
    );

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
                .order-card {
                    background: linear-gradient(145deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95));
                    border: 1px solid rgba(243, 207, 122, 0.1);
                    border-radius: 15px;
                    padding: 30px;
                    margin-bottom: 30px;
                    transition: 0.4s;
                }
                .order-card:hover { border-color: rgba(243, 207, 122, 0.4); transform: translateY(-5px); }
                .status-badge {
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    background: rgba(243, 207, 122, 0.1);
                    color: #f3cf7a;
                    border: 1px solid rgba(243, 207, 122, 0.2);
                }
            `}</style>

            <header style={styles.header}>
                <p style={styles.preTitle}>Culinary History</p>
                <h2 style={styles.mainTitle}>My Orders</h2>
                <div style={styles.goldLine}></div>
            </header>

            {orders.length === 0 ? (
                <div style={styles.emptyState}>
                    <FaBoxOpen size={60} color="rgba(243, 207, 122, 0.1)" />
                    <p style={{marginTop: '20px', color: '#666'}}>Aapne abhi tak koi architectural meal order nahi kiya.</p>
                    <button onClick={() => navigate('/menu')} style={styles.menuBtn}>Explore Menu</button>
                </div>
            ) : (
                <div style={styles.ordersList}>
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div style={styles.orderHeader}>
                                <div>
                                    <p style={styles.orderId}>ID: #{order._id.slice(-8).toUpperCase()}</p>
                                    <p style={styles.orderDate}><FaClock size={10} /> {new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <span className="status-badge">{order.status || 'Confirmed'}</span>
                            </div>

                            <div style={styles.itemsSection}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={styles.itemRow}>
                                        <div style={styles.itemInfo}>
                                            <div style={styles.itemBullet}></div>
                                            <span style={styles.itemName}>{item.name}</span>
                                            <span style={styles.itemQty}>x {item.quantity}</span>
                                        </div>
                                        <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <hr style={styles.divider} />

                            <div style={styles.orderFooter}>
                                <div style={styles.addressBox}>
                                    <FaMapMarkerAlt color="#f3cf7a" size={14} />
                                    <span>{order.address}</span>
                                </div>
                                <div style={styles.totalBox}>
                                    <span style={{color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px'}}>Amount Paid</span>
                                    <span style={styles.totalAmount}>₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { minHeight: "100vh", background: "#050505", padding: "160px 10% 80px 10%", fontFamily: "'Montserrat', sans-serif" },
    header: { textAlign: 'center', marginBottom: '60px' },
    preTitle: { fontSize: '10px', letterSpacing: '5px', color: '#f3cf7a', textTransform: 'uppercase', marginBottom: '10px' },
    mainTitle: { fontFamily: "'Marcellus', serif", fontSize: '48px', color: '#fff', margin: '0' },
    goldLine: { width: '60px', height: '1px', background: '#f3cf7a', margin: '25px auto' },
    center: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' },
    emptyState: { textAlign: 'center', padding: '100px 0', color: '#888' },
    menuBtn: { background: 'transparent', border: '1px solid #f3cf7a', color: '#f3cf7a', padding: '12px 30px', marginTop: '30px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' },
    orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' },
    orderId: { color: '#fff', fontSize: '15px', fontWeight: '700', letterSpacing: '1px', fontFamily: 'Marcellus' },
    orderDate: { color: '#555', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' },
    itemsSection: { margin: '25px 0' },
    itemRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#eee', fontSize: '14px' },
    itemInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
    itemBullet: { width: '6px', height: '6px', background: '#f3cf7a', borderRadius: '50%' },
    itemQty: { color: '#666', fontSize: '12px', fontWeight: '600' },
    divider: { border: 'none', borderBottom: '1px solid rgba(243, 207, 122, 0.05)', margin: '25px 0' },
    orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    addressBox: { display: 'flex', alignItems: 'center', gap: '10px', color: '#888', fontSize: '13px', maxWidth: '65%', lineHeight: '1.5' },
    totalBox: { textAlign: 'right' },
    totalAmount: { color: '#f3cf7a', fontSize: '26px', fontWeight: '400', fontFamily: 'Marcellus', display: 'block', marginTop: '5px' }
};

export default MyOrders;