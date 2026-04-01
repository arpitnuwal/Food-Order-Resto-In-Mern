import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaCloudUploadAlt, FaArrowLeft, FaCheckCircle, FaSpinner, 
  FaBookOpen, FaTrashAlt, FaEdit, FaSync, FaExclamationTriangle, FaTimes 
} from 'react-icons/fa';

function AddBlog() {
  const navigate = useNavigate();
  
  // States
  const [blogs, setBlogs] = useState([]);
  const [blogData, setBlogData] = useState({ title: "", content: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ Custom Popup State
  const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null });

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  // --- Utility: Show Popup ---
  const triggerPopup = (type, message, onConfirm = null) => {
    setPopup({ show: true, type, message, onConfirm });
    if (type === 'success') {
      setTimeout(() => setPopup({ show: false, type: '', message: '', onConfirm: null }), 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerPopup('error', "Bhai, photo 2MB se kam ki dalo!");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image && !editingId) return triggerPopup('error', "Photo zaroori hai!");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/blog/update/${editingId}`, formData);
        triggerPopup('success', "Culinary Story Updated! ✨");
      } else {
        await axios.post("http://localhost:5000/api/blog/add", formData);
        triggerPopup('success', "Story Published to Archi! ✨");
      }
      resetForm();
      fetchBlogs();
    } catch (err) { triggerPopup('error', "Kuch gadbad ho gayi!"); } 
    finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    triggerPopup('confirm', "Bhai, kya aap pakka is story ko delete karna chahte hain?", async () => {
        try {
            await axios.delete(`http://localhost:5000/api/blog/delete/${id}`);
            triggerPopup('success', "Story deleted successfully! 🗑️");
            fetchBlogs();
            if (editingId === id) resetForm();
        } catch (err) { triggerPopup('error', "Delete fail ho gaya!"); }
    });
  };

  const startEdit = (blog) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(blog._id);
    setBlogData({ title: blog.title, content: blog.content });
    setPreview(`http://localhost:5000/image/${blog.image}`);
    setImage(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setBlogData({ title: "", content: "" });
    setImage(null);
    setPreview(null);
  };

  return (
    <div style={styles.pageWrapper}>
      {/* ✅ CUSTOM POPUP MODAL */}
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
                            <button onClick={() => { popup.onConfirm(); setPopup({...popup, show: false}); }} style={styles.confirmBtn}>Delete It</button>
                            <button onClick={() => setPopup({...popup, show: false})} style={styles.cancelBtn}>Keep It</button>
                        </>
                    ) : (
                        <button onClick={() => setPopup({...popup, show: false})} style={styles.confirmBtn}>Okay</button>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* HEADER & FORM (Same as before but with triggerPopup) */}
      <header style={styles.header}>
        <div>
          <h2 style={styles.mainTitle}>{editingId ? "Edit Story" : "Create New Story"}</h2>
          <p style={styles.subTitle}>Publish premium insights for Archi members</p>
        </div>
        <button onClick={() => navigate('/blog')} style={styles.backBtn}>Public Blog Page <FaArrowLeft style={{marginLeft: '10px', transform: 'rotate(180deg)'}} /></button>
      </header>

      <div style={styles.contentCard}>
        <form onSubmit={handleSubmit} style={styles.formLayout}>
          <div style={styles.inputSection}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Title</label>
              <input value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} style={styles.input} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Content</label>
              <textarea value={blogData.content} onChange={e => setBlogData({...blogData, content: e.target.value})} style={{...styles.input, height: '180px', resize: 'none'}} required />
            </div>
            <div style={styles.btnActionGroup}>
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                    {loading ? <FaSpinner className="spin" /> : editingId ? <FaSync /> : <FaCheckCircle />} 
                    {loading ? " Processing..." : editingId ? " Update" : " Publish"}
                </button>
                {editingId && <button type="button" onClick={resetForm} style={styles.discardBtn}>Cancel</button>}
            </div>
          </div>

          <div style={styles.imageSection}>
            <div style={styles.previewContainer}>
              {preview ? <img src={preview} alt="" style={styles.previewImg} /> : <FaBookOpen size={40} color="#eee" />}
            </div>
            <label style={styles.uploadBtn}>
              <FaCloudUploadAlt /> Change Cover
              <input type="file" hidden onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </form>
      </div>

      {/* LIST SECTION */}
      <div style={{marginTop: '50px'}}>
          <h3 style={styles.sectionHeading}>Published Stories</h3>
          <div style={styles.blogGrid}>
              {blogs.map(blog => (
                  <div key={blog._id} style={styles.listCard}>
                      <img src={`http://localhost:5000/image/${blog.image}`} style={styles.listImg} alt="" />
                      <div style={styles.listInfo}>
                          <h4 style={styles.listTitle}>{blog.title}</h4>
                          <div style={styles.listActions}>
                              <button onClick={() => startEdit(blog)} style={styles.editBtn}><FaEdit /> Edit</button>
                              <button onClick={() => handleDelete(blog._id)} style={styles.deleteListBtn}><FaTrashAlt /> Delete</button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

const styles = {
  pageWrapper: { padding: '40px 8%', background: '#fcfcfc', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' },
  mainTitle: { margin: 0, fontSize: '28px', color: '#1a1a1a', fontWeight: '700' },
  subTitle: { color: '#888', fontSize: '14px' },
  backBtn: { padding: '10px 18px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '13px' },
  
  // MODAL STYLES
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center', width: '400px', animation: 'fadeIn 0.3s ease-out' },
  modalText: { fontSize: '16px', color: '#333', margin: '20px 0', fontWeight: '600' },
  modalActions: { display: 'flex', gap: '15px', justifyContent: 'center' },
  confirmBtn: { padding: '12px 25px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
  cancelBtn: { padding: '12px 25px', background: '#eee', color: '#555', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },

  contentCard: { background: '#fff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' },
  formLayout: { display: 'flex', gap: '40px', padding: '40px', flexWrap: 'wrap' },
  inputSection: { flex: 1.5, display: 'flex', flexDirection: 'column', gap: '15px' },
  sectionHeading: { fontSize: '14px', color: '#222', marginBottom: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase' },
  input: { padding: '15px', borderRadius: '12px', border: '1px solid #ececec', outline: 'none', fontSize: '14px', background: '#f9f9f9' },
  btnActionGroup: { display: 'flex', gap: '10px' },
  submitBtn: { flex: 2, padding: '15px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  discardBtn: { flex: 1, padding: '15px', background: '#eee', borderRadius: '10px', border: 'none', cursor: 'pointer' },
  imageSection: { flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' },
  previewContainer: { width: '100%', height: '250px', background: '#f8f8f8', borderRadius: '15px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  uploadBtn: { padding: '14px', background: '#f0f7ff', color: '#007bff', borderRadius: '10px', border: '1px solid #cce5ff', textAlign: 'center', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },

  blogGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  listCard: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' },
  listImg: { width: '100%', height: '150px', objectFit: 'cover' },
  listInfo: { padding: '15px' },
  listTitle: { fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' },
  listActions: { display: 'flex', gap: '10px' },
  editBtn: { flex: 1, padding: '8px', background: '#f3cf7a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },
  deleteListBtn: { flex: 1, padding: '8px', background: '#fff0f0', color: '#ff4d4d', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }
};

export default AddBlog;