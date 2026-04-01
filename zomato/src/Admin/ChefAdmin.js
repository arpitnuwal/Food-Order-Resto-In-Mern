import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserTie, FaCloudUploadAlt, FaArrowLeft, 
  FaCheckCircle, FaSpinner, FaTrash, FaEdit, FaExclamationTriangle, FaTimes 
} from 'react-icons/fa';

function ChefAdmin() {
  const [chefs, setChefs] = useState([]);
  const [chefData, setChefData] = useState({ name: "", role: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // ✅ Luxury Popup State
  const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null });

  const navigate = useNavigate();

  const fetchChefs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chefs");
      setChefs(res.data);
    } catch (err) { console.error(err); } 
    finally { setFetching(false); }
  };

  useEffect(() => { fetchChefs(); }, []);

  // --- Utility: Luxury Popup Trigger ---
  const triggerPopup = (type, message, onConfirm = null) => {
    setPopup({ show: true, type, message, onConfirm });
    if (type === 'success') {
      setTimeout(() => setPopup({ show: false, type: '', message: '', onConfirm: null }), 2500);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerPopup('error', "Bhai, photo 2MB se badi hai!");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image && !editingId) return triggerPopup('error', "Chef ki photo zaroori hai!");

    setLoading(true);
    const formData = new FormData();
    formData.append("name", chefData.name);
    formData.append("role", chefData.role);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        // Edit Mode Logic (Ensure backend has PUT route /api/chefs/:id)
        await axios.put(`http://localhost:5000/api/chefs/${editingId}`, formData);
        triggerPopup('success', "Architect Profile Updated! ✨");
      } else {
        // Add Mode Logic
        await axios.post("http://localhost:5000/api/chefs/add", formData);
        triggerPopup('success', "Chef Registered to Archi Team! 👨‍🍳");
      }
      resetForm();
      fetchChefs();
    } catch (err) { 
      triggerPopup('error', "Gadbad ho gayi! Backend check karo."); 
    } finally { setLoading(false); }
  };

  const startEdit = (chef) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(chef._id);
    setChefData({ name: chef.name, role: chef.role });
    setPreview(`http://localhost:5000/image/${chef.image}`);
    setImage(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setChefData({ name: "", role: "" });
    setImage(null);
    setPreview(null);
  };

  const deleteChef = (id) => {
    triggerPopup('confirm', "Bhai, kya aap pakka is profile ko delete karna chahte hain?", async () => {
        try {
            await axios.delete(`http://localhost:5000/api/chefs/${id}`);
            triggerPopup('success', "Chef profile removed! 🗑️");
            fetchChefs();
            if (editingId === id) resetForm();
        } catch (err) { triggerPopup('error', "Delete fail ho gaya!"); }
    });
  };

  return (
    <div style={styles.pageWrapper}>
      
      {/* ✅ LUXURY CUSTOM POPUP MODAL */}
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

      <header style={styles.header}>
        <div>
          <h2 style={styles.mainTitle}>{editingId ? "Refine Chef Profile" : "Culinary Architects"}</h2>
          <p style={styles.subTitle}>Manage the elite masterminds behind Archi Restaurant</p>
        </div>
        <button onClick={() => navigate(-1)} style={styles.backBtn}><FaArrowLeft /> Back</button>
      </header>

      <div style={styles.contentCard}>
        <form onSubmit={handleSubmit} style={styles.formLayout}>
          <div style={styles.inputSection}>
            <h3 style={styles.sectionHeading}>Profile Details</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                className="custom-input" value={chefData.name} 
                onChange={e => setChefData({...chefData, name: e.target.value})} 
                style={styles.input} required placeholder="Vikram Sethi"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Role / Specialization</label>
              <input 
                className="custom-input" value={chefData.role} 
                onChange={e => setChefData({...chefData, role: e.target.value})} 
                style={styles.input} required placeholder="Executive Pastry Chef"
              />
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                    {loading ? <FaSpinner className="spin" /> : editingId ? <FaEdit /> : <FaCheckCircle />} 
                    {loading ? " Processing..." : editingId ? " Update Profile" : " Register Chef"}
                </button>
                {editingId && <button type="button" onClick={resetForm} style={styles.cancelActionBtn}>Cancel</button>}
            </div>
          </div>

          <div style={styles.imageSection}>
            <h3 style={styles.sectionHeading}>Chef Visual</h3>
            <div style={styles.previewContainer}>
              {preview ? (
                <img src={preview} alt="Preview" style={styles.previewImg} />
              ) : (
                <div style={styles.imagePlaceholder}>
                  <FaUserTie size={50} color="#ddd" />
                </div>
              )}
            </div>
            <label style={styles.uploadBtn}>
              <FaCloudUploadAlt /> {image || editingId ? "Change Cover" : "Upload Photo"}
              <input type="file" hidden onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </form>
      </div>

      {/* Team List */}
      <div style={{marginTop: '50px'}}>
        <h3 style={styles.sectionHeading}>Current Team ({chefs.length})</h3>
        <div style={styles.chefGrid}>
          {fetching ? (
            <p style={{color: '#bbb'}}>Loading architects...</p>
          ) : chefs.map((chef) => (
            <div key={chef._id} style={styles.chefCardSmall}>
              <img src={`http://localhost:5000/image/${chef.image}`} alt="" style={styles.chefThumb} />
              <div style={{flex: 1}}>
                <h4 style={styles.miniName}>{chef.name}</h4>
                <p style={styles.miniRole}>{chef.role}</p>
              </div>
              <div style={{display: 'flex', gap: '5px'}}>
                <button onClick={() => startEdit(chef)} style={styles.editBtnSmall}><FaEdit /></button>
                <button onClick={() => deleteChef(chef._id)} style={styles.deleteBtn}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .custom-input:focus { border-color: #000 !important; background: #fff !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const styles = {
  pageWrapper: { padding: '40px 8%', background: '#fcfcfc', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' },
  mainTitle: { margin: 0, fontSize: '28px', color: '#1a1a1a', fontWeight: '800' },
  subTitle: { color: '#888', fontSize: '14px' },
  backBtn: { padding: '10px 20px', background: '#fff', border: '1px solid #eee', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: '700' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' },
  modalContent: { background: '#fff', padding: '40px', borderRadius: '25px', textAlign: 'center', width: '380px', animation: 'fadeIn 0.3s ease-out' },
  modalText: { fontSize: '17px', color: '#333', margin: '20px 0', fontWeight: '600' },
  modalActions: { display: 'flex', gap: '15px', justifyContent: 'center' },
  confirmBtn: { padding: '12px 25px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
  cancelBtn: { padding: '12px 25px', background: '#eee', color: '#555', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },

  contentCard: { background: '#fff', borderRadius: '24px', boxShadow: '0 15px 45px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', overflow: 'hidden' },
  formLayout: { display: 'flex', gap: '50px', padding: '45px', flexWrap: 'wrap' },
  inputSection: { flex: 1.2, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '22px' },
  sectionHeading: { fontSize: '14px', color: '#1a1a1a', marginBottom: '20px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '10px', fontWeight: '800', color: '#bbb', textTransform: 'uppercase' },
  input: { padding: '16px', borderRadius: '12px', border: '1px solid #efefef', outline: 'none', fontSize: '14px', background: '#fbfbfb', transition: '0.3s' },
  submitBtn: { flex: 2, padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  cancelActionBtn: { flex: 1, background: '#f5f5f5', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },

  imageSection: { flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  previewContainer: { width: '100%', height: '260px', background: '#fcfcfc', borderRadius: '20px', border: '1px solid #eee', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  imagePlaceholder: { textAlign: 'center' },
  uploadBtn: { width: '100%', padding: '15px', background: '#f0f7ff', color: '#007bff', borderRadius: '12px', border: '1px solid #cce5ff', textAlign: 'center', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },

  chefGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  chefCardSmall: { display: 'flex', alignItems: 'center', gap: '15px', background: '#fff', padding: '15px', borderRadius: '18px', border: '1px solid #eee', boxShadow: '0 4px 10px rgba(0,0,0,0.01)' },
  chefThumb: { width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #eee' },
  miniName: { margin: '0 0 4px 0', fontSize: '15px', color: '#1a1a1a', fontWeight: '700' },
  miniRole: { margin: 0, fontSize: '12px', color: '#999', fontWeight: '500' },
  editBtnSmall: { padding: '10px', background: '#f0f7ff', color: '#007bff', border: 'none', borderRadius: '10px', cursor: 'pointer' },
  deleteBtn: { padding: '10px', background: '#fff0f0', color: '#ff4d4d', border: 'none', borderRadius: '10px', cursor: 'pointer' }
};

export default ChefAdmin;