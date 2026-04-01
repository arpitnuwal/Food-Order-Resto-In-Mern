  import { useState, useEffect } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import axios from "axios";
  import { FaUserShield, FaArrowRight, FaLockOpen, FaEye, FaEyeSlash } from "react-icons/fa";

  function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser) {
          // navigate("/"); 
      }
    }, [navigate]);

    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const res = await axios.post("http://localhost:5000/api/login", { email, password });
        
        if (res.data && res.data.user) {
          // ✅ User ka data aur token save karo
          localStorage.setItem("user", JSON.stringify(res.data.user));
          if(res.data.token) localStorage.setItem("token", res.data.token);

          setIsSuccess(true); 

          // ✅ ROLE-BASED REDIRECT: 2 second ke loading animation ke baad
          setTimeout(() => {
              if (res.data.user.role === 'admin') {
                  // Admin dashboard ka path jo tune App.js mein set kiya hai
                  navigate("/admindashboard"); 
              } else {
                  // Normal user home page
                  navigate("/"); 
              }
          }, 2000); 
        }
      } catch (err) {
        setLoading(false);
        setError(err.response?.data?.message || "Invalid credentials. Please try again.");
      }
    };

    if (isSuccess) {
      return (
        <div style={styles.container}>
          <div style={styles.card} className="animate-scale">
            <FaLockOpen size={50} color="#f3cf7a" style={{ marginBottom: '20px' }} />
            <h2 style={styles.title}>Access Granted</h2>
            <p style={styles.subtitle}>Welcome back to Archi Luxury Dining</p>
            <div style={{ marginTop: '20px' }} className="loader-line"></div>
            <p style={{ color: '#444', fontSize: '11px', marginTop: '20px', letterSpacing: '2px' }}>
              PREPARING YOUR EXPERIENCE...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <FaUserShield size={40} color="#f3cf7a" style={{ marginBottom: '20px' }} />
          <h2 style={styles.title}>Archi</h2>
          <p style={styles.subtitle}>Sign in to your account</p>

          <form onSubmit={handleLogin} autoComplete="off">
            <input
              style={styles.input}
              type="email"
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />

            <div style={{ position: 'relative' }}>
              <input
                style={styles.input}
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <div 
                style={styles.eyeIcon} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div style={styles.forgotContainer}>
              <Link to="/forgotpassword" style={styles.forgotLink}>FORGOT PASSWORD?</Link>
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? "AUTHENTICATING..." : "ENTER DINING"}
            </button>
          </form>

          <p style={styles.switchText}>
            NEW TO ARCHI?
            <Link to="/register" style={styles.linkStyle}>CREATE ACCOUNT</Link>
          </p>
        </div>

        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
            @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .animate-scale { animation: scaleIn 0.5s ease-out forwards; }
            .loader-line { width: 100%; height: 2px; background: rgba(243, 207, 122, 0.1); position: relative; overflow: hidden; }
            .loader-line::after { content: ''; position: absolute; left: -50%; width: 50%; height: 100%; background: #f3cf7a; animation: loading 1.5s infinite linear; }
            @keyframes loading { 0% { left: -50%; } 100% { left: 100%; } }
            input:focus { border-color: #f3cf7a !important; background: rgba(255,255,255,0.05) !important; transition: 0.3s; }
            button:hover { background: #fff !important; color: #000 !important; transform: translateY(-2px); }
          `}
        </style>
      </div>
    );
  }

  const styles = {
    container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#050505", fontFamily: "'Montserrat', sans-serif", padding: "20px" },
    card: { background: "#0a0a0a", padding: "60px 40px", borderRadius: "2px", width: "420px", border: "1px solid rgba(243, 207, 122, 0.1)", textAlign: "center", boxShadow: "0 25px 50px rgba(0,0,0,0.6)" },
    title: { fontFamily: "'Marcellus', serif", fontSize: "32px", marginBottom: "10px", color: "#f3cf7a", letterSpacing: "4px", textTransform: "uppercase" },
    subtitle: { fontSize: "11px", marginBottom: "35px", color: "#666", letterSpacing: "2px", textTransform: "uppercase" },
    input: { width: "100%", padding: "15px", marginBottom: "20px", background: "#050505", border: "1px solid #222", color: "#fff", outline: "none", fontSize: "13px", borderRadius: '4px' },
    eyeIcon: { position: 'absolute', right: '15px', top: '15px', color: '#f3cf7a', cursor: 'pointer', zIndex: 10 },
    forgotContainer: { textAlign: 'right', marginBottom: '25px', marginTop: '-10px' },
    forgotLink: { color: '#666', fontSize: '10px', textDecoration: 'none', letterSpacing: '1px', fontWeight: '400', transition: '0.3s' },
    errorText: { color: "#ff4444", fontSize: "11px", marginBottom: "20px", textAlign: "left", letterSpacing: "1px" },
    button: { width: "100%", padding: "16px", background: "#f3cf7a", border: "none", color: "#000", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "2px", textTransform: "uppercase", transition: "0.4s" },
    switchText: { fontSize: "11px", marginTop: "30px", color: "#444", letterSpacing: "1px" },
    linkStyle: { color: "#f3cf7a", textDecoration: "none", marginLeft: "8px", fontWeight: "600" }
  };

  export default Login;