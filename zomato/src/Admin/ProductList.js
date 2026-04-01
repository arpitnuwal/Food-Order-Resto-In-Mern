import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  FaTrash, FaEdit, FaSave, FaTimes, FaSearch, 
  FaFilter, FaSync, FaExclamationTriangle, FaCheckCircle, 
  FaChevronRight, FaChevronLeft 
} from "react-icons/fa";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editFields, setEditFields] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const scrollRef = useRef(null); 

    const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null });
    const restaurantId = "ArchiRestaurant";

    const fetchProducts = async () => {
        setFetching(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/product/${restaurantId}`);
            setProducts(res.data);
        } catch (err) { console.error(err); }
        finally { setFetching(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    // Manual Scroll Logic for Filter
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const triggerPopup = (type, message, onConfirm = null) => {
        setPopup({ show: true, type, message, onConfirm });
        if (type === 'success') {
            setTimeout(() => setPopup({ show: false, type: '', message: '', onConfirm: null }), 2500);
        }
    };

    const handleDelete = (id) => {
        triggerPopup('confirm', "Bhai, kya aap pakka is dish ko menu se hatana chahte hain?", async () => {
            try {
                await axios.delete(`http://localhost:5000/api/product/delete/${id}`);
                triggerPopup('success', "Dish removed successfully! 🗑️");
                fetchProducts();
            } catch (err) { triggerPopup('error', "Delete fail ho gaya!"); }
        });
    };

    const startEdit = (item) => {
        setEditId(item._id);
        setEditFields({ ...item });
    };

    const saveEdit = async (id) => {
        try {
            const formData = new FormData();
            formData.append("name", editFields.name);
            formData.append("price", editFields.price);
            formData.append("category", editFields.category);
            formData.append("description", editFields.description);
            formData.append("restaurantId", restaurantId);

            await axios.put(`http://localhost:5000/api/product/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setEditId(null);
            fetchProducts();
            triggerPopup('success', "Dish updated successfully! ✨");
        } catch (err) { 
            triggerPopup('error', "Update failed! Backend check karein."); 
        }
    };

    const uniqueCategories = ["All", ...new Set(products.map(item => item.category))];
    const filteredProducts = products.filter(item => {
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div style={styles.pageWrapper}>
            {/* LUXURY POPUP MODAL */}
            {popup.show && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        {popup.type === 'confirm' ? <FaExclamationTriangle size={40} color="#f3cf7a" /> : 
                         popup.type === 'error' ? <FaTimes size={40} color="#ff4d4d" /> : 
                         <FaCheckCircle size={40} color="#4bb543" />}
                        <p style={styles.modalText}>{popup.message}</p>
                        <div style={styles.modalActions}>
                            {popup.type === 'confirm' ? (
                                <>
                                    <button onClick={() => { popup.onConfirm(); setPopup({...popup, show: false}); }} style={styles.confirmBtn}>Remove It</button>
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
                    <h2 style={styles.mainTitle}>Menu Management</h2>
                    <p style={styles.subTitle}>Design and manage Archi's premium flavors</p>
                </div>
                <div style={styles.headerActions}>
                    <div style={styles.searchBox}>
                        <FaSearch color="#999" />
                        <input 
                            type="text" placeholder="Search dish..." 
                            style={styles.searchInput} value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={fetchProducts} style={styles.refreshBtn} title="Refresh List">
                        <FaSync className={fetching ? "spin" : ""} />
                    </button>
                </div>
            </header>

            {/* PREMIUM SCROLLABLE FILTER */}
            <div style={styles.filterContainer}>
                <button onClick={() => scroll('left')} style={styles.scrollBtn}><FaChevronLeft /></button>
                <div ref={scrollRef} style={styles.tabsWrapper} className="hide-scroll">
                    {uniqueCategories.map((cat, index) => (
                        <button 
                            key={index} 
                            onClick={() => setSelectedCategory(cat)} 
                            style={selectedCategory === cat ? styles.activeTab : styles.tab}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <button onClick={() => scroll('right')} style={styles.scrollBtn}><FaChevronRight /></button>
            </div>

            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeadRow}>
                            <th style={styles.th}>Visual</th>
                            <th style={styles.th}>Dish Name</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fetching ? (
                            <tr><td colSpan="6" style={styles.loadingMsg}>Fetching Delicious Menu...</td></tr>
                        ) : filteredProducts.map((item) => (
                            <tr key={item._id} className="table-row" style={styles.tr}>
                                <td style={styles.td}>
                                    <div style={styles.imgWrapper}>
                                        <img src={`http://localhost:5000/image/${item.image}`} style={styles.dishImg} alt="" />
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    {editId === item._id ? (
                                        <input style={styles.editInput} value={editFields.name} onChange={e => setEditFields({...editFields, name: e.target.value})} />
                                    ) : ( <span style={styles.dishName}>{item.name}</span> )}
                                </td>
                                <td style={styles.td}>
                                    {editId === item._id ? (
                                        <input style={styles.editInput} value={editFields.category} onChange={e => setEditFields({...editFields, category: e.target.value})} />
                                    ) : ( <span style={styles.catBadge}>{item.category}</span> )}
                                </td>
                                <td style={styles.td}>
                                    {editId === item._id ? (
                                        <input type="number" style={styles.editInput} value={editFields.price} onChange={e => setEditFields({...editFields, price: e.target.value})} />
                                    ) : ( <span style={styles.priceText}>₹{item.price}</span> )}
                                </td>
                                <td style={{ ...styles.td, maxWidth: '280px' }}>
                                    {editId === item._id ? (
                                        <textarea style={styles.editTextarea} value={editFields.description} onChange={e => setEditFields({...editFields, description: e.target.value})} />
                                    ) : ( 
                                        <p style={styles.descText} title={item.description}>{item.description}</p> 
                                    )}
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.actionRow}>
                                        {editId === item._id ? (
                                            <><button onClick={() => saveEdit(item._id)} style={styles.saveBtn}><FaSave /></button>
                                              <button onClick={() => setEditId(null)} style={styles.cancelBtn}><FaTimes /></button></>
                                        ) : (
                                            <><button onClick={() => startEdit(item)} style={styles.editBtn}><FaEdit /></button>
                                              <button onClick={() => handleDelete(item._id)} style={styles.delBtn}><FaTrash /></button></>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
                .hide-scroll { overflow-x: auto; display: flex; scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none; }
                .hide-scroll::-webkit-scrollbar { display: none; }
                .table-row:hover { background-color: #fafafa !important; }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
}

const styles = {
    pageWrapper: { padding: '40px', background: '#fcfcfc', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    mainTitle: { margin: 0, fontSize: '28px', color: '#1a1a1a', fontWeight: '800', letterSpacing: '-1px' },
    subTitle: { color: '#888', fontSize: '14px', marginTop: '5px' },
    headerActions: { display: 'flex', gap: '15px' },
    searchBox: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
    searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '200px' },
    refreshBtn: { background: '#fff', border: '1px solid #eee', padding: '12px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' },

    filterContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', background: '#fff', padding: '10px', borderRadius: '20px', border: '1px solid #f0f0f0' },
    tabsWrapper: { display: 'flex', gap: '10px', overflowX: 'auto', flex: 1, whiteSpace: 'nowrap' },
    scrollBtn: { background: '#f8f8f8', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' },
    tab: { padding: '10px 25px', borderRadius: '15px', border: 'none', background: '#f9f9f9', color: '#666', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: '0.3s' },
    activeTab: { padding: '10px 25px', borderRadius: '15px', border: 'none', background: '#000', color: '#fff', fontWeight: '600', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },

    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' },
    modalContent: { background: '#fff', padding: '50px 40px', borderRadius: '24px', textAlign: 'center', width: '420px', animation: 'fadeIn 0.3s' },
    modalText: { fontSize: '17px', color: '#333', margin: '25px 0', fontWeight: '600', lineHeight: '1.6' },
    modalActions: { display: 'flex', gap: '15px', justifyContent: 'center' },
    confirmBtn: { padding: '14px 30px', background: '#000', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' },
    cancelBtn: { padding: '14px 30px', background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' },

    tableCard: { background: '#fff', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', overflow: 'hidden' },
    table: { width: "100%", borderCollapse: "collapse" },
    tableHeadRow: { textAlign: "left", background: "#fafafa", borderBottom: "1px solid #eee" },
    th: { padding: "20px", color: "#999", fontSize: "11px", textTransform: "uppercase", letterSpacing: '1px', fontWeight: '800' },
    tr: { borderBottom: "1px solid #f8f8f8" },
    td: { padding: "18px 20px", verticalAlign: 'middle' },

    imgWrapper: { width: '55px', height: '55px', borderRadius: '14px', overflow: 'hidden', border: '1px solid #eee' },
    dishImg: { width: '100%', height: '100%', objectFit: 'cover' },
    dishName: { fontWeight: '700', color: '#1a1a1a', fontSize: '15px' },
    catBadge: { background: '#f0f4f8', color: '#54759e', padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' },
    priceText: { fontWeight: '800', color: '#27ae60', fontSize: '15px' },

    // ✅ FIXED DESCRIPTION STYLE
    descText: { 
        margin: 0, color: '#888', fontSize: '13px', lineHeight: '1.5',
        display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical',
        overflow: 'hidden', textOverflow: 'ellipsis'
    },

    editInput: { width: '100%', padding: '10px', border: '1px solid #000', borderRadius: '10px', outline: 'none', fontSize: '14px' },
    editTextarea: { width: '100%', height: '80px', padding: '10px', border: '1px solid #000', borderRadius: '10px', resize: 'none', outline: 'none', fontSize: '13px' },
    
    actionRow: { display: 'flex', gap: '8px' },
    editBtn: { background: '#f0f7ff', color: '#007bff', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
    delBtn: { background: '#fff0f0', color: '#dc3545', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
    saveBtn: { background: '#e6fffa', color: '#28a745', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
    cancelBtn: { background: '#f5f5f5', color: '#666', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
    loadingMsg: { textAlign: 'center', padding: '80px', color: '#bbb', fontWeight: '600' }
};

export default ProductList;