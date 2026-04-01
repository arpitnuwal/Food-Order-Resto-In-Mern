import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaHeart, FaSync, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null }); // ✅ Custom Popup State
    const [toast, setToast] = useState({ show: false, message: '' }); // ✅ Toast notification state
    
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchWishlist = async () => {
        if (!user?._id) {
            navigate('/login');
            return;
        };
        try {
            const res = await axios.get(`http://localhost:5000/api/wishlist/${user._id}`);
            setWishlist(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchWishlist(); }, []);

    // ✅ Toast Logic
    const showToast = (msg) => {
        setToast({ show: true, message: msg });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    // ✅ Trigger Popup Modal
    const triggerPopup = (type, message, onConfirm = null) => {
        setPopup({ show: true, type, message, onConfirm });
    };

    const handleAddToCart = (item) => {
        addToCart(item);
        showToast(`${item.name} added to Archi Bag! ✨`);
    };

    const removeItem = (productId) => {
        triggerPopup('confirm', "Kya aap is dish ko favorites se hatana chahte hain?", async () => {
            try {
                await axios.post(`http://localhost:5000/api/wishlist/toggle`, { userId: user._id, productId });
                setWishlist(wishlist.filter(item => item._id !== productId));
                setPopup({ show: false });
                showToast("Favorites Updated! 🗑️");
            } catch (err) { 
                setPopup({ show: true, type: 'error', message: 'Error removing item' });
            }
        });
    };

    if (loading) return <div style={styles.center}><FaSync className="spin" color="#f3cf7a" size={30} /></div>;

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
                .wish-card {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(243,207,122,0.1);
                    border-radius: 15px; overflow: hidden; transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .wish-card:hover { transform: translateY(-12px); border-color: #f3cf7a; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
                .btn-action {
                    padding: 12px; background: transparent; border: 1px solid rgba(243,207,122,0.2);
                    color: #fff; cursor: pointer; transition: 0.4s; flex: 1;
                    display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 10px;
                    letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
                }
                .btn-action:hover { background: #f3cf7a; color: #000; border-color: #f3cf7a; }
                
                /* ✅ LUXURY TOAST */
                .toast {
                    position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
                    background: rgba(243, 207, 122, 0.95); color: #000; padding: 15px 35px;
                    border-radius: 50px; font-weight: 700; font-size: 13px; z-index: 999999;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.4); backdrop-filter: blur(10px);
                    animation: slideUp 0.4s ease-out;
                }
                @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
            `}</style>

            {/* ✅ TOAST NOTIFICATION */}
            {toast.show && <div className="toast">{toast.message}</div>}

            {/* ✅ LUXURY POPUP MODAL */}
            {popup.show && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        {popup.type === 'confirm' ? <FaExclamationTriangle size={45} color="#f3cf7a" /> : <FaTimes size={45} color="#ff4d4d" />}
                        <p style={styles.modalText}>{popup.message}</p>
                        <div style={styles.modalActions}>
                            {popup.type === 'confirm' ? (
                                <>
                                    <button onClick={popup.onConfirm} style={styles.confirmBtn}>Uda Do</button>
                                    <button onClick={() => setPopup({show: false})} style={styles.cancelBtn}>Rehne Do</button>
                                </>
                            ) : (
                                <button onClick={() => setPopup({show: false})} style={styles.confirmBtn}>Okay</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <header style={styles.header}>
                <p style={styles.preTitle}>Favorites</p>
                <h2 style={styles.mainTitle}>Collection of Taste</h2>
                <div style={styles.goldLine}></div>
            </header>

            {wishlist.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyCircle}><FaHeart size={40} color="rgba(243,207,122,0.1)" /></div>
                    <p style={{marginTop: '30px', color: '#888', letterSpacing: '1px'}}>Aapka dil abhi kisi dish par nahi aaya hai.</p>
                    <button onClick={() => navigate('/menu')} style={styles.menuBtn}>Explore Menu</button>
                </div>
            ) : (
                <div style={styles.grid}>
                    {wishlist.map(item => (
                        <div key={item._id} className="wish-card">
                            <div style={styles.imgWrapper}>
                                <img src={`http://localhost:5000/image/${item.image}`} style={styles.img} alt={item.name} />
                            </div>
                            <div style={{padding: '25px', textAlign: 'center'}}>
                                <h4 style={styles.itemName}>{item.name}</h4>
                                <p style={styles.itemPrice}>₹{item.price}</p>
                                <div style={{display: 'flex', gap: '12px', marginTop: '25px'}}>
                                    <button className="btn-action" onClick={() => handleAddToCart(item)}>
                                        <FaShoppingCart /> Bag It
                                    </button>
                                    <button className="btn-action" style={{maxWidth: '50px'}} onClick={() => removeItem(item._id)}>
                                        <FaTrash color="#ff4d4d" />
                                    </button>
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
    container: { minHeight: "100vh", background: "#050505", padding: "160px 8% 80px 8%", fontFamily: "'Montserrat', sans-serif" },
    header: { textAlign: 'center', marginBottom: '80px' },
    preTitle: { fontSize: '11px', letterSpacing: '6px', color: '#f3cf7a', textTransform: 'uppercase', marginBottom: '15px' },
    mainTitle: { fontFamily: "'Marcellus', serif", fontSize: '48px', color: '#fff', margin: '0' },
    goldLine: { width: '60px', height: '1px', background: '#f3cf7a', margin: '30px auto' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' },
    imgWrapper: { overflow: 'hidden', height: '220px' },
    img: { width: '100%', height: '100%', objectFit: 'cover', opacity: '0.7' },
    itemName: { color: '#f3cf7a', fontFamily: "'Marcellus', serif", fontSize: '22px', margin: '0 0 8px 0', letterSpacing: '1px' },
    itemPrice: { color: '#888', fontSize: '14px', fontWeight: '400', letterSpacing: '2px' },
    
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '50px' },
    emptyCircle: { width: '100px', height: '100px', borderRadius: '50%', border: '1px solid rgba(243,207,122,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    menuBtn: { background: '#f3cf7a', border: 'none', color: '#000', padding: '15px 40px', marginTop: '30px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '3px', fontWeight: '800' },
    center: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' },

    // Modal Styles
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, backdropFilter: 'blur(10px)' },
    modalContent: { background: '#0a0a0a', padding: '60px 40px', borderRadius: '20px', textAlign: 'center', width: '420px', border: '1px solid rgba(243,207,122,0.2)' },
    modalText: { fontSize: '18px', color: '#fff', margin: '25px 0', fontFamily: 'Marcellus' },
    modalActions: { display: 'flex', gap: '15px', justifyContent: 'center' },
    confirmBtn: { padding: '12px 30px', background: '#f3cf7a', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '800', fontSize: '11px', letterSpacing: '1px' },
    cancelBtn: { padding: '12px 30px', background: 'transparent', color: '#fff', border: '1px solid #333', borderRadius: '5px', cursor: 'pointer', fontWeight: '800', fontSize: '11px', letterSpacing: '1px' }
};

export default Wishlist;