import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaChevronRight, FaHome, FaUtensils, FaStar, FaUsers, 
  FaAward, FaGem, FaBalanceScale, FaHeart, FaChevronLeft 
} from 'react-icons/fa';

function About() {
  const [chefs, setChefs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3); // Responsive items

  // --- Backend se Chefs fetch karna ---
  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chefs');
        setChefs(res.data);
      } catch (err) {
        console.error("Chefs loading error:", err);
      }
    };
    fetchChefs();

    // Resize listener for responsive slider
    const handleResize = () => {
      if (window.innerWidth < 600) setItemsToShow(1);
      else if (window.innerWidth < 992) setItemsToShow(2);
      else setItemsToShow(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Slider Logic ---
  const nextSlide = () => {
    if (chefs.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % chefs.length);
    }
  };

  const prevSlide = () => {
    if (chefs.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + chefs.length) % chefs.length);
    }
  };

  const getVisibleChefs = () => {
    if (chefs.length === 0) return [];
    let items = [];
    for (let i = 0; i < itemsToShow; i++) {
      items.push(chefs[(currentIndex + i) % chefs.length]);
    }
    return items;
  };

  return (
    <div style={styles.pageContainer}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');

        /* --- Chef Image Effect --- */
        .about-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.9);
          transition: 1.5s ease;
        }

        /* --- Luxury Counter Card Styling --- */
        .counter-card {
          padding: 40px 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(243, 207, 122, 0.1);
          border-radius: 4px;
          text-align: center;
          transition: 0.5s all ease;
          position: relative;
          overflow: hidden;
        }

        .counter-card:hover {
          background: rgba(243, 207, 122, 0.04);
          border-color: rgba(243, 207, 122, 0.4);
          transform: translateY(-10px);
        }

        /* --- PREMIUM PILLARS ANIMATION --- */
        .pillar-card {
          padding: 60px 30px;
          background: #0a0a0a;
          border: 1px solid rgba(243, 207, 122, 0.1);
          text-align: center;
          transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        .pillar-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 0;
          background: linear-gradient(to top, rgba(243, 207, 122, 0.05), transparent);
          transition: 0.6s;
          z-index: -1;
        }

        .pillar-card:hover {
          border-color: #f3cf7a;
          transform: translateY(-15px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }

        .pillar-card:hover::before { height: 100%; }

        .pillar-icon-box {
          width: 70px;
          height: 70px;
          margin: 0 auto 25px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(243, 207, 122, 0.3);
          transform: rotate(45deg);
          transition: 0.5s;
        }

        .pillar-card:hover .pillar-icon-box { background: #f3cf7a; transform: rotate(0deg); }
        .pillar-card:hover .pillar-icon { color: #000; transform: rotate(0deg); }

        .pillar-icon { transform: rotate(-45deg); color: #f3cf7a; transition: 0.5s; }

        /* --- Chef Section Styling --- */
        .chef-slide-card {
          flex: 1;
          background: #080808;
          border: 1px solid rgba(243, 207, 122, 0.05);
          padding: 20px;
          text-align: center;
          transition: 0.5s;
          min-width: 0;
        }

        .chef-slide-card:hover { border-color: #f3cf7a; transform: translateY(-5px); }

        .chef-img-wrapper {
          width: 100%;
          height: 320px;
          overflow: hidden;
          margin-bottom: 20px;
          border-radius: 2px;
        }

        .chef-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 1s ease;
        }

        .chef-slide-card:hover img { transform: scale(1.1); }
        .nav-button:hover { background: #f3cf7a !important; color: #000 !important; }

        /* --- Breadcrumb Style --- */
        .breadcrumb-link {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          transition: 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 2px;
        }
        .breadcrumb-link:hover { color: #f3cf7a; }

        /* --- ✅ RESPONSIVE MEDIA QUERIES --- */
        @media (max-width: 992px) {
          .section-grid { grid-template-columns: 1fr !important; padding: 60px 5% !important; text-align: center; }
          .text-block { padding-right: 0 !important; }
          .pillar-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .main-title { font-size: 40px !important; }
        }

        @media (max-width: 768px) {
          .counter-grid { grid-template-columns: 1fr 1fr !important; gap: 15px !important; }
          .pillar-grid { grid-template-columns: 1fr !important; }
          .chef-section { padding: 60px 5% !important; }
          .slider-wrapper { gap: 10px !important; }
        }

        @media (max-width: 480px) {
          .main-title { font-size: 32px !important; letter-spacing: 5px !important; }
          .counter-grid { grid-template-columns: 1fr !important; }
          .chef-img-wrapper { height: 250px !important; }
          .nav-btn-mobile { width: 40px !important; height: 40px !important; }
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <div style={styles.heroBanner}>
        <img src="/9a55dcc0af24ad05f76206bf8bb3363a.jpg" alt="Interior" style={styles.heroImage} />
        <div style={styles.heroOverlay}>
          <div style={styles.heroTextContainer}>
            <span style={styles.goldLine}></span>
            <h1 style={styles.mainTitle} className="main-title">Our Story</h1>
            <p style={styles.subtitle}>Crafting Culinary Masterpieces Since 2024</p>
          </div>
          <nav style={styles.breadcrumb}>
            <Link to="/" className="breadcrumb-link"><FaHome size={12}/> HOME</Link>
            <FaChevronRight size={8} color="rgba(243, 207, 122, 0.5)" />
            <span style={{color: "#f3cf7a", fontSize: '10px', letterSpacing: '2px', fontWeight: '600'}}>ABOUT US</span>
          </nav>
        </div>
      </div>

      {/* --- LEGACY SECTION --- */}
      <div className="section-grid" style={styles.sectionGrid}>
        <div className="text-block" style={styles.textBlock}>
          <h2 style={styles.sectionTitle}>The Archi Philosophy</h2>
          <p style={styles.description}>
            Archi is not just a restaurant; it’s an architectural journey through taste. 
            Born in the heart of the city, we believe that food should be as visually 
            stunning as it is delicious.
          </p>
          <p style={styles.description}>
            From the sizzle of the pan to the golden glow of our interiors, every detail 
            is curated to offer you an escape into a world of pure indulgence.
          </p>
        </div>
        <div style={styles.imageBlock}>
          <img src="/Gemini_Generated_Image_dvxdaldvxdaldvxd.png" alt="Chefs" className="about-image" style={{maxHeight: '400px', width:'100%', borderRadius:'4px'}} />
        </div>
      </div>

      {/* --- LUXURY COUNTER SECTION --- */}
      <div style={styles.counterSection}>
        <div className="counter-grid" style={styles.counterGrid}>
          <div className="counter-card">
            <div className="counter-icon-box"><FaUsers size={35} color="#f3cf7a"/></div>
            <h2 style={styles.counterNum}>15,000+</h2>
            <div style={styles.goldDivider}></div>
            <p style={styles.counterLabel}>Happy Guests</p>
          </div>
          <div className="counter-card">
            <div className="counter-icon-box"><FaUtensils size={35} color="#f3cf7a"/></div>
            <h2 style={styles.counterNum}>85+</h2>
            <div style={styles.goldDivider}></div>
            <p style={styles.counterLabel}>Exotic Dishes</p>
          </div>
          <div className="counter-card">
            <div className="counter-icon-box"><FaAward size={35} color="#f3cf7a"/></div>
            <h2 style={styles.counterNum}>12</h2>
            <div style={styles.goldDivider}></div>
            <p style={styles.counterLabel}>Culinary Awards</p>
          </div>
          <div className="counter-card">
            <div className="counter-icon-box"><FaStar size={35} color="#f3cf7a"/></div>
            <h2 style={styles.counterNum}>10</h2>
            <div style={styles.goldDivider}></div>
            <p style={styles.counterLabel}>Expert Chefs</p>
          </div>
        </div>
      </div>

      {/* --- PREMIUM PILLARS SECTION --- */}
      <div style={styles.pillarsSection}>
        <div style={styles.sectionHeader}>
            <span style={styles.goldLine}></span>
            <h2 style={styles.pillarMainTitle}>The Archi Pillars</h2>
            <p style={styles.pillarSubtitle}>Building Excellence with Passion and Precision</p>
        </div>

        <div className="pillar-grid" style={styles.pillarGrid}>
          <div className="pillar-card">
            <div className="pillar-icon-box">
                <FaGem className="pillar-icon" size={28} />
            </div>
            <h3 style={styles.pillarTitle}>Elegance</h3>
            <p style={styles.pillarText}>A dining atmosphere meticulously designed to satisfy the most refined palate and aesthetic senses.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">
                <FaBalanceScale className="pillar-icon" size={28} />
            </div>
            <h3 style={styles.pillarTitle}>Precision</h3>
            <p style={styles.pillarText}>Every secret recipe is a calculated balance of authentic spices, premium ingredients, and master timing.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">
                <FaHeart className="pillar-icon" size={28} />
            </div>
            <h3 style={styles.pillarTitle}>Passion</h3>
            <p style={styles.pillarText}>Every plate is served with soulful dedication by our world-class culinary architects and visionaries.</p>
          </div>
        </div>
      </div>

      {/* --- MEET OUR CHEFS SLIDER --- */}
      {chefs.length > 0 && (
        <div className="chef-section" style={styles.chefSection}>
           <div style={styles.sectionHeader}>
              <span style={styles.goldLine}></span>
              <h2 style={styles.pillarMainTitle}>Culinary Architects</h2>
              <p style={styles.pillarSubtitle}>Meet the visionaries behind the taste</p>
           </div>

           <div className="slider-wrapper" style={styles.sliderWrapper}>
              <button onClick={prevSlide} className="nav-button nav-btn-mobile" style={styles.sliderNavBtn}><FaChevronLeft/></button>
              
              <div style={{...styles.chefGridMain, gap: '20px'}}>
                {getVisibleChefs().map((chef, idx) => (
                  <div key={idx} className="chef-slide-card">
                    <div className="chef-img-wrapper">
                      <img src={`http://localhost:5000/image/${chef.image}`} alt={chef.name} />
                    </div>
                    <h4 style={styles.chefNameTitle}>{chef.name}</h4>
                    <p style={styles.chefRoleTitle}>{chef.role}</p>
                  </div>
                ))}
              </div>

              <button onClick={nextSlide} className="nav-button nav-btn-mobile" style={styles.sliderNavBtn}><FaChevronRight/></button>
           </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: { background: "#050505", color: "#e0e0e0", fontFamily: "'Montserrat', sans-serif", paddingBottom: "100px" },
  heroBanner: { position: 'relative', height: '420px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' },
  heroTextContainer: { textAlign: 'center' },
  goldLine: { display: "block", width: "40px", height: "1px", background: "#f3cf7a", margin: "0 auto 20px auto", opacity: 0.6 },
  mainTitle: { fontFamily: "'Marcellus', serif", fontSize: "56px", color: "#f3cf7a", letterSpacing: "10px", textTransform: "uppercase", margin: 0 },
  subtitle: { fontSize: "11px", letterSpacing: "5px", textTransform: "uppercase", opacity: 0.6, marginTop: '10px', textAlign: 'center' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '40px', background: 'rgba(255,255,255,0.03)', padding: '10px 25px', borderRadius: '2px', backdropFilter: 'blur(10px)', border: '1px solid rgba(243, 207, 122, 0.1)' },
  
  sectionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", padding: "100px 10%", alignItems: "center", background: '#070707' },
  textBlock: { paddingRight: '30px' },
  imageBlock: { display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '4px' },
  sectionTitle: { fontFamily: "'Marcellus', serif", fontSize: "32px", color: "#f3cf7a", marginBottom: "25px" },
  description: { fontSize: "15px", lineHeight: "1.8", marginBottom: "20px", color: "#b0b0b0", textAlign: 'justify' },

  counterSection: { padding: "100px 10%", background: "#050505" },
  counterGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "25px" },
  counterNum: { fontFamily: "'Marcellus', serif", fontSize: "42px", color: "#f3cf7a", margin: "10px 0" },
  goldDivider: { width: "30px", height: "2px", background: "#f3cf7a", margin: "15px auto", opacity: 0.5 },
  counterLabel: { fontSize: "10px", textTransform: "uppercase", letterSpacing: "3px", color: "#fff", fontWeight: "600" },

  pillarsSection: { padding: "100px 10%", background: '#0a0a0a' },
  sectionHeader: { textAlign: 'center', marginBottom: '60px', padding: '0 20px' },
  pillarMainTitle: { fontFamily: "'Marcellus', serif", fontSize: "42px", color: "#f3cf7a", letterSpacing: "5px", textTransform: "uppercase", margin: '0 0 10px 0' },
  pillarSubtitle: { fontSize: "12px", letterSpacing: "4px", color: "#888", textTransform: "uppercase" },
  pillarGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" },
  pillarTitle: { fontFamily: "'Marcellus', serif", fontSize: "24px", color: "#f3cf7a", marginBottom: "15px", letterSpacing: '2px' },
  pillarText: { fontSize: "14px", color: "#aaa", lineHeight: '1.7', fontWeight: '400' },

  chefSection: { padding: "80px 10%", background: "#050505", borderTop: "1px solid rgba(243,207,122,0.05)" },
  sliderWrapper: { display: "flex", alignItems: "center", gap: "20px" },
  chefGridMain: { display: "flex", justifyContent: "center", width: "100%", gap: "20px", overflow: 'hidden' },
  chefNameTitle: { fontFamily: "'Marcellus', serif", color: "#f3cf7a", fontSize: "20px", marginTop: "15px" },
  chefRoleTitle: { fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "2px", marginTop: "5px" },
  sliderNavBtn: { 
    background: "transparent", border: "1px solid #f3cf7a", color: "#f3cf7a", 
    width: "50px", height: "50px", borderRadius: "50%", cursor: "pointer", 
    display: "flex", alignItems: "center", justifyContent: "center", transition: "0.3s", flexShrink: 0
  }
};

export default About;