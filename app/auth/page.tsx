"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Mode = "signin" | "signup";

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const C = {
  bg: "#080808",
  surface: "#0f0f0f",
  card: "#111111",
  panel: "#0c0c0c",
  red: "#C62828",
  redBright: "#E53935",
  redGlow: "rgba(198,40,40,0.18)",
  redGlowStrong: "rgba(229,57,53,0.35)",
  gold: "#BFA46A",
  goldDim: "rgba(191,164,106,0.15)",
  white: "#FFFFFF",
  offWhite: "#E8E6E0",
  muted: "#6B6B68",
  mutedLight: "#9A9896",
  border: "rgba(255,255,255,0.055)",
  borderHover: "rgba(255,255,255,0.12)",
  borderFocus: "rgba(198,40,40,0.6)",
  inputBg: "rgba(255,255,255,0.028)",
  inputBgFocus: "rgba(255,255,255,0.05)",
};

/* ─── KEYFRAMES STRING ───────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: ${C.bg}; overflow-x: hidden; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes slideRight {
    from { transform: translateX(-100%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.93); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes borderPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(198,40,40,0); }
    50%      { box-shadow: 0 0 0 4px rgba(198,40,40,0.12); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes floatA {
    0%,100% { transform: translate(0,0) scale(1); }
    33%     { transform: translate(30px,-20px) scale(1.05); }
    66%     { transform: translate(-20px,15px) scale(0.97); }
  }
  @keyframes floatB {
    0%,100% { transform: translate(0,0) scale(1); }
    40%     { transform: translate(-25px,20px) scale(1.03); }
    70%     { transform: translate(20px,-15px) scale(0.98); }
  }
  @keyframes floatC {
    0%,100% { transform: translate(0,0); }
    50%     { transform: translate(15px,25px); }
  }
  @keyframes scanline {
    from { transform: translateY(-100%); }
    to   { transform: translateY(100vh); }
  }
  @keyframes orbPulse {
    0%,100% { opacity: 0.06; transform: scale(1); }
    50%      { opacity: 0.12; transform: scale(1.08); }
  }
  @keyframes inputReveal {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes successPop {
    0%   { transform: scale(0.5); opacity: 0; }
    60%  { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 40px; }
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #111 inset !important;
    -webkit-text-fill-color: #E8E6E0 !important;
    transition: background-color 5000s;
  }
  input::placeholder { color: rgba(107,107,104,0.5); }
  input:focus        { outline: none; }
  button:focus-visible { outline: 2px solid ${C.redBright}; outline-offset: 3px; }

  .form-field { animation: inputReveal 0.4s cubic-bezier(0.4,0,0.2,1) both; }
  .form-field:nth-child(1) { animation-delay: 0.05s; }
  .form-field:nth-child(2) { animation-delay: 0.10s; }
  .form-field:nth-child(3) { animation-delay: 0.15s; }
  .form-field:nth-child(4) { animation-delay: 0.20s; }
  .form-field:nth-child(5) { animation-delay: 0.25s; }

  .stat-item { animation: fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) both; }
  .stat-item:nth-child(1) { animation-delay: 0.7s; }
  .stat-item:nth-child(2) { animation-delay: 0.85s; }
  .stat-item:nth-child(3) { animation-delay: 1.0s; }
`;

/* ─── CANVAS BACKGROUND ─────────────────────────────────────── */
function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const t         = useRef(0);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;

    const resize = () => {
      cvs.width  = window.innerWidth;
      cvs.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; };
    const pts: P[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.35 + 0.05,
    }));

    const draw = () => {
      t.current += 0.005;
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      /* deep vignette */
      const vig = ctx.createRadialGradient(
        cvs.width/2, cvs.height/2, cvs.height * 0.1,
        cvs.width/2, cvs.height/2, cvs.height * 0.85
      );
      vig.addColorStop(0, "rgba(8,8,8,0)");
      vig.addColorStop(1, "rgba(4,4,4,0.92)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      /* red orb — left side */
      const ox1 = cvs.width * 0.22 + Math.sin(t.current * 0.7) * 60;
      const oy1 = cvs.height * 0.45 + Math.cos(t.current * 0.5) * 40;
      const g1  = ctx.createRadialGradient(ox1, oy1, 0, ox1, oy1, 380);
      g1.addColorStop(0,   "rgba(180,30,30,0.13)");
      g1.addColorStop(0.5, "rgba(140,20,20,0.06)");
      g1.addColorStop(1,   "rgba(100,10,10,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      /* gold orb — upper right */
      const ox2 = cvs.width * 0.75 + Math.cos(t.current * 0.4) * 50;
      const oy2 = cvs.height * 0.2  + Math.sin(t.current * 0.6) * 30;
      const g2  = ctx.createRadialGradient(ox2, oy2, 0, ox2, oy2, 300);
      g2.addColorStop(0,   "rgba(191,164,106,0.07)");
      g2.addColorStop(0.5, "rgba(160,130,80,0.03)");
      g2.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      /* particles + connections */
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = cvs.width;
        if (p.x > cvs.width)  p.x = 0;
        if (p.y < 0) p.y = cvs.height;
        if (p.y > cvs.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198,40,40,${p.a})`;
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(180,30,30,${0.07 * (1 - d/100)})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }

      /* subtle scanline */
      const scanY = ((t.current * 60) % (cvs.height + 200)) - 100;
      const sg = ctx.createLinearGradient(0, scanY, 0, scanY + 120);
      sg.addColorStop(0,   "rgba(198,40,40,0)");
      sg.addColorStop(0.5, "rgba(198,40,40,0.015)");
      sg.addColorStop(1,   "rgba(198,40,40,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY, cvs.width, 120);

      /* grid overlay */
      ctx.strokeStyle = "rgba(255,255,255,0.012)";
      ctx.lineWidth   = 0.5;
      const gs = 80;
      for (let x = 0; x < cvs.width; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cvs.height); ctx.stroke();
      }
      for (let y = 0; y < cvs.height; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cvs.width, y); ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

/* ─── TICKER ─────────────────────────────────────────────────── */
function Ticker() {
  const items = ["Talent Redefined", "500+ Partners", "10,000+ Placed", "Redefining Culture", "India's Premier Staffing", "People First"];
  const doubled = [...items, ...items];
  return (
    <div style={{
      overflow: "hidden",
      borderTop:    `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      padding: "10px 0",
      background: "rgba(255,255,255,0.015)",
      marginBottom: "52px",
    }}>
      <div style={{
        display: "flex",
        gap: "48px",
        animation: "ticker 18s linear infinite",
        width: "max-content",
        whiteSpace: "nowrap",
      }}>
        {doubled.map((t, i) => (
          <span key={i} style={{
            fontSize: "10px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: i % 2 === 0 ? C.mutedLight : C.gold,
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: C.red, display: "inline-block" }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── LOGO ───────────────────────────────────────────────────── */
function Logo({ animate }: { animate?: boolean }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
      marginBottom: "36px",
      animation: animate ? "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" : undefined,
    }}>
      <div style={{
        display: "flex", alignItems: "stretch",
        border: `1.5px solid ${C.white}`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* shimmer sweep */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
          backgroundSize: "400px 100%",
          animation: "shimmer 3s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          padding: "8px 10px 8px 14px",
          borderRight: `1.5px solid rgba(255,255,255,0.3)`,
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "34px",
            fontWeight: 600,
            color: C.red,
            letterSpacing: "3px",
            lineHeight: 1,
            display: "block",
          }}>JBR</span>
        </div>
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 12px",
          gap: "1px",
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", letterSpacing: "4px", color: C.white, textTransform: "uppercase" }}>STAFFING</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", letterSpacing: "4px", color: C.offWhite, textTransform: "uppercase" }}>SOLUTIONS</span>
        </div>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        fontSize: "9px", letterSpacing: "2.5px", color: C.muted,
        textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ width: "20px", height: "0.5px", background: C.gold }} />
        Redefining People &amp; Culture
        <div style={{ width: "20px", height: "0.5px", background: C.gold }} />
      </div>
    </div>
  );
}

/* ─── TAB SWITCHER ───────────────────────────────────────────── */
function ModeTabs({ mode, onSwitch }: { mode: Mode; onSwitch: (m: Mode) => void }) {
  return (
    <div style={{
      display: "flex",
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${C.border}`,
      borderRadius: "12px",
      padding: "4px",
      marginBottom: "30px",
      position: "relative",
    }}>
      {(["signin","signup"] as Mode[]).map(m => (
        <button
          key={m}
          onClick={() => onSwitch(m)}
          style={{
            flex: 1,
            padding: "10px 16px",
            border: "none",
            borderRadius: "9px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            background: mode === m ? "rgba(198,40,40,0.15)" : "transparent",
            color: mode === m ? C.white : C.muted,
            boxShadow: mode === m ? `inset 0 0 0 1px rgba(198,40,40,0.4), 0 2px 12px rgba(198,40,40,0.12)` : "none",
          }}
        >
          {m === "signin" ? "Sign In" : "Register"}
        </button>
      ))}
    </div>
  );
}

/* ─── GOOGLE BTN ─────────────────────────────────────────────── */
function GoogleBtn({ label }: { label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "12px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        background: hov ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.035)",
        border: `1px solid ${hov ? C.borderHover : C.border}`,
        borderRadius: "10px",
        cursor: "pointer",
        color: C.offWhite,
        fontSize: "13px",
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.3px",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hov ? "translateY(-1px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
        marginBottom: "20px",
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M5.27 9.77A7.1 7.1 0 0 1 12 4.9c1.69 0 3.22.6 4.41 1.57l3.28-3.28A11.95 11.95 0 0 0 12 1C7.63 1 3.84 3.4 1.84 6.97l3.43 2.8z"/>
        <path fill="#34A853" d="M16.04 17.65A7.06 7.06 0 0 1 12 19.1c-2.97 0-5.51-1.83-6.64-4.44l-3.43 2.64A11.96 11.96 0 0 0 12 23c3.24 0 5.97-1.18 8.06-3.09l-4.02-2.26z"/>
        <path fill="#FBBC05" d="M19.55 12c0-.78-.08-1.55-.22-2.3H12v4.35h4.3a3.67 3.67 0 0 1-1.6 2.44l3.86 3A11.91 11.91 0 0 0 21 12c0-.64-.05-1.3-.12-1.95"/>
        <path fill="#4285F4" d="M5.36 14.66A7.12 7.12 0 0 1 4.9 12c0-.93.16-1.82.44-2.65L1.91 6.56A11.82 11.82 0 0 0 1 12c0 1.88.44 3.65 1.22 5.22l3.14-2.56z"/>
      </svg>
      {label}
    </button>
  );
}

/* ─── DIVIDER ────────────────────────────────────────────────── */
function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, ${C.border})` }} />
      <span style={{ fontSize: "10px", letterSpacing: "2px", color: C.muted, fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase" }}>
        or continue
      </span>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, ${C.border})` }} />
    </div>
  );
}

/* ─── INPUT FIELD ────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  hint?: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  icon?: React.ReactNode;
  delay?: number;
}
function Field({ label, hint, type="text", placeholder, value, onChange, autoComplete, icon, delay=0 }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPwd = type === "password";
  const hasVal = value.length > 0;

  return (
    <div className="form-field" style={{ marginBottom: "16px", animationDelay: `${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
        <label style={{
          fontSize: "10.5px", fontWeight: 500, letterSpacing: "1.2px",
          textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif",
          color: focused ? C.offWhite : C.muted,
          transition: "color 0.2s",
        }}>
          {label}
        </label>
        {hint && (
          <span style={{
            fontSize: "11px", color: C.red, cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            borderBottom: `1px solid rgba(198,40,40,0.3)`,
          }}>{hint}</span>
        )}
      </div>
      <div style={{ position: "relative" }}>
        {icon && (
          <div style={{
            position: "absolute", left: "14px", top: "50%",
            transform: "translateY(-50%)", color: focused ? C.red : C.muted,
            transition: "color 0.2s", display: "flex", pointerEvents: "none",
          }}>{icon}</div>
        )}
        <input
          type={isPwd && showPwd ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            padding: `13px ${isPwd ? "44px" : "14px"} 13px ${icon ? "42px" : "14px"}`,
            background: focused ? C.inputBgFocus : C.inputBg,
            border: `1px solid ${focused ? C.borderFocus : hasVal ? "rgba(255,255,255,0.08)" : C.border}`,
            borderRadius: "10px",
            color: C.offWhite,
            fontSize: "14px",
            fontFamily: "'DM Sans',sans-serif",
            transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
            boxSizing: "border-box",
            boxShadow: focused ? `0 0 0 3px rgba(198,40,40,0.1), 0 4px 20px rgba(0,0,0,0.4)` : "none",
          }}
        />
        {isPwd && (
          <button
            type="button"
            onClick={() => setShowPwd(s => !s)}
            style={{
              position: "absolute", right: "14px", top: "50%",
              transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: C.muted, padding: 0, display: "flex", transition: "color 0.2s",
            }}
          >
            {showPwd ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── PASSWORD STRENGTH ──────────────────────────────────────── */
function PwdStrength({ pwd }: { pwd: string }) {
  if (!pwd) return null;
  let s = 0;
  if (pwd.length >= 8)          s++;
  if (/[A-Z]/.test(pwd))        s++;
  if (/[0-9]/.test(pwd))        s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  const cols = ["#EF5350","#FF9800","#9CCC65","#66BB6A"];
  const labs = ["Weak","Fair","Good","Strong"];
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "5px" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: "2px", borderRadius: "1px",
            background: i < s ? cols[s-1] : "rgba(255,255,255,0.08)",
            transition: "background 0.35s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: i < s ? `0 0 6px ${cols[s-1]}60` : "none",
          }} />
        ))}
      </div>
      <span style={{ fontSize: "10px", color: s > 0 ? cols[s-1] : C.muted, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.5px" }}>
        {s > 0 ? labs[s-1] : ""}
      </span>
    </div>
  );
}

/* ─── PRIMARY BUTTON ─────────────────────────────────────────── */
function PrimaryBtn({ label, loading, onClick }: { label: string; loading?: boolean; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      disabled={loading}
      style={{
        width: "100%",
        padding: "14px",
        background: press
          ? "#A31515"
          : hov
          ? `linear-gradient(135deg, #D32F2F, #C62828)`
          : `linear-gradient(135deg, #C62828, #B71C1C)`,
        border: `1px solid ${hov ? "rgba(255,100,100,0.3)" : "rgba(198,40,40,0.4)"}`,
        borderRadius: "10px",
        color: C.white,
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        fontFamily: "'DM Sans',sans-serif",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: press ? "scale(0.985) translateY(1px)" : hov ? "translateY(-2px)" : "none",
        boxShadow: hov
          ? `0 8px 32px rgba(198,40,40,0.45), 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)`
          : `0 4px 16px rgba(198,40,40,0.25), inset 0 1px 0 rgba(255,255,255,0.08)`,
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        marginTop: "4px",
        position: "relative",
        overflow: "hidden",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {/* shimmer on hover */}
      {hov && !loading && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.06) 50%, transparent 80%)",
          backgroundSize: "300px 100%",
          animation: "shimmer 1.5s ease-in-out infinite",
        }} />
      )}
      {loading ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ animation: "spin 0.7s linear infinite" }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      ) : null}
      <span style={{ position: "relative", zIndex: 1 }}>{loading ? "Processing…" : label}</span>
    </button>
  );
}

/* ─── SUCCESS OVERLAY ────────────────────────────────────────── */
function SuccessFlash({ visible, mode }: { visible: boolean; mode: Mode }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 20,
      background: "rgba(8,8,8,0.96)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      borderRadius: "24px",
      animation: "fadeIn 0.3s ease both",
    }}>
      <div style={{
        width: "64px", height: "64px", borderRadius: "50%",
        border: `1.5px solid ${C.red}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        marginBottom: "20px",
        boxShadow: `0 0 40px ${C.redGlow}`,
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p style={{ color: C.white, fontSize: "16px", fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, letterSpacing: "1px", marginBottom: "8px" }}>
        {mode === "signin" ? "Welcome back." : "Account created."}
      </p>
      <p style={{ color: C.muted, fontSize: "12px", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.5px" }}>
        Redirecting…
      </p>
    </div>
  );
}

/* ─── LEFT PANEL ─────────────────────────────────────────────── */
function BrandPanel() {
  return (
    <div style={{
      flex: "0 0 400px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "52px 48px",
      borderRight: `1px solid ${C.border}`,
      position: "relative",
      overflow: "hidden",
      animation: "slideRight 0.7s cubic-bezier(0.4,0,0.2,1) both",
    }}>
      {/* Background geometry */}
      <div style={{
        position: "absolute", bottom: "-80px", right: "-80px",
        width: "320px", height: "320px",
        border: `1px solid rgba(198,40,40,0.07)`,
        borderRadius: "50%", pointerEvents: "none",
        animation: "floatA 14s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-40px", right: "-40px",
        width: "200px", height: "200px",
        border: `1px solid rgba(191,164,106,0.06)`,
        borderRadius: "50%", pointerEvents: "none",
        animation: "floatB 10s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "30%", left: "-60px",
        width: "180px", height: "180px",
        border: `1px solid rgba(198,40,40,0.04)`,
        borderRadius: "50%", pointerEvents: "none",
        animation: "floatC 12s ease-in-out infinite",
      }} />

      {/* Top accent */}
      <div>
        <div style={{
          width: "0px", height: "2px",
          background: `linear-gradient(to right, ${C.red}, ${C.gold})`,
          marginBottom: "48px",
          borderRadius: "1px",
          animation: "lineGrow 1s cubic-bezier(0.4,0,0.2,1) 0.3s both",
        }} />

        <div style={{ animation: "fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.2s both" }}>
          <div style={{
            fontSize: "11px", letterSpacing: "3.5px", textTransform: "uppercase",
            color: C.gold, fontFamily: "'DM Sans',sans-serif",
            marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px",
          }}>
            <div style={{ width: "20px", height: "0.5px", background: C.gold }} />
            Est. 2015
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "46px",
            lineHeight: 1.1,
            color: C.white,
            letterSpacing: "-0.5px",
            marginBottom: "8px",
          }}>
            People are
            <br />our <span style={{ color: C.red, fontWeight: 500, fontStyle: "italic" }}>greatest</span>
            <br />asset.
          </h1>
          <p style={{
            fontSize: "13px", color: C.mutedLight, lineHeight: 1.75,
            fontFamily: "'DM Sans',sans-serif", marginTop: "20px", maxWidth: "280px",
          }}>
            We connect exceptional talent with organisations that value culture. Your career journey deserves a partner that truly understands.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div>
        <div style={{ height: "1px", background: C.border, marginBottom: "28px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0" }}>
          {[
            { num: "500+", label: "Companies" },
            { num: "10K+", label: "Placed" },
            { num: "98%",  label: "Satisfaction" },
          ].map((s, i) => (
            <div key={s.label} className="stat-item" style={{
              borderRight: i < 2 ? `1px solid ${C.border}` : "none",
              paddingRight: i < 2 ? "20px" : "0",
              paddingLeft: i > 0 ? "20px" : "0",
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "26px", fontWeight: 500,
                color: C.white, lineHeight: 1,
                marginBottom: "4px",
              }}>{s.num}</div>
              <div style={{ fontSize: "10px", color: C.muted, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "28px", fontSize: "10px", color: "rgba(107,107,104,0.4)", letterSpacing: "0.5px", fontFamily: "'DM Sans',sans-serif" }}>
          © 2026 JBR Staffing Solutions Pvt. Ltd.
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN AUTH PAGE ─────────────────────────────────────────── */
export default function JBRAuth() {
  const [mode,      setMode]      = useState<Mode>("signin");
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [formKey,   setFormKey]   = useState(0);
  const [opacity,   setOpacity]   = useState(1);
  const [yOff,      setYOff]      = useState(0);
  const [dir,       setDir]       = useState<1|-1>(1);

  const [email,     setEmail]     = useState("");
  const [pwd,       setPwd]       = useState("");
  const [first,     setFirst]     = useState("");
  const [last,      setLast]      = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signPwd,   setSignPwd]   = useState("");

  const switchMode = useCallback((next: Mode) => {
    if (next === mode) return;
    const d: 1|-1 = next === "signup" ? 1 : -1;
    setDir(d);
    setOpacity(0);
    setYOff(-12 * d);
    setTimeout(() => {
      setMode(next);
      setFormKey(k => k + 1);
      setYOff(12 * d);
      setTimeout(() => { setOpacity(1); setYOff(0); }, 40);
    }, 260);
  }, [mode]);

  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  const emailIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
  const lockIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
  const userIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <CinematicBackground />

      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        position: "relative", zIndex: 1,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          display: "flex",
          width: "100%", maxWidth: "900px",
          background: "rgba(11,11,11,0.88)",
          border: `1px solid ${C.border}`,
          borderRadius: "24px",
          overflow: "hidden",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)`,
          animation: "fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.05s both",
          position: "relative",
        }}>

          {/* Brand panel */}
          <BrandPanel />

          {/* Auth panel */}
          <div style={{
            flex: 1,
            padding: "48px 44px",
            display: "flex", flexDirection: "column",
            position: "relative",
            overflowY: "auto",
          }}>
            <Ticker />
            <Logo animate />
            <ModeTabs mode={mode} onSwitch={switchMode} />

            {/* Form */}
            <div
              key={formKey}
              style={{
                opacity,
                transform: `translateY(${yOff}px)`,
                transition: "opacity 0.28s ease, transform 0.35s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <GoogleBtn label={mode === "signin" ? "Continue with Google" : "Register with Google"} />
              <Divider />

              {mode === "signin" ? (
                <>
                  <Field label="Email Address" type="email" placeholder="you@jbrstaffingsolutions.com"
                    value={email} onChange={setEmail} autoComplete="email" icon={emailIcon} delay={0.05} />
                  <Field label="Password" type="password" placeholder="Enter your password"
                    value={pwd} onChange={setPwd} autoComplete="current-password" icon={lockIcon}
                    hint="Forgot password?" delay={0.1} />
                  <PrimaryBtn label="Sign In" loading={loading} onClick={submit} />
                  <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: C.muted }}>
                    No account?{" "}
                    <button onClick={() => switchMode("signup")} style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: C.red, fontSize: "13px", fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 500, padding: 0,
                      borderBottom: `1px solid rgba(198,40,40,0.35)`,
                      paddingBottom: "1px",
                    }}>Create one now</button>
                  </p>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <Field label="First" placeholder="Jane" value={first} onChange={setFirst}
                        autoComplete="given-name" icon={userIcon} delay={0.05} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Field label="Last" placeholder="Doe" value={last} onChange={setLast}
                        autoComplete="family-name" delay={0.1} />
                    </div>
                  </div>
                  <Field label="Work Email" type="email" placeholder="you@jbrstaffingsolutions.com"
                    value={signEmail} onChange={setSignEmail} autoComplete="email"
                    icon={emailIcon} hint="@jbrstaffingsolutions.com" delay={0.15} />
                  <Field label="Password" type="password" placeholder="Create a strong password"
                    value={signPwd} onChange={setSignPwd} autoComplete="new-password"
                    icon={lockIcon} delay={0.2} />
                  <PwdStrength pwd={signPwd} />
                  <p style={{ fontSize: "11px", color: "rgba(107,107,104,0.5)", lineHeight: 1.7, marginBottom: "16px" }}>
                    By registering you agree to our{" "}
                    <span style={{ color: C.mutedLight, cursor: "pointer", borderBottom: `1px solid rgba(154,152,150,0.3)` }}>Terms</span>
                    {" "}&amp;{" "}
                    <span style={{ color: C.mutedLight, cursor: "pointer", borderBottom: `1px solid rgba(154,152,150,0.3)` }}>Privacy Policy</span>.
                  </p>
                  <PrimaryBtn label="Create Account" loading={loading} onClick={submit} />
                  <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: C.muted }}>
                    Already registered?{" "}
                    <button onClick={() => switchMode("signin")} style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: C.red, fontSize: "13px", fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 500, padding: 0,
                      borderBottom: `1px solid rgba(198,40,40,0.35)`,
                      paddingBottom: "1px",
                    }}>Sign in</button>
                  </p>
                </>
              )}
            </div>

            <SuccessFlash visible={success} mode={mode} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .brand-hide { display: none !important; }
        }
      `}</style>
    </>
  );
}