"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
// Removed lucide-react social icons to prevent export errors

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup State
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", role: "STUDENT" });
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const result = await signIn("credentials", {
      email: loginEmail, password: loginPassword, redirect: false,
    });
    if (result?.error) {
      setLoginError("Invalid email or password");
      setLoginLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    if (signupForm.password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }
    setSignupLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signupForm.name, email: signupForm.email, password: signupForm.password, role: signupForm.role }),
      });
      const data = await res.json();
      if (!res.ok) { setSignupError(data.error || "Signup failed"); setSignupLoading(false); return; }

      await signIn("credentials", { email: signupForm.email, password: signupForm.password, redirect: false });
      router.push("/onboarding");
    } catch {
      setSignupError("Something went wrong");
      setSignupLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center", width: "100%", padding: "1rem"
    }}>
      <style>{`
        .auth-container {
          background-color: #fff;
          border-radius: 20px;
          box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
          position: relative;
          overflow: hidden;
          width: 850px;
          max-width: 100%;
          min-height: 550px;
        }
        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }
        .sign-in-container {
          left: 0;
          width: 50%;
          z-index: 2;
        }
        .auth-container.right-panel-active .sign-in-container {
          transform: translateX(100%);
        }
        .sign-up-container {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }
        .auth-container.right-panel-active .sign-up-container {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: show 0.6s;
        }
        @keyframes show {
          0%, 49.99% { opacity: 0; z-index: 1; }
          50%, 100% { opacity: 1; z-index: 5; }
        }
        .overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.6s ease-in-out;
          z-index: 100;
        }
        .auth-container.right-panel-active .overlay-container {
          transform: translateX(-100%);
        }
        .overlay {
          background: #ff4b2b;
          background: linear-gradient(to right, #ff4b2b, #ff416c);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: 0 0;
          color: #ffffff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out, border-radius 0.6s ease-in-out;
          border-top-left-radius: 120px;
          border-bottom-left-radius: 120px;
        }
        .auth-container.right-panel-active .overlay {
          transform: translateX(50%);
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          border-top-right-radius: 120px;
          border-bottom-right-radius: 120px;
        }
        .overlay-panel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          text-align: center;
          top: 0;
          height: 100%;
          width: 50%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }
        .overlay-left {
          transform: translateX(-20%);
        }
        .auth-container.right-panel-active .overlay-left {
          transform: translateX(0);
        }
        .overlay-right {
          right: 0;
          transform: translateX(0);
        }
        .auth-container.right-panel-active .overlay-right {
          transform: translateX(20%);
        }
        .auth-form {
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 50px;
          height: 100%;
          text-align: center;
        }
        .auth-title {
          font-weight: bold;
          margin: 0;
          font-size: 2.2rem;
          color: #333;
          font-family: "Inter", sans-serif;
        }
        .social-container {
          margin: 20px 0;
        }
        .social-container a {
          border: 1px solid #DDDDDD;
          border-radius: 50%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin: 0 5px;
          height: 40px;
          width: 40px;
          text-decoration: none;
          color: #333;
          transition: background 0.3s, color 0.3s;
        }
        .social-container a:hover {
          background-color: #ff416c;
          color: white;
          border-color: #ff416c;
        }
        .auth-input {
          background-color: #eee;
          border: none;
          padding: 12px 15px;
          margin: 8px 0;
          width: 100%;
          border-radius: 8px;
          color: #333;
          outline: none;
          font-size: 0.9rem;
        }
        .auth-btn {
          border-radius: 20px;
          border: 1px solid #ff4b2b;
          background-color: #ff4b2b;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: bold;
          padding: 12px 45px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: transform 80ms ease-in;
          cursor: pointer;
          margin-top: 15px;
        }
        .auth-btn:active {
          transform: scale(0.95);
        }
        .auth-btn:focus {
          outline: none;
        }
        .auth-btn.ghost {
          background-color: transparent;
          border-color: #FFFFFF;
        }
        .role-selector {
          display: flex;
          gap: 15px;
          margin: 10px 0;
          width: 100%;
          justify-content: center;
        }
        .role-label {
          color: #555;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }
        .error-msg {
          color: #ff4b2b;
          font-size: 0.8rem;
          margin-top: -5px;
          margin-bottom: 5px;
        }
      `}</style>

      <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`} id="auth-container">
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <h1 className="auth-title">Create Account</h1>
            
                <div className="social-container">
                  <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                  <a href="#" aria-label="Github"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path><path d="M9 18c-4.5 1.5-5-2-7-2"></path></svg></a>
                  <a href="#" aria-label="Linkedin"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                </div>
                <span style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>or use your email for registration</span>
                
                {signupError && <div className="error-msg">{signupError}</div>}
                <input className="auth-input" type="text" placeholder="Name" required value={signupForm.name} onChange={e => setSignupForm({...signupForm, name: e.target.value})} />
                <input className="auth-input" type="email" placeholder="Email" required value={signupForm.email} onChange={e => setSignupForm({...signupForm, email: e.target.value})} />
                <input className="auth-input" type="password" placeholder="Password" required value={signupForm.password} onChange={e => setSignupForm({...signupForm, password: e.target.value})} />
                
                <div className="role-selector">
                  <label className="role-label">
                    <input type="radio" checked={signupForm.role === "STUDENT"} onChange={() => setSignupForm({...signupForm, role: "STUDENT"})} /> Student
                  </label>
                  <label className="role-label">
                    <input type="radio" checked={signupForm.role === "ADMIN"} onChange={() => setSignupForm({...signupForm, role: "ADMIN"})} /> Admin
                  </label>
                </div>

            <button className="auth-btn" disabled={signupLoading}>
              {signupLoading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <h1 className="auth-title">Sign in</h1>
            <div className="social-container">
              <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#" aria-label="Github"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path><path d="M9 18c-4.5 1.5-5-2-7-2"></path></svg></a>
              <a href="#" aria-label="Linkedin"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
            </div>
            <span style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>or use your account</span>
            
            {loginError && <div className="error-msg">{loginError}</div>}
            
            <input className="auth-input" type="email" placeholder="Email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
            <input className="auth-input" type="password" placeholder="Password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            
            <a href="/forgot-password" style={{ color: "#555", fontSize: "13px", textDecoration: "none", margin: "15px 0" }}>Forgot your password?</a>
            <button className="auth-btn" disabled={loginLoading}>{loginLoading ? "Signing in..." : "Sign In"}</button>
          </form>
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="auth-title" style={{ color: "white" }}>Welcome Back!</h1>
              <p style={{ fontSize: "14px", fontWeight: 100, lineHeight: "20px", letterSpacing: "0.5px", margin: "20px 0 30px" }}>
                To keep connected with us please login with your personal info
              </p>
              <button className="auth-btn ghost" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="auth-title" style={{ color: "white" }}>Hello, Friend!</h1>
              <p style={{ fontSize: "14px", fontWeight: 100, lineHeight: "20px", letterSpacing: "0.5px", margin: "20px 0 30px" }}>
                Enter your personal details and start your journey with us
              </p>
              <button className="auth-btn ghost" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
