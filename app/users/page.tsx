"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Plus, Edit2, Trash2, UserCog, X, ChevronDown 
} from "lucide-react";

import Sidebar from "../components/Sidebar";

/* ─── DESIGN TOKENS (LIGHT GRAY PROFESSIONAL THEME) ─────────── */
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
  pendingBg: "rgba(59,130,246,0.08)",
  pendingBorder: "rgba(59,130,246,0.2)",
  pendingText: "#3B82F6",
  alertBg: "rgba(198,40,40,0.08)",
  alertText: "#C62828",
  shadow: "rgba(0,0,0,0.06)",
  shadowMd: "rgba(0,0,0,0.10)",
};

/* ─── GLOBAL CSS & ANIMATIONS ────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.textBody}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.borderHover}; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }

  .clean-card {
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: 16px;
    box-shadow: 0 1px 3px ${C.shadow}, 0 4px 16px ${C.shadow};
  }

  .table-container { width: 100%; overflow-x: auto; }
  .table-min-width { min-width: 1000px; }

  /* Custom Select Reset */
  select { appearance: none; background-color: transparent; cursor: pointer; }
  select option { background-color: ${C.surface}; color: ${C.textHeading}; }
`;

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const USERS_DATA = [
  { id: 1, name: "Abhishek Singh", email: "gamerkiang855@jbrstaffingsolutions.ca", role: "VIEWER", status: "Active", lastLogin: "Never" },
  { id: 2, name: "zdfdsf dsfdsf", email: "gamerkiang955@jbrstaffingsolutions.ca", role: "VIEWER", status: "Active", lastLogin: "Never" },
  { id: 3, name: "Anshwinder Singh", email: "anshwindersingh@jbrstaffingsolutions.ca", role: "VIEWER", status: "Active", lastLogin: "Never" },
  { id: 4, name: "Lovepreet Singh", email: "love@jbrstaffingsolutions.ca", role: "VIEWER", status: "Active", lastLogin: "Never" },
  { id: 5, name: "saedeh Ghayourisales", email: "saedeh.ghayourisales@jbrstaffingsolutions.ca", role: "VIEWER", status: "Active", lastLogin: "Never" },
  { id: 6, name: "Lovepreet Singh", email: "ls5477803@jbrstaffingsolutions.ca", role: "VIEWER", status: "Active", lastLogin: "Never" },
  { id: 7, name: "", email: "adityapanchal@jbrstaffingsolutions.ca", role: "RECRUITER", status: "Active", lastLogin: "Never" },
  { id: 8, name: "Jignesh Bharwad", email: "jignesh@jbrstaffingsolutions.ca", role: "SUPER ADMIN", status: "Active", lastLogin: "Never" },
  { id: 9, name: "Brijesh Patel", email: "support@jbrstaffingsolutions.ca", role: "SUPER ADMIN", status: "Active", lastLogin: "Never" },
  { id: 10, name: "Yash Bharwad", email: "sales@jbrstaffingsolutions.ca", role: "SUPER ADMIN", status: "Active", lastLogin: "Never" },
];

/* ─── HELPER FUNCTIONS ───────────────────────────────────────── */
const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case 'SUPER ADMIN': 
      return { bg: C.alertBg, color: C.alertText };
    case 'RECRUITER': 
      return { bg: C.successBg, color: C.successText };
    case 'VIEWER': 
    default: 
      return { bg: C.inputBg, color: C.textMuted };
  }
};

/* ─── ANIMATION VARIANTS ─────────────────────────────────────── */
const easeOutCirc = [0.0, 0.55, 0.45, 1];
const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }};
const itemVars = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }};

/* ─── COMPONENTS ─────────────────────────────────────────────── */

function TopNav() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: easeOutCirc }}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 40px", borderBottom: `1px solid ${C.border}`,
        background: C.surface,
        position: "sticky", top: 0, zIndex: 10
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHint, fontWeight: 600 }}>Administration</span>
        <span style={{ color: C.textMuted }}>/</span>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHeading, fontWeight: 600 }}>User Management</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ fontSize: "13px", color: C.textMuted }}>
          Welcome, <span style={{ color: C.textHeading, fontWeight: 600 }}>support@jbrstaffingsolutions.ca</span>
        </span>
        <motion.button 
          whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} whileTap={{ scale: 0.98 }}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
          Sign Out <LogOut size={16} />
        </motion.button>
      </div>
    </motion.header>
  );
}

// Custom Input Component for the Dialog
function FormField({ label, placeholder, type = "text", autoFocus = false }: { label: string, placeholder: string, type?: string, autoFocus?: boolean }) {
  const [focused, setFocused] = useState(autoFocus);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: C.textLabel }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input 
          type={type} 
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "12px 16px",
            background: C.inputBg,
            border: `1px solid ${focused ? C.red : C.border}`,
            borderRadius: "8px", color: C.textBody, fontSize: "14px",
            outline: "none", transition: "all 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}

// Custom Select Component for the Dialog
function FormSelect({ label, options }: { label: string, options: string[] }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: C.textLabel }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select 
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "12px 36px 12px 16px",
            background: C.inputBg,
            border: `1px solid ${focused ? C.red : C.border}`,
            borderRadius: "8px", color: C.textBody, fontSize: "14px",
            outline: "none", transition: "all 0.2s ease",
          }}
        >
          {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <ChevronDown size={16} color={C.textHint} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

// Custom Toggle Switch
function ToggleSwitch({ label }: { label: string }) {
  const [isOn, setIsOn] = useState(true);
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
      <div 
        onClick={() => setIsOn(!isOn)}
        style={{
          width: "44px", height: "24px", borderRadius: "12px",
          background: isOn ? C.successText : C.borderHover,
          position: "relative", cursor: "pointer", transition: "background 0.3s ease"
        }}
      >
        <motion.div 
          layout
          initial={false}
          animate={{ x: isOn ? 22 : 2 }}
          style={{
            width: "20px", height: "20px", borderRadius: "50%",
            background: C.white, position: "absolute", top: "2px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
          }}
        />
      </div>
      <span style={{ fontSize: "14px", color: C.textBody, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────── */
export default function UserManagementPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("user_mgmt");
  const [isModalOpen, setModalOpen] = useState(false);
  
  // Custom Table Layout
  const tableGridTemplate = "1.5fr 2fr 1fr 1fr 1fr 100px"; 

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        
        <Sidebar 
          isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} 
          activeTab={activeTab} setActiveTab={setActiveTab} 
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
          <TopNav />

          <main style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}
            >
              <div>
                <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.textHeading, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                  <UserCog size={32} color={C.red} strokeWidth={2} /> User Management
                </h1>
                <p style={{ fontSize: "15px", color: C.textMuted }}>
                  Manage users and their roles in the system.
                </p>
              </div>
              
              <motion.button 
                onClick={() => setModalOpen(true)}
                whileHover={{ y: -2, boxShadow: `0 4px 16px ${C.redGlow}` }} whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px",
                  background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`,
                  border: "none", borderRadius: "8px",
                  color: C.white, fontSize: "14px", fontWeight: 600, letterSpacing: "0.5px",
                  cursor: "pointer", position: "relative", overflow: "hidden",
                  boxShadow: `0 2px 8px ${C.redGlow}`
                }}
              >
                <Plus size={18} style={{ position: "relative", zIndex: 1 }} />
                <span style={{ position: "relative", zIndex: 1 }}>Add User</span>
              </motion.button>
            </motion.div>

            {/* Data Table Section */}
            <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              {/* Table Header Controls */}
              <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading }}>Users</h3>
                <p style={{ fontSize: "13px", color: C.textMuted, marginTop: "4px" }}>
                  Manage system users and their access levels
                </p>
              </div>

              {/* Responsive Table Container */}
              <div className="table-container">
                <div className="table-min-width">
                  
                  {/* Table Column Headers */}
                  <div style={{ display: "grid", gridTemplateColumns: tableGridTemplate, padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: C.inputBg, alignItems: "center" }}>
                    {["Name", "Email", "Role", "Status", "Last Login", "Actions"].map((head, i) => (
                      <span key={i} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.textHint, fontWeight: 600 }}>{head}</span>
                    ))}
                  </div>

                  {/* Table Rows */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {USERS_DATA.map((user, idx) => {
                      const roleStyle = getRoleBadgeStyle(user.role);
                      const isActive = user.status.toLowerCase() === "active";
                      
                      return (
                        <motion.div 
                          key={user.id} variants={itemVars}
                          whileHover={{ backgroundColor: C.inputBg }}
                          style={{ 
                            display: "grid", gridTemplateColumns: tableGridTemplate, alignItems: "center",
                            padding: "20px 32px", borderBottom: idx !== USERS_DATA.length - 1 ? `1px solid ${C.border}` : "none",
                            transition: "background-color 0.2s ease"
                          }}
                        >
                          {/* Name */}
                          <div style={{ fontSize: "15px", fontWeight: 600, color: C.textHeading }}>
                            {user.name || <span style={{ color: C.textHint, fontStyle: "italic", fontWeight: 500 }}>Not provided</span>}
                          </div>
                          
                          {/* Email */}
                          <div style={{ fontSize: "14px", color: C.textMuted, wordBreak: "break-all", paddingRight: "16px" }}>
                            {user.email}
                          </div>
                          
                          {/* Role Badge */}
                          <div>
                            <div style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "20px", background: roleStyle.bg, color: roleStyle.color, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              {user.role}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            <div style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "20px", background: isActive ? C.successBg : C.alertBg, color: isActive ? C.successText : C.alertText, fontSize: "11px", fontWeight: 600, textTransform: "capitalize", letterSpacing: "0.5px" }}>
                              {user.status}
                            </div>
                          </div>

                          {/* Last Login */}
                          <div style={{ fontSize: "14px", color: C.textMuted }}>
                            {user.lastLogin}
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <motion.button whileHover={{ scale: 1.1, backgroundColor: C.redActiveBg, color: C.red, borderColor: C.red }} whileTap={{ scale: 0.9 }} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textHint, cursor: "pointer", padding: "8px", display: "flex", transition: "all 0.2s" }}>
                              <Edit2 size={16} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1, backgroundColor: C.redActiveBg, color: C.redBright, borderColor: C.redBright }} whileTap={{ scale: 0.9 }} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textHint, cursor: "pointer", padding: "8px", display: "flex", transition: "all 0.2s" }}>
                              <Trash2 size={16} />
                            </motion.button>
                          </div>

                        </motion.div>
                      );
                    })}
                  </div>

                </div>
              </div>
              
            </motion.div>

          </main>
        </div>
      </div>

      {/* CREATE USER DIALOG MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }}
              onClick={() => setModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              style={{ 
                position: "relative", width: "100%", maxWidth: "560px", margin: "24px",
                background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: "20px",
                boxShadow: `0 4px 16px ${C.shadowMd}`
              }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setModalOpen(false)}
                style={{ position: "absolute", right: "24px", top: "24px", background: "transparent", border: "none", color: C.textHint, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = C.textHeading}
                onMouseLeave={(e) => e.currentTarget.style.color = C.textHint}
              >
                <X size={24} />
              </button>

              <div style={{ padding: "32px 32px 24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 600, color: C.textHeading, marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Create User</h2>
                <p style={{ fontSize: "14px", color: C.textMuted }}>Create a new user account.</p>
              </div>

              <div style={{ padding: "0 32px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Form Fields */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <FormField label="First Name" placeholder="" autoFocus />
                  <FormField label="Last Name" placeholder="" />
                </div>
                
                <FormField label="Email" placeholder="" type="email" />
                <FormField label="Phone Number" placeholder="" type="tel" />
                
                <FormSelect label="Role" options={["Viewer", "Recruiter", "Super Admin"]} />

                <ToggleSwitch label="Active" />

                {/* Footer Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                  <motion.button 
                    whileHover={{ backgroundColor: C.inputBg, color: C.red, borderColor: C.red }} whileTap={{ scale: 0.98 }}
                    onClick={() => setModalOpen(false)}
                    style={{
                      padding: "10px 20px", background: "transparent", border: `1px solid ${C.border}`, 
                      borderRadius: "8px", color: C.textLabel, fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -1, boxShadow: `0 4px 16px ${C.redGlow}` }} whileTap={{ scale: 0.98 }}
                    onClick={() => setModalOpen(false)}
                    style={{
                      padding: "10px 24px", background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`, 
                      border: "none", borderRadius: "8px", color: C.white, 
                      fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: `0 2px 8px ${C.redGlow}`
                    }}
                  >
                    Create
                  </motion.button>
                </div>

              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </>
  );
}