"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  LogOut, Plus, Edit2, Trash2, UserCog 
} from "lucide-react";

import Sidebar, { C } from "../components/Sidebar";

/* ─── GLOBAL CSS & ANIMATIONS ────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.offWhite}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.borderHover}; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: ${C.muted}; }

  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }

  .glass-card {
    background: linear-gradient(145deg, rgba(17,17,17,0.9), rgba(12,12,12,0.95));
    border: 1px solid ${C.border};
    border-radius: 16px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.02);
  }

  .table-container { width: 100%; overflow-x: auto; }
  .table-min-width { min-width: 1000px; }
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
      return { bg: C.redGlow, border: "rgba(229,57,53,0.3)", color: C.redBright };
    case 'RECRUITER': 
      return { bg: C.emeraldGlow, border: "rgba(5, 150, 105, 0.3)", color: C.emerald };
    case 'VIEWER': 
    default: 
      return { bg: "rgba(255,255,255,0.05)", border: C.borderHover, color: C.mutedLight };
  }
};

/* ─── ANIMATION VARIANTS ─────────────────────────────────────── */
const easeOutCirc = [0.0, 0.55, 0.45, 1];
const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }};
const itemVars = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }};

/* ─── COMPONENTS ─────────────────────────────────────────────── */

function AmbientBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 0%, ${C.surface} 0%, ${C.bg} 80%)` }} />
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: `radial-gradient(circle, ${C.redGlow} 0%, transparent 60%)`, filter: "blur(100px)", opacity: 0.2 }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "60vw", height: "60vw", background: `radial-gradient(circle, ${C.goldDim} 0%, transparent 60%)`, filter: "blur(120px)", opacity: 0.15 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.3, maskImage: "linear-gradient(to bottom, black 20%, transparent 80%)", WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 80%)" }} />
    </div>
  );
}

function TopNav() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: easeOutCirc }}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 40px", borderBottom: `1px solid ${C.border}`,
        background: "rgba(8, 8, 8, 0.4)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        position: "sticky", top: 0, zIndex: 10
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.muted }}>Administration</span>
        <span style={{ color: C.mutedLight }}>/</span>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.white, fontWeight: 500 }}>User Management</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ fontSize: "12px", color: C.mutedLight }}>
          Welcome, <span style={{ color: C.offWhite, fontWeight: 500 }}>support@jbrstaffingsolutions.ca</span>
        </span>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(198,40,40,0.1)", borderColor: C.red, color: C.red }} whileTap={{ scale: 0.98 }}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.offWhite, fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease" }}>
          Sign Out <LogOut size={14} />
        </motion.button>
      </div>
    </motion.header>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────── */
export default function UserManagementPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("user_mgmt");
  
  // Custom Table Layout
  const tableGridTemplate = "1.5fr 2fr 1fr 1fr 1fr 100px"; 

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <AmbientBackground />
      
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        
        {/* Extracted Reusable Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} 
          activeTab={activeTab} setActiveTab={setActiveTab} 
        />

        {/* Right Scrollable Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
          <TopNav />

          <main style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}
            >
              <div>
                <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.white, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                  <UserCog size={32} color={C.red} strokeWidth={1.5} /> User Management
                </h1>
                <p style={{ fontSize: "14px", color: C.mutedLight }}>
                  Manage users and their roles in the system.
                </p>
              </div>
              
              <motion.button 
                whileHover={{ y: -2, boxShadow: `0 10px 20px ${C.redGlowStrong}` }} whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px",
                  background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`,
                  border: `1px solid rgba(255,100,100,0.3)`, borderRadius: "8px",
                  color: C.white, fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px",
                  cursor: "pointer", position: "relative", overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%)", backgroundSize: "300px 100%", animation: "shimmer 2.5s infinite" }} />
                <Plus size={18} style={{ position: "relative", zIndex: 1 }} />
                <span style={{ position: "relative", zIndex: 1 }}>Add User</span>
              </motion.button>
            </motion.div>

            {/* Data Table Section */}
            <motion.div variants={containerVars} initial="hidden" animate="show" className="glass-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              {/* Table Header Controls */}
              <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: C.white }}>Users</h3>
                <p style={{ fontSize: "12px", color: C.mutedLight, marginTop: "4px" }}>
                  Manage system users and their access levels
                </p>
              </div>

              {/* Responsive Table Container */}
              <div className="table-container">
                <div className="table-min-width">
                  
                  {/* Table Column Headers */}
                  <div style={{ display: "grid", gridTemplateColumns: tableGridTemplate, padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: "rgba(0,0,0,0.2)", alignItems: "center" }}>
                    {["Name", "Email", "Role", "Status", "Last Login", "Actions"].map((head, i) => (
                      <span key={i} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.mutedLight, fontWeight: 500 }}>{head}</span>
                    ))}
                  </div>

                  {/* Table Rows */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {USERS_DATA.map((user, idx) => {
                      const roleStyle = getRoleBadgeStyle(user.role);
                      
                      return (
                        <motion.div 
                          key={user.id} variants={itemVars}
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                          style={{ 
                            display: "grid", gridTemplateColumns: tableGridTemplate, alignItems: "center",
                            padding: "20px 32px", borderBottom: idx !== USERS_DATA.length - 1 ? `1px solid ${C.border}` : "none",
                            transition: "background-color 0.2s ease"
                          }}
                        >
                          {/* Name */}
                          <div style={{ fontSize: "14px", fontWeight: 500, color: C.white }}>
                            {user.name || <span style={{ color: C.muted, fontStyle: "italic" }}>Not provided</span>}
                          </div>
                          
                          {/* Email */}
                          <div style={{ fontSize: "13px", color: C.mutedLight, wordBreak: "break-all", paddingRight: "16px" }}>
                            {user.email}
                          </div>
                          
                          {/* Role Badge */}
                          <div>
                            <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: "20px", background: roleStyle.bg, border: `1px solid ${roleStyle.border}`, color: roleStyle.color, fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              {user.role}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: "20px", background: "rgba(255,255,255,0.1)", border: `1px solid rgba(255,255,255,0.15)`, color: C.white, fontSize: "10px", fontWeight: 600, textTransform: "capitalize", letterSpacing: "0.5px" }}>
                              {user.status}
                            </div>
                          </div>

                          {/* Last Login */}
                          <div style={{ fontSize: "13px", color: C.mutedLight }}>
                            {user.lastLogin}
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <motion.button whileHover={{ scale: 1.1, color: C.white, borderColor: C.borderHover }} whileTap={{ scale: 0.9 }} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.mutedLight, cursor: "pointer", padding: "6px", display: "flex" }}>
                              <Edit2 size={14} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1, color: C.redBright, borderColor: C.borderHover }} whileTap={{ scale: 0.9 }} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.mutedLight, cursor: "pointer", padding: "6px", display: "flex" }}>
                              <Trash2 size={14} />
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
    </>
  );
}