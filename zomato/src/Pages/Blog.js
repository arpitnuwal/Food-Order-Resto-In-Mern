import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaChevronRight, FaArrowRight } from 'react-icons/fa';

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/blogs").then(res => setBlogs(res.data));
    }, []);

    const handleReadMore = (blog) => {
        navigate(`/blog/${blog._id}`, { state: { blog } });
    };

    return (
        <div style={styles.pageContainer}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
                
                .breadcrumb-link { color: rgba(255, 255, 255, 0.5); text-decoration: none; transition: 0.3s; display: flex; align-items: center; gap: 8px; font-size: 10px; letter-spacing: 2px; }
                .breadcrumb-link:hover { color: #f3cf7a; }
                
                .blog-card { 
                    transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
                    border: 1px solid rgba(243, 207, 122, 0.1); 
                    cursor: pointer; 
                    background: #080808; 
                    display: flex; 
                    flex-direction: column;
                    position: relative;
                }
                .blog-card:hover { 
                    transform: translateY(-10px); 
                    border-color: #f3cf7a !important; 
                    box-shadow: 0 15px 40px rgba(0,0,0,0.5);
                }
                .blog-card:hover img { 
                    transform: scale(1.1); 
                    opacity: 1 !important; 
                }
                
                .read-btn { 
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: transparent; 
                    border: none; 
                    color: #f3cf7a; 
                    cursor: pointer; 
                    font-weight: 600; 
                    letter-spacing: 2px; 
                    font-size: 11px; 
                    margin-top: auto; 
                    padding: 0;
                    text-transform: uppercase; 
                    transition: 0.3s;
                }
                .read-btn:hover { color: #fff; gap: 15px; }

                /* --- ✅ RESPONSIVE MEDIA QUERIES --- */
                @media (max-width: 992px) {
                  .main-title { font-size: 42px !important; letter-spacing: 6px !important; }
                  .blog-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important; gap: 30px !important; }
                }

                @media (max-width: 768px) {
                  .hero-banner { height: 350px !important; }
                  .content-wrapper { padding: 60px 5% !important; }
                }

                @media (max-width: 480px) {
                  .main-title { font-size: 28px !important; }
                  .blog-img-container { height: 200px !important; }
                }
            `}</style>

            {/* --- HERO SECTION --- */}
            <div className="hero-banner" style={styles.heroBanner}>
                <img src="/9a55dcc0af24ad05f76206bf8bb3363a.jpg" alt="Blog BG" style={styles.heroImage} />
                <div style={styles.heroOverlay}>
                    <div style={styles.heroTextContainer}>
                        <span style={styles.goldLine}></span>
                        <h1 className="main-title" style={styles.mainTitle}>Archi Stories</h1>
                        <p style={styles.subtitle}>A GLIMPSE INTO THE WORLD OF FINE DINING</p>
                    </div>
                    <nav style={styles.breadcrumb}>
                        <Link to="/" className="breadcrumb-link"><FaHome size={12}/> HOME</Link>
                        <FaChevronRight size={8} color="rgba(243, 207, 122, 0.5)" />
                        <span style={{color: "#f3cf7a", fontSize: '10px', letterSpacing: '2px', fontWeight: '600'}}>OUR BLOG</span>
                    </nav>
                </div>
            </div>

            {/* --- BLOG GRID SECTION --- */}
            <div className="content-wrapper" style={styles.contentWrapper}>
                <div className="blog-grid" style={styles.blogGrid}>
                    {blogs.map(blog => (
                        <div key={blog._id} className="blog-card" onClick={() => handleReadMore(blog)}>
                            <div className="blog-img-container" style={{ overflow: 'hidden', height: '280px', position: 'relative' }}>
                                <img src={`http://localhost:5000/image/${blog.image}`} style={styles.blogImg} alt={blog.title} />
                                <div style={styles.dateBadge}>
                                    <span style={{fontSize: '18px', fontWeight: '700'}}>{new Date(blog.createdAt).getDate()}</span>
                                    <span style={{fontSize: '9px', opacity: 0.8}}>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                                </div>
                            </div>
                            <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={styles.blogTitle}>{blog.title}</h3>
                                <p style={styles.blogContent}>{blog.content.substring(0, 100)}...</p>
                                <button className="read-btn" onClick={(e) => { e.stopPropagation(); handleReadMore(blog); }}>
                                    READ FULL STORY <FaArrowRight size={10} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {blogs.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#444' }}>
                        <p style={{ letterSpacing: '3px', fontFamily: 'Marcellus' }}>PRESENTING STORIES SOON...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    pageContainer: { background: '#050505', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" },
    heroBanner: { position: 'relative', height: '420px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    heroImage: { width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' },
    heroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', textAlign: 'center' },
    heroTextContainer: { textAlign: 'center' },
    goldLine: { display: "block", width: "40px", height: "1px", background: "#f3cf7a", margin: "0 auto 20px auto", opacity: 0.6 },
    mainTitle: { fontFamily: "'Marcellus', serif", fontSize: "56px", color: "#f3cf7a", letterSpacing: "10px", textTransform: "uppercase", margin: 0 },
    subtitle: { fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", opacity: 0.6, marginTop: '15px', color: '#fff' },
    breadcrumb: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '40px', background: 'rgba(255,255,255,0.03)', padding: '10px 25px', borderRadius: '2px', backdropFilter: 'blur(10px)', border: '1px solid rgba(243, 207, 122, 0.1)' },
    contentWrapper: { padding: '80px 10%' },
    blogGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '50px 30px' },
    blogImg: { width: '100%', height: '100%', objectFit: 'cover', opacity: '0.8', transition: '1.5s cubic-bezier(0.4, 0, 0.2, 1)' },
    dateBadge: { position: 'absolute', bottom: '20px', left: '20px', background: '#f3cf7a', color: '#000', width: '50px', height: '55px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '3px solid #fff' },
    blogTitle: { color: '#fff', fontFamily: 'Marcellus', fontSize: '20px', margin: '0 0 15px 0', letterSpacing: '1px', lineHeight: '1.4' },
    blogContent: { color: '#666', fontSize: '13px', lineHeight: '1.8', textAlign: 'left', marginBottom: '25px' },
};

export default Blog;