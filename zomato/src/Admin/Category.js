import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaImage, 
  FaCloudUploadAlt, FaExclamationTriangle, FaCheckCircle, FaSpinner 
} from "react-icons/fa";

function Category() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  // ✅ Luxury Popup State
  const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null });

  const restaurantId = "ArchiRestaurant";

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/category/${restaurantId}`);
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const triggerPopup = (type, message, onConfirm = null) => {
    setPopup({ show: true, type, message, onConfirm });
    if (type === 'success') {
      setTimeout(() => setPopup({ show: false, type: '', message: '', onConfirm: null }), 2500);
    }
  };

  const handleImageChange = (e, mode) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerPopup('error', "Bhai, photo 2MB se badi hai!");
        return;
      }
      if (mode === 'add') {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      } else {
        setEditImage(file);
        setEditPreview(URL.createObjectURL(file));
      }
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!image) return triggerPopup('error', "Category photo required!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("restaurantId", restaurantId);
      formData.append("image", image);

      await axios.post("http://localhost:5000/api/category/add", formData);
      setName(""); setImage(null); setPreview(null);
      fetchCategories();
      triggerPopup('success', "Category created successfully! 🎉");
    } catch (err) { 
      triggerPopup('error', "Add failed! Check backend connection."); 
    } finally { setLoading(false); }
  };

  const deleteCategory = (id) => {
    triggerPopup('confirm', "Bhai, kya aap pakka is category ko udaana chahte hain?", async () => {
      try {
        await axios.delete(`http://localhost:5000/api/category/${id}`);
        fetchCategories();
        triggerPopup('success', "Category deleted! 🗑️");
      } catch (err) { triggerPopup('error', "Delete failed!"); }
    });
  };

  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
    setEditPreview(`http://localhost:5000/image/${cat.image}`);
    setEditImage(null);
  };

  const saveEdit = async (id) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", editName);
      if (editImage) formData.append("image", editImage);

      await axios.put(`http://localhost:5000/api/category/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditId(null);
      fetchCategories();
      triggerPopup('success', "Category updated! ✨");
    } catch (err) { triggerPopup('error', "Update failed!"); }
    finally { setLoading(false); }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditImage(null);
    setEditPreview(null);
  };

  return (
    <div style={styles.pageWrapper}>
      {/* POPUP MODAL */}
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
                            <button onClick={() => { popup.onConfirm(); setPopup({...popup, show: false}); }} style={styles.confirmBtn}>Delete</button>
                            <button onClick={() => setPopup({...popup, show: false})} style={styles.cancelBtn}>Cancel</button>
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
          <h2 style={styles.mainTitle}>Menu Categories</h2>
          <p style={styles.subTitle}>Design sections for Archi's premium menu</p>
        </div>
        <div style={styles.countBadge}>{categories.length} Sections</div>
      </header>

      <div style={styles.layout}>
        {/* ADD FORM */}
        <div style={styles.formCard}>
          <h3 style={styles.sectionTitle}><FaPlus /> New Category</h3>
          <form onSubmit={addCategory} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} placeholder="Desserts..." />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cover Image</label>
              <div style={styles.previewBox}>
                {preview ? <img src={preview} alt="" style={styles.previewImg} /> : <FaImage size={30} color="#ddd" />}
              </div>
              <label style={styles.uploadBtn}>
                <FaCloudUploadAlt /> Choose Photo
                <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, 'add')} />
              </label>
            </div>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
                {loading ? <FaSpinner className="spin" /> : "Create Section"}
            </button>
          </form>
        </div>

        {/* LIST TABLE */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Category Name</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} style={styles.tableRow}>
                  <td style={styles.td}>
                    {editId === cat._id ? (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                        <img src={editPreview} style={styles.catImgSmall} alt="" />
                        <label style={styles.editUploadLink}>
                           Change <input type="file" hidden onChange={(e) => handleImageChange(e, 'edit')} />
                        </label>
                      </div>
                    ) : (
                      <div style={styles.catImgBox}>
                        <img src={`http://localhost:5000/image/${cat.image}`} alt="" style={styles.catImg} />
                      </div>
                    )}
                  </td>
                  <td style={styles.td}>
                    {editId === cat._id ? (
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} style={styles.editInput} />
                    ) : (
                      <span style={styles.catName}>{cat.name}</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      {editId === cat._id ? (
                        <>
                          <button onClick={() => saveEdit(cat._id)} style={styles.saveBtn}><FaSave /></button>
                          <button onClick={cancelEdit} style={styles.cancelBtn}><FaTimes /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(cat)} style={styles.editIconBtn}><FaEdit /></button>
                          <button onClick={() => deleteCategory(cat._id)} style={styles.delIconBtn}><FaTrash /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { padding: '40px', background: '#fcfcfc', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  mainTitle: { margin: 0, fontSize: '28px', color: '#1a1a1a', fontWeight: '800' },
  subTitle: { color: '#888', fontSize: '14px' },
  countBadge: { background: '#000', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' },
  layout: { display: "flex", gap: "40px", alignItems: "flex-start" },
  formCard: { flex: "0 0 350px", position: "sticky", top: "40px", padding: "35px", background: "white", borderRadius: "20px", border: "1px solid #f0f0f0", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" },
  sectionTitle: { fontSize: '15px', color: '#222', marginBottom: '25px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px' },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: '11px', fontWeight: '800', color: '#999', textTransform: 'uppercase' },
  input: { padding: "15px", borderRadius: "12px", border: "1px solid #eee", fontSize: "14px", outline: 'none', background: '#f9f9f9' },
  previewBox: { height: '180px', background: '#f8f8f8', borderRadius: '15px', border: '1px solid #eee', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  uploadBtn: { padding: '12px', border: '1px solid #eee', borderRadius: '10px', fontSize: '12px', textAlign: 'center', cursor: 'pointer', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '700' },
  submitBtn: { padding: "16px", borderRadius: "12px", border: "none", background: "#000", color: "white", fontWeight: "700", cursor: "pointer" },
  tableCard: { flex: "1", padding: "35px", background: "white", borderRadius: "20px", border: "1px solid #f0f0f0", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeadRow: { textAlign: "left", borderBottom: "1px solid #f0f0f0" },
  th: { padding: "15px", color: "#bbb", fontSize: "11px", textTransform: "uppercase", fontWeight: '800' },
  tableRow: { borderBottom: "1px solid #f8f8f8" },
  td: { padding: "15px", verticalAlign: "middle" },
  catImgBox: { width: '55px', height: '55px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' },
  catImg: { width: '100%', height: '100%', objectFit: 'cover' },
  catImgSmall: { width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' },
  catName: { fontWeight: '700', color: '#333', fontSize: '15px' },
  editInput: { padding: '10px', borderRadius: '8px', border: '1px solid #000', width: '90%', outline: 'none' },
  editUploadLink: { fontSize: '10px', color: '#007bff', cursor: 'pointer', textAlign: 'center' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' },
  modalContent: { background: '#fff', padding: '40px', borderRadius: '24px', textAlign: 'center', width: '380px' },
  modalText: { fontSize: '17px', color: '#222', margin: '20px 0', fontWeight: '600' },
  modalActions: { display: 'flex', gap: '15px', justifyContent: 'center' },
  confirmBtn: { padding: '12px 25px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
  cancelBtn: { padding: '12px 25px', background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
  actionGroup: { display: 'flex', gap: '8px' },
  editIconBtn: { background: '#f0f7ff', color: '#007bff', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
  delIconBtn: { background: '#fff0f0', color: '#dc3545', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
  saveBtn: { background: '#e6fffa', color: '#28a745', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
  cancelBtn: { background: '#f5f5f5', color: '#666', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
  emptyMsg: { padding: '40px', textAlign: 'center', color: '#bbb' }
};

export default Category;