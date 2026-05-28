"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation"; 
import { 
  Users, 
  Calendar, 
  BadgeCheck, 
  AlertTriangle, 
  TrendingUp, 
  LogOut, 
  Plus, 
  FileText,
  Activity,
  LayoutDashboard,
  Link as LinkIcon,
  UserCheck,
  UserCog,
  Settings,
  BarChart3,
  ChevronLeft,
  Menu
} from "lucide-react";

/* ─── DESIGN TOKENS ─────────── */
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
  emerald: "#059669",
  emeraldGlow: "rgba(5,150,105,0.2)",
  white: "#FFFFFF",
  offWhite: "#E8E6E0",
  muted: "#6B6B68",
  mutedLight: "#9A9896",
  border: "rgba(255,255,255,0.055)",
  borderHover: "rgba(255,255,255,0.12)",
  borderFocus: "rgba(198,40,40,0.6)",
};

/* ─── GLOBAL CSS ────────────────────────────────── */
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

  /* Responsive 5-column grid fallback for mobile */
  @media (max-width: 1200px) {
    .stats-row {
      overflow-x: auto;
      padding-bottom: 16px;
    }
    .stats-grid {
      min-width: 1000px;
    }
  }
`;

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const SIDEBAR_MENU = [
  {
    group: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { id: "campaign", label: "Campaign Link", icon: LinkIcon, path: "/campaigns" },
      { id: "employees", label: "Employees", icon: Users, path: "/employees" },
      { id: "shortlisted", label: "Shortlisted", icon: UserCheck, path: "/shortlisted" },
    ]
  },
  {
    group: "Administration",
    items: [
      { id: "user_mgmt", label: "User Management", icon: UserCog, path: "/users" },
      { id: "master_mgmt", label: "Master Management", icon: Settings, path: "/master" },
    ]
  },
  {
    group: "Reports",
    items: [
      { id: "master_report", label: "Master Report", icon: BarChart3, path: "/master-report" },
    ]
  }
];

// ADDED NAVIGATION HREFS TO STATS DATA
const STATS_DATA = [
  { label: "Total Candidates", value: "1744", sub: "1744 registered", icon: Users, href: "/employees" },
  { label: "Active Campaigns", value: "1", sub: "1 running", icon: Calendar, href: "/campaigns" },
  { label: "Verified Candidates", value: "403", sub: "403 verified", icon: BadgeCheck, href: "/employees?status=verified" },
  { label: "License Expiring", value: "0", sub: "This month", icon: AlertTriangle, alert: true, href: "/employees?filter=license-expiring" },
  { label: "Conversion Rate", value: "23%", sub: "23% verified", icon: TrendingUp, href: "/master-report" },
];

const RECENT_ACTIVITY = [
  { name: "Bhavna Patel", role: "General Labour", time: "8 hours ago", initials: "BP" },
  { name: "Kamaljeet Singh", role: "Machine operator", time: "11 hours ago", initials: "KS" },
  { name: "Navdeep Kaur Kaur", role: "Warehouse Associate", time: "13 hours ago", initials: "NK" },
  { name: "Atinderjeet Kaur", role: "General Labour", time: "14 hours ago", initials: "AK" },
];

const JOB_CATEGORIES = [
  { name: "General Labour", total: 380, verified: 170 },
  { name: "Warehouse Assoc...", total: 195, verified: 45 },
  { name: "Customer Servic...", total: 140, verified: 25 },
  { name: "Office Admin An...", total: 70, verified: 20 },
  { name: "Security guards", total: 55, verified: 18 },
  { name: "Forklift Operat...", total: 35, verified: 15 },
  { name: "Personal Suppor...", total: 20, verified: 10 },
  { name: "Book Keeper", total: 15, verified: 5 },
];

const CAMPAIGN_STATS = {
  active: parseInt(STATS_DATA[1].value), 
  inactive: 3, 
  ended: 1
};
const totalCampaigns = CAMPAIGN_STATS.active + CAMPAIGN_STATS.inactive + CAMPAIGN_STATS.ended;

/* ─── ANIMATION VARIANTS ─────────────────────────────────────── */
const easeOutCirc = [0.0, 0.55, 0.45, 1];
const spring = { type: "spring", stiffness: 200, damping: 20 };

const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: spring }
};

/* ─── COMPONENTS ─────────────────────────────────────────────── */

function DashboardBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 0%, ${C.surface} 0%, ${C.bg} 80%)` }} />
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: `radial-gradient(circle, ${C.redGlow} 0%, transparent 60%)`, filter: "blur(100px)", opacity: 0.4 }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "60vw", height: "60vw", background: `radial-gradient(circle, ${C.goldDim} 0%, transparent 60%)`, filter: "blur(120px)", opacity: 0.3 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.3, maskImage: "linear-gradient(to bottom, black 20%, transparent 80%)", WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 80%)" }} />
    </div>
  );
}

function Sidebar({ isCollapsed, setCollapsed, activeTab, setActiveTab }: any) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.4, ease: easeOutCirc }}
      style={{
        background: "rgba(11, 11, 11, 0.6)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        borderRight: `1px solid ${C.border}`,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        overflow: "hidden",
        flexShrink: 0 
      }}
    >
      <div style={{ padding: "24px", display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "space-between", borderBottom: `1px solid ${C.border}`, height: "85px" }}>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              style={{ display: "flex", flexDirection: "column", gap: "4px", overflow: "hidden" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "24px", height: "24px", border: `1px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)", backgroundSize: "200px 100%", animation: "shimmer 3s infinite" }} />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", color: C.red, fontWeight: 700, fontSize: "14px", zIndex: 1 }}>JBR</span>
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, letterSpacing: "2px", color: C.white, whiteSpace: "nowrap" }}>STAFFING</span>
              </div>
              <span style={{ fontSize: "9px", letterSpacing: "1px", color: C.muted, textTransform: "uppercase", whiteSpace: "nowrap" }}>Redefining Culture</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: "transparent", border: "none", color: C.mutedLight, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", borderRadius: "8px"
          }}
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </motion.button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "32px" }}>
        {SIDEBAR_MENU.map((group, gIdx) => (
          <div key={gIdx} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            
            {!isCollapsed ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: C.muted, paddingLeft: "12px", marginBottom: "4px" }}>
                {group.group}
              </motion.span>
            ) : (
              <div style={{ height: "1px", background: C.border, margin: "8px 0" }} />
            )}

            {group.items.map((item) => {
              const isActive = activeTab ? activeTab === item.id : pathname === item.path;
              const Icon = item.icon;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    router.push(item.path);
                  }}
                  whileHover={!isActive ? { backgroundColor: "rgba(255,255,255,0.03)", x: 4 } : {}}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    width: "100%", padding: "12px",
                    background: isActive ? "linear-gradient(90deg, rgba(198,40,40,0.15) 0%, transparent 100%)" : "transparent",
                    border: "none", borderRadius: "8px", cursor: "pointer",
                    position: "relative", transition: "color 0.2s ease"
                  }}
                >
                  {isActive && (
                    <motion.div layoutId="activeTabIndicator" style={{ position: "absolute", left: 0, top: "10%", bottom: "10%", width: "3px", borderRadius: "0 4px 4px 0", background: C.red, boxShadow: `0 0 10px ${C.red}` }} />
                  )}
                  
                  <div style={{ display: "flex", justifyContent: "center", width: isCollapsed ? "100%" : "auto", color: isActive ? C.redBright : C.mutedLight }}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                        style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400, color: isActive ? C.white : C.offWhite, whiteSpace: "nowrap" }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </motion.aside>
  );
}

function TopNav({ activeTabLabel }: { activeTabLabel: string }) {
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
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.white, fontWeight: 500 }}>{activeTabLabel}</span>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ fontSize: "12px", color: C.mutedLight }}>
          Welcome, <span style={{ color: C.offWhite, fontWeight: 500 }}>support@jbrstaffingsolutions.ca</span>
        </span>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(198,40,40,0.1)", borderColor: C.red, color: C.red }} whileTap={{ scale: 0.98 }}
          style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px",
            background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px",
            color: C.offWhite, fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease"
          }}>
          Sign Out
          <LogOut size={14} />
        </motion.button>
      </div>
    </motion.header>
  );
}

function StatCard({ data }: { data: typeof STATS_DATA[0] }) {
  const router = useRouter(); // ADDED NEXT.JS ROUTER
  const Icon = data.icon;
  // Use bracket notation to safely access the optional alert property dynamically
  const isAlert = 'alert' in data && data.alert;

  return (
    <motion.div 
      onClick={() => { if(data.href) router.push(data.href) }} // ADDED NAVIGATION LINK
      variants={itemVars}
      whileHover={{ y: -4, borderColor: C.borderHover, boxShadow: "0 15px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.05)" }}
      whileTap={{ scale: 0.98 }} // ADDED TAP ANIMATION
      className="glass-card" 
      style={{ 
        padding: "20px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        cursor: data.href ? "pointer" : "default", // ADDED POINTER CURSOR
        minWidth: 0 
      }}>
      <div style={{ flex: 1, minWidth: 0, paddingRight: "12px" }}>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: C.mutedLight, marginBottom: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {data.label}
        </p>
        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "32px", fontWeight: 700, letterSpacing: "-0.5px", color: C.white, lineHeight: 1, marginBottom: "8px" }}>
          {data.value}
        </h3>
        <p style={{ fontSize: "11px", color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {data.sub}
        </p>
      </div>
      <div style={{
        width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
        background: isAlert ? C.redGlow : "rgba(255,255,255,0.03)", 
        border: `1px solid ${isAlert ? C.red : C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", 
        color: isAlert ? C.redBright : C.mutedLight, 
        boxShadow: isAlert ? `0 0 15px ${C.redGlow}` : "none"
      }}>
        <Icon size={18} strokeWidth={2} />
      </div>
    </motion.div>
  );
}

function CampaignDonutChart() {
  const size = 220; 
  const strokeWidth = 35; 
  const radius = (size - strokeWidth) / 2; 
  const circumference = radius * 2 * Math.PI;
  
  const activePercentage = totalCampaigns > 0 ? (CAMPAIGN_STATS.active / totalCampaigns) : 0;
  const activeOffset = circumference - (activePercentage * circumference);

  return (
    <motion.div variants={itemVars} className="glass-card" style={{ padding: "32px", flex: "1 1 400px", display: "flex", flexDirection: "column" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "40px", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Activity size={18} color={C.red} /> Campaign Status
      </h3>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, position: "relative" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 15px ${C.redGlowStrong})` }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
          <motion.circle 
            cx={size/2} cy={size/2} r={radius} fill="none" stroke={C.red} strokeWidth={strokeWidth} strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: activeOffset }} transition={{ duration: 2, ease: easeOutCirc, delay: 0.5 }}
          />
        </svg>
        <div style={{ position: "absolute", textAlign: "center", transform: "translateY(2px)" }}>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, ...spring }} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "36px", fontWeight: 700, color: C.white }}>
            {CAMPAIGN_STATS.active}
          </motion.div>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: C.red }}>Active</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "40px" }}>
        {[{ label: "Active", color: C.red }, { label: "Inactive", color: C.muted }, { label: "Ended", color: "rgba(255,255,255,0.1)" }].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: C.mutedLight }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color }} />{item.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RecentActivity() {
  return (
    <motion.div variants={itemVars} className="glass-card" style={{ padding: "32px", flex: "1 1 350px", display: "flex", flexDirection: "column" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "24px", letterSpacing: "0.5px" }}>Recent Activity</h3>
      <motion.div variants={containerVars} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {RECENT_ACTIVITY.map((act, i) => (
          <motion.div key={i} variants={itemVars} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: i !== RECENT_ACTIVITY.length -1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: C.offWhite, letterSpacing: "1px" }}>
                {act.initials}
              </div>
              <div>
                <p style={{ fontSize: "13px", color: C.white, marginBottom: "4px" }}><span style={{ fontWeight: 600 }}>{act.name}</span> registered for <span style={{ color: C.gold }}>{act.role}</span></p>
                <p style={{ fontSize: "11px", color: C.muted }}>{act.time}</p>
              </div>
            </div>
            <div style={{ padding: "4px 10px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", color: "#60A5FA", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>Pending</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function CustomBarChart({ title, type }: { title: string, type: "total" | "verified" }) {
  const isTotal = type === "total"; const maxVal = isTotal ? 380 : 180;
  const gradient = isTotal ? `linear-gradient(to top, ${C.redBright}, ${C.red})` : `linear-gradient(to top, #10B981, ${C.emerald})`;
  const shadow = isTotal ? C.redGlow : C.emeraldGlow;
  return (
    <motion.div variants={itemVars} className="glass-card" style={{ padding: "32px", flex: 1, minWidth: "400px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "32px", letterSpacing: "0.5px" }}>{title}</h3>
      <div style={{ display: "flex", height: "200px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
          {[1, 0.75, 0.5, 0.25, 0].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", opacity: 0.5 }}>
              <span style={{ fontSize: "10px", width: "24px", textAlign: "right", color: C.muted }}>{Math.round(maxVal * step)}</span>
              <div style={{ flex: 1, height: "1px", background: i === 4 ? C.borderHover : C.border, borderBottom: i === 4 ? `1px solid ${C.border}` : "none" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", flex: 1, paddingLeft: "40px", position: "relative", zIndex: 1 }}>
          {JOB_CATEGORIES.map((cat, i) => {
            const heightPct = ( (isTotal ? cat.total : cat.verified) / maxVal) * 100;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "40px" }}>
                <motion.div 
                  initial={{ height: 0 }} whileInView={{ height: `${heightPct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: easeOutCirc, delay: i * 0.05 }} whileHover={{ filter: "brightness(1.2)" }}
                  style={{ width: "100%", background: gradient, borderRadius: "4px 4px 0 0", boxShadow: heightPct > 0 ? `0 0 15px ${shadow}` : "none", cursor: "pointer" }}
                  title={`${cat.name} : ${isTotal ? cat.total : cat.verified}`}
                />
                <span style={{ fontSize: "9px", color: C.mutedLight, transform: "rotate(-45deg)", transformOrigin: "top left", whiteSpace: "nowrap", marginTop: "8px", width: "20px" }}>{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function ActionCard({ title, sub, type, icon: Icon, href }: { title: string, sub: string, type: "primary"|"secondary"|"tertiary", icon: any, href: string }) {
  const router = useRouter();
  const isPrimary = type === "primary"; const isTertiary = type === "tertiary";
  return (
    <motion.div 
      onClick={() => router.push(href)}
      variants={itemVars} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }}
      style={{
        flex: 1, padding: "28px", borderRadius: "16px", cursor: "pointer", position: "relative", overflow: "hidden",
        background: isPrimary ? `linear-gradient(135deg, ${C.redBright}, ${C.red})` : isTertiary ? "#374151" : "#000000",
        border: `1px solid ${isPrimary ? "rgba(255,100,100,0.3)" : C.border}`, boxShadow: isPrimary ? `0 15px 30px ${C.redGlowStrong}` : "0 10px 30px rgba(0,0,0,0.5)",
      }}>
      {isPrimary && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%)", backgroundSize: "300px 100%", animation: "shimmer 2.5s infinite" }} />}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", gap: "24px" }}>
        <div style={{ color: isPrimary ? C.white : C.muted }}><Icon size={28} strokeWidth={1.5} /></div>
        <div>
          <h4 style={{ fontSize: "18px", fontWeight: 600, color: C.white, marginBottom: "4px" }}>{title}</h4>
          <p style={{ fontSize: "12px", color: isPrimary ? "rgba(255,255,255,0.8)" : C.mutedLight }}>{sub}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN LAYOUT PAGE ────────────────────────────────────── */
export default function JBRLayout() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const activeTabLabel = SIDEBAR_MENU.flatMap(g => g.items).find(i => i.id === activeTab)?.label || "Dashboard";

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <DashboardBackground />
      
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
          
          <TopNav activeTabLabel={activeTabLabel} />

          <main style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
            
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" ? (
                <motion.div
                  key="dashboard-view"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                  style={{ display: "flex", flexDirection: "column", gap: "32px" }}
                >
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.white, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                      Recruitment Overview
                    </h1>
                    <p style={{ fontSize: "14px", color: C.mutedLight }}>
                      Here's an overview of your activities and candidate pipeline.
                    </p>
                  </motion.div>

                  <div className="stats-row">
                    <motion.div 
                      variants={containerVars} 
                      initial="hidden" 
                      animate="show" 
                      className="stats-grid"
                      style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(5, minmax(0, 1fr))", 
                        gap: "20px" 
                      }}
                    >
                      {STATS_DATA.map((stat, i) => <StatCard key={i} data={stat} />)}
                    </motion.div>
                  </div>

                  <motion.div variants={containerVars} initial="hidden" animate="show" style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                    <CampaignDonutChart />
                    <RecentActivity />
                  </motion.div>

                  <motion.div variants={containerVars} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "16px" }}>
                    <CustomBarChart title="Total Candidates by Job Category" type="total" />
                    <CustomBarChart title="Verified Candidates by Job Category" type="verified" />
                  </motion.div>

                  <motion.div variants={containerVars} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginTop: "16px", paddingBottom: "40px" }}>
                    <motion.h3 variants={itemVars} style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px" }}>Quick Actions</motion.h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                      <ActionCard title="Create Campaign" sub="Manage 1 campaigns" type="primary" icon={Plus} href="/campaigns" />
                      <ActionCard title="View Employees" sub="1744 registered" type="secondary" icon={Users} href="/employees" />
                      <ActionCard title="Generate Report" sub="3 available reports" type="tertiary" icon={FileText} href="/master-report" />
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  key="other-view"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px dashed ${C.border}`, borderRadius: "16px", background: "rgba(255,255,255,0.01)" }}
                >
                  <Activity size={48} color={C.muted} style={{ marginBottom: "16px", opacity: 0.5 }} />
                  <h2 style={{ fontSize: "24px", fontFamily: "'Cormorant Garamond', serif", color: C.white }}>{activeTabLabel} Module</h2>
                  <p style={{ color: C.mutedLight, marginTop: "8px" }}>This section is currently under development.</p>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>
      </div>
    </>
  );
}