"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Plus, Search, Edit2, Trash2, Settings, 
  Briefcase, Layers, Users, Link as LinkIcon, MapPin, 
  Map, Calendar, Copy, ExternalLink, X
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

  .sub-nav-container::-webkit-scrollbar { display: none; }
`;

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const SUB_TABS = [
  { id: "industries", label: "Job Industries", icon: Briefcase },
  { id: "categories", label: "Job Categories", icon: Layers },
  { id: "groups", label: "Groups", icon: Users },
  { id: "campaigns", label: "Campaigns", icon: LinkIcon },
  { id: "provinces", label: "Provinces", icon: MapPin },
  { id: "cities", label: "Cities", icon: Map },
];

const MOCK_INDUSTRIES = [
  { id: 1, name: "Security Service Occupations", status: "Active", created: "7/14/2025" },
  { id: 2, name: "Accounting", status: "Active", created: "7/9/2025" },
  { id: 3, name: "Aerospace & Advanced Manufacturing", status: "Active", created: "7/9/2025" },
  { id: 4, name: "Automotive", status: "Active", created: "11/5/2025" },
];

const MOCK_CATEGORIES = [
  { id: 1, name: "3D Animator", industry: "Creative & Digital Media", status: "Active" },
  { id: 2, name: "Accountant (CPA)", industry: "Accounting", status: "Active" },
  { id: 3, name: "Aerospace Engineer", industry: "Aerospace & Advanced Manufacturing", status: "Active" },
  { id: 4, name: "AI Specialist", industry: "IT & Digital Innovation", status: "Active" },
  { id: 5, name: "AI/ML Engineer", industry: "IT & Digital Innovation", status: "Active" },
  { id: 6, name: "Air Duct Cleaning Technician", industry: "Cleaners (Specialized)", status: "Active" },
];

const MOCK_GROUPS = [
  { id: 1, name: "18 Wheels FO", desc: "", status: "Active", created: "1/7/2026" },
  { id: 2, name: "18 Wheels GL", desc: "18 Wheels Client Candidates", status: "Active", created: "8/12/2025" },
  { id: 3, name: "Aerostream Logistics", desc: "", status: "Active", created: "1/7/2026" },
];

const MOCK_CAMPAIGNS = [
  { id: 1, name: "JBR", range: "Jun 26, 2025 - May 31, 2026", status: "Active", created: "Jul 07, 2025" },
];

const MOCK_PROVINCES = [
  { id: 1, name: "Alberta", code: "AB", status: "Active" },
  { id: 2, name: "British Columbia", code: "BC", status: "Active" },
  { id: 3, name: "Manitoba", code: "MB", status: "Inactive" },
  { id: 4, name: "New Brunswick", code: "NB", status: "Inactive" },
];

const MOCK_CITIES = [
  { id: 1, name: "Brampton", province: "Ontario (ON)", status: "Active" },
  { id: 2, name: "Burlington", province: "Ontario (ON)", status: "Active" },
  { id: 3, name: "Burnaby", province: "British Columbia (BC)", status: "Active" },
  { id: 4, name: "Caledon", province: "Ontario (ON)", status: "Active" },
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
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHint, fontWeight: 600 }}>Administration</span>
        <span style={{ color: C.textMuted }}>/</span>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHeading, fontWeight: 600 }}>Master Management</span>
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

function StatusBadge({ status }: { status: string }) {
  const isActive = status.toLowerCase() === "active";
  return (
    <div style={{ 
      display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: "20px", 
      background: isActive ? C.successBg : C.alertBg, 
      color: isActive ? C.successText : C.alertText, 
      fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" 
    }}>
      {status}
    </div>
  );
}

function ActionButtons() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <motion.button whileHover={{ scale: 1.1, color: C.red, borderColor: C.red, backgroundColor: C.redActiveBg }} whileTap={{ scale: 0.9 }} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textHint, cursor: "pointer", padding: "8px", display: "flex", transition: "all 0.2s" }}>
        <Edit2 size={16} />
      </motion.button>
      <motion.button whileHover={{ scale: 1.1, color: C.redBright, borderColor: C.redBright, backgroundColor: C.redActiveBg }} whileTap={{ scale: 0.9 }} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textHint, cursor: "pointer", padding: "8px", display: "flex", transition: "all 0.2s" }}>
        <Trash2 size={16} />
      </motion.button>
    </div>
  );
}

function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div style={{ position: "relative", marginBottom: "24px" }}>
      <Search size={16} color={C.textHint} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
      <input 
        type="text" placeholder={placeholder}
        style={{
          width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px",
          padding: "12px 16px 12px 42px", color: C.textBody, fontSize: "14px", outline: "none", transition: "border-color 0.2s"
        }}
        onFocus={(e) => e.target.style.borderColor = C.red}
        onBlur={(e) => e.target.style.borderColor = C.border}
      />
    </div>
  );
}

function AddButton({ label, onClick }: { label: string, onClick?: () => void }) {
  return (
    <motion.button 
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: `0 4px 16px ${C.redGlow}` }} whileTap={{ scale: 0.98 }}
      style={{
        display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
        background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`, border: "none", borderRadius: "8px",
        color: C.white, fontSize: "14px", fontWeight: 600, letterSpacing: "0.5px", cursor: "pointer", position: "relative", overflow: "hidden",
        boxShadow: `0 2px 8px ${C.redGlow}`
      }}
    >
      <Plus size={16} style={{ position: "relative", zIndex: 1 }} />
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </motion.button>
  );
}

// Custom Form Components for Modals
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

function FormTextArea({ label, placeholder, autoFocus = false }: { label: string, placeholder: string, autoFocus?: boolean }) {
  const [focused, setFocused] = useState(autoFocus);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: C.textLabel }}>{label}</label>
      <div style={{ position: "relative" }}>
        <textarea 
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "12px 16px", minHeight: "100px", resize: "vertical",
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
export default function MasterManagementPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [activeSubTab, setActiveSubTab] = useState("industries");
  
  // Modal State
  const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);

  const renderSubNav = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
      className="sub-nav-container"
      style={{ 
        display: "flex", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "12px", 
        padding: "6px", marginBottom: "32px", overflowX: "auto", whiteSpace: "nowrap" 
      }}
    >
      {SUB_TABS.map((tab) => {
        const isActive = activeSubTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              flex: 1, minWidth: "150px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px 16px", background: "transparent", border: "none", borderRadius: "8px", cursor: "pointer",
              color: isActive ? C.red : C.textLabel, fontSize: "14px", fontWeight: isActive ? 600 : 500,
              position: "relative", transition: "color 0.2s ease"
            }}
          >
            {isActive && (
              <motion.div layoutId="masterSubNav" style={{ position: "absolute", inset: 0, background: C.redActiveBg, borderRadius: "8px" }} />
            )}
            <Icon size={16} style={{ position: "relative", zIndex: 1 }} />
            <span style={{ position: "relative", zIndex: 1 }}>{tab.label}</span>
          </button>
        );
      })}
    </motion.div>
  );

  const renderIndustries = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px" }}>Job Industries</h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Manage job industries and their configurations</p>
        </div>
        <AddButton label="Add Industry" onClick={() => setIndustryModalOpen(true)} />
      </div>
      <SearchBar placeholder="Search by name or description" />
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MOCK_INDUSTRIES.map((item) => (
          <motion.div key={item.id} variants={itemVars} whileHover={{ backgroundColor: C.inputBg }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", transition: "background-color 0.2s" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "15px", fontWeight: 600, color: C.textHeading }}>{item.name}</span>
                <StatusBadge status={item.status} />
              </div>
              <span style={{ fontSize: "12px", color: C.textMuted }}>Created: {item.created}</span>
            </div>
            <ActionButtons />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderCategories = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}><Layers size={20} color={C.red} strokeWidth={2} /> Job Categories Management</h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Manage job categories and license requirements for candidate applications</p>
        </div>
        <AddButton label="Add Category" />
      </div>
      <SearchBar placeholder="Search job categories..." />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {MOCK_CATEGORIES.map((item) => (
          <motion.div key={item.id} variants={itemVars} whileHover={{ borderColor: C.borderHover, boxShadow: `0 4px 16px ${C.shadow}` }} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", minHeight: "140px", transition: "all 0.2s" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px", fontWeight: 600, color: C.textHeading }}>{item.name}</span>
                <StatusBadge status={item.status} />
              </div>
              <span style={{ fontSize: "13px", color: C.textMuted }}>Industry: {item.industry}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <ActionButtons />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderGroups = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px" }}>Master Groups</h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Create groups to shortlist and manage candidates</p>
        </div>
        <AddButton label="Add Group" />
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MOCK_GROUPS.map((item) => (
          <motion.div key={item.id} variants={itemVars} whileHover={{ backgroundColor: C.inputBg }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", transition: "background-color 0.2s" }}>
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
            <ActionButtons />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderCampaigns = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}><Users size={20} color={C.red} strokeWidth={2} /> Campaigns Management</h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Create and manage recruitment campaigns with registration links</p>
        </div>
        <AddButton label="Add Campaign" />
      </div>
      <SearchBar placeholder="Search campaigns..." />
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MOCK_CAMPAIGNS.map((item) => (
          <motion.div key={item.id} variants={itemVars} whileHover={{ borderColor: C.borderHover }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", transition: "border-color 0.2s" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "16px", fontWeight: 600, color: C.textHeading }}>{item.name}</span>
                <StatusBadge status={item.status} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.textMuted, fontSize: "14px" }}>
                <Calendar size={16} /> {item.range}
              </div>
              <span style={{ fontSize: "12px", color: C.textHint, marginTop: "8px" }}>Created: {item.created}</span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <motion.button whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                <Copy size={16} /> Copy Link
              </motion.button>
              <motion.button whileHover={{ color: C.red }} style={{ background: "transparent", border: "none", color: C.textHint, cursor: "pointer", padding: "8px", transition: "color 0.2s" }}>
                <ExternalLink size={18} />
              </motion.button>
              <ActionButtons />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderProvinces = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px" }}>Provinces Management</h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Manage provinces and territories for candidate locations</p>
        </div>
        <AddButton label="Add Province" />
      </div>
      <SearchBar placeholder="Search provinces..." />
      
      <div style={{ border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", padding: "16px 24px", background: C.inputBg, borderBottom: `1px solid ${C.border}` }}>
          {["Province Name", "Code", "Status", "Actions"].map(h => <span key={h} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.textHint, fontWeight: 600 }}>{h}</span>)}
        </div>
        {MOCK_PROVINCES.map((item, idx) => (
          <motion.div key={item.id} variants={itemVars} whileHover={{ backgroundColor: C.inputBg }} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", alignItems: "center", padding: "16px 24px", borderBottom: idx !== MOCK_PROVINCES.length - 1 ? `1px solid ${C.border}` : "none", background: C.surface, transition: "background-color 0.2s" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: C.textHeading }}>{item.name}</span>
            <span style={{ fontSize: "14px", color: C.textMuted }}>{item.code}</span>
            <div><StatusBadge status={item.status} /></div>
            <ActionButtons />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderCities = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, marginBottom: "4px" }}>Cities Management</h2>
          <p style={{ fontSize: "14px", color: C.textMuted }}>Manage cities for candidate locations within provinces</p>
        </div>
        <AddButton label="Add City" />
      </div>
      <SearchBar placeholder="Search cities or provinces..." />
      
      <div style={{ border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 100px", padding: "16px 24px", background: C.inputBg, borderBottom: `1px solid ${C.border}` }}>
          {["City Name", "Province", "Status", "Actions"].map(h => <span key={h} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.textHint, fontWeight: 600 }}>{h}</span>)}
        </div>
        {MOCK_CITIES.map((item, idx) => (
          <motion.div key={item.id} variants={itemVars} whileHover={{ backgroundColor: C.inputBg }} style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 100px", alignItems: "center", padding: "16px 24px", borderBottom: idx !== MOCK_CITIES.length - 1 ? `1px solid ${C.border}` : "none", background: C.surface, transition: "background-color 0.2s" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: C.textHeading }}>{item.name}</span>
            <span style={{ fontSize: "14px", color: C.textMuted }}>{item.province}</span>
            <div><StatusBadge status={item.status} /></div>
            <ActionButtons />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        
        <Sidebar 
          isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} 
          activeTab="master_mgmt" setActiveTab={() => {}} 
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
          <TopNav />

          <main style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column" }}>
            
            {/* Main Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: "32px" }}>
              <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.textHeading, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                <Settings size={32} color={C.red} strokeWidth={2} /> Master Management
              </h1>
              <p style={{ fontSize: "15px", color: C.textMuted }}>
                Manage job industries, job categories, campaigns, provinces, cities and their configurations.
              </p>
            </motion.div>

            {/* Sub-Navigation Tabs */}
            {renderSubNav()}

            {/* Render Active View */}
            <AnimatePresence mode="wait">
              <motion.div key={activeSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                {activeSubTab === "industries" && renderIndustries()}
                {activeSubTab === "categories" && renderCategories()}
                {activeSubTab === "groups" && renderGroups()}
                {activeSubTab === "campaigns" && renderCampaigns()}
                {activeSubTab === "provinces" && renderProvinces()}
                {activeSubTab === "cities" && renderCities()}
              </motion.div>
            </AnimatePresence>

          </main>
        </div>
      </div>

      {/* CREATE NEW JOB INDUSTRY DIALOG MODAL */}
      <AnimatePresence>
        {isIndustryModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }}
              onClick={() => setIndustryModalOpen(false)}
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
                onClick={() => setIndustryModalOpen(false)}
                style={{ position: "absolute", right: "24px", top: "24px", background: "transparent", border: "none", color: C.textHint, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = C.textHeading}
                onMouseLeave={(e) => e.currentTarget.style.color = C.textHint}
              >
                <X size={24} />
              </button>

              <div style={{ padding: "32px 32px 24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 600, color: C.textHeading, marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Create New Job Industry</h2>
                <p style={{ fontSize: "14px", color: C.textMuted }}>Enter the details for the new job industry.</p>
              </div>

              <div style={{ padding: "0 32px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Form Fields */}
                <FormField label="Name *" placeholder="Enter industry name" autoFocus />
                
                <FormTextArea label="Description" placeholder="Enter industry description (optional)" />

                <ToggleSwitch label="Active" />

                {/* Footer Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                  <motion.button 
                    whileHover={{ backgroundColor: C.inputBg, color: C.red, borderColor: C.red }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIndustryModalOpen(false)}
                    style={{
                      padding: "10px 20px", background: "transparent", border: `1px solid ${C.border}`, 
                      borderRadius: "8px", color: C.textLabel, fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -1, boxShadow: `0 4px 16px ${C.redGlow}` }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIndustryModalOpen(false)}
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