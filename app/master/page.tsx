"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Plus, Search, Edit2, Trash2, Settings, 
  Briefcase, Layers, Users, Link as LinkIcon, MapPin, 
  Map, Calendar, Copy, ExternalLink, X
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
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.white, fontWeight: 500 }}>Master Management</span>
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

function StatusBadge({ status }: { status: string }) {
  const isActive = status.toLowerCase() === "active";
  return (
    <div style={{ 
      display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: "20px", 
      background: isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)", 
      border: `1px solid ${isActive ? "rgba(255,255,255,0.15)" : C.border}`, 
      color: isActive ? C.white : C.mutedLight, 
      fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" 
    }}>
      {status}
    </div>
  );
}

function ActionButtons() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <motion.button whileHover={{ scale: 1.1, color: C.white, borderColor: C.borderHover }} whileTap={{ scale: 0.9 }} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.mutedLight, cursor: "pointer", padding: "8px", display: "flex" }}>
        <Edit2 size={14} />
      </motion.button>
      <motion.button whileHover={{ scale: 1.1, color: C.redBright, borderColor: C.borderHover }} whileTap={{ scale: 0.9 }} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.mutedLight, cursor: "pointer", padding: "8px", display: "flex" }}>
        <Trash2 size={14} />
      </motion.button>
    </div>
  );
}

function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div style={{ position: "relative", marginBottom: "24px" }}>
      <Search size={16} color={C.muted} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
      <input 
        type="text" placeholder={placeholder}
        style={{
          width: "100%", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "8px",
          padding: "12px 16px 12px 42px", color: C.white, fontSize: "13px", outline: "none", transition: "border-color 0.2s"
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
      whileHover={{ y: -2, boxShadow: `0 10px 20px ${C.redGlowStrong}` }} whileTap={{ scale: 0.98 }}
      style={{
        display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
        background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`, border: `1px solid rgba(255,100,100,0.3)`, borderRadius: "8px",
        color: C.white, fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px", cursor: "pointer", position: "relative", overflow: "hidden"
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%)", backgroundSize: "300px 100%", animation: "shimmer 2.5s infinite" }} />
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
      <label style={{ fontSize: "11px", fontWeight: 500, color: C.mutedLight }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input 
          type={type} 
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "12px 16px",
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${focused ? C.red : C.border}`,
            borderRadius: "8px", color: C.white, fontSize: "13px",
            outline: "none", transition: "all 0.2s ease",
            boxShadow: focused ? `0 0 0 3px ${C.redGlow}` : "none"
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
      <label style={{ fontSize: "11px", fontWeight: 500, color: C.mutedLight }}>{label}</label>
      <div style={{ position: "relative" }}>
        <textarea 
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "12px 16px", minHeight: "100px", resize: "vertical",
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${focused ? C.red : C.border}`,
            borderRadius: "8px", color: C.white, fontSize: "13px",
            outline: "none", transition: "all 0.2s ease",
            boxShadow: focused ? `0 0 0 3px ${C.redGlow}` : "none"
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
          background: isOn ? C.emerald : "rgba(255,255,255,0.1)",
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
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
          }}
        />
      </div>
      <span style={{ fontSize: "13px", color: C.offWhite, fontWeight: 500 }}>{label}</span>
    </div>
  );
}


/* ─── MAIN PAGE ────────────────────────────────────── */
export default function MasterManagementPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Need to trick sidebar into highlighting "master_mgmt" (assuming that's its ID in your Sidebar.tsx)
  const [activeSubTab, setActiveSubTab] = useState("industries");
  
  // Modal State
  const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);

  const renderSubNav = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
      className="sub-nav-container"
      style={{ 
        display: "flex", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "12px", 
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
              color: isActive ? C.white : C.mutedLight, fontSize: "13px", fontWeight: isActive ? 600 : 500,
              position: "relative", transition: "color 0.2s ease"
            }}
          >
            {isActive && (
              <motion.div layoutId="masterSubNav" style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.06)", borderRadius: "8px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }} />
            )}
            <Icon size={16} style={{ position: "relative", zIndex: 1 }} />
            <span style={{ position: "relative", zIndex: 1 }}>{tab.label}</span>
          </button>
        );
      })}
    </motion.div>
  );

  const renderIndustries = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="glass-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.white, marginBottom: "4px" }}>Job Industries</h2>
          <p style={{ fontSize: "13px", color: C.mutedLight }}>Manage job industries and their configurations</p>
        </div>
        <AddButton label="Add Industry" onClick={() => setIndustryModalOpen(true)} />
      </div>
      <SearchBar placeholder="Search by name or description" />
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MOCK_INDUSTRIES.map((item) => (
          <motion.div key={item.id} variants={itemVars} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "15px", fontWeight: 500, color: C.white }}>{item.name}</span>
                <StatusBadge status={item.status} />
              </div>
              <span style={{ fontSize: "11px", color: C.muted }}>Created: {item.created}</span>
            </div>
            <ActionButtons />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderCategories = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="glass-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.white, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}><Layers size={20} color={C.red} /> Job Categories Management</h2>
          <p style={{ fontSize: "13px", color: C.mutedLight }}>Manage job categories and license requirements for candidate applications</p>
        </div>
        <AddButton label="Add Category" />
      </div>
      <SearchBar placeholder="Search job categories..." />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {MOCK_CATEGORIES.map((item) => (
          <motion.div key={item.id} variants={itemVars} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "12px", minHeight: "140px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px", fontWeight: 600, color: C.white }}>{item.name}</span>
                <StatusBadge status={item.status} />
              </div>
              <span style={{ fontSize: "12px", color: C.mutedLight }}>Industry: {item.industry}</span>
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
    <motion.div variants={containerVars} initial="hidden" animate="show" className="glass-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.white, marginBottom: "4px" }}>Master Groups</h2>
          <p style={{ fontSize: "13px", color: C.mutedLight }}>Create groups to shortlist and manage candidates</p>
        </div>
        <AddButton label="Add Group" />
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MOCK_GROUPS.map((item) => (
          <motion.div key={item.id} variants={itemVars} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Users size={16} color={C.mutedLight} />
                <span style={{ fontSize: "15px", fontWeight: 500, color: C.white }}>{item.name}</span>
                <StatusBadge status={item.status} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {item.desc && <span style={{ fontSize: "12px", color: C.mutedLight }}>{item.desc}</span>}
                <span style={{ fontSize: "11px", color: C.muted }}>Created: {item.created}</span>
              </div>
            </div>
            <ActionButtons />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderCampaigns = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="glass-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.white, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}><Users size={20} color={C.red} /> Campaigns Management</h2>
          <p style={{ fontSize: "13px", color: C.mutedLight }}>Create and manage recruitment campaigns with registration links</p>
        </div>
        <AddButton label="Add Campaign" />
      </div>
      <SearchBar placeholder="Search campaigns..." />
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MOCK_CAMPAIGNS.map((item) => (
          <motion.div key={item.id} variants={itemVars} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "16px", fontWeight: 600, color: C.white }}>{item.name}</span>
                <StatusBadge status={item.status} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.mutedLight, fontSize: "13px" }}>
                <Calendar size={14} /> {item.range}
              </div>
              <span style={{ fontSize: "12px", color: C.muted, marginTop: "8px" }}>Created: {item.created}</span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.white, fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                <Copy size={14} /> Copy Link
              </button>
              <button style={{ background: "transparent", border: "none", color: C.mutedLight, cursor: "pointer", padding: "8px" }}>
                <ExternalLink size={16} />
              </button>
              <ActionButtons />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderProvinces = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="glass-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.white, marginBottom: "4px" }}>Provinces Management</h2>
          <p style={{ fontSize: "13px", color: C.mutedLight }}>Manage provinces and territories for candidate locations</p>
        </div>
        <AddButton label="Add Province" />
      </div>
      <SearchBar placeholder="Search provinces..." />
      
      <div style={{ border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", padding: "16px 24px", background: "rgba(0,0,0,0.3)", borderBottom: `1px solid ${C.border}` }}>
          {["Province Name", "Code", "Status", "Actions"].map(h => <span key={h} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.mutedLight, fontWeight: 500 }}>{h}</span>)}
        </div>
        {MOCK_PROVINCES.map((item, idx) => (
          <motion.div key={item.id} variants={itemVars} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", alignItems: "center", padding: "16px 24px", borderBottom: idx !== MOCK_PROVINCES.length - 1 ? `1px solid ${C.border}` : "none", background: "rgba(255,255,255,0.01)" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: C.white }}>{item.name}</span>
            <span style={{ fontSize: "14px", color: C.mutedLight }}>{item.code}</span>
            <div><StatusBadge status={item.status} /></div>
            <ActionButtons />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderCities = () => (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="glass-card" style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: C.white, marginBottom: "4px" }}>Cities Management</h2>
          <p style={{ fontSize: "13px", color: C.mutedLight }}>Manage cities for candidate locations within provinces</p>
        </div>
        <AddButton label="Add City" />
      </div>
      <SearchBar placeholder="Search cities or provinces..." />
      
      <div style={{ border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 100px", padding: "16px 24px", background: "rgba(0,0,0,0.3)", borderBottom: `1px solid ${C.border}` }}>
          {["City Name", "Province", "Status", "Actions"].map(h => <span key={h} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.mutedLight, fontWeight: 500 }}>{h}</span>)}
        </div>
        {MOCK_CITIES.map((item, idx) => (
          <motion.div key={item.id} variants={itemVars} style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 100px", alignItems: "center", padding: "16px 24px", borderBottom: idx !== MOCK_CITIES.length - 1 ? `1px solid ${C.border}` : "none", background: "rgba(255,255,255,0.01)" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: C.white }}>{item.name}</span>
            <span style={{ fontSize: "14px", color: C.mutedLight }}>{item.province}</span>
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
      <AmbientBackground />
      
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        
        {/* Pass "master_mgmt" as activeTab so sidebar highlights it if that is its ID */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} 
          activeTab="master_mgmt" setActiveTab={() => {}} 
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
          <TopNav />

          <main style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column" }}>
            
            {/* Main Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: "32px" }}>
              <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.white, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                <Settings size={32} color={C.red} strokeWidth={1.5} /> Master Management
              </h1>
              <p style={{ fontSize: "14px", color: C.mutedLight }}>
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
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
              onClick={() => setIndustryModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              style={{ 
                position: "relative", width: "100%", maxWidth: "560px", margin: "24px",
                background: "linear-gradient(145deg, rgba(22,22,22,0.95), rgba(15,15,15,0.98))",
                border: `1px solid rgba(255,255,255,0.08)`, borderRadius: "20px",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)"
              }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIndustryModalOpen(false)}
                style={{ position: "absolute", right: "24px", top: "24px", background: "transparent", border: "none", color: C.muted, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = C.white}
                onMouseLeave={(e) => e.currentTarget.style.color = C.muted}
              >
                <X size={20} />
              </button>

              <div style={{ padding: "32px 32px 24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 600, color: C.white, marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Create New Job Industry</h2>
                <p style={{ fontSize: "13px", color: C.mutedLight }}>Enter the details for the new job industry.</p>
              </div>

              <div style={{ padding: "0 32px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Form Fields */}
                <FormField label="Name *" placeholder="Enter industry name" autoFocus />
                
                <FormTextArea label="Description" placeholder="Enter industry description (optional)" />

                <ToggleSwitch label="Active" />

                {/* Footer Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                  <motion.button 
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIndustryModalOpen(false)}
                    style={{
                      padding: "10px 20px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, 
                      borderRadius: "8px", color: C.offWhite, fontSize: "13px", fontWeight: 500, cursor: "pointer"
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -1, boxShadow: `0 8px 16px ${C.redGlowStrong}` }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIndustryModalOpen(false)}
                    style={{
                      padding: "10px 24px", background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`, 
                      border: `1px solid rgba(255,100,100,0.3)`, borderRadius: "8px", color: C.white, 
                      fontSize: "13px", fontWeight: 600, cursor: "pointer"
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