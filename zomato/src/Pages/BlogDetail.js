import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaHome, FaChevronRight, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';

function BlogDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { blog } = location.state || {};

    // Scroll top par le jane ke liye jab page khule
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!blog) return <div style={{background:'#050505', height:'100vh', color:'#fff', textAlign:'center', paddingTop:'100px'}}>Story data not available!</div>;

    return (
        <div style={styles.pageContainer}>
            <style>{`
                .breadcrumb-link { color: rgba(255, 255, 255, 0.5); text-decoration: none; transition: 0.3s; display: flex; align-items: center; gap: 8px; font-size: 10px; letter-spacing: 2px; }
                .breadcrumb-link:hover { color: #f3cf7a; }
                .back-btn:hover { color: #fff !important; transform: translateX(-5px); }
            `}</style>

            {/* --- HERO SECTION --- */}
            <div style={styles.heroBanner}>
                <img src={`http://localhost:5000/image/${blog.image}`} alt={blog.title} style={styles.heroImage} />
                <div style={styles.heroOverlay}>
                    <div style={styles.heroTextContainer}>
                        <span style={styles.goldLine}></span>
                        <h1 style={styles.mainTitle}>{blog.title}</h1>
                        <p style={styles.subtitle}>Insights from the Heart of our Kitchen</p>
                    </div>
                    <nav style={styles.breadcrumb}>
                        <Link to="/" className="breadcrumb-link"><FaHome size={12}/> HOME</Link>
                        <FaChevronRight size={8} color="rgba(243, 207, 122, 0.5)" />
                        <Link to="/blog" className="breadcrumb-link">OUR BLOG</Link>
                        <FaChevronRight size={8} color="rgba(243, 207, 122, 0.5)" />
                        <span style={{color: "#f3cf7a", fontSize: '10px', letterSpacing: '2px', fontWeight: '600'}}>STORY DETAIL</span>
                    </nav>
                </div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div style={styles.contentWrapper}>
                <button onClick={() => navigate(-1)} className="back-btn" style={styles.backBtn}>
                    <FaArrowLeft /> BACK TO BLOG
                </button>

                <div style={styles.articleBody}>
                    <div style={styles.metaInfo}>
                        <FaCalendarAlt color="#f3cf7a" />
                        <span>{new Date(blog.createdAt).toDateString().toUpperCase()}</span>
                    </div>
                    
                    <h2 style={styles.blogHeading}>{blog.title}</h2>
                    
                    {/* ✅ Full Paragraph Display */}
                    <p style={styles.fullContent}>
                        {blog.content}
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: { background: '#050505', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif", color: '#fff' },
    heroBanner: { position: 'relative', height: '450px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    heroImage: { width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' },
    heroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    heroTextContainer: { textAlign: 'center', padding: '0 10%' },
    goldLine: { display: "block", width: "40px", height: "1px", background: "#f3cf7a", margin: "0 auto 20px auto", opacity: 0.6 },
    mainTitle: { fontFamily: "'Marcellus', serif", fontSize: "48px", color: "#f3cf7a", letterSpacing: "5px", textTransform: "uppercase", margin: 0 },
    subtitle: { fontSize: "11px", letterSpacing: "5px", textTransform: "uppercase", opacity: 0.6, marginTop: '10px', color: '#fff' },
    breadcrumb: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '40px', background: 'rgba(255,255,255,0.03)', padding: '10px 25px', borderRadius: '2px', border: '1px solid rgba(243, 207, 122, 0.1)' },
    
    contentWrapper: { maxWidth: '900px', margin: '0 auto', padding: '60px 5%' },
    backBtn: { background: 'transparent', border: 'none', color: '#f3cf7a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', letterSpacing: '2px', transition: '0.3s', marginBottom: '40px' },
    metaInfo: { display: 'flex', alignItems: 'center', gap: '10px', color: '#888', fontSize: '12px', marginBottom: '20px' },
    blogHeading: { fontFamily: "'Marcellus', serif", fontSize: '36px', color: '#fff', marginBottom: '30px', borderBottom: '1px solid rgba(243,207,122,0.1)', paddingBottom: '20px' },
    fullContent: { fontSize: '18px', lineHeight: '1.8', color: '#ccc', textAlign: 'justify', whiteSpace: 'pre-line' }
};

export default BlogDetail;