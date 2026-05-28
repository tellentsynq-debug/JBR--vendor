"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
// FIX 1: Removed 'Sidebar' from lucide-react imports to prevent the component clash
import { LogOut, Plus, Search, Copy, Check, Edit2, EyeOff } from "lucide-react";
// FIX 1: Correctly imported the Sidebar component and C tokens
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
  
  /* FIX 2: Added a class for horizontal scrolling on the table */
  .table-container {
    width: 100%;
    overflow-x: auto;
  }
  .table-min-width {
    min-width: 1000px; /* Prevents columns from squishing on small screens */
  }
`;

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const CAMPAIGNS_DATA = [
  { id: 1, name: "JBR Main Hiring", start: "June 26th, 2025", end: "May 31st, 2026", status: "Active", linkStatus: "Working" },
  { id: 2, name: "Summer Tech Leads", start: "July 15th, 2025", end: "Aug 30th, 2025", status: "Ended", linkStatus: "Expired" },
  { id: 3, name: "Warehouse Associates Q4", start: "Oct 1st, 2025", end: "Dec 31st, 2025", status: "Active", linkStatus: "Working" },
  { id: 4, name: "Admin Support Staff", start: "Jan 10th, 2026", end: "Mar 20th, 2026", status: "Draft", linkStatus: "Pending" },
];

/* ─── ANIMATION VARIANTS ─────────────────────────────────────── */
const easeOutCirc = [0.0, 0.55, 0.45, 1];
const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }};
const itemVars = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }};

/* ─── COMPONENTS ─────────────────────────────────────────────── */

function AmbientBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 0%, ${C.surface} 0%, ${C.bg} 80%)` }} />
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: `radial-gradient(circle, ${C.redGlow} 0%, transparent 60%)`, filter: "blur(100px)", opacity: 0.4 }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "60vw", height: "60vw", background: `radial-gradient(circle, ${C.goldDim} 0%, transparent 60%)`, filter: "blur(120px)", opacity: 0.3 }} />
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
      
      {/* FIX 3: Restored breadcrumb styling to match Dashboard */}
      <div style={{ display: "flex", alignItems: "center", }}>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.white, fontWeight: 500 }}>Campaign Link</span>
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

// Micro-interaction component for copying links
function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px",
        background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
        borderRadius: "6px", cursor: "pointer",
        color: copied ? C.emerald : C.white,
        transition: "color 0.2s ease"
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span style={{ fontSize: "12px", fontWeight: 500 }}>{copied ? "Copied!" : "Copy Link"}</span>
    </motion.button>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────── */
export default function CampaignsPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");

  // Custom CSS Grid map for the table columns
  const tableGridTemplate = "1.5fr 1fr 1fr 1fr 1.5fr 0.8fr"; 

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
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.white, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                  Campaigns
                </h1>
                <p style={{ fontSize: "14px", color: C.mutedLight }}>
                  Create and manage recruitment campaigns
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
                <span style={{ position: "relative", zIndex: 1 }}>Create Campaign</span>
              </motion.button>
            </motion.div>

            {/* Campaign List / Table Area */}
            <motion.div variants={containerVars} initial="hidden" animate="show" className="glass-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              {/* Card Header & Search */}
              <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: C.white }}>Campaign List</h3>
                
                <div style={{ position: "relative" }}>
                  <Search size={16} color={C.muted} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input 
                    type="text" placeholder="Search campaigns..." 
                    style={{
                      background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "8px",
                      padding: "8px 16px 8px 36px", color: C.white, fontSize: "13px", width: "240px", outline: "none",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = C.red}
                    onBlur={(e) => e.target.style.borderColor = C.border}
                  />
                </div>
              </div>

              {/* FIX 2: Wrapped the grid table in a responsive overflow container */}
              <div className="table-container">
                <div className="table-min-width">
                  
                  {/* Table Headers */}
                  <div style={{ display: "grid", gridTemplateColumns: tableGridTemplate, padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: "rgba(0,0,0,0.2)" }}>
                    {["Name", "Start Date", "End Date", "Status", "Link", "Actions"].map((head, i) => (
                      <span key={i} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.mutedLight, fontWeight: 500 }}>
                        {head}
                      </span>
                    ))}
                  </div>

                  {/* Table Rows */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {CAMPAIGNS_DATA.map((camp, idx) => (
                      <motion.div 
                        key={camp.id} variants={itemVars}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                        style={{ 
                          display: "grid", gridTemplateColumns: tableGridTemplate, alignItems: "center",
                          padding: "20px 32px", borderBottom: idx !== CAMPAIGNS_DATA.length - 1 ? `1px solid ${C.border}` : "none",
                          transition: "background-color 0.2s ease"
                        }}
                      >
                        {/* Column 1: Name */}
                        <div style={{ fontSize: "14px", fontWeight: 500, color: C.white }}>{camp.name}</div>
                        
                        {/* Column 2: Start Date */}
                        <div style={{ fontSize: "13px", color: C.mutedLight }}>{camp.start}</div>
                        
                        {/* Column 3: End Date */}
                        <div style={{ fontSize: "13px", color: C.mutedLight }}>{camp.end}</div>
                        
                        {/* Column 4: Status Badge */}
                        <div>
                          {camp.status === "Active" ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "20px", background: "rgba(229,57,53,0.1)", border: `1px solid rgba(229,57,53,0.2)`, color: C.redBright, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.redBright, boxShadow: `0 0 8px ${C.redBright}` }} /> Active
                            </div>
                          ) : camp.status === "Ended" ? (
                            <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, color: C.muted, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Ended
                            </div>
                          ) : (
                            <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: "20px", background: C.goldDim, border: `1px solid rgba(191,164,106,0.3)`, color: C.gold, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Draft
                            </div>
                          )}
                        </div>

                        {/* Column 5: Link UI */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {camp.status !== "Draft" && <CopyLinkButton />}
                          
                          {camp.linkStatus === "Working" && (
                            <span style={{ padding: "4px 8px", borderRadius: "4px", background: C.emeraldGlow, color: C.emerald, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Working
                            </span>
                          )}
                          {camp.linkStatus === "Expired" && (
                            <span style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", color: C.muted, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Expired
                            </span>
                          )}
                        </div>

                        {/* Column 6: Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <motion.button whileHover={{ scale: 1.1, color: C.white }} whileTap={{ scale: 0.9 }} style={{ background: "transparent", border: "none", color: C.mutedLight, cursor: "pointer", padding: "6px" }}>
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1, color: C.redBright }} whileTap={{ scale: 0.9 }} style={{ background: "transparent", border: "none", color: C.mutedLight, cursor: "pointer", padding: "6px" }}>
                            <EyeOff size={16} />
                          </motion.button>
                        </div>

                      </motion.div>
                    ))}
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