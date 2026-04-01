import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag, FaUser, FaSignOutAlt, FaUserCircle, 
  FaKey, FaUserPlus, FaHistory, FaHeart, FaChair, FaCalendarAlt,
  FaGlassCheers, FaBars, FaTimes, FaExclamationTriangle 
} from 'react-icons/fa'; 
import { useCart } from '../context/CartContext'; 

function Header() {
  const { cartCount } = useCart(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ Logout Popup State
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Open Premium Modal
  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setShowLogoutModal(true); 
  };

  // ✅ Final Logout Logic
  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600;700&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { overflow-x: hidden; background: #000; width: 100%; }

          :root {
            --pure-gold: #f3cf7a;
            --deep-gold: #c9a055;
            --aura: rgba(243, 207, 122, 0.3);
          }

          .navbar {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 110px;
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 80px;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(25px);
            z-index: 99999;
            border-bottom: 1px solid rgba(243, 207, 122, 0.1);
            transition: 0.4s ease;
          }

          .brand-box { display: flex; align-items: center; gap: 20px; text-decoration: none; z-index: 100001; }
          .core-logo { position: relative; width: 45px; height: 45px; display: flex; justify-content: center; align-items: center; }
          .halo { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 1px solid var(--aura); box-shadow: 0 0 20px var(--aura); animation: rotateHalo 8s infinite linear; }
          .pyramid { width: 18px; height: 18px; background: var(--pure-gold); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation: float 3s infinite ease-in-out; }
          .brand-text { font-family: 'Marcellus', serif; font-size: 32px; color: var(--pure-gold); letter-spacing: 8px; text-transform: uppercase; }

          @keyframes rotateHalo { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(180deg); } }

          /* Desktop Menu */
          .nav-right { display: flex; align-items: center; }
          .nav-list { display: flex; gap: 35px; list-style: none; align-items: center; }

          .nav-link {
            font-family: 'Montserrat', sans-serif; 
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none; font-size: 10px; font-weight: 600; letter-spacing: 2px;
            text-transform: uppercase; transition: 0.3s;
          }
          .nav-link:hover { color: var(--pure-gold); text-shadow: 0 0 10px var(--aura); }

          .elite-res-btn {
            position: relative;
            padding: 14px 30px;
            background: linear-gradient(145deg, var(--deep-gold), var(--pure-gold));
            color: #000; text-decoration: none; font-family: 'Montserrat', sans-serif;
            font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
            border-radius: 2px; overflow: hidden; transition: 0.5s; display: flex; align-items: center; gap: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          }

          .icon-container { position: relative; display: flex; align-items: center; cursor: pointer; transition: 0.3s; }
          .cart-badge {
            position: absolute; top: -8px; right: -10px;
            background: #fff; color: #000; font-size: 10px; font-weight: 800;
            width: 18px; height: 18px; border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
          }

          /* User Dropdown */
          .dropdown-box {
            position: absolute; top: 55px; right: 0; width: 230px;
            background: rgba(10, 10, 10, 0.98); border: 1px solid rgba(243, 207, 122, 0.2);
            border-radius: 12px; backdrop-filter: blur(25px); padding: 15px 0;
            box-shadow: 0 15px 40px rgba(0,0,0,0.8); z-index: 100000;
          }

          .dropdown-item {
            display: flex; align-items: center; gap: 15px; padding: 12px 25px;
            color: rgba(255, 255, 255, 0.7); text-decoration: none;
            font-family: 'Montserrat', sans-serif; font-size: 11px; text-transform: uppercase; transition: 0.3s;
          }
          .dropdown-item:hover { background: rgba(243, 207, 122, 0.05); color: var(--pure-gold); padding-left: 30px; }

          /* Mobile Elements */
          .hamburger { display: none; color: var(--pure-gold); font-size: 26px; cursor: pointer; z-index: 100001; }
          .mobile-cart { display: none; }

          /* --- ✅ PREMIUM MODAL STYLES --- */
          .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.92); backdrop-filter: blur(12px);
            display: flex; align-items: center; justify-content: center;
            z-index: 999999; animation: fadeIn 0.3s ease;
          }
          .premium-popup {
            background: #0d0d0d; border: 1px solid rgba(243, 207, 122, 0.2);
            padding: 45px 40px; border-radius: 24px; width: 400px;
            text-align: center; box-shadow: 0 0 60px rgba(0,0,0,1);
            animation: scaleUp 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67);
          }
          .modal-btn-stay { 
            flex: 1; padding: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); 
            color: #fff; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; letter-spacing: 1px;
          }
          .modal-btn-stay:hover { border-color: var(--pure-gold); color: var(--pure-gold); background: rgba(255,255,255,0.1); }
          
          .modal-btn-logout { 
            flex: 1; padding: 16px; background: #ff4d4d; border: none; 
            color: #fff; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; letter-spacing: 1px;
          }
          .modal-btn-logout:hover { background: #cc0000; transform: translateY(-2px); }

          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

          /* Responsive Logic */
          @media (max-width: 1250px) {
            .navbar { padding: 0 40px; }
            .nav-list { gap: 20px; }
            .brand-text { font-size: 26px; letter-spacing: 5px; }
          }

          @media (max-width: 1100px) {
            .hamburger { display: block; }
            .nav-list { display: none; } 
            .navbar { height: 90px; }
            .mobile-cart { display: flex; margin-right: 20px; }
            .brand-text { font-size: 22px; letter-spacing: 4px; }
            .core-logo { width: 35px; height: 35px; }
            .premium-popup { width: 85%; padding: 35px 25px; }
          }

          /* Mobile Menu Drawer */
          .mobile-menu {
            position: fixed; top: 0; right: ${isMobileMenuOpen ? '0' : '-100%'};
            width: 80%; max-width: 400px; height: 100vh;
            background: #0a0a0a; border-left: 1px solid var(--aura);
            transition: 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0);
            z-index: 100000; padding: 120px 40px 40px;
            display: flex; flex-direction: column; gap: 25px;
            box-shadow: -10px 0 30px rgba(0,0,0,0.5);
          }

          .mobile-link {
            font-family: 'Marcellus', serif; color: #fff; text-decoration: none;
            font-size: 20px; letter-spacing: 3px; text-transform: uppercase; transition: 0.3s;
          }
          .mobile-link:hover { color: var(--pure-gold); padding-left: 10px; }

          /* ✅ MOBILE CLOSE BUTTON STYLES */
          .mobile-close-btn {
            position: absolute; top: 30px; right: 30px;
            color: var(--pure-gold); font-size: 28px;
            cursor: pointer; background: transparent; border: none;
            display: flex; align-items: center; justify-content: center;
          }

          .nav-spacer { height: 110px; }
          @media (max-width: 900px) { .nav-spacer { height: 90px; } }
        `}
      </style>

      {/* --- ✅ PREMIUM LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="premium-popup">
            <div style={{ background: 'rgba(243, 207, 122, 0.05)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '1px solid rgba(243, 207, 122, 0.2)' }}>
              <FaExclamationTriangle size={30} color="var(--pure-gold)" />
            </div>
            <h2 style={{fontFamily: 'Marcellus', color: 'var(--pure-gold)', fontSize: '26px', marginBottom: '12px'}}>Sign Out?</h2>
            <p style={{color: '#aaa', fontSize: '14px', marginBottom: '35px', lineHeight: '1.6', fontWeight: '300'}}>Bhai, are you sure you want to end your elite culinary session at Archi?</p>
            
            <div style={{display: 'flex', gap: '15px'}}>
              <button onClick={() => setShowLogoutModal(false)} className="modal-btn-stay">NO, STAY</button>
              <button onClick={confirmLogout} className="modal-btn-logout">YES, LOGOUT</button>
            </div>
          </div>
        </div>
      )}

      <nav className="navbar">
        <Link to="/" className="brand-box">
          <div className="core-logo">
            <div className="halo"></div>
            <div className="pyramid"></div>
          </div>
          <span className="brand-text">Archi</span>
        </Link>

        {/* Desktop & Tablet Icons/Links */}
        <div className="nav-right">
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/about" className="nav-link">About</Link></li>
            <li><Link to="/menu" className="nav-link">Menu</Link></li>
            <li><Link to="/blog" className="nav-link">Blog</Link></li>
            <li><Link to="/services" className="nav-link">Service</Link></li>
            <li><Link to="/privateevent" className="nav-link">Elite Events</Link></li>

            <li>
              <Link to="/booktable" className="elite-res-btn">
                <FaCalendarAlt size={13} /> Reserve
              </Link>
            </li>
            
            <li>
              <Link to="/cart" className="icon-container">
                <FaShoppingBag color="var(--pure-gold)" size={18} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </li>

            <li className="user-menu-wrapper" ref={dropdownRef} style={{position: 'relative'}}>
              <div className="icon-container" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <FaUser color="var(--pure-gold)" size={18} />
              </div>

              {isDropdownOpen && (
                <div className="dropdown-box">
                  {user ? (
                    <>
                      <div style={{padding: '5px 25px 15px 25px'}}>
                        <p style={{color: '#888', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase'}}>Elite Member</p>
                        <p style={{color: 'var(--pure-gold)', fontSize: '13px', fontFamily: 'Marcellus', marginTop: '4px'}}>{user.name}</p>
                      </div>
                      <Link to="/userprofile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                      <Link to="/myorder" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Orders</Link>
                      <Link to="/booktable" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Bookings</Link>
                      <Link to="/wishlist" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Wishlist</Link>
                      <div className="dropdown-item" onClick={handleLogoutClick} style={{color: '#ff4d4d', cursor: 'pointer'}}>Logout</div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Login</Link>
                      <Link to="/register" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Register</Link>
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>

          {/* Mobile Right Side (Cart + Hamburger) */}
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Link to="/cart" className="icon-container mobile-cart">
              <FaShoppingBag color="var(--pure-gold)" size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <div className="mobile-menu">
        {/* ✅ MOBILE CLOSE BUTTON (X) */}
        <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
           <FaTimes />
        </button>

        <Link to="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
        <Link to="/menu" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
        <Link to="/privateevent" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Elite Events</Link>
        <Link to="/booktable" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Reserve Table</Link>
        <Link to="/about" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
        <Link to="/services" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
        <Link to="/blog" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
        
        <div style={{height: '1px', background: 'var(--aura)', margin: '10px 0'}}></div>
        
        {user ? (
          <>
            <Link to="/userprofile" className="mobile-link" style={{fontSize: '16px'}} onClick={() => setIsMobileMenuOpen(false)}>My Profile ({user.name})</Link>
            <Link to="/myorder" className="mobile-link" style={{fontSize: '16px'}} onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
            <div className="mobile-link" style={{fontSize: '16px', color: '#ff4d4d'}} onClick={handleLogoutClick}>Logout</div>
          </>
        ) : (
          <>
            <Link to="/login" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            <Link to="/register" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>

      <div className="nav-spacer"></div>
    </>
  );
}

export default Header;