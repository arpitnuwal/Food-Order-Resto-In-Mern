import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/register", { 
        name, email, phone, password 
      });

      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setIsSuccess(true);
        setTimeout(() => navigate("/"), 2500);
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration Failed. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.card} className="animate-scale">
          <FaUserCheck size={50} color="#f3cf7a" style={{ marginBottom: '20px' }} />
          <h2 style={styles.title}>Membership Active</h2>
          <p style={styles.subtitle}>Welcome to Archi Luxury Dining, {name}</p>
          <div style={{ marginTop: '20px' }} className="loader-line"></div>
          <p style={{ color: '#444', fontSize: '11px', marginTop: '20px', letterSpacing: '2px' }}>
            PREPARING YOUR TABLE...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <FaUserPlus size={40} color="#f3cf7a" style={{ marginBottom: '20px' }} />
        <h2 style={styles.title}>Archi</h2>
        <p style={styles.subtitle}>Create your elite account</p>

        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            placeholder="FULL NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="email"
            placeholder="EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="tel"
            placeholder="PHONE NUMBER"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.errorText}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "AUTHENTICATING..." : "JOIN THE ELITE"}
          </button>
        </form>

        <p style={styles.switchText}>
          ALREADY A MEMBER?
          <Link to="/login" style={styles.linkStyle}>SIGN IN</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale { animation: scaleIn 0.5s ease-out forwards; }
        .loader-line { width: 100%; height: 2px; background: rgba(243, 207, 122, 0.1); position: relative; overflow: hidden; }
        .loader-line::after { content: ''; position: absolute; left: -50%; width: 50%; height: 100%; background: #f3cf7a; animation: loading 1.5s infinite linear; }
        @keyframes loading { 0% { left: -50%; } 100% { left: 100%; } }
        input:focus { border-color: #f3cf7a !important; }
        button:hover { background: #fff !important; color: #000 !important; }
      `}</style>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#050505", fontFamily: "'Montserrat', sans-serif", padding: "20px" },
  card: { background: "#0a0a0a", padding: "50px 40px", borderRadius: "2px", width: "420px", border: "1px solid rgba(243, 207, 122, 0.1)", textAlign: "center", boxShadow: "0 25px 50px rgba(0,0,0,0.6)" },
  title: { fontFamily: "'Marcellus', serif", fontSize: "32px", marginBottom: "10px", color: "#f3cf7a", letterSpacing: "4px", textTransform: "uppercase" },
  subtitle: { fontSize: "11px", marginBottom: "35px", color: "#666", letterSpacing: "2px", textTransform: "uppercase" },
  input: { width: "100%", padding: "14px", marginBottom: "15px", background: "#050505", border: "1px solid #222", color: "#fff", outline: "none", fontSize: "12px" },
  errorText: { color: "#ff4444", fontSize: "11px", marginBottom: "20px", textAlign: "left", letterSpacing: "1px" },
  button: { width: "100%", padding: "16px", background: "#f3cf7a", border: "none", color: "#000", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "2px", textTransform: "uppercase", transition: "0.4s", marginTop: "10px" },
  switchText: { fontSize: "11px", marginTop: "30px", color: "#444", letterSpacing: "1px" },
  linkStyle: { color: "#f3cf7a", textDecoration: "none", marginLeft: "8px", fontWeight: "600" }
};

export default Register;