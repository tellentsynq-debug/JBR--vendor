"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Plus, Search, Edit2, Trash2, Settings,
  Briefcase, Layers, Users, Link as LinkIcon, MapPin,
  Map, Calendar, Copy, ExternalLink, X, ChevronDown,
  AlertTriangle, Loader2, RefreshCw, CheckCircle, XCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

/* ─── DESIGN TOKENS ──────────────────────────────────────────── */
const C = {
  bg: "#F0F2F5",
  surface: "#FFFFFF",
  border: "rgba(0,0,0,0.07)",
  borderHover: "rgba(0,0,0,0.14)",
  textHeading: "#111111",
  textBody: "#1A1A1A",
  textLabel: "#374151",
  textMuted: "#6B7280",
  textHint: "#9BA3AF",
  red: "#C62828",
  redBright: "#E53935",
  redGlow: "rgba(229,57,53,0.20)",
  redActiveBg: "rgba(198,40,40,0.08)",
  inputBg: "#F4F6F8",
  white: "#FFFFFF",
  successBg: "rgba(5,150,105,0.10)",
  successText: "#059669",
  alertBg: "rgba(198,40,40,0.08)",
  alertText: "#C62828",
  shadow: "rgba(0,0,0,0.06)",
  shadowMd: "rgba(0,0,0,0.10)",
};

const BASE_URL = "https://jbrstaffingsolutions.com/api";

/* ─── GLOBAL CSS ─────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.textBody}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.borderHover}; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
  .clean-card { background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 16px; box-shadow: 0 1px 3px ${C.shadow}, 0 4px 16px ${C.shadow}; }
  .sub-nav-container::-webkit-scrollbar { display: none; }
  select { appearance: none; -webkit-appearance: none; }
`;

/* ─── TYPES ──────────────────────────────────────────────────── */
interface Industry {
  id: number;
  name: string;
  description?: string;
  status: string;
  created_at?: string;
}

interface Category {
  id: number;
  category_name: string;
  job_industry_id: number;
  industry_name?: string;
  description?: string;
  status: string;
  license_required: boolean | number;
  created_at?: string;
}

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("jbr_token") || ""
      : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...getAuthHeaders(), ...(options.headers as Record<string, string> || {}) },
    });
    const json = await res.json();
    if (!res.ok) {
      return { data: null, error: json?.message || `Error ${res.status}` };
    }
    return { data: json, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

/* ─── TOAST ──────────────────────────────────────────────────── */
interface Toast { id: number; message: string; type: "success" | "error" }

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 999, display: "flex", flexDirection: "column", gap: "10px" }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 18px", borderRadius: "10px", background: C.surface, border: `1px solid ${t.type === "success" ? C.successText : C.red}`, boxShadow: `0 4px 16px ${C.shadowMd}`, minWidth: "260px", maxWidth: "360px" }}>
            {t.type === "success"
              ? <CheckCircle size={18} color={C.successText} />
              : <XCircle size={18} color={C.red} />}
            <span style={{ fontSize: "13px", fontWeight: 500, color: C.textBody, flex: 1 }}>{t.message}</span>
            <button onClick={() => onRemove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textHint, display: "flex" }}>
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;
  const add = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now() + counter++;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  const remove = useCallback((id: number) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

/* ─── SUB TABS ───────────────────────────────────────────────── */
const SUB_TABS = [
  { id: "industries",  label: "Job Industries",  icon: Briefcase },
  { id: "categories",  label: "Job Categories",  icon: Layers },
  { id: "groups",      label: "Groups",           icon: Users },
  { id: "campaigns",   label: "Campaigns",        icon: LinkIcon },
  { id: "provinces",   label: "Provinces",        icon: MapPin },
  { id: "cities",      label: "Cities",           icon: Map },
];

/* ─── STATIC MOCK DATA (non-API tabs) ────────────────────────── */
const MOCK_GROUPS = [
  { id: 1, name: "18 Wheels FO",         desc: "",                          status: "Active", created: "1/7/2026"  },
  { id: 2, name: "18 Wheels GL",         desc: "18 Wheels Client Candidates", status: "Active", created: "8/12/2025" },
  { id: 3, name: "Aerostream Logistics", desc: "",                          status: "Active", created: "1/7/2026"  },
];
const MOCK_CAMPAIGNS = [
  { id: 1, name: "JBR", range: "Jun 26, 2025 - May 31, 2026", status: "Active", created: "Jul 07, 2025" },
];
const MOCK_PROVINCES = [
  { id: 1, name: "Alberta",          code: "AB", status: "Active"   },
  { id: 2, name: "British Columbia", code: "BC", status: "Active"   },
  { id: 3, name: "Manitoba",         code: "MB", status: "Inactive" },
  { id: 4, name: "New Brunswick",    code: "NB", status: "Inactive" },
];
const MOCK_CITIES = [
  { id: 1, name: "Brampton",  province: "Ontario (ON)",          status: "Active" },
  { id: 2, name: "Burlington", province: "Ontario (ON)",         status: "Active" },
  { id: 3, name: "Burnaby",   province: "British Columbia (BC)", status: "Active" },
  { id: 4, name: "Caledon",   province: "Ontario (ON)",          status: "Active" },
];

/* ─── ANIMATION VARIANTS ─────────────────────────────────────── */
const easeOutCirc = [0.0, 0.55, 0.45, 1];
const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const itemVars = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } } };

/* ─── REUSABLE UI ─────────────────────────────────────────────── */
function TopNav() {
  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: easeOutCirc }}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHint, fontWeight: 600 }}>Administration</span>
        <span style={{ color: C.textMuted }}>/</span>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHeading, fontWeight: 600 }}>Master Management</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ fontSize: "13px", color: C.textMuted }}>Welcome, <span style={{ color: C.textHeading, fontWeight: 600 }}>support@jbrstaffingsolutions.ca</span></span>
        <motion.button whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} whileTap={{ scale: 0.98 }}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
          Sign Out <LogOut size={16} />
        </motion.button>
      </div>
    </motion.header>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status?.toLowerCase() === "active";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: "20px", background: isActive ? C.successBg : C.alertBg, color: isActive ? C.successText : C.alertText, fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
      {status}
    </div>
  );
}

function ActionButtons({ onEdit, onDelete, loading }: { onEdit?: () => void; onDelete?: () => void; loading?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <motion.button onClick={onEdit} disabled={loading} whileHover={{ scale: 1.1, color: C.red, borderColor: C.red, backgroundColor: C.redActiveBg }} whileTap={{ scale: 0.9 }}
        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textHint, cursor: loading ? "not-allowed" : "pointer", padding: "8px", display: "flex", transition: "all 0.2s", opacity: loading ? 0.5 : 1 }}>
        <Edit2 size={16} />
      </motion.button>
      <motion.button onClick={onDelete} disabled={loading} whileHover={{ scale: 1.1, color: C.redBright, borderColor: C.redBright, backgroundColor: C.redActiveBg }} whileTap={{ scale: 0.9 }}
        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textHint, cursor: loading ? "not-allowed" : "pointer", padding: "8px", display: "flex", transition: "all 0.2s", opacity: loading ? 0.5 : 1 }}>
        <Trash2 size={16} />
      </motion.button>
    </div>
  );
}

function SearchBar({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: "relative", marginBottom: "24px" }}>
      <Search size={16} color={C.textHint} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
      <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "12px 16px 12px 42px", color: C.textBody, fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
        onFocus={(e) => (e.target.style.borderColor = C.red)}
        onBlur={(e) => (e.target.style.borderColor = C.border)}
      />
    </div>
  );
}

function AddButton({ label, onClick, loading }: { label: string; onClick?: () => void; loading?: boolean }) {
  return (
    <motion.button onClick={onClick} disabled={loading} whileHover={{ y: -2, boxShadow: `0 4px 16px ${C.redGlow}` }} whileTap={{ scale: 0.98 }}
      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`, border: "none", borderRadius: "8px", color: C.white, fontSize: "14px", fontWeight: 600, letterSpacing: "0.5px", cursor: loading ? "not-allowed" : "pointer", boxShadow: `0 2px 8px ${C.redGlow}`, opacity: loading ? 0.7 : 1 }}>
      {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Plus size={16} />}
      <span>{label}</span>
    </motion.button>
  );
}

function LoadingState() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", gap: "12px", color: C.textMuted }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: C.red }} />
      <span style={{ fontSize: "14px" }}>Loading...</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", color: C.textMuted }}>
      <span style={{ fontSize: "14px" }}>{message}</span>
    </div>
  );
}

/* ─── FORM COMPONENTS ─────────────────────────────────────────── */
function FormField({ label, placeholder, type = "text", autoFocus = false, value, onChange }: {
  label: string; placeholder: string; type?: string; autoFocus?: boolean; value?: string; onChange?: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: C.textLabel, letterSpacing: "0.3px" }}>{label}</label>
      <input type={type} placeholder={placeholder} autoFocus={autoFocus} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: "100%", padding: "11px 14px", background: C.inputBg, border: `1.5px solid ${focused ? C.red : C.border}`, borderRadius: "8px", color: C.textBody, fontSize: "14px", outline: "none", transition: "all 0.2s ease", fontFamily: "'DM Sans', sans-serif" }}
      />
    </div>
  );
}

function FormTextArea({ label, placeholder, value, onChange }: { label: string; placeholder: string; value?: string; onChange?: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: C.textLabel, letterSpacing: "0.3px" }}>{label}</label>
      <textarea placeholder={placeholder} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: "100%", padding: "11px 14px", minHeight: "100px", resize: "vertical", background: C.inputBg, border: `1.5px solid ${focused ? C.red : C.border}`, borderRadius: "8px", color: C.textBody, fontSize: "14px", outline: "none", transition: "all 0.2s ease", fontFamily: "'DM Sans', sans-serif" }}
      />
    </div>
  );
}

function FormSelect({ label, placeholder, options, value, onChange }: {
  label: string; placeholder: string; options: { value: string; label: string }[]; value?: string; onChange?: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: C.textLabel, letterSpacing: "0.3px" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: "100%", padding: "11px 40px 11px 14px", background: C.inputBg, border: `1.5px solid ${focused ? C.red : C.border}`, borderRadius: "8px", color: value ? C.textBody : C.textHint, fontSize: "14px", outline: "none", transition: "all 0.2s ease", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={16} color={C.textHint} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function ToggleSwitch({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div onClick={() => onChange(!value)}
        style={{ width: "44px", height: "24px", borderRadius: "12px", background: value ? C.successText : C.borderHover, position: "relative", cursor: "pointer", transition: "background 0.3s ease", flexShrink: 0 }}>
        <motion.div layout initial={false} animate={{ x: value ? 22 : 2 }}
          style={{ width: "20px", height: "20px", borderRadius: "50%", background: C.white, position: "absolute", top: "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
      <span style={{ fontSize: "14px", color: C.textBody, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

/* ─── MODAL SHELL ────────────────────────────────────────────── */
function ModalShell({ isOpen, onClose, title, subtitle, submitLabel = "Create", onSubmit, children, loading }: {
  isOpen: boolean; onClose: () => void; title: string; subtitle: string;
  submitLabel?: string; onSubmit?: () => void; children: React.ReactNode; loading?: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }} onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, type: "spring", bounce: 0.25 }}
            style={{ position: "relative", width: "100%", maxWidth: "560px", margin: "24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "20px", boxShadow: `0 8px 32px ${C.shadowMd}` }}>
            <div style={{ padding: "28px 28px 20px", borderBottom: `1px solid ${C.border}` }}>
              <button onClick={onClose}
                style={{ position: "absolute", right: "20px", top: "20px", background: "transparent", border: "none", color: C.textHint, cursor: "pointer", padding: "4px", display: "flex", borderRadius: "6px" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.textHeading)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textHint)}>
                <X size={20} />
              </button>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: C.textHeading, marginBottom: "4px" }}>{title}</h2>
              <p style={{ fontSize: "13px", color: C.textMuted }}>{subtitle}</p>
            </div>
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>{children}</div>
            <div style={{ padding: "0 28px 24px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <motion.button whileHover={{ backgroundColor: C.inputBg, borderColor: C.borderHover }} whileTap={{ scale: 0.98 }}
                onClick={onClose} disabled={loading}
                style={{ padding: "10px 20px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "8px", color: C.textLabel, fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                Cancel
              </motion.button>
              <motion.button whileHover={{ y: -1, boxShadow: `0 4px 16px ${C.redGlow}` }} whileTap={{ scale: 0.98 }}
                onClick={onSubmit} disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`, border: "none", borderRadius: "8px", color: C.white, fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", boxShadow: `0 2px 8px ${C.redGlow}`, opacity: loading ? 0.7 : 1 }}>
                {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                {submitLabel}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── DELETE MODAL ───────────────────────────────────────────── */
function DeleteModal({ isOpen, onClose, onConfirm, itemLabel, loading }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; itemLabel: string; loading?: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }} onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
            style={{ position: "relative", width: "100%", maxWidth: "440px", margin: "24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", boxShadow: `0 8px 32px ${C.shadowMd}`, padding: "28px" }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: C.alertBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertTriangle size={20} color={C.red} />
              </div>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: C.textHeading, marginBottom: "6px" }}>Are you sure?</h3>
                <p style={{ fontSize: "14px", color: C.textMuted, lineHeight: 1.5 }}>
                  This cannot be undone. This will permanently delete the <strong style={{ color: C.textBody }}>{itemLabel}</strong>.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <motion.button whileHover={{ backgroundColor: C.inputBg }} whileTap={{ scale: 0.98 }}
                onClick={onClose} disabled={loading}
                style={{ padding: "9px 18px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "8px", color: C.textLabel, fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                Cancel
              </motion.button>
              <motion.button whileHover={{ y: -1, boxShadow: `0 4px 16px ${C.redGlow}` }} whileTap={{ scale: 0.98 }}
                onClick={onConfirm} disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 20px", background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`, border: "none", borderRadius: "8px", color: C.white, fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", boxShadow: `0 2px 8px ${C.redGlow}`, opacity: loading ? 0.7 : 1 }}>
                {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                Delete
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── INDUSTRY MODAL ─────────────────────────────────────────── */
interface IndustryForm { name: string; description: string; status: boolean }

function IndustryModal({ isOpen, onClose, mode = "create", initial, onSubmit, loading }: {
  isOpen: boolean; onClose: () => void; mode?: "create" | "edit";
  initial?: IndustryForm; onSubmit: (data: IndustryForm) => void; loading?: boolean;
}) {
  const [form, setForm] = useState<IndustryForm>({ name: "", description: "", status: true });
  useEffect(() => {
    if (isOpen) setForm(initial ?? { name: "", description: "", status: true });
  }, [isOpen, initial]);

  return (
    <ModalShell isOpen={isOpen} onClose={onClose}
      title={mode === "create" ? "Create New Job Industry" : "Edit Job Industry"}
      subtitle={mode === "create" ? "Enter the details for the new job industry." : "Update the job industry information below."}
      submitLabel={mode === "create" ? "Create" : "Update"}
      onSubmit={() => onSubmit(form)} loading={loading}>
      <FormField label="Name *" placeholder="Enter industry name" autoFocus value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
      <FormTextArea label="Description" placeholder="Enter industry description (optional)" value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} />
      <ToggleSwitch label="Active" value={form.status} onChange={(v) => setForm((p) => ({ ...p, status: v }))} />
    </ModalShell>
  );
}

/* ─── CATEGORY MODAL ─────────────────────────────────────────── */
interface CategoryForm { category_name: string; job_industry_id: string; description: string; status: boolean; license_required: boolean }

function CategoryModal({ isOpen, onClose, mode = "create", initial, industries, onSubmit, loading }: {
  isOpen: boolean; onClose: () => void; mode?: "create" | "edit";
  initial?: CategoryForm; industries: Industry[]; onSubmit: (data: CategoryForm) => void; loading?: boolean;
}) {
  const [form, setForm] = useState<CategoryForm>({ category_name: "", job_industry_id: "", description: "", status: true, license_required: false });
  useEffect(() => {
    if (isOpen) setForm(initial ?? { category_name: "", job_industry_id: "", description: "", status: true, license_required: false });
  }, [isOpen, initial]);

  const industryOptions = industries.map((i) => ({ value: String(i.id), label: i.name }));

  return (
    <ModalShell isOpen={isOpen} onClose={onClose}
      title={mode === "create" ? "Add New Job Category" : "Edit Job Category"}
      subtitle={mode === "create" ? "Create a new job category." : "Update job category information."}
      submitLabel={mode === "create" ? "Create" : "Update"}
      onSubmit={() => onSubmit(form)} loading={loading}>
      <FormField label="Category Name *" placeholder="e.g., Healthcare, Construction, IT" autoFocus value={form.category_name} onChange={(v) => setForm((p) => ({ ...p, category_name: v }))} />
      <FormSelect label="Job Industry *" placeholder="Select a job industry" options={industryOptions} value={form.job_industry_id} onChange={(v) => setForm((p) => ({ ...p, job_industry_id: v }))} />
      <FormTextArea label="Description" placeholder="Brief description of this job category..." value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <ToggleSwitch label="Active" value={form.status} onChange={(v) => setForm((p) => ({ ...p, status: v }))} />
        <ToggleSwitch label="License Required" value={form.license_required} onChange={(v) => setForm((p) => ({ ...p, license_required: v }))} />
      </div>
    </ModalShell>
  );
}

/* ─── STATIC MODALS (Groups, Campaigns, Provinces, Cities) ───── */
function GroupModal({ isOpen, onClose, mode = "create" }: { isOpen: boolean; onClose: () => void; mode?: "create" | "edit" }) {
  const [name, setName] = useState(""); const [desc, setDesc] = useState(""); const [active, setActive] = useState(true);
  useEffect(() => { if (isOpen) { setName(""); setDesc(""); setActive(true); } }, [isOpen]);
  return (
    <ModalShell isOpen={isOpen} onClose={onClose}
      title={mode === "create" ? "Create New Group" : "Edit Group"}
      subtitle={mode === "create" ? "Enter the details for the new group." : "Update the group details below."}
      submitLabel={mode === "create" ? "Create" : "Update"} onSubmit={onClose}>
      <FormField label="Group Name *" placeholder="Enter group name" autoFocus value={name} onChange={setName} />
      <FormTextArea label="Job Group Description" placeholder="Describe the purpose/criteria of this group" value={desc} onChange={setDesc} />
      <ToggleSwitch label="Active" value={active} onChange={setActive} />
    </ModalShell>
  );
}

function CampaignModal({ isOpen, onClose, mode = "create" }: { isOpen: boolean; onClose: () => void; mode?: "create" | "edit" }) {
  const [name, setName] = useState(""); const [start, setStart] = useState(""); const [end, setEnd] = useState(""); const [active, setActive] = useState(true);
  useEffect(() => { if (isOpen) { setName(""); setStart(""); setEnd(""); setActive(true); } }, [isOpen]);
  return (
    <ModalShell isOpen={isOpen} onClose={onClose}
      title={mode === "create" ? "Add New Campaign" : "Edit Campaign"}
      subtitle={mode === "create" ? "Create a new recruitment campaign." : "Update campaign information."}
      submitLabel={mode === "create" ? "Create" : "Update"} onSubmit={onClose}>
      <FormField label="Campaign Name" placeholder="e.g., Summer 2024 Healthcare Recruitment" autoFocus value={name} onChange={setName} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FormField label="Start Date" placeholder="dd-mm-yyyy" type="date" value={start} onChange={setStart} />
        <FormField label="End Date" placeholder="dd-mm-yyyy" type="date" value={end} onChange={setEnd} />
      </div>
      <ToggleSwitch label="Active" value={active} onChange={setActive} />
    </ModalShell>
  );
}

function ProvinceModal({ isOpen, onClose, mode = "create" }: { isOpen: boolean; onClose: () => void; mode?: "create" | "edit" }) {
  const [name, setName] = useState(""); const [code, setCode] = useState(""); const [active, setActive] = useState(true);
  useEffect(() => { if (isOpen) { setName(""); setCode(""); setActive(true); } }, [isOpen]);
  return (
    <ModalShell isOpen={isOpen} onClose={onClose}
      title={mode === "create" ? "Add New Province" : "Edit Province"}
      subtitle={mode === "create" ? "Create a new province entry." : "Update province information."}
      submitLabel={mode === "create" ? "Create" : "Update"} onSubmit={onClose}>
      <FormField label="Province Name" placeholder="e.g., Ontario" autoFocus value={name} onChange={setName} />
      <FormField label="Province Code" placeholder="e.g., ON" value={code} onChange={setCode} />
      <ToggleSwitch label="Active" value={active} onChange={setActive} />
    </ModalShell>
  );
}

function CityModal({ isOpen, onClose, mode = "create" }: { isOpen: boolean; onClose: () => void; mode?: "create" | "edit" }) {
  const [name, setName] = useState(""); const [province, setProvince] = useState(""); const [active, setActive] = useState(true);
  useEffect(() => { if (isOpen) { setName(""); setProvince(""); setActive(true); } }, [isOpen]);
  return (
    <ModalShell isOpen={isOpen} onClose={onClose}
      title={mode === "create" ? "Add New City" : "Edit City"}
      subtitle={mode === "create" ? "Create a new city entry." : "Update city information."}
      submitLabel={mode === "create" ? "Create" : "Update"} onSubmit={onClose}>
      <FormField label="City Name" placeholder="e.g., Toronto" autoFocus value={name} onChange={setName} />
      <FormSelect label="Province" placeholder="Select a province"
        options={[
          { value: "AB", label: "Alberta (AB)" }, { value: "BC", label: "British Columbia (BC)" },
          { value: "MB", label: "Manitoba (MB)" }, { value: "NB", label: "New Brunswick (NB)" },
          { value: "ON", label: "Ontario (ON)" }, { value: "QC", label: "Quebec (QC)" },
        ]}
        value={province} onChange={setProvince} />
      <ToggleSwitch label="Active" value={active} onChange={setActive} />
    </ModalShell>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function MasterManagementPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("industries");
  const { toasts, add: addToast, remove: removeToast } = useToast();

  /* ── Industries State ── */
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [industryLoading, setIndustryLoading] = useState(false);
  const [industrySearch, setIndustrySearch] = useState("");
  const [industryCreateOpen, setIndustryCreateOpen] = useState(false);
  const [industryEditOpen, setIndustryEditOpen] = useState(false);
  const [industryEditTarget, setIndustryEditTarget] = useState<Industry | null>(null);
  const [industryDeleteTarget, setIndustryDeleteTarget] = useState<Industry | null>(null);
  const [industryModalLoading, setIndustryModalLoading] = useState(false);

  /* ── Categories State ── */
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryCreateOpen, setCategoryCreateOpen] = useState(false);
  const [categoryEditOpen, setCategoryEditOpen] = useState(false);
  const [categoryEditTarget, setCategoryEditTarget] = useState<Category | null>(null);
  const [categoryDeleteTarget, setCategoryDeleteTarget] = useState<Category | null>(null);
  const [categoryModalLoading, setCategoryModalLoading] = useState(false);

  /* ── Static modal states ── */
  const [groupCreate, setGroupCreate] = useState(false);
  const [groupEdit, setGroupEdit] = useState(false);
  const [campaignCreate, setCampaignCreate] = useState(false);
  const [campaignEdit, setCampaignEdit] = useState(false);
  const [provinceCreate, setProvinceCreate] = useState(false);
  const [provinceEdit, setProvinceEdit] = useState(false);
  const [cityCreate, setCityCreate] = useState(false);
  const [cityEdit, setCityEdit] = useState(false);
  const [genericDeleteOpen, setGenericDeleteOpen] = useState(false);
  const [genericDeleteLabel, setGenericDeleteLabel] = useState("");

  /* ── Fetch Industries ── */
  const fetchIndustries = useCallback(async () => {
    setIndustryLoading(true);
    const { data, error } = await apiFetch<{ data: Industry[] }>("/job-industries");
    if (error) addToast(error, "error");
    else setIndustries(data?.data ?? []);
    setIndustryLoading(false);
  }, [addToast]);

  /* ── Fetch Categories ── */
  const fetchCategories = useCallback(async () => {
    setCategoryLoading(true);
    const { data, error } = await apiFetch<{ data: Category[] }>("/job-categories");
    if (error) addToast(error, "error");
    else setCategories(data?.data ?? []);
    setCategoryLoading(false);
  }, [addToast]);

  useEffect(() => { fetchIndustries(); }, [fetchIndustries]);
  useEffect(() => { if (activeSubTab === "categories") fetchCategories(); }, [activeSubTab, fetchCategories]);

  /* ── Industry CRUD ── */
  const handleIndustryCreate = async (form: IndustryForm) => {
    setIndustryModalLoading(true);
    const { data, error } = await apiFetch<Industry>("/job-industries", {
      method: "POST",
      body: JSON.stringify({ name: form.name, description: form.description, status: form.status ? "active" : "inactive" }),
    });
    setIndustryModalLoading(false);
    if (error) { addToast(error, "error"); return; }
    addToast(`Industry "${(data as unknown as { name: string })?.name}" created successfully!`);
    setIndustryCreateOpen(false);
    fetchIndustries();
  };

  const handleIndustryEdit = async (form: IndustryForm) => {
    if (!industryEditTarget) return;
    setIndustryModalLoading(true);
    const { error } = await apiFetch(`/job-industries/${industryEditTarget.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: form.name, description: form.description, status: form.status ? "active" : "inactive" }),
    });
    setIndustryModalLoading(false);
    if (error) { addToast(error, "error"); return; }
    addToast("Industry updated successfully!");
    setIndustryEditOpen(false);
    setIndustryEditTarget(null);
    fetchIndustries();
  };

  const handleIndustryDelete = async () => {
    if (!industryDeleteTarget) return;
    setIndustryModalLoading(true);
    const { error } = await apiFetch(`/job-industries/${industryDeleteTarget.id}`, { method: "DELETE" });
    setIndustryModalLoading(false);
    if (error) { addToast(error, "error"); return; }
    addToast(`Industry "${industryDeleteTarget.name}" deleted.`);
    setIndustryDeleteTarget(null);
    fetchIndustries();
  };

  /* ── Category CRUD ── */
  const handleCategoryCreate = async (form: CategoryForm) => {
    setCategoryModalLoading(true);
    const { data, error } = await apiFetch<Category>("/job-categories/", {
      method: "POST",
      body: JSON.stringify({
        category_name: form.category_name,
        job_industry_id: Number(form.job_industry_id),
        description: form.description,
        status: form.status ? "active" : "inactive",
        license_required: form.license_required,
      }),
    });
    setCategoryModalLoading(false);
    if (error) { addToast(error, "error"); return; }
    addToast(`Category "${(data as unknown as { category_name: string })?.category_name}" created!`);
    setCategoryCreateOpen(false);
    fetchCategories();
  };

  const handleCategoryEdit = async (form: CategoryForm) => {
    if (!categoryEditTarget) return;
    setCategoryModalLoading(true);
    const { error } = await apiFetch(`/job-categories/${categoryEditTarget.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        category_name: form.category_name,
        job_industry_id: Number(form.job_industry_id),
        description: form.description,
        status: form.status ? "active" : "inactive",
        license_required: form.license_required,
      }),
    });
    setCategoryModalLoading(false);
    if (error) { addToast(error, "error"); return; }
    addToast("Category updated successfully!");
    setCategoryEditOpen(false);
    setCategoryEditTarget(null);
    fetchCategories();
  };

  const handleCategoryDelete = async () => {
    if (!categoryDeleteTarget) return;
    setCategoryModalLoading(true);
    const { error } = await apiFetch(`/job-categories/${categoryDeleteTarget.id}`, { method: "DELETE" });
    setCategoryModalLoading(false);
    if (error) { addToast(error, "error"); return; }
    addToast(`Category "${categoryDeleteTarget.category_name}" deleted.`);
    setCategoryDeleteTarget(null);
    fetchCategories();
  };

  /* ── Filtered data ── */
  const filteredIndustries = industries.filter((i) =>
    i.name?.toLowerCase().includes(industrySearch.toLowerCase()) ||
    i.description?.toLowerCase().includes(industrySearch.toLowerCase())
  );
  const filteredCategories = categories.filter((c) =>
    c.category_name?.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.industry_name?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  /* ── Sub-Nav ── */
  const renderSubNav = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
      className="sub-nav-container"
      style={{ display: "flex", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "6px", marginBottom: "32px", overflowX: "auto", whiteSpace: "nowrap" }}>
      {SUB_TABS.map((tab) => {
        const isActive = activeSubTab === tab.id;
        const Icon = tab.icon;
        return (
          <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
            style={{ flex: 1, minWidth: "150px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px 16px", background: "transparent", border: "none", borderRadius: "8px", cursor: "pointer", color: isActive ? C.red : C.textLabel, fontSize: "14px", fontWeight: isActive ? 600 : 500, position: "relative", transition: "color 0.2s ease" }}>
            {isActive && <motion.div layoutId="masterSubNav" style={{ position: "absolute", inset: 0, background: C.redActiveBg, borderRadius: "8px" }} />}
            <Icon size={16} style={{ position: "relative", zIndex: 1 }} />
            <span style={{ position: "relative", zIndex: 1 }}>{tab.label}</span>
          </button>
        );
      })}
    </motion.div>
  );

  /* ── Render Industries ── */
  const renderIndustries = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px" }}>Job Industries</h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Manage job industries and their configurations</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <motion.button onClick={fetchIndustries} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "8px", color: C.textLabel, fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            <RefreshCw size={14} style={{ animation: industryLoading ? "spin 1s linear infinite" : "none" }} /> Refresh
          </motion.button>
          <AddButton label="Add Industry" onClick={() => setIndustryCreateOpen(true)} />
        </div>
      </div>
      <SearchBar placeholder="Search by name or description" value={industrySearch} onChange={setIndustrySearch} />
      {industryLoading ? <LoadingState /> : filteredIndustries.length === 0 ? <EmptyState message="No industries found." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredIndustries.map((item) => (
            <motion.div key={item.id} variants={itemVars} whileHover={{ backgroundColor: C.inputBg }}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", transition: "background-color 0.2s" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: C.textHeading }}>{item.name}</span>
                  <StatusBadge status={item.status} />
                </div>
                {item.description && <span style={{ fontSize: "13px", color: C.textMuted }}>{item.description}</span>}
                <span style={{ fontSize: "12px", color: C.textMuted }}>
                  Created: {item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}
                </span>
              </div>
              <ActionButtons
                onEdit={() => { setIndustryEditTarget(item); setIndustryEditOpen(true); }}
                onDelete={() => setIndustryDeleteTarget(item)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  /* ── Render Categories ── */
  const renderCategories = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={20} color={C.red} strokeWidth={2} /> Job Categories Management
          </h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Manage job categories and license requirements for candidate applications</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <motion.button onClick={fetchCategories} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "8px", color: C.textLabel, fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            <RefreshCw size={14} style={{ animation: categoryLoading ? "spin 1s linear infinite" : "none" }} /> Refresh
          </motion.button>
          <AddButton label="Add Category" onClick={() => setCategoryCreateOpen(true)} />
        </div>
      </div>
      <SearchBar placeholder="Search job categories..." value={categorySearch} onChange={setCategorySearch} />
      {categoryLoading ? <LoadingState /> : filteredCategories.length === 0 ? <EmptyState message="No categories found." /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredCategories.map((item) => (
            <motion.div key={item.id} variants={itemVars} whileHover={{ borderColor: C.borderHover, boxShadow: `0 4px 16px ${C.shadow}` }}
              style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", minHeight: "140px", transition: "all 0.2s" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 600, color: C.textHeading }}>{item.category_name}</span>
                  <StatusBadge status={item.status} />
                </div>
                <span style={{ fontSize: "13px", color: C.textMuted }}>Industry: {item.industry_name || `ID ${item.job_industry_id}`}</span>
                {item.description && <p style={{ fontSize: "12px", color: C.textMuted, marginTop: "6px" }}>{item.description}</p>}
                {(item.license_required === 1 || item.license_required === true) && (
                  <div style={{ marginTop: "8px", display: "inline-flex", padding: "3px 8px", borderRadius: "6px", background: "rgba(59,130,246,0.08)", color: "#3B82F6", fontSize: "11px", fontWeight: 600 }}>
                    License Required
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <ActionButtons
                  onEdit={() => {
                    setCategoryEditTarget(item);
                    setCategoryEditOpen(true);
                  }}
                  onDelete={() => setCategoryDeleteTarget(item)}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  /* ── Render Groups (static) ── */
  const renderGroups = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px" }}>Master Groups</h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Create groups to shortlist and manage candidates</p>
        </div>
        <AddButton label="Add Group" onClick={() => setGroupCreate(true)} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MOCK_GROUPS.map((item) => (
          <motion.div key={item.id} variants={itemVars} whileHover={{ backgroundColor: C.inputBg }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", transition: "background-color 0.2s" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Users size={18} color={C.textHint} />
                <span style={{ fontSize: "16px", fontWeight: 600, color: C.textHeading }}>{item.name}</span>
                <StatusBadge status={item.status} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {item.desc && <span style={{ fontSize: "13px", color: C.textMuted }}>{item.desc}</span>}
                <span style={{ fontSize: "12px", color: C.textHint }}>Created: {item.created}</span>
              </div>
            </div>
            <ActionButtons onEdit={() => setGroupEdit(true)} onDelete={() => { setGenericDeleteLabel("group and its memberships"); setGenericDeleteOpen(true); }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  /* ── Render Campaigns (static) ── */
  const renderCampaigns = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Users size={20} color={C.red} strokeWidth={2} /> Campaigns Management
          </h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Create and manage recruitment campaigns with registration links</p>
        </div>
        <AddButton label="Add Campaign" onClick={() => setCampaignCreate(true)} />
      </div>
      <SearchBar placeholder="Search campaigns..." value="" onChange={() => {}} />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MOCK_CAMPAIGNS.map((item) => (
          <motion.div key={item.id} variants={itemVars} whileHover={{ borderColor: C.borderHover }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", transition: "border-color 0.2s" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "16px", fontWeight: 600, color: C.textHeading }}>{item.name}</span>
                <StatusBadge status={item.status} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.textMuted, fontSize: "14px" }}>
                <Calendar size={16} /> {item.range}
              </div>
              <span style={{ fontSize: "12px", color: C.textHint }}>Created: {item.created}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <motion.button whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                <Copy size={16} /> Copy Link
              </motion.button>
              <motion.button whileHover={{ color: C.red }}
                style={{ background: "transparent", border: "none", color: C.textHint, cursor: "pointer", padding: "8px", transition: "color 0.2s" }}>
                <ExternalLink size={18} />
              </motion.button>
              <ActionButtons onEdit={() => setCampaignEdit(true)} onDelete={() => { setGenericDeleteLabel("campaign"); setGenericDeleteOpen(true); }} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  /* ── Render Provinces (static) ── */
  const renderProvinces = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px" }}>Provinces Management</h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Manage provinces and territories for candidate locations</p>
        </div>
        <AddButton label="Add Province" onClick={() => setProvinceCreate(true)} />
      </div>
      <SearchBar placeholder="Search provinces..." value="" onChange={() => {}} />
      <div style={{ border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", padding: "16px 24px", background: C.inputBg, borderBottom: `1px solid ${C.border}` }}>
          {["Province Name", "Code", "Status", "Actions"].map((h) => (
            <span key={h} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.textHint, fontWeight: 600 }}>{h}</span>
          ))}
        </div>
        {MOCK_PROVINCES.map((item, idx) => (
          <motion.div key={item.id} variants={itemVars} whileHover={{ backgroundColor: C.inputBg }}
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", alignItems: "center", padding: "16px 24px", borderBottom: idx !== MOCK_PROVINCES.length - 1 ? `1px solid ${C.border}` : "none", background: C.surface, transition: "background-color 0.2s" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: C.textHeading }}>{item.name}</span>
            <span style={{ fontSize: "14px", color: C.textMuted }}>{item.code}</span>
            <div><StatusBadge status={item.status} /></div>
            <ActionButtons onEdit={() => setProvinceEdit(true)} onDelete={() => { setGenericDeleteLabel("province"); setGenericDeleteOpen(true); }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  /* ── Render Cities (static) ── */
  const renderCities = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px" }}>Cities Management</h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Manage cities for candidate locations within provinces</p>
        </div>
        <AddButton label="Add City" onClick={() => setCityCreate(true)} />
      </div>
      <SearchBar placeholder="Search cities or provinces..." value="" onChange={() => {}} />
      <div style={{ border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 100px", padding: "16px 24px", background: C.inputBg, borderBottom: `1px solid ${C.border}` }}>
          {["City Name", "Province", "Status", "Actions"].map((h) => (
            <span key={h} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.textHint, fontWeight: 600 }}>{h}</span>
          ))}
        </div>
        {MOCK_CITIES.map((item, idx) => (
          <motion.div key={item.id} variants={itemVars} whileHover={{ backgroundColor: C.inputBg }}
            style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 100px", alignItems: "center", padding: "16px 24px", borderBottom: idx !== MOCK_CITIES.length - 1 ? `1px solid ${C.border}` : "none", background: C.surface, transition: "background-color 0.2s" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: C.textHeading }}>{item.name}</span>
            <span style={{ fontSize: "14px", color: C.textMuted }}>{item.province}</span>
            <div><StatusBadge status={item.status} /></div>
            <ActionButtons onEdit={() => setCityEdit(true)} onDelete={() => { setGenericDeleteLabel("city"); setGenericDeleteOpen(true); }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  /* ── industry edit initial form ── */
  const industryEditInitial: IndustryForm | undefined = industryEditTarget
    ? { name: industryEditTarget.name, description: industryEditTarget.description ?? "", status: industryEditTarget.status === "active" }
    : undefined;

  /* ── category edit initial form ── */
  const categoryEditInitial: CategoryForm | undefined = categoryEditTarget
    ? {
        category_name: categoryEditTarget.category_name,
        job_industry_id: String(categoryEditTarget.job_industry_id),
        description: categoryEditTarget.description ?? "",
        status: categoryEditTarget.status === "active",
        license_required: categoryEditTarget.license_required === 1 || categoryEditTarget.license_required === true,
      }
    : undefined;

  return (
    <>
      <style>{GLOBAL_CSS}
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} activeTab="master_mgmt" setActiveTab={() => {}} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
          <TopNav />

          <main style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column" }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: "32px" }}>
              <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.textHeading, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                <Settings size={32} color={C.red} strokeWidth={2} /> Master Management
              </h1>
              <p style={{ fontSize: "15px", color: C.textMuted }}>Manage job industries, job categories, campaigns, provinces, cities and their configurations.</p>
            </motion.div>

            {renderSubNav()}

            <AnimatePresence mode="wait">
              <motion.div key={activeSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                {activeSubTab === "industries" && renderIndustries()}
                {activeSubTab === "categories" && renderCategories()}
                {activeSubTab === "groups"     && renderGroups()}
                {activeSubTab === "campaigns"  && renderCampaigns()}
                {activeSubTab === "provinces"  && renderProvinces()}
                {activeSubTab === "cities"     && renderCities()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ── INDUSTRY MODALS ── */}
      <IndustryModal isOpen={industryCreateOpen} onClose={() => setIndustryCreateOpen(false)} mode="create" onSubmit={handleIndustryCreate} loading={industryModalLoading} />
      <IndustryModal isOpen={industryEditOpen} onClose={() => { setIndustryEditOpen(false); setIndustryEditTarget(null); }} mode="edit" initial={industryEditInitial} onSubmit={handleIndustryEdit} loading={industryModalLoading} />
      <DeleteModal isOpen={!!industryDeleteTarget} onClose={() => setIndustryDeleteTarget(null)} onConfirm={handleIndustryDelete} itemLabel={industryDeleteTarget?.name ?? "industry"} loading={industryModalLoading} />

      {/* ── CATEGORY MODALS ── */}
      <CategoryModal isOpen={categoryCreateOpen} onClose={() => setCategoryCreateOpen(false)} mode="create" industries={industries} onSubmit={handleCategoryCreate} loading={categoryModalLoading} />
      <CategoryModal isOpen={categoryEditOpen} onClose={() => { setCategoryEditOpen(false); setCategoryEditTarget(null); }} mode="edit" initial={categoryEditInitial} industries={industries} onSubmit={handleCategoryEdit} loading={categoryModalLoading} />
      <DeleteModal isOpen={!!categoryDeleteTarget} onClose={() => setCategoryDeleteTarget(null)} onConfirm={handleCategoryDelete} itemLabel={categoryDeleteTarget?.category_name ?? "category"} loading={categoryModalLoading} />

      {/* ── STATIC MODALS ── */}
      <GroupModal isOpen={groupCreate} onClose={() => setGroupCreate(false)} mode="create" />
      <GroupModal isOpen={groupEdit}   onClose={() => setGroupEdit(false)}   mode="edit" />
      <CampaignModal isOpen={campaignCreate} onClose={() => setCampaignCreate(false)} mode="create" />
      <CampaignModal isOpen={campaignEdit}   onClose={() => setCampaignEdit(false)}   mode="edit" />
      <ProvinceModal isOpen={provinceCreate} onClose={() => setProvinceCreate(false)} mode="create" />
      <ProvinceModal isOpen={provinceEdit}   onClose={() => setProvinceEdit(false)}   mode="edit" />
      <CityModal isOpen={cityCreate} onClose={() => setCityCreate(false)} mode="create" />
      <CityModal isOpen={cityEdit}   onClose={() => setCityEdit(false)}   mode="edit" />
      <DeleteModal isOpen={genericDeleteOpen} onClose={() => setGenericDeleteOpen(false)} onConfirm={() => setGenericDeleteOpen(false)} itemLabel={genericDeleteLabel} />

      {/* ── TOAST ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}