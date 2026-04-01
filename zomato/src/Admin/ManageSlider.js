import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    FaUpload, FaTrash, FaEdit, FaPlus, FaSync, FaImages, FaTimes, 
    FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle 
} from "react-icons/fa";

function ManageSlider() {
    const [slides, setSlides] = useState([]);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const restaurantId = "ArchiRestaurant";

    // ✅ Popups State
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'success' });
    const [confirmModal, setConfirmModal] = useState({ show: false, id: null });

    const fetchSlides = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/slider/${restaurantId}`);
            setSlides(res.data);
        } catch (err) { console.error("Error fetching slides", err); }
    };

    useEffect(() => { fetchSlides(); }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) { setPreview(URL.createObjectURL(selectedFile)); }
    };

    const handleEdit = (slide) => {
        setEditingId(slide._id);
        setTitle(slide.title);
        setSubtitle(slide.subtitle);
        setPreview(`http://localhost:5000/image/${slide.image}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setSubtitle("");
        setFile(null);
        setPreview(null);
    };

    const showMsg = (title, message, type = 'success') => {
        setModal({ show: true, title, message, type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        if (file) formData.append("image", file);
        formData.append("title", title);
        formData.append("subtitle", subtitle);
        formData.append("restaurantId", restaurantId);

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/slider/${editingId}`, formData);
                showMsg("Updated!", "Banner has been successfully modified.", "success");
            } else {
                await axios.post("http://localhost:5000/api/slider/add", formData);
                showMsg("Created!", "New slider banner added to the hero section.", "success");
            }
            resetForm();
            fetchSlides();
        } catch (err) { 
            showMsg("Failed!", "Something went wrong. Check backend connection.", "error");
        } finally { setLoading(false); }
    };

    // ✅ Actual Delete Logic
    const executeDelete = async () => {
        const id = confirmModal.id;
        try {
            const res = await axios.delete(`http://localhost:5000/api/slider/${id}`);
            if (res.status === 200) {
                fetchSlides();
                showMsg("Deleted!", "The banner was permanently removed.", "info");
            }
        } catch (err) { 
            showMsg("Error!", "Could not delete the banner.", "error");
        } finally {
            setConfirmModal({ show: false, id: null });
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentBody}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Hero Sliders</h1>
                        <p style={styles.subtitle}>Manage Archi's premium home page banners</p>
                    </div>
                    <div style={styles.countBadge}>{slides.length} Sections</div>
                </header>

                <div style={styles.mainGrid}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            {editingId ? <><FaEdit size={12} /> EDIT SLIDER</> : <><FaPlus size={12} /> NEW SLIDER</>}
                        </h3>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>TITLE</label>
                                <input style={styles.input} placeholder="e.g., Royal Dinner" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>SUBTITLE</label>
                                <input style={styles.input} placeholder="e.g., Luxury Experience" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>COVER IMAGE</label>
                                <div style={styles.imagePlaceholder}>
                                    {preview ? <img src={preview} style={styles.previewImg} alt="preview" /> : <FaImages size={40} color="#eee" />}
                                </div>
                                <label style={styles.uploadBtn}>
                                    <FaUpload size={14} /> Choose Photo
                                    <input type="file" onChange={handleFileChange} hidden />
                                </label>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" disabled={loading} style={{ ...styles.submitBtn, flex: editingId ? 2 : 1 }}>
                                    {loading ? "Processing..." : editingId ? "Update Slider" : "Save Slider"}
                                </button>
                                {editingId && <button type="button" onClick={resetForm} style={styles.cancelBtn}><FaTimes /> Cancel</button>}
                            </div>
                        </form>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.listHeader}>
                            <span>IMAGE</span>
                            <span>DETAILS</span>
                            <span style={{ textAlign: 'right' }}>ACTIONS</span>
                        </div>
                        <div style={styles.scrollArea}>
                            {slides.map((slide) => (
                                <div key={slide._id} style={styles.listItem}>
                                    <img src={`http://localhost:5000/image/${slide.image}`} style={styles.thumb} alt="thumb" />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={styles.itemTitle}>{slide.title}</h4>
                                        <p style={styles.itemSub}>{slide.subtitle}</p>
                                    </div>
                                    <div style={styles.actions}>
                                        <button onClick={() => handleEdit(slide)} style={styles.editBtn} title="Edit"><FaEdit /></button>
                                        <button onClick={() => setConfirmModal({ show: true, id: slide._id })} style={styles.delBtn} title="Delete"><FaTrash /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ SUCCESS/ERROR POPUP */}
            {modal.show && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <button style={styles.closeModalBtn} onClick={() => setModal({ ...modal, show: false })}><FaTimes /></button>
                        {modal.type === 'success' && <FaCheckCircle color="#28a745" size={60} />}
                        {modal.type === 'error' && <FaExclamationCircle color="#dc3545" size={60} />}
                        {modal.type === 'info' && <FaInfoCircle color="#007bff" size={60} />}
                        <h2 style={styles.modalTitle}>{modal.title}</h2>
                        <p style={styles.modalText}>{modal.message}</p>
                        <button style={{...styles.modalPrimaryBtn, background: modal.type === 'error' ? '#dc3545' : '#000'}} onClick={() => setModal({ ...modal, show: false })}>Got it</button>
                    </div>
                </div>
            )}

            {/* ✅ DELETE CONFIRMATION POPUP */}
            {confirmModal.show && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <FaExclamationTriangle color="#ff9800" size={60} />
                        <h2 style={styles.modalTitle}>Uda du pakka?</h2>
                        <p style={styles.modalText}>Bhai, ye banner wapas nahi aayega agar delete kar diya toh.</p>
                        <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                            <button style={{ ...styles.modalPrimaryBtn, background: '#dc3545' }} onClick={executeDelete}>Uda do!</button>
                            <button style={{ ...styles.modalPrimaryBtn, background: '#eee', color: '#333' }} onClick={() => setConfirmModal({ show: false, id: null })}>Nahi re!</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    pageContainer: { width: '100%', minHeight: '100vh', background: '#fff', boxSizing: 'border-box' },
    contentBody: { paddingLeft: '60px', paddingRight: '40px', paddingTop: '50px', paddingBottom: '50px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    title: { fontSize: '36px', color: '#1a1a1a', margin: 0, fontWeight: '800' },
    subtitle: { color: '#999', fontSize: '15px', marginTop: '5px' },
    countBadge: { background: '#000', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontWeight: 'bold' },
    mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'start' },
    card: { background: '#fff', borderRadius: '25px', padding: '35px', border: '1px solid #f2f2f2', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' },
    cardTitle: { fontSize: '14px', fontWeight: '800', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' },
    form: { display: 'flex', flexDirection: 'column', gap: '25px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    label: { fontSize: '11px', fontWeight: '800', color: '#bbb' },
    input: { padding: '16px', borderRadius: '12px', border: '1px solid #f2f2f2', background: '#f9f9f9', outline: 'none', fontSize: '14px' },
    imagePlaceholder: { width: '100%', height: '200px', borderRadius: '15px', background: '#f9f9f9', border: '1px solid #f2f2f2', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', overflow: 'hidden' },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
    uploadBtn: { padding: '14px', background: '#fff', border: '1px solid #eee', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '13px' },
    submitBtn: { padding: '18px', background: '#000', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
    cancelBtn: { flex: 1, padding: '18px', background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' },
    listHeader: { display: 'grid', gridTemplateColumns: '100px 1fr 100px', paddingBottom: '15px', borderBottom: '1px solid #f5f5f5', marginBottom: '20px', fontSize: '11px', color: '#ccc', fontWeight: '800' },
    scrollArea: { maxHeight: '600px', overflowY: 'auto' },
    listItem: { display: 'grid', gridTemplateColumns: '100px 1fr 100px', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #fafafa' },
    thumb: { width: '70px', height: '50px', borderRadius: '10px', objectFit: 'cover' },
    itemTitle: { margin: 0, fontSize: '16px', color: '#333', fontWeight: '600' },
    itemSub: { margin: 0, fontSize: '12px', color: '#aaa' },
    actions: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
    editBtn: { background: '#eef6ff', color: '#007bff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
    delBtn: { background: '#fff0f0', color: '#dc3545', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' },

    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' },
    modalContent: { background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '400px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', animation: 'pop 0.3s ease-out' },
    closeModalBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '20px' },
    modalTitle: { fontSize: '24px', color: '#1a1a1a', margin: '20px 0 10px 0' },
    modalText: { color: '#666', fontSize: '16px', marginBottom: '30px', lineHeight: '1.5' },
    modalPrimaryBtn: { width: '100%', padding: '15px', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }
};

export default ManageSlider;