import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaImages, FaUtensils, FaListAlt, FaChartBar, FaSignOutAlt, 
  FaHome, FaAngleRight, FaChevronDown, FaChevronUp, FaTag,
  FaPenNib, FaUserTie, FaChair, FaEnvelopeOpenText, 
  FaStar, // ✅ Review approval ke liye naya icon
  FaGlassCheers 
} from "react-icons/fa";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dropdown open/close state
  const [isPromoOpen, setIsPromoOpen] = useState(true); 

  const menuItems = [
    { name: "Dashboard", path: "/admindashboard", icon: <FaChartBar /> },
    { 
      name: "Promotions", 
      icon: <FaTag />, 
      isDropdown: true,
      subItems: [
        { name: "Home Slider", path: "/manageslider", icon: <FaImages /> },
        { name: "Flash Offer", path: "/manageflashdeal", icon: <FaTag /> },
      ]
    },
    
    // ✅ Table Reservation Admin Option
    { name: "Manage Tables", path: "/admintabledashboard", icon: <FaChair /> }, 

    // ✅ Private Events Admin Option
    { name: "Private Events", path: "/privateeventadmin", icon: <FaGlassCheers /> }, 

    // ✅ Chef Admin Option
    { name: "Manage Chefs", path: "/chefadmin", icon: <FaUserTie /> }, 
    
    { name: "Categories", path: "/category", icon: <FaListAlt /> },
    { name: "Add Product", path: "/addproduct", icon: <FaUtensils /> },
    { name: "Product List", path: "/productlist", icon: <FaListAlt /> },

    // ✅ Customer Inquiries Admin Option
    { name: "Customer Inquiries", path: "/admininquiry", icon: <FaEnvelopeOpenText /> }, 

    // ✅ NEW: Approve Reviews Admin Option
    { name: "Approve Reviews", path: "/adminreviewapproval", icon: <FaStar /> }, 

    { name: "Add Blog", path: "/addblog", icon: <FaPenNib /> }, 
  ];

  return (
    <div style={styles.sidebar}>
      {/* --- Logo Section --- */}
      <div style={styles.logoSection}>
        <h2 style={styles.logoText}>ARCHI</h2>
        <p style={styles.adminTag}>Control Panel</p>
      </div>

      {/* --- Navigation --- */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          if (item.isDropdown) {
            return (
              <div key={item.name} style={{ marginBottom: "5px" }}>
                {/* Parent Link */}
                <div 
                  onClick={() => setIsPromoOpen(!isPromoOpen)}
                  className="sidebar-item"
                  style={styles.navItem}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={styles.icon}>{item.icon}</span>
                    <span style={styles.navText}>{item.name}</span>
                  </div>
                  {isPromoOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                </div>

                {/* Sub Items (Dropdown Content) */}
                {isPromoOpen && (
                  <div style={{ paddingLeft: "15px", marginTop: "5px" }}>
                    {item.subItems.map((sub) => {
                      const isActive = location.pathname.toLowerCase() === sub.path.toLowerCase();
                      return (
                        <div
                          key={sub.name}
                          onClick={() => navigate(sub.path)}
                          className="sidebar-item"
                          style={{
                            ...styles.navItem,
                            background: isActive ? "#e7f1ff" : "transparent",
                            color: isActive ? "#007bff" : "#666",
                            fontSize: "13px",
                            padding: "10px 15px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ ...styles.icon, fontSize: "14px", color: isActive ? "#007bff" : "#999" }}>
                              {sub.icon}
                            </span>
                            <span>{sub.name}</span>
                          </div>
                          {isActive && <FaAngleRight size={10} />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular Menu Items
          const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
          return (
            <div 
              key={item.name} 
              onClick={() => navigate(item.path)}
              className="sidebar-item"
              style={{
                ...styles.navItem,
                background: isActive ? "#e7f1ff" : "transparent",
                color: isActive ? "#007bff" : "#555",
                fontWeight: isActive ? "600" : "500",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ ...styles.icon, color: isActive ? "#007bff" : "#888" }}>{item.icon}</span>
                <span style={styles.navText}>{item.name}</span>
              </div>
              {isActive && <FaAngleRight size={12} />}
            </div>
          );
        })}
      </nav>

      {/* --- Footer / Logout --- */}
      <div style={styles.footerSection}>
        <div style={styles.logoutBtn} onClick={() => navigate("/")}>
          <FaHome /> <span>Back to Site</span>
        </div>
        <div style={{ ...styles.logoutBtn, color: '#dc3545', marginTop: '15px' }} onClick={() => navigate("/login")}>
          <FaSignOutAlt /> <span>Logout</span>
        </div>
      </div>

      <style>{`
        .sidebar-item:hover {
          background: #f8f9fa !important;
          color: #007bff !important;
        }
        .sidebar-item:hover span {
          color: #007bff !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  sidebar: { width: "260px", height: "100vh", background: "#ffffff", borderRight: "1px solid #e0e0e0", position: "fixed", top: 0, left: 0, display: "flex", flexDirection: "column", zIndex: 1000, boxShadow: "262px 0 5px rgba(0,0,0,0.02)" },
  logoSection: { padding: "30px 20px", textAlign: "left", borderBottom: "1px solid #f0f0f0" },
  logoText: { fontFamily: "'Segoe UI', sans-serif", color: "#333", margin: 0, fontWeight: "800", fontSize: "24px", letterSpacing: "1px" },
  adminTag: { fontSize: '11px', letterSpacing: '1px', color: '#007bff', fontWeight: '700', margin: "5px 0 0 0", textTransform: "uppercase" },
  nav: { flex: 1, marginTop: "20px", padding: "0 15px", overflowY: "auto" },
  navItem: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 15px", cursor: "pointer", transition: "0.2s all ease", fontFamily: "'Segoe UI', sans-serif", fontSize: "14px", borderRadius: "8px", marginBottom: "5px" },
  icon: { marginRight: "12px", fontSize: "16px", display: "flex", alignItems: "center", transition: "0.2s" },
  footerSection: { padding: "20px", borderTop: "1px solid #f0f0f0", background: "#fafafa" },
  logoutBtn: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", color: '#666', fontWeight: "500", transition: "0.2s" }
};

export default AdminSidebar;