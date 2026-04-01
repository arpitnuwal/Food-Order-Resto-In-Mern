import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock, FaArrowLeft, FaShieldAlt, FaUserCheck, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: Choose Option, 3: OTP + Action
  const [mode, setMode] = useState(""); // "login" or "reset"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ Control both fields
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/forgot-password/send-otp", { email });
      setStep(2);
      setMessage("OTP sent to your elite inbox! 🥂");
    } catch (err) { 
        setMessage("Email not found in our records."); 
    }
    setLoading(false);
  };

  // ✅ Force Reset all inputs to Empty Strings
  const startFinalStep = (selectedMode) => {
    setMode(selectedMode);
    setOtp(""); 
    setNewPassword(""); 
    setConfirmPassword(""); 
    setMessage("");
    setShowPassword(false);
    setStep(3);
  };

  // Final Step: Verify & Action
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (mode === "reset" && newPassword !== confirmPassword) {
        return setMessage("Passwords do not match!");
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const res = await axios.post("http://localhost:5000/api/forgot-password/verify-otp-login", { email, otp });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      } else {
        await axios.post("http://localhost:5000/api/forgot-password/reset-password", { email, otp, newPassword });
        setMessage("Security Updated! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) { 
        setMessage(err.response?.data?.message || "Invalid OTP code."); 
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="animate-scale">
        <h2 style={styles.title}>{step === 1 ? "Recovery" : "Elite Access"}</h2>
        
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <p style={styles.subtitle}>Enter your Gmail to receive a code.</p>
            <input style={styles.input} type="email" placeholder="GMAIL ADDRESS" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <button style={styles.button} type="submit" disabled={loading}>SEND OTP</button>
          </form>
        )}

        {step === 2 && (
          <div style={styles.optionContainer}>
            <p style={styles.subtitle}>Choose your preferred access method:</p>
            <button style={styles.optionBtn} onClick={() => startFinalStep("login")}>
               <FaUserCheck size={20}/> DIRECT LOGIN (Quick)
            </button>
            <button style={{...styles.optionBtn, marginTop: '15px'}} onClick={() => startFinalStep("reset")}>
               <FaKey size={20}/> CREATE NEW PASSWORD
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleFinalSubmit} autoComplete="off">
            <p style={styles.subtitle}>{mode === "login" ? "Enter OTP for instant access" : "Enter OTP & New Password"}</p>
            
            <input 
                style={{...styles.input, textAlign:'center', letterSpacing:'8px'}} 
                type="text" 
                placeholder="000000" 
                maxLength="6" 
                name="otp-code"
                value={otp} 
                onChange={(e)=>setOtp(e.target.value)} 
                required 
                autoComplete="new-password" 
            />
            
            {mode === "reset" && (
              <>
                {/* New Password Field */}
                <div style={styles.passwordWrapper}>
                    <input 
                        style={{...styles.input, marginBottom: 0}} 
                        type={showPassword ? "text" : "password"} 
                        placeholder="NEW PASSWORD" 
                        name="new-password"
                        value={newPassword} 
                        onChange={(e)=>setNewPassword(e.target.value)} 
                        required 
                        autoComplete="new-password"
                    />
                    <div style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                </div>

                {/* Confirm Password Field with same Toggle logic */}
                <div style={{...styles.passwordWrapper, marginTop: '20px'}}>
                    <input 
                        style={{...styles.input, marginBottom: 0}} 
                        type={showPassword ? "text" : "password"} 
                        placeholder="CONFIRM PASSWORD" 
                        name="confirm-password"
                        value={confirmPassword} 
                        onChange={(e)=>setConfirmPassword(e.target.value)} 
                        required 
                        autoComplete="new-password"
                    />
                    <div style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                </div>
              </>
            )}
            
            <button style={styles.button} type="submit" disabled={loading}>
                {loading ? "VERIFYING..." : mode === "login" ? "LOGIN NOW" : "UPDATE & LOGIN"}
            </button>
          </form>
        )}

        {message && <p style={{color: message.includes("match") ? "#ff4d4d" : "#f3cf7a", fontSize:'11px', marginTop:'15px'}}>{message}</p>}
        
        <button onClick={() => navigate("/login")} style={styles.backBtn}>BACK TO LOGIN</button>
      </div>

      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
          @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .animate-scale { animation: scaleIn 0.5s ease-out forwards; }
          input:focus { border-color: #f3cf7a !important; background: rgba(255,255,255,0.05) !important; transition: 0.3s; }
      `}</style>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#050505", fontFamily: "'Montserrat', sans-serif" },
  card: { background: "#0a0a0a", padding: "50px 40px", width: "420px", border: "1px solid rgba(243, 207, 122, 0.1)", textAlign: "center", boxShadow: "0 25px 50px rgba(0,0,0,0.6)" },
  title: { fontFamily: "'Marcellus', serif", fontSize: "28px", color: "#f3cf7a", letterSpacing: "3px", textTransform: "uppercase", marginBottom: '10px' },
  subtitle: { fontSize: "11px", color: "#666", letterSpacing: "1px", marginBottom: "30px" },
  input: { width: "100%", padding: "15px", marginBottom: "20px", background: "#050505", border: "1px solid #222", color: "#fff", outline: "none", fontSize: '13px', borderRadius: '4px' },
  passwordWrapper: { position: 'relative', width: '100%' },
  eyeIcon: { position: 'absolute', right: '15px', top: '15px', color: '#f3cf7a', cursor: 'pointer', zIndex: 10 },
  button: { width: "100%", padding: "16px", background: "#f3cf7a", color: "#000", fontWeight: "bold", cursor: "pointer", border: 'none', letterSpacing: '2px', marginTop: '20px' },
  optionBtn: { width: "100%", padding: "20px", background: "transparent", border: "1px solid #333", color: "#fff", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', fontSize: '12px', fontWeight: '600', transition: '0.3s' },
  backBtn: { background: 'none', border: 'none', color: "#444", cursor: 'pointer', fontSize: "10px", marginTop: '25px', letterSpacing: '2px' }
};

export default ForgotPassword;