import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom"; 
import { 
  FaArrowLeft, FaStar, FaSearch, FaInfoCircle, FaCrown, 
  FaHeart, FaRegHeart, FaHome, FaChevronRight 
} from "react-icons/fa"; 
import { useCart } from "../context/CartContext"; 

function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]); 
  
  const { addToCart } = useCart(); 
  const location = useLocation();
  const navigate = useNavigate();

  const initialState = location.state?.selectedId || "All";
  const [selectedParent, setSelectedParent] = useState(initialState);
  const [selectedSub, setSelectedSub] = useState("All");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const restaurantId = "ArchiRestaurant";
  const user = JSON.parse(localStorage.getItem('user')); 

  // --- Fetch Data ---
  const fetchData = async () => {
    try {
      const prodRes = await axios.get(`http://localhost:5000/api/product/${restaurantId}`);
      const catRes = await axios.get(`http://localhost:5000/api/category/${restaurantId}`);
      setProducts(prodRes.data);
      setCategories(catRes.data);

      if (user?._id) {
        const wishRes = await axios.get(`http://localhost:5000/api/wishlist/${user._id}`);
        setWishlist(wishRes.data.map(item => item._id)); 
      }
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => {
    fetchData();
  }, [user?._id]);

  const toggleWishlist = async (productId) => {
    if (!user?._id) {
      alert("Pehle login toh kar lo maharaj!");
      navigate('/login');
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/wishlist/toggle", { userId: user._id, productId });
      setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    } catch (err) { console.error("Wishlist error:", err); }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
        const matches = products.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        setSuggestions(matches.slice(0, 5));
        setShowSuggestions(true);
    } else { setShowSuggestions(false); }
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.name);
    setShowSuggestions(false);
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const goToDetail = (product) => { navigate(`/product/${product._id}`, { state: { product } }); };

  const subCategories = categories.filter(c => c.parentCategory && c.parentCategory._id === selectedParent);

  const filteredProducts = products.filter(item => {
    let matchesParent = true;
    if (selectedParent && selectedParent !== "All") {
        const parentObj = categories.find(c => c._id === selectedParent);
        const childNames = categories.filter(c => c.parentCategory && c.parentCategory._id === selectedParent).map(c => c.name);
        if (parentObj) childNames.push(parentObj.name);
        matchesParent = childNames.includes(item.category);
    }
    let matchesSub = true;
    if (selectedSub !== "All") {
       const targetSubCat = categories.find(c => c._id === selectedSub);
       matchesSub = targetSubCat && item.category === targetSubCat.name;
    }
    return matchesParent && matchesSub && item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const signatureDishes = [...products].sort((a, b) => b.price - a.price).slice(0, 3);

  return (
    <div style={styles.pageContainer}>
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .hide-scroll::-webkit-scrollbar { display: none; }
          .product-card { transition: 0.5s all cubic-bezier(0.19, 1, 0.22, 1); border: 1px solid #1a1a1a; background: #0f0f0f; cursor: pointer; overflow: hidden; position: relative; }
          .product-card:hover { transform: translateY(-10px); border-color: #f3cf7a; box-shadow: 0 10px 40px rgba(243, 207, 122, 0.1); }
          .product-card:hover img { transform: scale(1.1); filter: brightness(1.1); }
          .wishlist-btn { position: absolute; top: 15px; right: 15px; z-index: 20; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(243, 207, 122, 0.2); transition: 0.3s; color: #f3cf7a; }
          .wishlist-btn:hover { background: #f3cf7a; color: #000; transform: scale(1.1); }
          .breadcrumb-link { color: rgba(255, 255, 255, 0.5); text-decoration: none; transition: 0.3s; display: flex; align-items: center; gap: 8px; font-size: 10px; letter-spacing: 2px; }
          .breadcrumb-link:hover { color: #f3cf7a; }
          .add-to-plate-btn:hover { background: #f3cf7a !important; color: #000 !important; border-color: #f3cf7a !important; }

          /* ✅ RESPONSIVE MEDIA QUERIES */
          @media (max-width: 992px) {
            .hero-title { font-size: 40px !important; }
            .product-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important; gap: 20px !important; }
          }

          @media (max-width: 768px) {
            .filter-container { flex-direction: column !important; align-items: flex-start !important; }
            .search-wrapper { width: 100% !important; }
            .chip-container { width: 100% !important; padding-bottom: 10px; }
            .hero-banner { height: 300px !important; }
            .hero-title { font-size: 32px !important; letter-spacing: 5px !important; }
          }

          @media (max-width: 480px) {
            .product-grid { grid-template-columns: 1fr !important; }
            .price-badge { padding: 4px 15px !important; fontSize: 14px !important; }
            .page-container { padding-bottom: 60px !important; }
          }
      `}</style>

      {/* --- HERO SECTION --- */}
      <div className="hero-banner" style={styles.heroBanner}>
        <img src="/9a55dcc0af24ad05f76206bf8bb3363a.jpg" alt="Interior" style={styles.heroImage} />
        <div style={styles.heroOverlay}>
          <div style={styles.heroTextContainer}>
            <span style={styles.goldLine}></span>
            <h1 className="hero-title" style={styles.mainTitle}>Culinary Gallery</h1>
            <p style={styles.subtitle}>Explore Our Handcrafted Flavors</p>
          </div>
          <nav style={styles.breadcrumb}>
            <Link to="/" className="breadcrumb-link"><FaHome size={12}/> HOME</Link>
            <FaChevronRight size={8} color="rgba(243, 207, 122, 0.5)" />
            <span style={{color: "#f3cf7a", fontSize: '10px', letterSpacing: '2px', fontWeight: '600'}}>OUR MENU</span>
          </nav>
        </div>
      </div>

      {/* --- Search & Sub-Category Section --- */}
      <div className="filter-container" style={styles.filterSection}>
          <div className="search-wrapper" style={{position: 'relative', width: '300px'}}>
              <div style={styles.searchBox}>
                <FaSearch color="#f3cf7a" size={14} />
                <input type="text" placeholder="Discover flavors..." value={searchTerm} onChange={handleSearchChange} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} style={styles.searchInput} />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                  <div style={styles.suggestionList}>
                      {suggestions.map((item) => (
                          <div key={item._id} onClick={() => handleSuggestionClick(item)} style={styles.suggestionItem}>
                            <img src={`http://localhost:5000/image/${item.image}`} alt="" style={{width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover'}}/>
                            {item.name}
                          </div>
                      ))}
                  </div>
              )}
          </div>

          <div className="chip-container hide-scroll" style={styles.chipContainer}>
            <button onClick={() => setSelectedSub("All")} style={selectedSub === "All" ? styles.activeChip : styles.chip}>ALL CURATIONS</button>
            {subCategories.map(sub => (
              <button key={sub._id} onClick={() => setSelectedSub(sub._id)} style={selectedSub === sub._id ? styles.activeChip : styles.chip}>
                {sub.name.toUpperCase()}
              </button>
            ))}
          </div>
      </div>

      {/* ✅ SIGNATURE SECTION */}
      {selectedSub === "All" && searchTerm === "" && (
          <div style={{padding: '0 5% 40px 5%'}}>
              <p style={styles.sectionLabel}><FaCrown color="#f3cf7a"/> CHEF'S SIGNATURE MASTERPIECES</p>
              <div className="product-grid" style={styles.productGrid}>
                  {signatureDishes.map(item => (
                      <div key={`sig-${item._id}`} className="product-card" onClick={() => goToDetail(item)}>
                          <div style={styles.signatureTag}><FaCrown size={10}/> SIGNATURE</div>
                          <div className="wishlist-btn" onClick={(e) => { e.stopPropagation(); toggleWishlist(item._id); }}>
                             {wishlist.includes(item._id) ? <FaHeart /> : <FaRegHeart />}
                          </div>
                          <div style={{position: 'relative', height: '220px', overflow: 'hidden'}}>
                              <img src={`http://localhost:5000/image/${item.image}`} alt={item.name} style={styles.productImage} />
                              <div style={styles.productFadeOverlay}></div>
                              <span className="price-badge" style={styles.priceBadge}>₹{item.price}</span>
                          </div>
                          <div style={styles.productInfo}>
                              <h4 style={styles.productName}>{item.name}</h4>
                              <p style={styles.productDesc}>{item.description?.substring(0, 60)}...</p>
                              <button className="add-to-plate-btn" style={styles.addButton} onClick={(e) => { e.stopPropagation(); addToCart(item); }}>ADD TO PLATE</button>
                          </div>
                      </div>
                  ))}
              </div>
              <div style={styles.divider}></div>
          </div>
      )}

      {/* --- Main Product Grid --- */}
      <div className="page-container" style={{padding: '0 5%'}}>
          <p style={styles.sectionLabel}>EXPLORE OUR MENU</p>
          <div className="product-grid" style={styles.productGrid}>
            {filteredProducts.map(item => (
              <div key={item._id} className="product-card" onClick={() => goToDetail(item)}>
                <div className="wishlist-btn" onClick={(e) => { e.stopPropagation(); toggleWishlist(item._id); }}>
                    {wishlist.includes(item._id) ? <FaHeart /> : <FaRegHeart />}
                </div>
                <div style={{position: 'relative', height: '220px', overflow: 'hidden'}}>
                  <img src={`http://localhost:5000/image/${item.image}`} alt={item.name} style={styles.productImage} />
                  <div style={styles.productFadeOverlay}></div>
                  <span className="price-badge" style={styles.priceBadge}>₹{item.price}</span>
                  <div style={styles.detailIcon}><FaInfoCircle /> Details</div>
                </div>
                <div style={styles.productInfo}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <h4 style={styles.productName}>{item.name}</h4>
                    <span style={styles.rating}><FaStar size={10}/> 4.8</span>
                  </div>
                  <p style={styles.productDesc}>{item.description?.substring(0, 60)}...</p>
                  <button className="add-to-plate-btn" style={styles.addButton} onClick={(e) => { e.stopPropagation(); addToCart(item); }}>ADD TO PLATE</button>
                </div>
              </div>
            ))}
          </div>
      </div>
      
      {filteredProducts.length === 0 && (
          <div style={{textAlign: 'center', color: '#666', marginTop: '80px', fontFamily: 'Marcellus', padding: '0 20px'}}>
            <p style={{fontSize: '24px', letterSpacing: '4px'}}>NO SELECTION FOUND</p>
          </div>
      )}
    </div>
  );
}

const styles = {
    pageContainer: { background: "#050505", minHeight: "100vh", fontFamily: "'Montserrat', sans-serif", color: "#e0e0e0", paddingBottom: "100px" },
    heroBanner: { position: 'relative', height: '420px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    heroImage: { width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' },
    heroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', textAlign: 'center' },
    heroTextContainer: { textAlign: 'center' },
    goldLine: { display: "block", width: "40px", height: "1px", background: "#f3cf7a", margin: "0 auto 20px auto", opacity: 0.6 },
    mainTitle: { fontFamily: "'Marcellus', serif", fontSize: "56px", color: "#f3cf7a", letterSpacing: "10px", textTransform: "uppercase", margin: 0 },
    subtitle: { fontSize: "11px", letterSpacing: "5px", textTransform: "uppercase", opacity: 0.6, marginTop: '10px' },
    breadcrumb: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '40px', background: 'rgba(255,255,255,0.03)', padding: '10px 25px', borderRadius: '2px', backdropFilter: 'blur(10px)', border: '1px solid rgba(243, 207, 122, 0.1)' },
    filterSection: { padding: '40px 5% 0 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'nowrap' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid #222', borderRadius: '4px', padding: '12px 15px' },
    searchInput: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '13px', width: '100%' },
    suggestionList: { position: 'absolute', top: '55px', left: 0, width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', zIndex: 100 },
    suggestionItem: { padding: '12px 15px', fontSize: '13px', color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' },
    chipContainer: { display: "flex", gap: "10px", overflowX: "auto", padding: "5px 0" },
    chip: { background: "transparent", border: "1px solid #222", color: "#555", padding: "10px 20px", fontSize: "10px", cursor: "pointer", letterSpacing: "2px", whiteSpace: 'nowrap', transition: '0.3s' },
    activeChip: { background: "#f3cf7a", border: "1px solid #f3cf7a", color: "#000", padding: "10px 20px", fontSize: "10px", fontWeight: "600", whiteSpace: 'nowrap' },
    sectionLabel: { fontSize: '10px', letterSpacing: '4px', color: '#f3cf7a', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '50px' },
    divider: { height: '1px', background: 'rgba(243, 207, 122, 0.1)', margin: '60px 0 40px 0' },
    productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "40px", animation: "slideUp 0.8s ease" },
    productImage: { width: "100%", height: "100%", objectFit: "cover", transition: '1.5s ease' },
    productFadeOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to top, #0f0f0f 0%, transparent 60%)" },
    priceBadge: { position: "absolute", bottom: "15px", right: "0", background: "#f3cf7a", color: "#000", padding: "6px 20px", fontSize: "16px", fontWeight: "bold", fontFamily: "'Marcellus', serif", zIndex: 2 },
    signatureTag: { position: 'absolute', top: '15px', left: '15px', background: '#f3cf7a', color: '#000', padding: '4px 12px', fontSize: '10px', fontWeight: '800', zIndex: 10, display: 'flex', alignItems: 'center', gap: '5px' },
    detailIcon: { position: 'absolute', top: '15px', right: '55px', color: '#fff', fontSize: '10px', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '20px', backdropFilter: 'blur(5px)' },
    productInfo: { padding: "25px" },
    productName: { fontFamily: "'Marcellus', serif", fontSize: "20px", color: "#fff", margin: 0 },
    rating: { color: "#f3cf7a", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" },
    productDesc: { fontSize: "13px", color: "#666", lineHeight: "1.7", margin: "15px 0 25px 0", height: '45px', overflow: 'hidden' },
    addButton: { width: "100%", background: "transparent", border: "1px solid #333", color: "#f3cf7a", padding: "14px", fontSize: "11px", letterSpacing: "3px", cursor: "pointer", transition: "0.4s", fontWeight: '600' }
};

export default Menu;