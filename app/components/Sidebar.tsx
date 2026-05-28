"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, LayoutDashboard, Link as LinkIcon, UserCheck, 
  UserCog, Settings, BarChart3, ChevronLeft, Menu 
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

/* ─── SHARED TOKENS (You can move this to a theme.ts file) ─── */
export const C = {
  bg: "#080808", surface: "#0f0f0f", card: "#111111", panel: "#0c0c0c",
  red: "#C62828", redBright: "#E53935", redGlow: "rgba(198,40,40,0.18)", redGlowStrong: "rgba(229,57,53,0.35)",
  gold: "#BFA46A", goldDim: "rgba(191,164,106,0.15)", emerald: "#059669", emeraldGlow: "rgba(5,150,105,0.2)",
  white: "#FFFFFF", offWhite: "#E8E6E0", muted: "#6B6B68", mutedLight: "#9A9896",
  border: "rgba(255,255,255,0.055)", borderHover: "rgba(255,255,255,0.12)",
};

const SIDEBAR_MENU = [
  {
    group: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { id: "campaigns", label: "Campaign Link", icon: LinkIcon, path: "/campaigns" },
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

const easeOutCirc = [0.0, 0.55, 0.45, 1];

interface SidebarProps {
  isCollapsed: boolean;
  setCollapsed: (val: boolean) => void;
  // Made optional so it falls back to URL routing automatically
  activeTab?: string;
  setActiveTab?: (val: string) => void;
}

export default function Sidebar({ isCollapsed, setCollapsed, activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.4, ease: easeOutCirc }}
      style={{
        background: "rgba(11, 11, 11, 0.6)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
        borderRight: `1px solid ${C.border}`, height: "100vh", position: "sticky", top: 0,
        display: "flex", flexDirection: "column", zIndex: 50, overflow: "hidden", flexShrink: 0
      }}
    >
      <div style={{ padding: "24px", display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "space-between", borderBottom: `1px solid ${C.border}`, height: "85px" }}>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} style={{ display: "flex", flexDirection: "column", gap: "4px", overflow: "hidden" }}>
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
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }} whileTap={{ scale: 0.9 }}
          style={{ background: "transparent", border: "none", color: C.mutedLight, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", borderRadius: "8px" }}
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </motion.button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "32px" }}>
        {SIDEBAR_MENU.map((group, gIdx) => (
          <div key={gIdx} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {!isCollapsed ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: C.muted, paddingLeft: "12px", marginBottom: "4px" }}>{group.group}</motion.span>
            ) : <div style={{ height: "1px", background: C.border, margin: "8px 0" }} />}

            {group.items.map((item) => {
              // Automatically highlight based on URL, falling back to state if URL doesn't match
              const isActive = activeTab ? activeTab === item.id : pathname === item.path;
              const Icon = item.icon;
              
              return (
                <motion.button
                  key={item.id} 
                  onClick={() => {
                    if (setActiveTab) setActiveTab(item.id);
                    router.push(item.path); // <--- Triggers actual navigation
                  }}
                  whileHover={!isActive ? { backgroundColor: "rgba(255,255,255,0.03)", x: 4 } : {}} whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px", width: "100%", padding: "12px",
                    background: isActive ? "linear-gradient(90deg, rgba(198,40,40,0.15) 0%, transparent 100%)" : "transparent",
                    border: "none", borderRadius: "8px", cursor: "pointer", position: "relative", transition: "color 0.2s ease"
                  }}
                >
                  {isActive && <motion.div layoutId="activeTabIndicator" style={{ position: "absolute", left: 0, top: "10%", bottom: "10%", width: "3px", borderRadius: "0 4px 4px 0", background: C.red, boxShadow: `0 0 10px ${C.red}` }} />}
                  <div style={{ display: "flex", justifyContent: "center", width: isCollapsed ? "100%" : "auto", color: isActive ? C.redBright : C.mutedLight }}><Icon size={20} strokeWidth={isActive ? 2.5 : 2} /></div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400, color: isActive ? C.white : C.offWhite, whiteSpace: "nowrap" }}>
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