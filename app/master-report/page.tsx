"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LogOut, Download, FileText, Users, UserCheck, Calendar, 
  AlertTriangle, TrendingUp, MapPin, Briefcase, Clock, 
  CheckCircle, XCircle, FileWarning, ShieldAlert, Activity
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

  .chart-bar { transition: filter 0.2s; }
  .chart-bar:hover { filter: brightness(0.9); }
`;

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const MOCK_STATS = [
  { label: "Total Candidates", value: "1000", sub: "All registrations", icon: Users, color: "#3B82F6" },
  { label: "Verified Rate", value: "33%", sub: "334 verified", icon: UserCheck, color: C.successText },
  { label: "Active Campaigns", value: "1", sub: "Currently running", icon: Calendar, color: "#8B5CF6" },
  { label: "License Alerts", value: "0", sub: "Expiring this month", icon: AlertTriangle, color: C.alertText },
];

const MOCK_TRENDS = [
  { month: "Dec 2025", registrations: 10, verifications: 5 },
  { month: "Jan 2026", registrations: 40, verifications: 15 },
  { month: "Feb 2026", registrations: 85, verifications: 25 },
  { month: "Mar 2026", registrations: 150, verifications: 60 },
  { month: "Apr 2026", registrations: 220, verifications: 110 },
  { month: "May 2026", registrations: 350, verifications: 180 },
];

const MOCK_PROVINCES = [
  { name: "Ontario", total: 112, verified: 101, rate: 90 },
  { name: "Alberta", total: 336, verified: 150, rate: 45 },
  { name: "British Columbia", total: 552, verified: 83, rate: 15 },
];

const MOCK_CATEGORIES = [
  { name: "General Labour", total: 378, verified: 171, rate: 45 },
  { name: "Warehouse Associate", total: 195, verified: 13, rate: 7 },
  { name: "Customer Service", total: 131, verified: 48, rate: 37 },
  { name: "Office Admin & Clerical", total: 67, verified: 23, rate: 34 },
  { name: "Security Guards", total: 53, verified: 17, rate: 32 },
  { name: "Forklift Operator", total: 30, verified: 16, rate: 53, tag: "License" },
];

const CAMPAIGN_STATS = {
  active: parseInt(MOCK_STATS[2].value), 
  inactive: 3, 
  ended: 1
};
const totalCampaigns = CAMPAIGN_STATS.active + CAMPAIGN_STATS.inactive + CAMPAIGN_STATS.ended;

/* ─── ANIMATION VARIANTS ─────────────────────────────────────── */
const easeOutCirc = [0.0, 0.55, 0.45, 1];
const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }};
const itemVars = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }};

/* ─── CUSTOM CHARTS ──────────────────────────────────────────── */

function DonutChart({ data, size = 200, strokeWidth = 30 }: { data: { label: string, value: number, color: string }[], size?: number, strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  
  let currentOffset = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={C.bg} strokeWidth={strokeWidth} />
          {data.map((item, i) => {
            const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
            const offset = currentOffset;
            currentOffset -= (item.value / total) * circumference;

            return (
              <motion.circle
                key={i} cx={size/2} cy={size/2} r={radius} fill="none"
                stroke={item.color} strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: easeOutCirc, delay: i * 0.2 }}
              />
            );
          })}
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: C.textBody }}>
            <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: item.color }} />
            <span style={{ fontWeight: 600 }}>{item.label}</span>
            <span style={{ color: C.textMuted }}>({((item.value / total) * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomLineChart() {
  const width = 600; const height = 240;
  const padX = 40; const padY = 20;
  const maxVal = 400; 
  
  const getCoordinates = (val: number, idx: number) => {
    const x = padX + (idx * ((width - padX * 2) / (MOCK_TRENDS.length - 1)));
    const y = height - padY - ((val / maxVal) * (height - padY * 2));
    return { x, y };
  };

  const regPoints = MOCK_TRENDS.map((d, i) => getCoordinates(d.registrations, i));
  const verPoints = MOCK_TRENDS.map((d, i) => getCoordinates(d.verifications, i));

  const createPath = (points: {x:number, y:number}[]) => `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div style={{ minWidth: "600px", position: "relative" }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid Lines */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = height - padY - (i * ((height - padY * 2) / 4));
            return (
              <g key={i}>
                <line x1={padX} y1={y} x2={width - padX} y2={y} stroke={C.border} strokeWidth="1" strokeDasharray="4 4" />
                <text x={padX - 10} y={y + 4} fill={C.textHint} fontSize="11" fontWeight="500" textAnchor="end">{i * 100}</text>
              </g>
            );
          })}
          
          {/* X Axis Labels */}
          {MOCK_TRENDS.map((d, i) => {
            const { x } = getCoordinates(0, i);
            return <text key={i} x={x} y={height} fill={C.textHint} fontSize="11" fontWeight="500" textAnchor="middle">{d.month}</text>;
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="gradReg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradVer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.successText} stopOpacity="0.15" />
              <stop offset="100%" stopColor={C.successText} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Paths */}
          <motion.path d={`${createPath(regPoints)} L ${width-padX},${height-padY} L ${padX},${height-padY} Z`} fill="url(#gradReg)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />
          <motion.path d={`${createPath(verPoints)} L ${width-padX},${height-padY} L ${padX},${height-padY} Z`} fill="url(#gradVer)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }} />
          
          <motion.path d={createPath(regPoints)} fill="none" stroke="#3B82F6" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
          <motion.path d={createPath(verPoints)} fill="none" stroke={C.successText} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }} />

          {/* Dots */}
          {regPoints.map((p, i) => <motion.circle key={`r${i}`} cx={p.x} cy={p.y} r={4} fill={C.surface} stroke="#3B82F6" strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + i*0.1 }} />)}
          {verPoints.map((p, i) => <motion.circle key={`v${i}`} cx={p.x} cy={p.y} r={4} fill={C.surface} stroke={C.successText} strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + i*0.1 }} />)}
        </svg>

        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: C.textLabel, fontWeight: 500 }}>
            <span style={{ width: "12px", height: "3px", background: "#3B82F6", borderRadius: "2px" }} /> Registrations
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: C.textLabel, fontWeight: 500 }}>
            <span style={{ width: "12px", height: "3px", background: C.successText, borderRadius: "2px" }} /> Verifications
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomBarChart({ data, color }: { data: { name: string, total: number }[], color: string }) {
  const maxVal = Math.max(...data.map(d => d.total)) * 1.1; 

  return (
    <div style={{ display: "flex", height: "220px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
        {[1, 0.75, 0.5, 0.25, 0].map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", width: "24px", textAlign: "right", color: C.textHint, fontWeight: 500 }}>{Math.round(maxVal * step)}</span>
            <div style={{ flex: 1, height: "1px", background: i === 4 ? C.borderHover : C.border, borderBottom: i === 4 ? `1px solid ${C.border}` : "none" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", flex: 1, paddingLeft: "40px", position: "relative", zIndex: 1 }}>
        {data.map((item, i) => {
          const heightPct = (item.total / maxVal) * 100;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "32px" }}>
              <motion.div 
                initial={{ height: 0 }} whileInView={{ height: `${heightPct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: easeOutCirc, delay: i * 0.1 }} 
                className="chart-bar"
                style={{ width: "100%", background: color, borderRadius: "4px 4px 0 0", cursor: "pointer" }}
                title={`${item.name}: ${item.total}`}
              />
              <span style={{ fontSize: "10px", color: C.textMuted, transform: "rotate(-45deg)", transformOrigin: "top left", whiteSpace: "nowrap", marginTop: "8px", width: "20px", fontWeight: 600 }}>
                {item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── COMPONENTS ─────────────────────────────────────────────── */

function TopNav() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: easeOutCirc }}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 10 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHint, fontWeight: 600 }}>Reports</span>
        <span style={{ color: C.textMuted }}>/</span>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHeading, fontWeight: 600 }}>Master Report</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ fontSize: "13px", color: C.textMuted }}>Welcome, <span style={{ color: C.textHeading, fontWeight: 600 }}>support@jbrstaffingsolutions.ca</span></span>
        <motion.button whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} whileTap={{ scale: 0.98 }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
          Sign Out <LogOut size={16} />
        </motion.button>
      </div>
    </motion.header>
  );
}

function MetricCard({ value, label, sub, color }: { value: string, label: string, sub: string, color: string }) {
  return (
    <div style={{ flex: 1, padding: "24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}>
      <h3 style={{ fontSize: "36px", fontWeight: 700, color: color, fontFamily: "'DM Sans', sans-serif" }}>{value}</h3>
      <p style={{ fontSize: "14px", fontWeight: 600, color: C.textHeading }}>{label}</p>
      <p style={{ fontSize: "12px", color: C.textMuted, fontWeight: 500 }}>{sub}</p>
    </div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────── */
export default function MasterReportPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        
        <Sidebar isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} activeTab="master_report" setActiveTab={() => {}} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
          <TopNav />

          <main style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Page Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "8px" }}>
              <div>
                <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.textHeading, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                  <Activity size={32} color={C.red} strokeWidth={2} /> Master Report
                </h1>
                <p style={{ fontSize: "15px", color: C.textMuted }}>Comprehensive overview of all portal metrics and statistics</p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <motion.button whileHover={{ backgroundColor: C.inputBg }} whileTap={{ scale: 0.98 }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "8px", color: C.textHeading, fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  <Download size={16} /> Export Excel
                </motion.button>
                <motion.button whileHover={{ y: -2, boxShadow: `0 4px 16px ${C.redGlow}` }} whileTap={{ scale: 0.98 }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: `linear-gradient(135deg, ${C.redBright}, ${C.red})`, border: "none", borderRadius: "8px", color: C.white, fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: `0 2px 8px ${C.redGlow}` }}>
                  <FileText size={16} /> Generate PDF
                </motion.button>
              </div>
            </motion.div>

            {/* Top Stat Cards */}
            <motion.div variants={containerVars} initial="hidden" animate="show" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              {MOCK_STATS.map((stat, i) => (
                <motion.div key={i} variants={itemVars} className="clean-card" style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: "13px", color: C.textLabel, marginBottom: "12px", fontWeight: 600 }}>{stat.label}</p>
                    <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "36px", fontWeight: 700, color: C.textHeading, lineHeight: 1, marginBottom: "8px" }}>{stat.value}</h3>
                    <p style={{ fontSize: "12px", color: C.textMuted, fontWeight: 500 }}>{stat.sub}</p>
                  </div>
                  <div style={{ color: stat.color, padding: "10px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "10px" }}>
                    <stat.icon size={24} strokeWidth={2} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts Row 1 */}
            <motion.div variants={containerVars} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
              <motion.div variants={itemVars} className="clean-card" style={{ padding: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, marginBottom: "32px", display: "flex", alignItems: "center", gap: "8px" }}><TrendingUp size={20} color={C.red} strokeWidth={2}/> Verification Status Distribution</h3>
                <DonutChart data={[{ label: "Verified", value: 33, color: C.successText }, { label: "Pending", value: 66, color: "#F59E0B" }, { label: "Rejected", value: 1, color: C.alertText }]} />
              </motion.div>
              <motion.div variants={itemVars} className="clean-card" style={{ padding: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, marginBottom: "32px", display: "flex", alignItems: "center", gap: "8px" }}><Calendar size={20} color={C.red} strokeWidth={2}/> 6-Month Registration Trends</h3>
                <CustomLineChart />
              </motion.div>
            </motion.div>

            {/* Charts Row 2 */}
            <motion.div variants={containerVars} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
              <motion.div variants={itemVars} className="clean-card" style={{ padding: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, marginBottom: "32px", display: "flex", alignItems: "center", gap: "8px" }}><MapPin size={20} color={C.red} strokeWidth={2}/> Top Provinces by Candidates</h3>
                <CustomBarChart data={MOCK_PROVINCES} color="#3B82F6" />
              </motion.div>
              <motion.div variants={itemVars} className="clean-card" style={{ padding: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, marginBottom: "32px", display: "flex", alignItems: "center", gap: "8px" }}><Briefcase size={20} color={C.red} strokeWidth={2}/> Popular Job Categories</h3>
                <CustomBarChart data={MOCK_CATEGORIES} color={C.redBright} />
              </motion.div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div variants={containerVars} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="clean-card" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}><Clock size={20} color={C.red} strokeWidth={2}/> Performance Metrics & KPIs</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <MetricCard value="0" label="This Month" sub="Registrations" color="#3B82F6" />
                <MetricCard value="33%" label="Success Rate" sub="Verification" color={C.successText} />
                <MetricCard value="2.5" label="Days Average" sub="Time to Verify" color="#8B5CF6" />
                <MetricCard value="0%" label="Rejection Rate" sub="Quality Metric" color={C.alertText} />
              </div>
            </motion.div>

            {/* Tables Row */}
            <motion.div variants={containerVars} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
              <motion.div variants={itemVars} className="clean-card" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "24px", borderBottom: `1px solid ${C.border}` }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, display: "flex", alignItems: "center", gap: "8px" }}><MapPin size={20} color={C.red} strokeWidth={2}/> Candidates by Province</h3>
                </div>
                <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: C.inputBg, fontSize: "12px", textTransform: "uppercase", color: C.textHint, fontWeight: 600 }}>
                  <span>Province</span><span style={{ textAlign: "right" }}>Total</span><span style={{ textAlign: "right" }}>Verified</span><span style={{ textAlign: "right" }}>Rate</span>
                </div>
                {MOCK_PROVINCES.map((prov, i) => (
                  <div key={i} style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderBottom: i !== MOCK_PROVINCES.length -1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}>
                    <span style={{ fontSize: "15px", color: C.textHeading, fontWeight: 600 }}>{prov.name}</span>
                    <span style={{ fontSize: "14px", color: C.textMuted, textAlign: "right" }}>{prov.total}</span>
                    <span style={{ fontSize: "14px", color: C.textMuted, textAlign: "right" }}>{prov.verified}</span>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, background: prov.rate >= 90 ? C.successBg : C.alertBg, color: prov.rate >= 90 ? C.successText : C.alertText }}>{prov.rate}%</span>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVars} className="clean-card" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "24px", borderBottom: `1px solid ${C.border}` }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, display: "flex", alignItems: "center", gap: "8px" }}><Briefcase size={20} color={C.red} strokeWidth={2}/> Candidates by Job Category</h3>
                </div>
                <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", background: C.inputBg, fontSize: "12px", textTransform: "uppercase", color: C.textHint, fontWeight: 600 }}>
                  <span>Category</span><span style={{ textAlign: "right" }}>Total</span><span style={{ textAlign: "right" }}>Verified</span><span style={{ textAlign: "right" }}>Rate</span>
                </div>
                {MOCK_CATEGORIES.map((cat, i) => (
                  <div key={i} style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", borderBottom: i !== MOCK_CATEGORIES.length -1 ? `1px solid ${C.border}` : "none", alignItems: "center", background: cat.tag ? C.inputBg : "transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", color: C.textHeading, fontWeight: 600 }}>{cat.name}</span>
                      {cat.tag && <span style={{ padding: "2px 6px", borderRadius: "4px", background: C.surface, border: `1px solid ${C.border}`, fontSize: "10px", color: C.textMuted, fontWeight: 600 }}>{cat.tag}</span>}
                    </div>
                    <span style={{ fontSize: "14px", color: C.textMuted, textAlign: "right" }}>{cat.total}</span>
                    <span style={{ fontSize: "14px", color: C.textMuted, textAlign: "right" }}>{cat.verified}</span>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, background: C.alertBg, color: C.alertText }}>{cat.rate}%</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* License & Verification Breakdowns */}
            <motion.div variants={containerVars} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px" }}>
              <motion.div variants={itemVars} className="clean-card" style={{ padding: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}><FileWarning size={20} color={C.red} strokeWidth={2}/> License Management Analysis</h3>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "40px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", flex: 1, minWidth: "300px" }}>
                    <MetricCard value="36" label="With License" sub="Valid & Active" color={C.successText} />
                    <MetricCard value="0" label="Expiring This Month" sub="Needs Attention" color={C.alertText} />
                    <MetricCard value="2" label="Expiring Next 3 Months" sub="Upcoming Renewals" color="#F59E0B" />
                    <MetricCard value="0" label="Missing License" sub="Action Required" color={C.alertText} />
                  </div>
                  <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: "300px" }}>
                    <DonutChart data={[{ label: "Valid", value: 95, color: C.successText }, { label: "Expiring Soon", value: 5, color: "#F59E0B" }, { label: "Missing", value: 0, color: C.alertText }]} size={160} strokeWidth={24} />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVars} className="clean-card" style={{ padding: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}><ShieldAlert size={20} color={C.red} strokeWidth={2}/> Verification Status Breakdown</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  <MetricCard value="334" label="Verified" sub="Ready for placement" color={C.successText} />
                  <MetricCard value="664" label="Pending" sub="Under review" color="#F59E0B" />
                  <MetricCard value="2" label="Rejected" sub="Did not meet criteria" color={C.alertText} />
                </div>
              </motion.div>
            </motion.div>

          </main>
        </div>
      </div>
    </>
  );
}