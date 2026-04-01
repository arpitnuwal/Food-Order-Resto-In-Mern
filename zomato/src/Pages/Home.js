import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useCart } from '../context/CartContext'; 
import { FaChevronDown, FaChevronUp, FaCrown, FaArrowRight, FaTag, FaClock, FaFire, FaQuoteLeft } from "react-icons/fa"; 

function Home() {
  const [categories, setCategories] = useState([]);
  const [signatureDishes, setSignatureDishes] = useState([]); 
  const [slides, setSlides] = useState([]); 
  const [flashDeals, setFlashDeals] = useState([]); 
  const [currentDealIdx, setCurrentDealIdx] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(0); 
  const [showAll, setShowAll] = useState(false); 
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const navigate = useNavigate(); 
  const restaurantId = "ArchiRestaurant";

  // --- 1. TIMER LOGIC (Active for current deal) ---
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  const formatTime = (totalSeconds) => {
    if (totalSeconds <= 0) return "OFFER ENDED";
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hrs = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const dDisplay = days > 0 ? `${days}d : ` : "";
    const hDisplay = hrs.toString().padStart(2, '0');
    const mDisplay = mins.toString().padStart(2, '0');
    const sDisplay = secs.toString().padStart(2, '0');
    return `${dDisplay}${hDisplay}h : ${mDisplay}m : ${sDisplay}s`;
  };

  // --- 2. DATA FETCHING ---
  const fetchData = async () => {
    try {
      const catRes = await axios.get(`http://localhost:5000/api/category/${restaurantId}`);
      setCategories(catRes.data);

      const prodRes = await axios.get(`http://localhost:5000/api/product/${restaurantId}`);
      setSignatureDishes([...prodRes.data].sort((a, b) => b.price - a.price).slice(0, 3));

      const slideRes = await axios.get(`http://localhost:5000/api/slider/${restaurantId}`);
      setSlides(slideRes.data);

      const dealRes = await axios.get(`http://localhost:5000/api/flash-deal/all/${restaurantId}`);
      if (dealRes.data && dealRes.data.length > 0) {
        const activeDeals = dealRes.data.filter(deal => new Date(deal.endTime) > new Date());
        setFlashDeals(activeDeals);
        if(activeDeals.length > 0) updateTimer(activeDeals[0]);
      }
    } catch (err) { console.error("Home Page Fetch Error:", err); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ 3. AUTO-EXPIRY REALTIME CHECK
  useEffect(() => {
    const expiryChecker = setInterval(() => {
      setFlashDeals(prevDeals => {
        const now = new Date();
        const validDeals = prevDeals.filter(deal => new Date(deal.endTime) > now);
        if (validDeals.length !== prevDeals.length) {
          if (currentDealIdx >= validDeals.length) setCurrentDealIdx(0);
          return validDeals;
        }
        return prevDeals;
      });
    }, 10000); 

    return () => clearInterval(expiryChecker);
  }, [currentDealIdx]);

  // --- 4. FLASH DEAL AUTO-SLIDER LOGIC ---
  useEffect(() => {
    if (flashDeals.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentDealIdx((prev) => {
        const nextIdx = (prev + 1) % flashDeals.length;
        updateTimer(flashDeals[nextIdx]);
        return nextIdx;
      });
    }, 6000); 
    return () => clearInterval(interval);
  }, [flashDeals]);

  const updateTimer = (deal) => {
    if (!deal) return;
    const end = new Date(deal.endTime).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((end - now) / 1000);
    setTimeLeft(diff > 0 ? diff : 0);
  };

  const handleFlashDealClick = (deal) => {
    if (deal && deal.product) {
      navigate(`/product/${deal.product._id}`, { 
        state: { product: deal.product, isFlashDeal: true, discount: deal.discountPercentage } 
      });
    }
  };

  // --- SLIDER AUTO-PLAY (Hero) ---
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const parentCategories = categories.filter(c => !c.parentCategory);
  const visibleCategories = showAll ? parentCategories : parentCategories.slice(0, 3);
  const goToMenu = (catId) => { navigate('/menu', { state: { selectedId: catId } }); };
  const handleProductClick = (dish) => { navigate(`/product/${dish._id}`, { state: { product: dish } }); };

  return (
    <div style={styles.pageContainer}>
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
          .slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 2s ease-in-out; object-fit: cover; filter: brightness(0.5); }
          .slide.active { opacity: 1; z-index: 1; }
          .hero-text { transform: translateY(30px); transition: 1.5s ease; opacity: 0; }
          .active .hero-text { transform: translateY(0); opacity: 1; }
          .category-card { position: relative; height: 260px; background: #0a0a0a; overflow: hidden; cursor: pointer; transition: 0.7s; border: 1px solid rgba(243, 207, 122, 0.1); }
          .category-card:hover { transform: translateY(-8px); border: 1px solid rgba(243, 207, 122, 0.5); }
          .category-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.4; transition: 1.5s; }
          .category-card:hover img { transform: scale(1.1); opacity: 0.2; }
          .card-content { position: absolute; bottom: 0; left: 0; width: 100%; padding: 20px; text-align: center; background: linear-gradient(to top, #050505, transparent); z-index: 2; }
          .btn-luxury { margin-top: 20px; padding: 14px 45px; background: transparent; border: 1px solid #f3cf7a; color: #f3cf7a; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: 0.4s; display: inline-flex; align-items: center; gap: 12px; font-family: 'Montserrat', sans-serif; font-weight: 600; }
          .btn-luxury:hover { background: #f3cf7a; color: #000; transform: scale(1.05); }
          .grid-layout { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
          .sig-layout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
          .deal-fade-enter { opacity: 0; transform: scale(0.98); transition: 1s ease; }
          .deal-fade-active { opacity: 1; transform: scale(1); }
          .experience-img { transition: 2s ease; filter: grayscale(50%); }
          .experience-card:hover .experience-img { transform: scale(1.05); filter: grayscale(0%); }
          .testimonial-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(243, 207, 122, 0.1); padding: 40px; text-align: center; transition: 0.5s; }
          .testimonial-card:hover { border-color: #f3cf7a; background: rgba(243, 207, 122, 0.05); }
          @media (max-width: 1024px) { .grid-layout { grid-template-columns: repeat(2, 1fr); } .sig-layout { grid-template-columns: repeat(2, 1fr); } .deal-flex { flex-direction: column-reverse !important; padding: 30px !important; } .deal-img-box { height: 280px !important; width: 100% !important; } .experience-flex { flex-direction: column !important; } }
          @media (max-width: 600px) { .grid-layout { grid-template-columns: repeat(1, 1fr); } .sig-layout { grid-template-columns: repeat(1, 1fr); } }
      `}</style>
      
      {/* 1. HERO SLIDER */}
      <div style={styles.sliderContainer}>
        {slides.length > 0 ? (
          slides.map((slide, index) => (
            <div key={index} className={index === currentSlide ? "active" : ""}>
              <img src={`http://localhost:5000/image/${slide.image}`} className={`slide ${index === currentSlide ? "active" : ""}`} alt="" />
              <div style={styles.heroOverlay}></div>
              <div style={{ ...styles.heroContent, zIndex: 10, display: index === currentSlide ? 'block' : 'none' }}>
                  <div className="hero-text">
                    <span style={styles.goldLine}></span>
                    <h1 style={styles.heroTitle}>{slide.title}</h1>
                    <p style={styles.heroSubtitle}>{slide.subtitle}</p>
                  </div>
              </div>
            </div>
          ))
        ) : <div style={styles.loader}>INITIALIZING ARCHI LUXURY...</div>}
      </div>

      {/* 2. FLASH DEAL SECTION */}
      {flashDeals.length > 0 && flashDeals[currentDealIdx]?.product && (
        <div style={styles.sectionContainer}>
          <div key={flashDeals[currentDealIdx]._id} style={styles.dealBanner} className="deal-flex deal-fade-active">
            <div style={{ flex: 1.2 }}>
              <p style={styles.preTitle}><FaFire color="#ff4d4d" /> Burning offer</p>
              <h2 style={{ fontFamily: 'Marcellus', fontSize: '42px', color: '#fff', margin: '10px 0' }}>Exclusive Deal</h2>
              <h4 style={{ fontSize: '24px', color: '#f3cf7a', marginBottom: '20px', letterSpacing: '1px' }}>{flashDeals[currentDealIdx].product.name}</h4>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '25px 0' }}>
                <span style={{ fontSize: '42px', color: '#fff', fontWeight: 'bold' }}>
                  ₹{Math.floor(flashDeals[currentDealIdx].product.price * (1 - flashDeals[currentDealIdx].discountPercentage / 100))}
                </span>
                <span style={{ fontSize: '20px', color: '#555', textDecoration: 'line-through' }}>₹{flashDeals[currentDealIdx].product.price}</span>
                <span style={styles.discountTag}>{flashDeals[currentDealIdx].discountPercentage}% OFF</span>
              </div>
              
              <div style={styles.timerBox}>
                <FaClock style={{marginRight: '12px', fontSize: '18px', color: '#ff4d4d'}} /> 
                <span style={{letterSpacing: '2px', fontWeight: '600'}}>{formatTime(timeLeft)}</span>
              </div>
              
              <button className="btn-luxury" onClick={() => handleFlashDealClick(flashDeals[currentDealIdx])}>
                Claim Offer <FaArrowRight size={10} />
              </button>

              {flashDeals.length > 1 && (
                <div style={{display: 'flex', gap: '8px', marginTop: '30px'}}>
                   {flashDeals.map((_, i) => (
                     <div key={i} style={{width: i === currentDealIdx ? '30px' : '8px', height: '4px', background: i === currentDealIdx ? '#f3cf7a' : '#333', transition: '0.4s', borderRadius: '2px'}}></div>
                   ))}
                </div>
              )}
            </div>

            <div className="deal-img-box" style={{ flex: 1, height: '400px', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <img src={`http://localhost:5000/image/${flashDeals[currentDealIdx].product.image}`} alt="Deal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      )}

      {/* ⭐ NEW: EXPERIENCE SECTION */}
      <div style={styles.sectionContainer}>
          <div style={styles.experienceWrapper} className="experience-flex">
              <div style={{ flex: 1, padding: '20px' }} className="experience-card">
                  <div style={{ overflow: 'hidden', borderRadius: '4px', height: '500px' }}>
                    <img 
                      src="/The-KiTin-Chinese-Restaurant-08.png" 
                      alt="Ambiance" 
                      className="experience-img" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
              </div>
              <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={styles.preTitle}>Since 2024</p>
                  <h2 style={{ ...styles.sectionTitle, fontSize: '48px', marginBottom: '25px', textAlign: 'left' }}>The Art of Fine Dining</h2>
                  <p style={{ color: '#888', lineHeight: '1.8', fontSize: '15px', marginBottom: '30px', textAlign: 'left' }}>
                    At Archi, we believe every plate is a blueprint of passion. Our chefs are culinary architects, 
                    designing flavors that resonate with the soul. We don't just serve meals; we construct memories.
                  </p>
                  <button className="btn-luxury" style={{width: 'fit-content'}} onClick={() => navigate('/about')}>Discover Our Story</button>
              </div>
          </div>
      </div>

      {/* 3. CATEGORIES SECTION */}
      <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <p style={styles.preTitle}>Signature Selection</p>
            <h3 style={styles.sectionTitle}>Curated Collections</h3>
          </div>
          <div className="grid-layout">
            <div onClick={() => goToMenu("All")} className="category-card">
                <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800" alt="All" />
                <div className="card-content"><h4 style={styles.cardTitle}>Full Menu</h4><div style={styles.goldDot}></div></div>
            </div>
            {visibleCategories.map(cat => (
              <div key={cat._id} onClick={() => goToMenu(cat._id)} className="category-card">
                  <img src={`http://localhost:5000/image/${cat.image}`} alt={cat.name} />
                  <div className="card-content"><h4 style={styles.cardTitle}>{cat.name}</h4><div style={styles.goldDot}></div></div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
             <button className="btn-luxury" onClick={() => setShowAll(!showAll)}>
                {showAll ? <><FaChevronUp /> Show Less</> : <><FaChevronDown /> View All Categories</>}
             </button>
          </div>
      </div>

      {/* ⭐ NEW: TESTIMONIALS SECTION */}
      <div style={{ ...styles.sectionContainer, background: '#080808', padding: '80px 8%', margin: '80px 0' }}>
          <div style={styles.sectionHeader}>
            <p style={styles.preTitle}>Our Patronage</p>
            <h3 style={styles.sectionTitle}>Elite Guest Reviews</h3>
          </div>
          <div className="sig-layout" style={{ gap: '20px' }}>
              <div className="testimonial-card">
                  <FaQuoteLeft color="#f3cf7a" size={24} style={{ marginBottom: '20px' }} />
                  <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '20px' }}>"The architecture of the flavors was unlike anything I've tasted. Pure luxury."</p>
                  <h5 style={{ color: '#f3cf7a', letterSpacing: '2px' }}>- ARJUN SHARMA</h5>
              </div>
              <div className="testimonial-card">
                  <FaQuoteLeft color="#f3cf7a" size={24} style={{ marginBottom: '20px' }} />
                  <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '20px' }}>"Every detail, from the gold-themed decor to the plating, screams elegance."</p>
                  <h5 style={{ color: '#f3cf7a', letterSpacing: '2px' }}>- PRIYA VERMA</h5>
              </div>
              <div className="testimonial-card">
                  <FaQuoteLeft color="#f3cf7a" size={24} style={{ marginBottom: '20px' }} />
                  <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '20px' }}>"Archi has set a new standard for multi-cuisine dining. Simply world-class."</p>
                  <h5 style={{ color: '#f3cf7a', letterSpacing: '2px' }}>- RAHUL MEHTA</h5>
              </div>
          </div>
      </div>

      {/* 4. SIGNATURE DISHES */}
      <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <p style={styles.preTitle}>Handcrafted</p>
            <h3 style={styles.sectionTitle}>Chef's Signature</h3>
          </div>
          <div className="sig-layout">
            {signatureDishes.map((dish) => (
                <div key={dish._id} className="category-card" style={{height: '420px'}} onClick={() => handleProductClick(dish)}>
                  <div style={styles.signatureBadge}><FaCrown /> SIGNATURE</div>
                  <img src={`http://localhost:5000/image/${dish.image}`} alt={dish.name} />
                  <div className="card-content">
                    <h4 style={styles.cardTitle}>{dish.name}</h4>
                    <p style={{color: '#f3cf7a', fontSize: '18px', marginTop: '10px', fontWeight: 'bold'}}>₹{dish.price}</p>
                    <div style={{...styles.goldDot, marginBottom: '15px'}}></div>
                    <span style={{fontSize: '10px', color: '#888', letterSpacing: '2px'}}>VIEW DETAILS</span>
                  </div>
                </div>
              ))}
          </div>
      </div>

      {/* ⭐ NEW: RESERVATION BANNER */}
      <div style={styles.reservationBanner}>
          <div style={styles.bannerOverlay}></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontFamily: 'Marcellus', fontSize: '42px', color: '#f3cf7a' }}>Ready for a Culinary Journey?</h2>
            <p style={{ letterSpacing: '4px', marginTop: '10px', color: '#fff', textTransform: 'uppercase' }}>Reserve your private table today</p>
            <button className="btn-luxury" style={{ marginTop: '40px' }} onClick={() => navigate('/booktable')}>Book My Table</button>
          </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { background: "#050505", minHeight: "100vh", color: "#e0e0e0", overflowX: 'hidden' },
  sliderContainer: { position: "relative", width: "100%", height: "85vh", overflow: "hidden", marginBottom: "80px" },
  heroOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, #050505 100%)" },
  heroContent: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "80%" },
  goldLine: { display: "block", width: "60px", height: "2px", background: "#f3cf7a", margin: "0 auto 25px auto" },
  heroTitle: { fontFamily: "'Marcellus', serif", fontSize: "64px", color: "#f3cf7a", margin: "0", letterSpacing: "2px" },
  heroSubtitle: { fontSize: "13px", color: "#fff", letterSpacing: "8px", textTransform: "uppercase", marginTop: '10px' },
  sectionContainer: { padding: "0 8%", maxWidth: "1400px", margin: "0 auto 100px auto" },
  sectionHeader: { marginBottom: "50px", textAlign: "center" },
  preTitle: { fontSize: "10px", letterSpacing: "5px", color: "#f3cf7a", textTransform: "uppercase", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  sectionTitle: { fontFamily: "'Marcellus', serif", fontSize: "36px", color: "#fff", textAlign: 'center' },
  cardTitle: { fontFamily: "'Marcellus', serif", fontSize: "18px", color: "#f3cf7a" },
  goldDot: { width: "4px", height: "4px", background: "#f3cf7a", borderRadius: "50%", margin: "10px auto 0 auto" },
  loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#f3cf7a', letterSpacing: '4px', fontSize: '12px' },
  dealBanner: { background: 'linear-gradient(135deg, #0a0a0a, #151515)', padding: '60px', border: '1px solid rgba(243,207,122,0.15)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '50px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' },
  discountTag: { background: '#f3cf7a', color: '#000', padding: '6px 15px', borderRadius: '50px', fontSize: '13px', fontWeight: '800' },
  timerBox: { background: 'rgba(255, 255, 255, 0.03)', color: '#fff', padding: '15px 35px', borderRadius: '12px', width: 'fit-content', fontFamily: "'Montserrat', sans-serif", fontSize: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', backdropFilter: 'blur(10px)' },
  signatureBadge: { position: "absolute", top: "20px", right: "20px", background: "#f3cf7a", color: "#000", padding: "5px 12px", fontSize: "10px", fontWeight: "700", zIndex: 3 },
  experienceWrapper: { display: 'flex', alignItems: 'center', background: '#0a0a0a', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(243, 207, 122, 0.05)' },
  reservationBanner: { height: '450px', backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' },
  bannerOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 1 }
};

export default Home;