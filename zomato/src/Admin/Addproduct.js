import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaPlus, FaCloudUploadAlt, FaUtensils, FaArrowLeft, FaImage, 
  FaCheckCircle, FaSpinner, FaTimes, FaExclamationTriangle, FaTrashAlt, FaEdit 
} from "react-icons/fa";

function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Checking Edit Mode
  const editData = location.state?.product; 

  const [productData, setProductData] = useState({
    name: editData?.name || "", 
    price: editData?.price || "", 
    description: editData?.description || "", 
    category: editData?.category || ""
  });
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(editData ? `http://localhost:5000/image/${editData.image}` : null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // ✅ Premium Popup State
  const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null });

  const restaurantId = "ArchiRestaurant";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/category/${restaurantId}`);
        setCategories(res.data);
      } catch (err) { console.error("Category load failed", err); }
    };
    fetchCategories();
  }, []);

  // --- Utility: Luxury Popup Trigger ---
  const triggerPopup = (type, message, onConfirm = null) => {
    setPopup({ show: true, type, message, onConfirm });
    // Success messages apne aap 3 sec mein gayab ho jayenge
    if (type === 'success') {
      setTimeout(() => setPopup({ show: false, type: '', message: '', onConfirm: null }), 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerPopup('error', "Bhai, file 2MB se badi hai! Choti photo dalo.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (!image && !editData) return triggerPopup('error', "Bhai, bina photo ke menu pheeka lagega!");

    setLoading(true);
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("restaurantId", restaurantId);
    if (image) formData.append("image", image);

    try {
      if (editData) {
        // ✅ UPDATE API CALL
        await axios.put(`http://localhost:5000/api/product/update/${editData._id}`, formData);
        triggerPopup('success', "Masterpiece Updated Successfully! ✨");
      } else {
        // ✅ ADD API CALL
        await axios.post("http://localhost:5000/api/product/add", formData);
        triggerPopup('success', "New Delight Added to Menu! 🍽️");
      }
      // Delay navigation to show success animation
      setTimeout(() => navigate("/productlist"), 2500);
    } catch (err) { 
      console.error(err);
      triggerPopup('error', "Update failed! Backend routes check karein."); 
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    triggerPopup('confirm', "Bhai, kya aap pakka is dish ko list se hatana chahte hain?", async () => {
      try {
        await axios.delete(`http://localhost:5000/api/product/delete/${editData._id}`);
        triggerPopup('success', "Dish removed from Archi Menu! 🗑️");
        setTimeout(() => navigate("/productlist"), 2500);
      } catch (err) {
        triggerPopup('error', "Delete fail ho gaya! Permission check karein.");
      }
    });
  };

  return (
    <div style={styles.pageWrapper}>
      
      {/* ✅ LUXURY CUSTOM POPUP MODAL */}
      {popup.show && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                {popup.type === 'confirm' ? <FaExclamationTriangle size={50} color="#f3cf7a" /> : 
                 popup.type === 'error' ? <FaTimes size={50} color="#ff4d4d" /> : 
                 <FaCheckCircle size={50} color="#4bb543" />}
                
                <h3 style={styles.modalHeading}>{popup.type.toUpperCase()}</h3>
                <p style={styles.modalText}>{popup.message}</p>
                
                <div style={styles.modalActions}>
                    {popup.type === 'confirm' ? (
                        <>
                            <button onClick={() => { popup.onConfirm(); setPopup({...popup, show: false}); }} style={styles.confirmBtn}>Delete It</button>
                            <button onClick={() => setPopup({...popup, show: false})} style={styles.cancelBtn}>Keep It</button>
                        </>
                    ) : (
                        <button onClick={() => setPopup({...popup, show: false})} style={styles.confirmBtn}>Close</button>
                    )}
                </div>
            </div>
        </div>
      )}

      <header style={styles.header}>
        <div>
          <h2 style={styles.mainTitle}>{editData ? "Refine Culinary Dish" : "Add New Creation"}</h2>
          <p style={styles.subTitle}>Managing the flavors of Archi Restaurant</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
            <button onClick={() => navigate("/productlist")} style={styles.backBtn}>
                <FaArrowLeft /> Product List
            </button>
            {editData && (
              <button onClick={handleDelete} style={styles.deleteBtn}>
                <FaTrashAlt /> Delete Dish
              </button>
            )}
        </div>
      </header>

      <div style={styles.contentCard}>
        <form onSubmit={handleAction} style={styles.formLayout}>
          
          <div style={styles.inputSection}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Dish Name</label>
              <input 
                className="custom-input" placeholder="e.g. Exotic Saffron Risotto" 
                value={productData.name} 
                onChange={e => setProductData({...productData, name: e.target.value})} 
                style={styles.input} required 
              />
            </div>

            <div style={styles.row}>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>Category</label>
                <select 
                  className="custom-input" value={productData.category} 
                  onChange={e => setProductData({...productData, category: e.target.value})} 
                  style={styles.input} required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>Price (₹)</label>
                <input 
                  className="custom-input" type="number" 
                  value={productData.price} 
                  onChange={e => setProductData({...productData, price: e.target.value})} 
                  style={styles.input} required 
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Description</label>
              <textarea 
                className="custom-input" placeholder="Describe the soul of this dish..."
                value={productData.description} 
                onChange={e => setProductData({...productData, description: e.target.value})} 
                style={{...styles.input, height: '120px', resize: 'none'}} required 
              />
            </div>

            <div style={styles.btnActionGroup}>
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                    {loading ? <FaSpinner className="spin" /> : editData ? <FaEdit /> : <FaCheckCircle />} 
                    {loading ? " Processing..." : editData ? " Update Masterpiece" : " Add to Menu"}
                </button>
            </div>
          </div>

          <div style={styles.imageSection}>
            <div style={styles.previewContainer}>
              {preview ? (
                <div style={{position: 'relative', width: '100%', height: '100%'}}>
                    <img src={preview} alt="Preview" style={styles.previewImg} />
                    <div style={styles.previewTag}>₹{productData.price || "0"}</div>
                </div>
              ) : (
                <div style={styles.imagePlaceholder}>
                  <FaImage size={60} color="#ddd" />
                  <p style={{color: '#ccc', fontSize: '12px', marginTop: '10px'}}>Preview will appear here</p>
                </div>
              )}
            </div>
            
            <label style={styles.uploadBtn}>
              <FaCloudUploadAlt size={20} />
              {image || editData ? "Change Dish Photo" : "Upload Dish Photo"}
              <input type="file" hidden onChange={handleImageChange} accept="image/*" />
            </label>
          </div>

        </form>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .custom-input:focus { border-color: #000 !important; background: #fff !important; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const styles = {
  pageWrapper: { padding: '40px 8%', background: '#fcfcfc', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' },
  mainTitle: { margin: 0, fontSize: '28px', color: '#1a1a1a', fontWeight: '800', letterSpacing: '-1px' },
  subTitle: { color: '#888', fontSize: '14px', marginTop: '5px' },
  backBtn: { padding: '12px 20px', background: '#fff', border: '1px solid #eee', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', transition: '0.3s' },
  deleteBtn: { padding: '12px 20px', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#e53e3e', transition: '0.3s' },

  // POPUP MODAL STYLES
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(8px)' },
  modalContent: { background: '#fff', padding: '50px 40px', borderRadius: '30px', textAlign: 'center', width: '420px', animation: 'slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
  modalHeading: { fontSize: '12px', letterSpacing: '4px', color: '#aaa', margin: '20px 0 10px 0' },
  modalText: { fontSize: '18px', color: '#222', marginBottom: '30px', fontWeight: '600', lineHeight: '1.5' },
  modalActions: { display: 'flex', gap: '15px', justifyContent: 'center' },
  confirmBtn: { padding: '14px 30px', background: '#000', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
  cancelBtn: { padding: '14px 30px', background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },

  contentCard: { background: '#fff', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', overflow: 'hidden' },
  formLayout: { display: 'flex', gap: '60px', padding: '50px', flexWrap: 'wrap' },
  inputSection: { flex: 1.4, minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '25px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '11px', fontWeight: '800', color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { padding: '16px', borderRadius: '14px', border: '1px solid #efefef', outline: 'none', fontSize: '15px', background: '#fbfbfb', transition: '0.4s' },
  row: { display: 'flex', gap: '25px' },
  btnActionGroup: { display: 'flex', marginTop: '10px' },
  submitBtn: { width: '100%', padding: '18px', background: '#000', color: '#fff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },
  
  imageSection: { flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '25px' },
  previewContainer: { width: '100%', height: '380px', background: '#fcfcfc', borderRadius: '24px', border: '2px dashed #eee', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  previewTag: { position: 'absolute', bottom: '25px', right: '25px', background: '#f3cf7a', color: '#000', padding: '8px 20px', borderRadius: '40px', fontWeight: '800', fontSize: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' },
  imagePlaceholder: { textAlign: 'center' },
  uploadBtn: { width: '100%', padding: '18px', background: '#f0f7ff', color: '#007bff', borderRadius: '16px', border: '1px solid #cce5ff', textAlign: 'center', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: '0.3s' }
};

export default AddProduct;