import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaClock, FaCheckCircle, FaUtensils, FaPercentage, 
  FaHourglassHalf, FaInfoCircle, FaSync, FaTrashAlt, FaEdit, FaExclamationTriangle, FaTimes, FaPlus 
} from "react-icons/fa";

function ManageFlashDeal() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [discount, setDiscount] = useState(20);
    const [duration, setDuration] = useState(24);
    const [allDeals, setAllDeals] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null });
    const restaurantId = "ArchiRestaurant";

    const fetchData = async () => {
        setFetching(true);
        try {
            const prodRes = await axios.get(`http://localhost:5000/api/product/${restaurantId}`);
            setProducts(prodRes.data);
            
            const dealRes = await axios.get(`http://localhost:5000/api/flash-deal/all/${restaurantId}`);
            
            // ✅ Data fetch karte waqt hi expired deals hata do
            const activeDeals = (dealRes.data || []).filter(deal => new Date(deal.endTime) > new Date());
            setAllDeals(activeDeals);
        } catch (err) { 
            console.error(err); 
        } finally { 
            setFetching(false); 
        }
    };

    // ✅ AUTO-EXPIRY LOGIC: Har 30 second mein check karega
    useEffect(() => {
        fetchData();

        const expiryCheckTimer = setInterval(() => {
            setAllDeals(prevDeals => {
                const now = new Date();
                const stillActive = prevDeals.filter(deal => new Date(deal.endTime) > now);
                
                // Agar koi deal khatam hui hai, tabhi state update hogi
                if (stillActive.length !== prevDeals.length) {
                    console.log("🔥 An expired deal was removed automatically.");
                    return stillActive;
                }
                return prevDeals;
            });
        }, 30000); // 30 seconds interval

        return () => clearInterval(expiryCheckTimer);
    }, []);

    const triggerPopup = (type, message, onConfirm = null) => {
        setPopup({ show: true, type, message, onConfirm });
        if (type === 'success') {
            setTimeout(() => setPopup({ show: false, type: '', message: '', onConfirm: null }), 2500);
        }
    };

    const handleActionDeal = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return triggerPopup('error', "Pehle ek dish toh chuno!");
        
        setLoading(true);
        try {
            const dealData = {
                restaurantId,
                productId: selectedProduct,
                discountPercentage: Number(discount),
                endTime: new Date(Date.now() + Number(duration) * 60 * 60 * 1000).toISOString(),
                dealId: editingId 
            };

            await axios.post("http://localhost:5000/api/flash-deal/update", dealData);
            triggerPopup('success', editingId ? "Deal Updated! ✨" : "New Deal Launched! 🔥");
            
            setEditingId(null);
            setSelectedProduct("");
            setDiscount(20);
            setDuration(24);
            fetchData(); 
        } catch (err) {
            console.error(err);
            triggerPopup('error', "Failed to save deal!");
        } finally { 
            setLoading(false); 
        }
    };

    const deleteDeal = (id) => {
        triggerPopup('confirm', "Bhai, kya aap is offer ko khatam karna chahte hain?", async () => {
            try {
                await axios.delete(`http://localhost:5000/api/flash-deal/delete/${id}`);
                triggerPopup('success', "Deal Removed! 🗑️");
                fetchData();
            } catch (err) { 
                triggerPopup('error', "Failed to stop!"); 
            }
        });
    };

    const startEdit = (deal) => {
        setEditingId(deal._id);
        setSelectedProduct(deal.product?._id || "");
        setDiscount(deal.discountPercentage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={styles.pageWrapper}>
            {popup.show && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        {popup.type === 'confirm' ? <FaExclamationTriangle size={45} color="#f3cf7a" /> : 
                         popup.type === 'error' ? <FaTimes size={45} color="#ff4d4d" /> : 
                         <FaCheckCircle size={45} color="#4bb543" />}
                        <p style={styles.modalText}>{popup.message}</p>
                        <div style={styles.modalActions}>
                            {popup.type === 'confirm' ? (
                                <>
                                    <button onClick={() => { popup.onConfirm(); setPopup({...popup, show: false}); }} style={styles.confirmBtn}>Stop Deal</button>
                                    <button onClick={() => setPopup({...popup, show: false})} style={styles.cancelBtn}>Keep It</button>
                                </>
                            ) : ( 
                                <button onClick={() => setPopup({...popup, show: false})} style={styles.confirmBtn}>Okay</button> 
                            )}
                        </div>
                    </div>
                </div>
            )}

            <header style={styles.header}>
                <div>
                    <h2 style={styles.mainTitle}>Flash Deal Management</h2>
                    <p style={styles.subTitle}>{editingId ? "Refining Active Offer" : "Add or edit restaurant promotions"}</p>
                </div>
            </header>

            <div style={styles.layout}>
                <div style={styles.formCard}>
                    <h3 style={styles.cardHeading}>{editingId ? "Modify Deal" : "Create New Offer"}</h3>
                    <form onSubmit={handleActionDeal} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Dish / Item</label>
                            <select 
                                style={styles.input} 
                                value={selectedProduct} 
                                onChange={(e) => setSelectedProduct(e.target.value)} 
                                required
                            >
                                <option value="">Select dish...</option>
                                {products.map(p => <option key={p._id} value={p._id}>{p.name} (₹{p.price})</option>)}
                            </select>
                        </div>
                        <div style={styles.row}>
                            <div style={{flex:1}}>
                                <label style={styles.label}>Discount %</label>
                                <input type="number" style={styles.input} value={discount} onChange={e => setDiscount(e.target.value)} min="1" max="100" />
                            </div>
                            <div style={{flex:1}}>
                                <label style={styles.label}>Hours</label>
                                <input type="number" style={styles.input} value={duration} onChange={e => setDuration(e.target.value)} min="1" />
                            </div>
                        </div>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? <FaSync className="spin" /> : editingId ? <FaEdit /> : <FaPlus />}
                            {loading ? " Processing..." : editingId ? " Update Deal" : " Launch Deal"}
                        </button>
                        {editingId && (
                            <button type="button" onClick={() => {setEditingId(null); setSelectedProduct("");}} style={styles.cancelLink}>
                                Cancel Editing
                            </button>
                        )}
                    </form>
                </div>

                <div style={styles.listSection}>
                    <h3 style={styles.cardHeading}>Active Deals ({allDeals.length})</h3>
                    <div style={styles.dealGrid}>
                        {fetching ? (
                            <div style={{textAlign:'center', padding:'20px'}}><FaSync className="spin" /></div>
                        ) : allDeals.length > 0 ? (
                            allDeals.map(deal => (
                                <div key={deal._id} style={styles.dealRow}>
                                    <div style={styles.imgContainer}>
                                        <img src={deal.product ? `http://localhost:5000/image/${deal.product.image}` : "https://via.placeholder.com/50"} style={styles.miniImg} alt="" />
                                        <div style={styles.discountBadgeSmall}>{deal.discountPercentage}%</div>
                                    </div>
                                    <div style={{flex:1}}>
                                        <div style={styles.dealTitle}>{deal.product?.name || "Dish Removed"}</div>
                                        <div style={styles.dealMeta}>
                                            <FaClock size={10} /> Ends: {new Date(deal.endTime).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={styles.actionBtns}>
                                        <button onClick={() => startEdit(deal)} style={styles.editIcon} title="Edit Offer"><FaEdit /></button>
                                        <button onClick={() => deleteDeal(deal._id)} style={styles.delIcon} title="Delete Offer"><FaTrashAlt /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={styles.empty}>
                                <FaInfoCircle size={24} color="#eee" />
                                <p>No deals active. Launch your first offer!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}

const styles = {
    // ... Saare styles same rahenge (Maine design se ched-chad nahi ki hai)
    pageWrapper: { padding: '40px 5%', background: '#fcfcfc', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    mainTitle: { margin: 0, fontSize: '28px', color: '#1a1a1a', fontWeight: '800', letterSpacing: '-1px' },
    subTitle: { color: '#888', fontSize: '14px', marginTop: '5px' },
    layout: { display: 'flex', gap: '40px', alignItems: 'flex-start' },
    formCard: { flex: '0 0 380px', background: '#fff', padding: '35px', borderRadius: '24px', border: '1px solid #f0f0f0', boxShadow: '0 15px 35px rgba(0,0,0,0.03)', position: 'sticky', top: '20px' },
    cardHeading: { fontSize: '12px', fontWeight: '800', color: '#bbb', marginBottom: '25px', textTransform: 'uppercase', letterSpacing: '1px' },
    form: { display: 'flex', flexDirection: 'column', gap: '22px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '11px', fontWeight: '800', color: '#999', textTransform: 'uppercase' },
    input: { padding: '16px', borderRadius: '12px', border: '1px solid #efefef', outline: 'none', background: '#fbfbfb', fontSize: '14px', fontWeight: '600' },
    row: { display: 'flex', gap: '15px' },
    submitBtn: { padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', transition: '0.3s' },
    cancelLink: { background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '12px', fontWeight: '700', marginTop: '10px', textDecoration: 'underline' },
    listSection: { flex: 1, background: '#fff', padding: '35px', borderRadius: '24px', border: '1px solid #f0f0f0', minHeight: '400px' },
    dealGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
    dealRow: { display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', borderRadius: '18px', border: '1px solid #f8f8f8', background: '#fff', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.01)' },
    imgContainer: { position: 'relative' },
    miniImg: { width: '65px', height: '65px', borderRadius: '14px', objectFit: 'cover', border: '1px solid #eee' },
    discountBadgeSmall: { position: 'absolute', top: '-5px', right: '-5px', background: '#ff4d4d', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '4px 6px', borderRadius: '6px' },
    dealTitle: { fontWeight: '700', fontSize: '16px', color: '#1a1a1a' },
    dealMeta: { fontSize: '12px', color: '#bbb', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' },
    actionBtns: { display: 'flex', gap: '10px' },
    editIcon: { background: '#f0f7ff', color: '#007bff', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
    delIcon: { background: '#fff0f0', color: '#ff4d4d', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(8px)' },
    modalContent: { background: '#fff', padding: '50px 40px', borderRadius: '30px', textAlign: 'center', width: '400px' },
    modalText: { fontSize: '18px', color: '#222', margin: '25px 0', fontWeight: '700', lineHeight: '1.5' },
    modalActions: { display: 'flex', gap: '15px', justifyContent: 'center' },
    confirmBtn: { padding: '14px 30px', background: '#000', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' },
    cancelBtn: { padding: '14px 30px', background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' },
    empty: { textAlign: 'center', color: '#bbb', fontSize: '14px', padding: '40px' }
};

export default ManageFlashDeal;