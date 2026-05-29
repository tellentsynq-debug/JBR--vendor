"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Search, ChevronDown, Download, CheckCircle, 
  MessageCircle, Users, Trash2, Eye, Edit2, UserCheck, 
  ChevronLeft, ChevronRight, Square, CheckSquare, Calendar
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

  .table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .table-min-width {
    min-width: 1400px;
  }

  /* Custom Select Dropdown Styling */
  select {
    appearance: none;
    background-color: transparent;
    cursor: pointer;
  }
  select option {
    background-color: ${C.surface};
    color: ${C.textHeading};
  }
`;

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const SHORTLISTED_DATA = [
  { id: 1, name: "Arjun Sharma", email: "arjun.sharma@example.com", phone: "+14165550198", gender: "Male", role: "Frontend Developer", location: "Toronto, Ontario", status: "Shortlisted", date: "5/29/2026" },
  { id: 2, name: "Priya Patel", email: "priya.p@example.com", phone: "+16045550123", gender: "Female", role: "UX Designer", location: "Vancouver, BC", status: "Shortlisted", date: "5/28/2026" },
];

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
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHint, fontWeight: 600 }}>Main</span>
        <span style={{ color: C.textMuted }}>/</span>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHeading, fontWeight: 600 }}>Shortlisted</span>
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

/* ─── MAIN PAGE ────────────────────────────────────── */
export default function ShortlistedPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("shortlisted");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const tableGridTemplate = "40px 1.2fr 1.8fr 1.2fr 0.8fr 1.2fr 1.5fr 0.8fr 1fr 1.5fr 100px"; 
  const dataCount = SHORTLISTED_DATA.length;

  const toggleRow = (id: number) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedRows.length === dataCount) setSelectedRows([]);
    else setSelectedRows(SHORTLISTED_DATA.map(e => e.id));
  };

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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.textHeading, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                <UserCheck size={32} color={C.red} strokeWidth={2} /> Shortlisted Candidates
              </h1>
              <p style={{ fontSize: "15px", color: C.textMuted }}>
                Select a group to view shortlisted candidates.
              </p>
            </motion.div>

            {/* Filters Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="clean-card" style={{ padding: "24px 32px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, marginBottom: "4px" }}>Filters</h3>
              <p style={{ fontSize: "13px", color: C.textMuted, marginBottom: "24px" }}>Filter candidates by various criteria</p>
              
              {/* Top Full-Width Group Dropdown */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.textLabel, marginBottom: "8px" }}>Group</label>
                <div style={{ position: "relative" }}>
                  <select 
                    style={{
                      width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px",
                      padding: "10px 36px 10px 16px", color: C.textBody, fontSize: "14px", outline: "none", transition: "border-color 0.2s"
                    }}
                  >
                    <option>Select a group</option>
                    <option>Summer 2026 Intake</option>
                    <option>Tech Leads Batch A</option>
                  </select>
                  <ChevronDown size={16} color={C.textHint} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>

              {/* 5-Column Bottom Filters */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "20px" }}>
                
                {/* Search */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.textLabel, marginBottom: "8px" }}>Search</label>
                  <div style={{ position: "relative" }}>
                    <Search size={16} color={C.textHint} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                      type="text" placeholder="Search by name, email, or phone" 
                      style={{
                        width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 16px 10px 36px", color: C.textBody, fontSize: "14px", outline: "none", transition: "border-color 0.2s",
                        textOverflow: "ellipsis"
                      }}
                      onFocus={(e) => e.target.style.borderColor = C.red}
                      onBlur={(e) => e.target.style.borderColor = C.border}
                    />
                  </div>
                </div>

                {/* Dropdowns */}
                {[
                  { label: "Verification Status", options: ["All Statuses", "Pending", "Verified"] },
                  { label: "Job Category", options: ["All Categories", "General Labour", "Security", "Warehouse"] },
                  { label: "Province", options: ["All Provinces", "British Columbia", "Ontario"] },
                  { label: "City", options: ["All Cities", "Surrey", "Vancouver", "Toronto"] },
                ].map((filter, idx) => (
                  <div key={idx}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.textLabel, marginBottom: "8px" }}>{filter.label}</label>
                    <div style={{ position: "relative" }}>
                      <select 
                        style={{
                          width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px",
                          padding: "10px 36px 10px 16px", color: C.textBody, fontSize: "14px", outline: "none", transition: "border-color 0.2s"
                        }}
                      >
                        {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                      <ChevronDown size={16} color={C.textHint} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Data Table Section */}
            <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              {/* Table Header Controls */}
              <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, display: "flex", alignItems: "center", gap: "8px" }}>
                      Employees <span style={{ color: C.redBright }}>({dataCount})</span>
                    </h3>
                    <p style={{ fontSize: "13px", color: C.textMuted, marginTop: "4px" }}>
                      Registered candidates and their information (Showing {dataCount > 0 ? `1-${dataCount}` : '0'} of {dataCount})
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: C.textLabel, fontWeight: 500 }}>Rows per page:</span>
                    <div style={{ position: "relative" }}>
                      <select style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "6px", padding: "8px 28px 8px 12px", color: C.textBody, fontSize: "13px", outline: "none" }}>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                      <ChevronDown size={14} color={C.textHint} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>

                {/* Bulk Actions Row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <motion.button 
                    whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} whileTap={{ scale: 0.98 }}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                  >
                    <Download size={16} /> Download Excel ({dataCount})
                  </motion.button>

                  {[
                    { label: "Bulk Verify", icon: CheckCircle },
                    { label: "Send WhatsApp", icon: MessageCircle },
                    { label: "Assign to Group(s)", icon: Users },
                    { label: "Bulk Delete", icon: Trash2 },
                  ].map((action, idx) => (
                    <motion.button 
                      key={idx}
                      disabled={selectedRows.length === 0}
                      whileHover={selectedRows.length > 0 ? { backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red } : {}}
                      style={{ 
                        display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", 
                        background: "transparent", 
                        border: `1px solid ${C.border}`, 
                        borderRadius: "6px", 
                        color: selectedRows.length > 0 ? C.textHeading : C.textHint, 
                        fontSize: "13px", fontWeight: 600, 
                        cursor: selectedRows.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s" 
                      }}
                    >
                      <action.icon size={16} /> {action.label} ({selectedRows.length})
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Responsive Table Container */}
              <div className="table-container">
                <div className="table-min-width">
                  
                  {/* Table Column Headers */}
                  <div style={{ display: "grid", gridTemplateColumns: tableGridTemplate, padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: C.inputBg, alignItems: "center" }}>
                    <button onClick={toggleAll} style={{ background: "none", border: "none", color: C.textHint, cursor: "pointer", padding: 0, display: "flex" }}>
                      {selectedRows.length === dataCount && dataCount > 0 ? <CheckSquare size={16} color={C.red} /> : <Square size={16} />}
                    </button>
                    {["Name", "Email", "Phone", "Gender", "Job Category", "Location", "Status", "Registration Date", "Documents", "Actions"].map((head, i) => (
                      <span key={i} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.textHint, fontWeight: 600 }}>{head}</span>
                    ))}
                  </div>

                  {/* Table Rows or Empty State */}
                  {dataCount === 0 ? (
                    <div style={{ padding: "60px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", opacity: 0.7 }}>
                      <Users size={48} color={C.textHint} />
                      <p style={{ color: C.textMuted, fontSize: "15px", fontWeight: 500 }}>No candidates found in this group.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {SHORTLISTED_DATA.map((emp, idx) => {
                        const isSelected = selectedRows.includes(emp.id);
                        return (
                          <motion.div 
                            key={emp.id} variants={itemVars}
                            whileHover={{ backgroundColor: C.inputBg }}
                            style={{ 
                              display: "grid", gridTemplateColumns: tableGridTemplate, alignItems: "center",
                              padding: "16px 32px", borderBottom: idx !== dataCount - 1 ? `1px solid ${C.border}` : "none",
                              background: isSelected ? C.redActiveBg : "transparent",
                              transition: "background-color 0.2s ease"
                            }}
                          >
                            {/* Checkbox */}
                            <button onClick={() => toggleRow(emp.id)} style={{ background: "none", border: "none", color: isSelected ? C.red : C.textHint, cursor: "pointer", padding: 0, display: "flex" }}>
                              {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                            </button>

                            {/* Name */}
                            <div style={{ fontSize: "14px", fontWeight: 600, color: C.textHeading, lineHeight: 1.4 }}>
                              {emp.name.split(" ").map((n, i) => <div key={i}>{n}</div>)}
                            </div>
                            
                            {/* Email */}
                            <div style={{ fontSize: "13px", color: C.textMuted, wordBreak: "break-all", paddingRight: "16px" }}>{emp.email}</div>
                            
                            {/* Phone */}
                            <div style={{ fontSize: "13px", color: C.textMuted }}>{emp.phone}</div>

                            {/* Gender */}
                            <div style={{ fontSize: "13px", color: C.textMuted }}>{emp.gender}</div>
                            
                            {/* Job */}
                            <div style={{ fontSize: "14px", color: C.textBody, fontWeight: 500 }}>{emp.role}</div>

                            {/* Location */}
                            <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: 1.4 }}>
                              {emp.location.split(", ").map((l, i) => <div key={i}>{l}</div>)}
                            </div>
                            
                            {/* Status Badge */}
                            <div>
                              <div style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "20px", background: C.successBg, color: C.successText, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {emp.status}
                              </div>
                            </div>

                            {/* Date */}
                            <div style={{ fontSize: "13px", color: C.textMuted, display: "flex", alignItems: "center", gap: "6px" }}>
                              <Calendar size={14} /> {emp.date}
                            </div>

                            {/* Documents */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <motion.button whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "12px", fontWeight: 500, cursor: "pointer", width: "fit-content", transition: "all 0.2s" }}>
                                <Eye size={14} /> View Resume
                              </motion.button>
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <motion.button whileHover={{ scale: 1.1, backgroundColor: C.redActiveBg, color: C.redBright, borderColor: C.redBright }} whileTap={{ scale: 0.9 }} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textHint, cursor: "pointer", padding: "8px", display: "flex", transition: "all 0.2s" }}>
                                <Trash2 size={16} />
                              </motion.button>
                            </div>

                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>
              
            </motion.div>

          </main>
        </div>
      </div>
    </>
  );
}