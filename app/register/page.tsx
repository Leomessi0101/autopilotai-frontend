"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (token) router.push("/dashboard");
  }, [router]);

  const pwStrength = password.length === 0 ? null : password.length < 6 ? "weak" : password.length < 10 ? "ok" : "strong";
  const pwColor    = pwStrength === "weak" ? "#ef4444" : pwStrength === "ok" ? "#f59e0b" : "#059669";
  const pwLabel    = pwStrength === "weak" ? "Too short" : pwStrength === "ok" ? "Decent" : "Strong";
  const pwPct      = pwStrength === "weak" ? 33 : pwStrength === "ok" ? 66 : 100;

  const handleRegister = async () => {
    setError("");
    if (name.length < 2)          { setError("Please enter your full name.");              return; }
    if (!email.includes("@"))     { setError("Please enter a valid email address.");       return; }
    if (password.length < 6)      { setError("Password must be at least 6 characters.");  return; }

    try {
      setLoading(true);
      await api.post("/api/auth/register", { name, email, password });
      const loginRes = await api.post("/api/auth/login", { email, password });
      const token        = loginRes.data.token;
      const subscription = loginRes.data.subscription_plan || loginRes.data.subscription;
      localStorage.setItem("autopilot_token", token);
      if (subscription) localStorage.setItem("autopilot_subscription", subscription);

      const urlParams    = new URLSearchParams(window.location.search);
      const selectedPlan = urlParams.get("plan");
      if (selectedPlan === "starter" || selectedPlan === "pro") {
        try {
          const stripeRes = await api.post(`/api/stripe/create-checkout-session?plan=${selectedPlan}`);
          window.location.href = stripeRes.data.checkout_url;
          return;
        } catch { /* fall through */ }
      }
      router.push("/dashboard");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleRegister(); };

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

        .auth-grid {
          position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(#1a1a1a 1px, transparent 1px),
            linear-gradient(90deg, #1a1a1a 1px, transparent 1px);
          background-size: 52px 52px;
          opacity: .35; pointer-events: none;
        }

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
          transform: translateY(-50%); color: #444; pointer-events: none; display: flex;
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
          transition: filter .2s, transform .18s, box-shadow .2s; letter-spacing: -.01em;
        }
        .btn-submit:hover:not(:disabled) {
          filter: brightness(1.08); transform: translateY(-1px);
          box-shadow: 0 10px 32px rgba(5,150,105,.3);
        }
        .btn-submit:disabled { opacity: .5; cursor: not-allowed; transform: none; }

        .link-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 600; color: #059669; padding: 0; transition: color .18s;
        }
        .link-btn:hover { color: #4ade80; }

        /* Perks list */
        .perk {
          display: flex; align-items: center; gap: 9;
          font-family: 'DM Sans', sans-serif; font-size: 12px; color: #666;
        }
      `}</style>

      <div className="auth-grid" />

      <div className="auth-card fade-up">
        <div style={{ height: 3, background: "linear-gradient(90deg, #059669, #0ea5e9)" }} />

        <div style={{ padding: "36px 36px 32px" }}>

          {/* Logo */}
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <button
              className="font-display"
              onClick={() => router.push("/")}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, color: "white", letterSpacing: "-0.03em" }}
            >
              Autopilot<span style={{ color: "#059669" }}>AI</span>
            </button>
            <div className="font-sans" style={{ marginTop: 6, fontSize: 13, color: "#555" }}>
              Create your free account — takes 30 seconds
            </div>
          </div>

          {/* Perks bar */}
          <div style={{ display: "flex", gap: 16, marginBottom: 24, padding: "12px 14px", borderRadius: 12, background: "rgba(5,150,105,.05)", border: "1px solid rgba(5,150,105,.12)", flexWrap: "wrap", justifyContent: "center" }}>
            {["Free forever", "No credit card", "Instant access"].map((p) => (
              <div key={p} className="perk">
                <CheckCircle size={12} style={{ color: "#059669", flexShrink: 0 }} />
                <span>{p}</span>
              </div>
            ))}
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
              <label className="label">Full name</label>
              <div style={{ position: "relative" }}>
                <span className="field-icon"><User size={15} /></span>
                <input
                  className="field" type="text" value={name}
                  onChange={(e) => setName(e.target.value)} onKeyDown={onKey}
                  placeholder="John Smith" autoComplete="name"
                />
              </div>
            </div>

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
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <span className="field-icon"><Lock size={15} /></span>
                <input
                  className="field" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} onKeyDown={onKey}
                  placeholder="Create a strong password" autoComplete="new-password"
                />
              </div>

              {/* Password strength */}
              {pwStrength && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pwPct}%`, background: pwColor, borderRadius: 2, transition: "width .3s, background .3s" }} />
                  </div>
                  <span className="font-sans" style={{ fontSize: 11, color: pwColor, fontWeight: 700, marginTop: 4, display: "block" }}>
                    {pwLabel}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button className="btn-submit" style={{ marginTop: 24 }} onClick={handleRegister} disabled={loading}>
            {loading
              ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Creating account…</>
              : <>Create Account <ArrowRight size={15} /></>
            }
          </button>

          {/* Login link */}
          <div className="font-sans" style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #1a1a1a", textAlign: "center", fontSize: 13, color: "#555" }}>
            Already have an account?{" "}
            <button className="link-btn" onClick={() => router.push("/login")}>
              Sign in
            </button>
          </div>

          {/* Terms */}
          <p className="font-sans" style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: "#333", lineHeight: 1.6 }}>
            By signing up you agree to our{" "}
            <a href="/terms"   style={{ color: "#444", textDecoration: "none" }}>Terms</a>
            {" "}and{" "}
            <a href="/privacy" style={{ color: "#444", textDecoration: "none" }}>Privacy Policy</a>
          </p>
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