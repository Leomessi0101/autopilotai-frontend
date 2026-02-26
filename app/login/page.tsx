"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (token) router.push("/dashboard");
    else setChecking(false);
  }, [router]);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("autopilot_token", res.data.token);
      if (res.data.subscription_plan) localStorage.setItem("autopilot_subscription", res.data.subscription_plan);
      router.push("/dashboard");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleLogin(); };

  if (checking) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 32, height: 32, border: "2px solid #222", borderTop: "2px solid #059669", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans    { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp .45s ease both; }

        /* Grid bg */
        .auth-grid {
          position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(#1a1a1a 1px, transparent 1px),
            linear-gradient(90deg, #1a1a1a 1px, transparent 1px);
          background-size: 52px 52px;
          opacity: .35;
          pointer-events: none;
        }

        /* Card */
        .auth-card {
          background: #111; border: 1px solid #1e1e1e; border-radius: 22px;
          overflow: hidden; width: 100%; max-width: 420px;
          position: relative; z-index: 1;
          box-shadow: 0 32px 80px rgba(0,0,0,.6);
        }

        .field {
          width: 100%; background: #0a0a0a; border: 1px solid #2a2a2a;
          border-radius: 12px; padding: 13px 16px 13px 44px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #e5e5e5;
          outline: none; transition: border-color .2s, box-shadow .2s;
        }
        .field::placeholder { color: #444; }
        .field:hover  { border-color: #333; }
        .field:focus  { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,.1); }

        .field-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%); color: #444; pointer-events: none;
          display: flex;
        }

        .label {
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase; color: #555;
          display: block; margin-bottom: 8px;
        }

        .btn-submit {
          width: 100%; padding: 14px; border-radius: 12px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #059669, #0ea5e9); color: white;
          transition: filter .2s, transform .18s, box-shadow .2s;
          letter-spacing: -.01em;
        }
        .btn-submit:hover:not(:disabled) {
          filter: brightness(1.08); transform: translateY(-1px);
          box-shadow: 0 10px 32px rgba(5,150,105,.3);
        }
        .btn-submit:disabled { opacity: .5; cursor: not-allowed; transform: none; }

        .link-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 600; color: #059669; padding: 0;
          transition: color .18s;
        }
        .link-btn:hover { color: #4ade80; }

        .divider {
          display: flex; align-items: center; gap: 12; margin: 20px 0;
        }
        .divider-line { flex: 1; height: 1px; background: #1a1a1a; }
        .divider-text {
          font-family: 'DM Sans', sans-serif; font-size: 11px;
          font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #333;
          white-space: nowrap; padding: 0 8px;
        }
      `}</style>

      <div className="auth-grid" />

      <div className="auth-card fade-up">
        {/* Top bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #059669, #0ea5e9)" }} />

        <div style={{ padding: "36px 36px 32px" }}>

          {/* Logo */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <button
              className="font-display"
              onClick={() => router.push("/")}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, color: "white", letterSpacing: "-0.03em" }}
            >
              Autopilot<span style={{ color: "#059669" }}>AI</span>
            </button>
            <div className="font-sans" style={{ marginTop: 6, fontSize: 13, color: "#555" }}>
              Welcome back — sign in to continue
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="font-sans" style={{
              display: "flex", alignItems: "flex-start", gap: 9, padding: "12px 14px",
              borderRadius: 12, background: "rgba(220,38,38,.06)", border: "1px solid rgba(220,38,38,.2)",
              fontSize: 13, color: "#f87171", marginBottom: 20, lineHeight: 1.5,
            }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="label">Email address</label>
              <div style={{ position: "relative" }}>
                <span className="field-icon"><Mail size={15} /></span>
                <input
                  className="field" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} onKeyDown={onKey}
                  placeholder="you@example.com" autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label className="label" style={{ marginBottom: 0 }}>Password</label>
                <button className="link-btn" style={{ fontSize: 12 }} onClick={() => router.push("/forgot-password")}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <span className="field-icon"><Lock size={15} /></span>
                <input
                  className="field" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} onKeyDown={onKey}
                  placeholder="••••••••" autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button className="btn-submit" style={{ marginTop: 24 }} onClick={handleLogin} disabled={loading}>
            {loading
              ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Signing in…</>
              : <>Sign In <ArrowRight size={15} /></>
            }
          </button>

          {/* Register link */}
          <div className="font-sans" style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #1a1a1a", textAlign: "center", fontSize: 13, color: "#555" }}>
            Don't have an account?{" "}
            <button className="link-btn" onClick={() => router.push("/register")}>
              Create account
            </button>
          </div>
        </div>
      </div>

      {/* Back to home */}
      <button
        className="font-sans link-btn"
        onClick={() => router.push("/")}
        style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", fontSize: 12, color: "#444", zIndex: 2 }}
      >
        ← Back to home
      </button>
    </div>
  );
}