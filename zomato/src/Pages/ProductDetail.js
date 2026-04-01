import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // ✅ Link add kiya
import { FaArrowLeft, FaUtensils, FaLeaf, FaShoppingBag, FaStar, FaChevronDown, FaCheckCircle, FaTimes, FaEye, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = location.state?.product;
  const isFlashDeal = location.state?.isFlashDeal;
  const discount = location.state?.discount;

  // ✅ States
  const [reviews, setReviews] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [activeFlashDeals, setActiveFlashDeals] = useState([]);
  const [newReview, setNewReview] = useState({ userName: "", rating: 5, comment: "" });
  const [posting, setPosting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      fetchProductReviews();
      fetchSuggestedData();
    }
  }, [product]);

  const fetchProductReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/product/${product._id}`);
      setReviews(res.data);
    } catch (err) { console.error("Reviews load nahi ho paye"); }
  };

  const fetchSuggestedData = async () => {
    try {
      const dealsRes = await axios.get(`http://localhost:5000/api/flash-deal/all/ArchiRestaurant`);
      setActiveFlashDeals(dealsRes.data);

      const res = await axios.get(`http://localhost:5000/api/product/ArchiRestaurant`);
      const filtered = res.data.filter(p => p.category === product.category && p._id !== product._id);
      setSuggestedProducts(filtered.slice(0, 4));
    } catch (err) { console.error("Data load failed"); }
  };

  const handleAddToCart = () => {
    const finalPrice = isFlashDeal ? Math.floor(product.price * (1 - discount / 100)) : product.price;
    addToCart({ ...product, price: finalPrice, isFlashDeal: isFlashDeal });
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await axios.post("http://localhost:5000/api/reviews/add", {
        ...newReview,
        productId: product._id
      });
      setNewReview({ userName: "", rating: 5, comment: "" });
      setShowPopup(true);
    } catch (err) { alert("Review post nahi ho paya!"); }
    setPosting(false);
  };

  if (!product) return <div style={{ color: '#fff', textAlign: 'center', padding: '100px' }}>Product Not Found...</div>;

  const displayPrice = isFlashDeal ? Math.floor(product.price * (1 - discount / 100)) : product.price;
  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);

  return (
    <div style={styles.pageContainer}>
      <style>{`
        .order-btn { margin-top: 30px; padding: 18px 60px; background: #f3cf7a; color: #000; border: none; font-weight: 700; cursor: pointer; transition: 0.4s; display: flex; align-items: center; gap: 15px; text-transform: uppercase; }
        .order-btn:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(243, 207, 122, 0.3); }
        .star-input { color: #f3cf7a; cursor: pointer; font-size: 22px; margin-right: 5px; transition: 0.2s; }
        
        .review-card { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; margin-bottom: 20px; border-radius: 4px; animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .view-all-btn { background: transparent; border: none; color: #f3cf7a; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 10px 0; position: relative; transition: 0.3s; }
        .view-all-btn::after { content: ''; position: absolute; bottom: 0; left: 0; width: 30px; height: 1px; background: #f3cf7a; transition: 0.4s; }
        .view-all-btn:hover::after { width: 100%; }
        
        .suggest-card { background: #080808; border: 1px solid #111; padding: 12px; transition: 0.4s; cursor: pointer; position: relative; overflow: hidden; height: 100%; }
        .suggest-card:hover { border-color: #f3cf7a; }
        .suggest-img-box { height: 160px; overflow: hidden; margin-bottom: 15px; border-radius: 4px; position: relative; }
        .suggest-img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .suggest-card:hover img { transform: scale(1.1); }

        /* ✅ NEW PREMIUM FULL MENU BUTTON */
        .full-menu-btn {
          text-decoration: none;
          background: rgba(243, 207, 122, 0.05);
          border: 1px solid #f3cf7a;
          color: #f3cf7a;
          padding: 10px 24px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 2px;
        }
        .full-menu-btn:hover {
          background: #f3cf7a;
          color: #000;
          box-shadow: 0 0 20px rgba(243, 207, 122, 0.2);
          transform: translateX(5px);
        }

        .suggest-badge { position: absolute; top: 10px; left: 10px; background: #f3cf7a; color: #000; font-size: 9px; font-weight: 900; padding: 3px 8px; border-radius: 2px; z-index: 2; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(5px); }
        .modal-content { background: #0a0a0a; border: 1px solid #f3cf7a; padding: 40px; text-align: center; max-width: 400px; width: 90%; animation: fadeIn 0.4s ease-out; position: relative; }

        @media (max-width: 992px) {
          .detail-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .image-box { height: 400px !important; }
          .review-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }

        @media (max-width: 600px) {
          .suggest-header { flex-direction: column; align-items: flex-start !important; gap: 15px; }
          .full-menu-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Success Pop-up */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FaTimes style={{ position: 'absolute', top: '15px', right: '15px', color: '#555', cursor: 'pointer' }} onClick={() => setShowPopup(false)}/>
            <FaCheckCircle size={50} color="#f3cf7a" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontFamily: 'Marcellus', color: '#f3cf7a', letterSpacing: '2px' }}>THANK YOU</h2>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '25px' }}>Aapka review Admin verification ke baad live show hoga. ✨</p>
            <button style={{ ...styles.submitBtn, width: '100%', padding: '12px' }} onClick={() => setShowPopup(false)}>UNDERSTOOD</button>
          </div>
        </div>
      )}

      <div style={styles.contentWrapper}>
        <button style={{background:'none', border:'none', color:'#f3cf7a', cursor:'pointer', marginBottom:'30px'}} onClick={() => navigate(-1)}>
          <FaArrowLeft /> BACK TO CURATION
        </button>

        <div className="detail-grid" style={styles.detailGrid}>
          <div className="image-box" style={styles.imageBox}>
            <img src={`http://localhost:5000/image/${product.image}`} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="" />
          </div>

          <div style={styles.infoBox}>
            {isFlashDeal && <span style={styles.dealTag}>FLASH DEAL - {discount}% OFF</span>}
            <h1 className="product-name" style={styles.productName}>{product.name}</h1>
            <div style={styles.priceTag}>₹{displayPrice} {isFlashDeal && <span style={styles.oldPrice}>₹{product.price}</span>}</div>
            <p style={styles.description}>{product.description || "Premium handcrafted luxury dish."}</p>
            <div style={styles.metaInfo}>
              <div style={styles.metaItem}><FaLeaf color="#4CAF50" /> 100% Organic</div>
              <div style={styles.metaItem}><FaUtensils color="#f3cf7a" /> Served Fresh</div>
            </div>
            <button className="order-btn" onClick={handleAddToCart}>
              <FaShoppingBag /> Add to Plate
            </button>
          </div>
        </div>

        {/* --- SUGGESTED PRODUCTS --- */}
        {suggestedProducts.length > 0 && (
          <div style={{marginTop: '80px', marginBottom: '80px'}}>
            <div className="suggest-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '35px' }}>
              <div>
                <h2 style={styles.sectionTitle}>You May Also Like</h2>
                <div style={styles.goldLine}></div>
              </div>
              
              {/* ✅ UPDATED FULL MENU BUTTON */}
              <Link to="/menu" className="full-menu-btn">
                EXPLORE FULL MENU <FaArrowRight size={12} />
              </Link>
            </div>

            <div className="suggest-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px'}}>
              {suggestedProducts.map((item) => {
                const deal = activeFlashDeals.find(d => d.product?._id === item._id);
                const finalPrice = deal ? Math.floor(item.price * (1 - deal.discountPercentage / 100)) : item.price;

                return (
                  <div key={item._id} className="suggest-card" onClick={() => {
                    navigate(`/product/${item.name.replace(/\s+/g, '-').toLowerCase()}`, { 
                        state: { product: item, isFlashDeal: !!deal, discount: deal?.discountPercentage } 
                    });
                    window.scrollTo(0,0);
                  }}>
                    <div className="suggest-img-box">
                      {deal && <div className="suggest-badge">OFFER</div>}
                      <img src={`http://localhost:5000/image/${item.image}`} className="suggest-img" alt={item.name} />
                    </div>
                    <h4 className="suggest-name" style={{fontFamily:'Marcellus', color:'#fff', margin:'0 0 8px 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{item.name}</h4>
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <span style={{color:'#f3cf7a', fontWeight:'700', fontSize:'14px'}}>₹{finalPrice}</span>
                      {deal && <span style={{color:'#444', textDecoration:'line-through', fontSize:'11px'}}>₹{item.price}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- REVIEW SECTION --- */}
        <div style={styles.reviewSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Guest Experiences</h2>
            <div style={styles.goldLine}></div>
          </div>

          <div className="review-grid" style={styles.reviewGrid}>
            <div className="form-card" style={styles.formCard}>
              <h3 style={styles.formTitle}>Rate this Dish</h3>
              <form onSubmit={handleReviewSubmit}>
                <input style={styles.input} placeholder="YOUR NAME" value={newReview.userName} onChange={(e) => setNewReview({...newReview, userName: e.target.value})} required />
                <div style={{margin: '15px 0'}}>
                  {[1,2,3,4,5].map(num => (
                    <FaStar key={num} className="star-input" style={{ opacity: num <= newReview.rating ? 1 : 0.2 }} onClick={() => setNewReview({...newReview, rating: num})} />
                  ))}
                </div>
                <textarea style={{...styles.input, height: '80px', resize: 'none'}} placeholder="YOUR EXPERIENCE..." value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} required />
                <button style={styles.submitBtn} disabled={posting}>{posting ? "POSTING..." : "POST REVIEW"}</button>
              </form>
            </div>

            <div style={styles.reviewList}>
              {reviews.length === 0 ? (
                <p style={{color: '#555', textAlign: 'center', marginTop: '50px'}}>Be the first to review this dish!</p>
              ) : (
                <>
                  {displayedReviews.map((r) => (
                    <div key={r._id} className="review-card">
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <span style={{color: '#f3cf7a', fontFamily:'Marcellus', fontSize:'14px'}}>{r.userName}</span>
                        <span style={{fontSize:'10px', color:'#444'}}>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{marginBottom:'10px'}}>
                        {[...Array(r.rating)].map((_, i) => <FaStar key={i} color="#f3cf7a" size={10} />)}
                      </div>
                      <p style={{color:'#888', fontSize:'13px', fontStyle:'italic', lineHeight:'1.6'}}>"{r.comment}"</p>
                    </div>
                  ))}
                  {reviews.length > 5 && !showAll && (
                    <div className="view-all-wrapper">
                        <button className="view-all-btn" onClick={() => setShowAll(true)}>Read all {reviews.length} reviews <FaChevronDown size={10}/></button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { background: "#050505", minHeight: "100vh", padding: "140px 8% 80px" },
  contentWrapper: { maxWidth: "1200px", margin: "0 auto" },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", marginBottom: '100px' },
  imageBox: { height: "500px", border: "1px solid #111", borderRadius: "8px", overflow: "hidden" },
  infoBox: { padding: "20px 0" },
  dealTag: { background: '#f3cf7a', color: '#000', padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px' },
  productName: { fontFamily: "Marcellus", fontSize: "42px", color: "#fff", margin: "20px 0" },
  priceTag: { fontSize: "32px", color: "#f3cf7a", marginBottom: "20px" },
  oldPrice: { fontSize: "18px", color: "#555", textDecoration: "line-through", marginLeft: "15px" },
  description: { color: "#aaa", lineHeight: "1.8", marginBottom: "30px" },
  metaItem: { display: "flex", alignItems: "center", gap: "10px", color: "#fff", marginBottom: "10px" },
  reviewSection: { marginTop: '80px', borderTop: '1px solid #111', paddingTop: '60px' },
  sectionHeader: { marginBottom: '30px' },
  sectionTitle: { fontFamily: 'Marcellus', fontSize: '28px', color: '#f3cf7a', margin: 0 },
  goldLine: { height: '2px', width: '50px', background: '#f3cf7a', marginTop: '10px' },
  reviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '50px' },
  formCard: { background: '#080808', padding: '30px', border: '1px solid #111', height: 'fit-content', position: 'sticky', top: '150px' },
  formTitle: { color: '#fff', fontSize: '14px', marginBottom: '20px', letterSpacing: '2px', textTransform:'uppercase' },
  input: { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #222', padding: '12px 0', color: '#fff', outline: 'none', marginBottom: '15px' },
  submitBtn: { width: '100%', background: '#f3cf7a', color: '#000', border: 'none', padding: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  reviewList: { minHeight: '400px' }
};

export default ProductDetail;