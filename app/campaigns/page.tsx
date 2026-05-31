"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Search, Copy, Check, Edit2, EyeOff, X, Calendar as CalendarIcon } from "lucide-react";
import Sidebar from "../components/Sidebar";

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
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
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
  }
  .table-min-width {
    min-width: 1000px;
  }
  
  input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
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

function TopNav() {
  const router = useRouter();
  const [user, setUser] = useState<{ firstName?: string, email?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("jbr_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("jbr_token");
    localStorage.removeItem("jbr_user");
    router.push("/"); // Directs back to auth/home
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: easeOutCirc }}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 40px", borderBottom: `1px solid ${C.border}`,
        background: C.surface,
        position: "sticky", top: 0, zIndex: 10
      }}>
      
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHeading, fontWeight: 600 }}>Campaign Link</span>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ fontSize: "13px", color: C.textMuted }}>
          Welcome, <span style={{ color: C.textHeading, fontWeight: 500 }}>
            {user ? (user.firstName ? `${user.firstName} (${user.email})` : user.email) : "Loading..."}
          </span>
        </span>
        <motion.button 
          onClick={handleSignOut}
          whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} whileTap={{ scale: 0.98 }}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "13px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease" }}>
          Sign Out <LogOut size={16} />
        </motion.button>
      </div>
    </motion.header>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={copied ? {} : { backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px",
        background: copied ? C.successBg : "transparent",
        border: copied ? `1px solid transparent` : `1px solid ${C.border}`,
        borderRadius: "6px", cursor: "pointer",
        color: copied ? C.successText : C.textLabel,
        transition: "all 0.2s ease"
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span style={{ fontSize: "12px", fontWeight: 600 }}>{copied ? "Copied!" : "Copy Link"}</span>
    </motion.button>
  );
}

// Custom Input Field
interface FormFieldProps {
  label: string;
  placeholder: string;
  isDate?: boolean;
  value: string;
  onChange: (v: string) => void;
}
function FormField({ label, placeholder, isDate = false, value, onChange }: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: C.textLabel }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input 
          type={isDate ? "date" : "text"} 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
        {isDate && <CalendarIcon size={16} color={C.textHint} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0 }} />} 
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────── */
export default function CampaignsPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");
  
  // Modal & Form State
  const [isModalOpen, setModalOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const tableGridTemplate = "1.5fr 1fr 1fr 1fr 1.5fr 0.8fr"; 

  const handleCreateCampaign = async () => {
    if (!campaignName || !startDate || !endDate) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("jbr_token");
      
      const response = await fetch("https://jbrstaffingsolutions.com/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Passing the bearer token
        },
        body: JSON.stringify({
          name: campaignName,
          startDate: startDate,
          endDate: endDate
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setCampaignName("");
          setStartDate("");
          setEndDate("");
          setIsSuccess(false);
          setModalOpen(false);
          // Note: You would typically refetch your campaigns list here
        }, 1500);
      } else {
        const data = await response.json();
        setErrorMsg(data.message || "Failed to create campaign.");
      }
    } catch (error) {
      console.error("Campaign Creation Error:", error);
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}
            >
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.textHeading, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                  Campaigns
                </h1>
                <p style={{ fontSize: "15px", color: C.textMuted }}>
                  Create and manage recruitment campaigns
                </p>
              </div>
              
              <motion.button 
                onClick={() => setModalOpen(true)}
                whileHover={{ y: -2, boxShadow: `0 8px 24px ${C.redGlow}` }} whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px",
                  background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`,
                  border: "none", borderRadius: "8px",
                  color: C.white, fontSize: "14px", fontWeight: 600, letterSpacing: "0.5px",
                  cursor: "pointer", position: "relative", overflow: "hidden",
                  boxShadow: `0 4px 16px ${C.redGlow}`
                }}
              >
                <Plus size={18} style={{ position: "relative", zIndex: 1 }} />
                <span style={{ position: "relative", zIndex: 1 }}>Create Campaign</span>
              </motion.button>
            </motion.div>

            <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading }}>Campaign List</h3>
                
                <div style={{ position: "relative" }}>
                  <Search size={16} color={C.textHint} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  <input 
                    type="text" placeholder="Search campaigns..." 
                    style={{
                      background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px",
                      padding: "10px 16px 10px 40px", color: C.textBody, fontSize: "14px", width: "260px", outline: "none",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = C.red}
                    onBlur={(e) => e.target.style.borderColor = C.border}
                  />
                </div>
              </div>

              <div className="table-container">
                <div className="table-min-width">
                  
                  <div style={{ display: "grid", gridTemplateColumns: tableGridTemplate, padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: C.inputBg }}>
                    {["Name", "Start Date", "End Date", "Status", "Link", "Actions"].map((head, i) => (
                      <span key={i} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.textHint, fontWeight: 600 }}>
                        {head}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {CAMPAIGNS_DATA.map((camp, idx) => (
                      <motion.div 
                        key={camp.id} variants={itemVars}
                        whileHover={{ backgroundColor: C.inputBg }}
                        style={{ 
                          display: "grid", gridTemplateColumns: tableGridTemplate, alignItems: "center",
                          padding: "20px 32px", borderBottom: idx !== CAMPAIGNS_DATA.length - 1 ? `1px solid ${C.border}` : "none",
                          transition: "background-color 0.2s ease"
                        }}
                      >
                        <div style={{ fontSize: "15px", fontWeight: 600, color: C.textHeading }}>{camp.name}</div>
                        <div style={{ fontSize: "14px", color: C.textMuted }}>{camp.start}</div>
                        <div style={{ fontSize: "14px", color: C.textMuted }}>{camp.end}</div>
                        
                        <div>
                          {camp.status === "Active" ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "20px", background: C.successBg, color: C.successText, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.successText }} /> Active
                            </div>
                          ) : camp.status === "Ended" ? (
                            <div style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "20px", background: C.alertBg, color: C.alertText, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Ended
                            </div>
                          ) : (
                            <div style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "20px", background: C.pendingBg, border: `1px solid ${C.pendingBorder}`, color: C.pendingText, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Draft
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {camp.status !== "Draft" && <CopyLinkButton />}
                          {camp.linkStatus === "Working" && (
                            <span style={{ padding: "4px 8px", borderRadius: "4px", background: C.successBg, color: C.successText, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Working</span>
                          )}
                          {camp.linkStatus === "Expired" && (
                            <span style={{ padding: "4px 8px", borderRadius: "4px", background: C.alertBg, color: C.alertText, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Expired</span>
                          )}
                          {camp.linkStatus === "Pending" && (
                            <span style={{ padding: "4px 8px", borderRadius: "4px", background: C.pendingBg, color: C.pendingText, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Pending</span>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <motion.button whileHover={{ scale: 1.1, color: C.red }} whileTap={{ scale: 0.9 }} style={{ background: "transparent", border: "none", color: C.textHint, cursor: "pointer", padding: "6px", transition: "color 0.2s" }}>
                            <Edit2 size={18} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1, color: C.redBright }} whileTap={{ scale: 0.9 }} style={{ background: "transparent", border: "none", color: C.textHint, cursor: "pointer", padding: "6px", transition: "color 0.2s" }}>
                            <EyeOff size={18} />
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

      {/* CREATE CAMPAIGN DIALOG MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }}
              onClick={() => { if (!isLoading && !isSuccess) setModalOpen(false); }}
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              style={{ 
                position: "relative", width: "100%", maxWidth: "560px", margin: "24px",
                background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)"
              }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setModalOpen(false)}
                disabled={isLoading || isSuccess}
                style={{ position: "absolute", right: "24px", top: "24px", background: "transparent", border: "none", color: C.textHint, cursor: isLoading || isSuccess ? "not-allowed" : "pointer", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = C.textHeading}
                onMouseLeave={(e) => e.currentTarget.style.color = C.textHint}
              >
                <X size={24} />
              </button>

              <div style={{ padding: "32px 32px 24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 600, color: C.textHeading, marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Create New Campaign</h2>
                <p style={{ fontSize: "14px", color: C.textMuted }}>Define the parameters for your new recruitment campaign.</p>
              </div>

              <div style={{ padding: "0 32px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                
                <FormField 
                  label="Campaign Name" 
                  placeholder="Enter campaign name" 
                  value={campaignName}
                  onChange={setCampaignName}
                />
                
                <div style={{ display: "flex", gap: "16px" }}>
                  <FormField 
                    label="Start Date" 
                    placeholder="Pick start date" 
                    isDate 
                    value={startDate}
                    onChange={setStartDate}
                  />
                  <FormField 
                    label="End Date" 
                    placeholder="Pick end date" 
                    isDate 
                    value={endDate}
                    onChange={setEndDate}
                  />
                </div>

                {errorMsg && (
                  <div style={{ color: C.red, fontSize: "13px", fontWeight: 500, marginTop: "-8px" }}>
                    {errorMsg}
                  </div>
                )}

                <motion.button 
                  disabled={isLoading || isSuccess}
                  onClick={handleCreateCampaign}
                  whileHover={isLoading || isSuccess ? {} : { y: -2, boxShadow: `0 8px 24px ${C.redGlow}` }} 
                  whileTap={isLoading || isSuccess ? {} : { scale: 0.98 }}
                  style={{
                    width: "100%", padding: "14px", marginTop: "8px",
                    background: isSuccess ? "#059669" : `linear-gradient(135deg, ${C.redBright}, ${C.red})`,
                    border: "none", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px",
                    color: C.white, fontSize: "15px", fontWeight: 600, letterSpacing: "0.5px",
                    cursor: isLoading || isSuccess ? "default" : "pointer", position: "relative", overflow: "hidden",
                    boxShadow: isSuccess ? "0 4px 16px rgba(5,150,105,0.25)" : `0 4px 16px ${C.redGlow}`,
                    opacity: isLoading ? 0.8 : 1,
                    transition: "background 0.3s ease, box-shadow 0.3s ease"
                  }}
                >
                  {isLoading ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.7s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  ) : isSuccess ? (
                    <>
                      <Check size={18} strokeWidth={2.5} />
                      <span style={{ position: "relative", zIndex: 1 }}>Campaign Created!</span>
                    </>
                  ) : (
                    <span style={{ position: "relative", zIndex: 1 }}>Create Campaign</span>
                  )}
                </motion.button>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </>
  );
}