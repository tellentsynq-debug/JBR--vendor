"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Search, ChevronDown, Download, CheckCircle, 
  MessageCircle, Users, Trash2, Eye, Edit2, ChevronLeft, 
  ChevronRight, Square, CheckSquare, Calendar, FileSpreadsheet
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
  .table-min-width { min-width: 1450px; }

  select { appearance: none; background-color: transparent; cursor: pointer; }
  select option { background-color: ${C.surface}; color: ${C.textHeading}; }
`;

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const MOCK_JOB_CATEGORIES = [
  { id: "cat-1", name: "General Labour" },
  { id: "cat-2", name: "Security" },
  { id: "cat-3", name: "Warehouse" }
];

const MOCK_PROVINCES = [
  { id: "prov-1", name: "British Columbia" },
  { id: "prov-2", name: "Ontario" },
  { id: "prov-3", name: "Alberta" }
];

// ─── ALL CANADIAN CITIES (grouped by province) ───────────────
const MOCK_CITIES = [
  // Alberta
  { id: "city-ab-1",  name: "Calgary",         province: "Alberta" },
  { id: "city-ab-2",  name: "Edmonton",         province: "Alberta" },
  { id: "city-ab-3",  name: "Red Deer",         province: "Alberta" },
  { id: "city-ab-4",  name: "Lethbridge",       province: "Alberta" },
  { id: "city-ab-5",  name: "St. Albert",       province: "Alberta" },
  { id: "city-ab-6",  name: "Medicine Hat",     province: "Alberta" },
  { id: "city-ab-7",  name: "Grande Prairie",   province: "Alberta" },
  { id: "city-ab-8",  name: "Airdrie",          province: "Alberta" },
  { id: "city-ab-9",  name: "Spruce Grove",     province: "Alberta" },
  { id: "city-ab-10", name: "Leduc",            province: "Alberta" },
  { id: "city-ab-11", name: "Fort McMurray",    province: "Alberta" },
  { id: "city-ab-12", name: "Beaumont",         province: "Alberta" },
  { id: "city-ab-13", name: "Chestermere",      province: "Alberta" },
  { id: "city-ab-14", name: "Lloydminster",     province: "Alberta" },
  { id: "city-ab-15", name: "Camrose",          province: "Alberta" },
  { id: "city-ab-16", name: "Lacombe",          province: "Alberta" },
  { id: "city-ab-17", name: "Cochrane",         province: "Alberta" },
  { id: "city-ab-18", name: "Okotoks",          province: "Alberta" },
  { id: "city-ab-19", name: "Banff",            province: "Alberta" },
  { id: "city-ab-20", name: "Jasper",           province: "Alberta" },

  // British Columbia
  { id: "city-bc-1",  name: "Vancouver",        province: "British Columbia" },
  { id: "city-bc-2",  name: "Surrey",           province: "British Columbia" },
  { id: "city-bc-3",  name: "Burnaby",          province: "British Columbia" },
  { id: "city-bc-4",  name: "Richmond",         province: "British Columbia" },
  { id: "city-bc-5",  name: "Kelowna",          province: "British Columbia" },
  { id: "city-bc-6",  name: "Abbotsford",       province: "British Columbia" },
  { id: "city-bc-7",  name: "Coquitlam",        province: "British Columbia" },
  { id: "city-bc-8",  name: "Langley",          province: "British Columbia" },
  { id: "city-bc-9",  name: "Saanich",          province: "British Columbia" },
  { id: "city-bc-10", name: "Delta",            province: "British Columbia" },
  { id: "city-bc-11", name: "Kamloops",         province: "British Columbia" },
  { id: "city-bc-12", name: "Nanaimo",          province: "British Columbia" },
  { id: "city-bc-13", name: "Chilliwack",       province: "British Columbia" },
  { id: "city-bc-14", name: "Maple Ridge",      province: "British Columbia" },
  { id: "city-bc-15", name: "Victoria",         province: "British Columbia" },
  { id: "city-bc-16", name: "North Vancouver",  province: "British Columbia" },
  { id: "city-bc-17", name: "Prince George",    province: "British Columbia" },
  { id: "city-bc-18", name: "New Westminster",  province: "British Columbia" },
  { id: "city-bc-19", name: "West Vancouver",   province: "British Columbia" },
  { id: "city-bc-20", name: "Penticton",        province: "British Columbia" },
  { id: "city-bc-21", name: "Vernon",           province: "British Columbia" },
  { id: "city-bc-22", name: "Port Coquitlam",   province: "British Columbia" },
  { id: "city-bc-23", name: "Port Moody",       province: "British Columbia" },
  { id: "city-bc-24", name: "White Rock",       province: "British Columbia" },
  { id: "city-bc-25", name: "Mission",          province: "British Columbia" },
  { id: "city-bc-26", name: "Cranbrook",        province: "British Columbia" },
  { id: "city-bc-27", name: "Fort St. John",    province: "British Columbia" },
  { id: "city-bc-28", name: "Courtenay",        province: "British Columbia" },
  { id: "city-bc-29", name: "Pitt Meadows",     province: "British Columbia" },
  { id: "city-bc-30", name: "Squamish",         province: "British Columbia" },

  // Ontario
  { id: "city-on-1",  name: "Toronto",          province: "Ontario" },
  { id: "city-on-2",  name: "Ottawa",           province: "Ontario" },
  { id: "city-on-3",  name: "Mississauga",      province: "Ontario" },
  { id: "city-on-4",  name: "Brampton",         province: "Ontario" },
  { id: "city-on-5",  name: "Hamilton",         province: "Ontario" },
  { id: "city-on-6",  name: "London",           province: "Ontario" },
  { id: "city-on-7",  name: "Markham",          province: "Ontario" },
  { id: "city-on-8",  name: "Vaughan",          province: "Ontario" },
  { id: "city-on-9",  name: "Kitchener",        province: "Ontario" },
  { id: "city-on-10", name: "Windsor",          province: "Ontario" },
  { id: "city-on-11", name: "Richmond Hill",    province: "Ontario" },
  { id: "city-on-12", name: "Oakville",         province: "Ontario" },
  { id: "city-on-13", name: "Burlington",       province: "Ontario" },
  { id: "city-on-14", name: "Greater Sudbury",  province: "Ontario" },
  { id: "city-on-15", name: "Oshawa",           province: "Ontario" },
  { id: "city-on-16", name: "Barrie",           province: "Ontario" },
  { id: "city-on-17", name: "St. Catharines",   province: "Ontario" },
  { id: "city-on-18", name: "Cambridge",        province: "Ontario" },
  { id: "city-on-19", name: "Kingston",         province: "Ontario" },
  { id: "city-on-20", name: "Whitby",           province: "Ontario" },
  { id: "city-on-21", name: "Guelph",           province: "Ontario" },
  { id: "city-on-22", name: "Ajax",             province: "Ontario" },
  { id: "city-on-23", name: "Thunder Bay",      province: "Ontario" },
  { id: "city-on-24", name: "Waterloo",         province: "Ontario" },
  { id: "city-on-25", name: "Chatham-Kent",     province: "Ontario" },
  { id: "city-on-26", name: "Pickering",        province: "Ontario" },
  { id: "city-on-27", name: "Niagara Falls",    province: "Ontario" },
  { id: "city-on-28", name: "Clarington",       province: "Ontario" },
  { id: "city-on-29", name: "Brantford",        province: "Ontario" },
  { id: "city-on-30", name: "Halton Hills",     province: "Ontario" },
];

const EMPLOYEES_DATA = [
  { id: 1, first_name: "Noorie", last_name: "Noorie", email: "nooriegkme@gmail.com", phone_number: "+12362341786", gender: "Female", job_categories: { name: "Warehouse Associate" }, cities: { name: "Surrey" }, provinces: { name: "British Columbia" }, verification_status: "pending", created_at: "2026-05-28T10:00:00Z", license_required: false },
  { id: 2, first_name: "Gagandeep", last_name: "Kaur", email: "kaurgaganchd@gmail.com", phone_number: "+16047616556", gender: "Female", job_categories: { name: "Security guards" }, cities: { name: "Surrey" }, provinces: { name: "British Columbia" }, verification_status: "pending", created_at: "2026-05-28T09:30:00Z", license_required: true },
  { id: 3, first_name: "Harkeerat", last_name: "Singh", email: "harkeerat794@gmail.com", phone_number: "+14376622973", gender: "Male", job_categories: { name: "General Labour" }, cities: { name: "Surrey" }, provinces: { name: "British Columbia" }, verification_status: "verified", created_at: "2026-05-27T14:15:00Z", license_required: false },
  { id: 4, first_name: "Bhavna", last_name: "Patel", email: "bhavnabenpatel1976@gmail.com", phone_number: "+17789642411", gender: "Female", job_categories: { name: "General Labour" }, cities: { name: "Surrey" }, provinces: { name: "British Columbia" }, verification_status: "rejected", created_at: "2026-05-27T11:20:00Z", license_required: false },
];

/* ─── HELPER FUNCTIONS ───────────────────────────────────────── */
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const getVerificationBadge = (status: string) => {
  switch (status) {
    case 'verified': return { bg: C.successBg, border: "transparent", color: C.successText, label: "Verified" };
    case 'pending': return { bg: C.pendingBg, border: C.pendingBorder, color: C.pendingText, label: "Pending" };
    case 'rejected': return { bg: C.alertBg, border: "transparent", color: C.alertText, label: "Rejected" };
    default: return { bg: C.inputBg, border: C.border, color: C.textMuted, label: "Unknown" };
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
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHint, fontWeight: 600 }}>Main</span>
        <span style={{ color: C.textMuted }}>/</span>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.textHeading, fontWeight: 600 }}>Employees</span>
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
export default function EmployeesPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [jobCategoryFilter, setJobCategoryFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const totalItems = EMPLOYEES_DATA.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  const tableGridTemplate = "40px 1.2fr 1.8fr 1.2fr 0.8fr 1.2fr 1.5fr 0.8fr 1fr 1.8fr 100px"; 

  // Filter cities by selected province
  const filteredCities = provinceFilter === "all"
    ? MOCK_CITIES
    : MOCK_CITIES.filter(city => {
        const province = MOCK_PROVINCES.find(p => p.id === provinceFilter);
        return province ? city.province === province.name : true;
      });

  const toggleRow = (id: number) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedEmployees.length === totalItems) setSelectedEmployees([]);
    else setSelectedEmployees(EMPLOYEES_DATA.map(e => e.id));
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
                <Users size={32} color={C.red} strokeWidth={2} /> Employee Management
              </h1>
              <p style={{ fontSize: "15px", color: C.textMuted }}>
                View and manage registered candidates and their information.
              </p>
            </motion.div>

            {/* Filters Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="clean-card" style={{ padding: "24px 32px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.textHeading, marginBottom: "4px" }}>Filters</h3>
              <p style={{ fontSize: "13px", color: C.textMuted, marginBottom: "20px" }}>Filter candidates by various criteria</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                
                {/* Search */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.textLabel, marginBottom: "8px" }}>Search</label>
                  <div style={{ position: "relative" }}>
                    <Search size={16} color={C.textHint} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                      type="text" placeholder="Search by name, email, or phone" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 16px 10px 40px", color: C.textBody, fontSize: "14px", outline: "none", transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = C.red}
                      onBlur={(e) => e.target.style.borderColor = C.border}
                    />
                  </div>
                </div>

                {/* Verification Status */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.textLabel, marginBottom: "8px" }}>Verification Status</label>
                  <div style={{ position: "relative" }}>
                    <select 
                      value={verificationFilter}
                      onChange={(e) => setVerificationFilter(e.target.value)}
                      style={{
                        width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 36px 10px 16px", color: C.textBody, fontSize: "14px", outline: "none", transition: "border-color 0.2s"
                      }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <ChevronDown size={14} color={C.textHint} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Job Category */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.textLabel, marginBottom: "8px" }}>Job Category</label>
                  <div style={{ position: "relative" }}>
                    <select 
                      value={jobCategoryFilter}
                      onChange={(e) => setJobCategoryFilter(e.target.value)}
                      style={{
                        width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 36px 10px 16px", color: C.textBody, fontSize: "14px", outline: "none", transition: "border-color 0.2s"
                      }}
                    >
                      <option value="all">All Categories</option>
                      {MOCK_JOB_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <ChevronDown size={14} color={C.textHint} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Province */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.textLabel, marginBottom: "8px" }}>Province</label>
                  <div style={{ position: "relative" }}>
                    <select 
                      value={provinceFilter}
                      onChange={(e) => { setProvinceFilter(e.target.value); setCityFilter("all"); }}
                      style={{
                        width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 36px 10px 16px", color: C.textBody, fontSize: "14px", outline: "none", transition: "border-color 0.2s"
                      }}
                    >
                      <option value="all">All Provinces</option>
                      {MOCK_PROVINCES.map(prov => <option key={prov.id} value={prov.id}>{prov.name}</option>)}
                    </select>
                    <ChevronDown size={14} color={C.textHint} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* City — filtered by selected province, all 80 cities when province = "all" */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.textLabel, marginBottom: "8px" }}>City</label>
                  <div style={{ position: "relative" }}>
                    <select 
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      style={{
                        width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 36px 10px 16px", color: C.textBody, fontSize: "14px", outline: "none", transition: "border-color 0.2s"
                      }}
                    >
                      <option value="all">All Cities</option>
                      {filteredCities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} color={C.textHint} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Data Table Section */}
            <motion.div variants={containerVars} initial="hidden" animate="show" className="clean-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              {/* Table Header Controls */}
              <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: 600, color: C.textHeading, display: "flex", alignItems: "center", gap: "8px" }}>
                      Employees <span style={{ color: C.redBright }}>({totalItems})</span>
                    </h3>
                    <p style={{ fontSize: "13px", color: C.textMuted, marginTop: "4px" }}>
                      Registered candidates and their information (Showing {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} of {totalItems})
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: C.textLabel, fontWeight: 500 }}>Rows per page:</span>
                    <div style={{ position: "relative" }}>
                      <select 
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                        style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "6px", padding: "8px 28px 8px 12px", color: C.textBody, fontSize: "13px", outline: "none" }}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <ChevronDown size={14} color={C.textHint} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>

                {/* Bulk Actions Row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <motion.button 
                    whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} whileTap={{ scale: 0.98 }} 
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                    <FileSpreadsheet size={16} /> Download Excel ({totalItems})
                  </motion.button>

                  <motion.button 
                    disabled={selectedEmployees.length === 0} 
                    whileHover={selectedEmployees.length > 0 ? { backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red } : {}}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: selectedEmployees.length > 0 ? C.textHeading : C.textHint, fontSize: "13px", fontWeight: 600, cursor: selectedEmployees.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                    <CheckCircle size={16} /> Bulk Verify ({selectedEmployees.length})
                  </motion.button>

                  <motion.button 
                    disabled={selectedEmployees.length === 0} 
                    whileHover={selectedEmployees.length > 0 ? { backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red } : {}}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: selectedEmployees.length > 0 ? C.textHeading : C.textHint, fontSize: "13px", fontWeight: 600, cursor: selectedEmployees.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                    <MessageCircle size={16} /> Send WhatsApp ({selectedEmployees.length})
                  </motion.button>

                  <motion.button 
                    disabled={selectedEmployees.length === 0} 
                    whileHover={selectedEmployees.length > 0 ? { backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red } : {}}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: selectedEmployees.length > 0 ? C.textHeading : C.textHint, fontSize: "13px", fontWeight: 600, cursor: selectedEmployees.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                    <Users size={16} /> Assign to Group(s) ({selectedEmployees.length})
                  </motion.button>

                  <motion.button 
                    disabled={selectedEmployees.length === 0} 
                    whileHover={selectedEmployees.length > 0 ? { backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red } : {}}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: selectedEmployees.length > 0 ? C.textHeading : C.textHint, fontSize: "13px", fontWeight: 600, cursor: selectedEmployees.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                    <Trash2 size={16} /> Bulk Delete ({selectedEmployees.length})
                  </motion.button>
                </div>
              </div>

              {/* Responsive Table Container */}
              <div className="table-container">
                <div className="table-min-width">
                  
                  {/* Table Column Headers */}
                  <div style={{ display: "grid", gridTemplateColumns: tableGridTemplate, padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: C.inputBg, alignItems: "center" }}>
                    <button onClick={toggleAll} style={{ background: "none", border: "none", color: C.textHint, cursor: "pointer", padding: 0, display: "flex" }}>
                      {selectedEmployees.length === totalItems && totalItems > 0 ? <CheckSquare size={16} color={C.red} /> : <Square size={16} />}
                    </button>
                    {["Name", "Email", "Phone", "Gender", "Job Category", "Location", "Status", "Registration Date", "Documents", "Actions"].map((head, i) => (
                      <span key={i} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.textHint, fontWeight: 600 }}>{head}</span>
                    ))}
                  </div>

                  {/* Table Rows */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {EMPLOYEES_DATA.map((emp, idx) => {
                      const isSelected = selectedEmployees.includes(emp.id);
                      const badge = getVerificationBadge(emp.verification_status);
                      
                      return (
                        <motion.div 
                          key={emp.id} variants={itemVars}
                          whileHover={{ backgroundColor: C.inputBg }}
                          style={{ 
                            display: "grid", gridTemplateColumns: tableGridTemplate, alignItems: "center",
                            padding: "16px 32px", borderBottom: idx !== EMPLOYEES_DATA.length - 1 ? `1px solid ${C.border}` : "none",
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
                            <div>{emp.first_name}</div>
                            <div>{emp.last_name}</div>
                          </div>
                          
                          {/* Email */}
                          <div style={{ fontSize: "13px", color: C.textMuted, wordBreak: "break-all", paddingRight: "16px" }}>{emp.email}</div>
                          
                          {/* Phone */}
                          <div style={{ fontSize: "13px", color: C.textMuted }}>{emp.phone_number}</div>

                          {/* Gender */}
                          <div style={{ fontSize: "13px", color: C.textMuted }}>{emp.gender || 'Not Specified'}</div>
                          
                          {/* Job */}
                          <div style={{ fontSize: "14px", color: C.textBody, fontWeight: 500 }}>{emp.job_categories?.name}</div>

                          {/* Location */}
                          <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: 1.4 }}>
                            <div>{emp.cities?.name},</div>
                            <div>{emp.provinces?.name}</div>
                          </div>
                          
                          {/* Status Badge */}
                          <div>
                            <div style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "20px", background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              {badge.label}
                            </div>
                          </div>

                          {/* Registration Date */}
                          <div style={{ fontSize: "13px", color: C.textMuted, display: "flex", alignItems: "center", gap: "6px" }}>
                            <Calendar size={14} /> {formatDate(emp.created_at)}
                          </div>

                          {/* Documents */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
                            <motion.button whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
                              <Eye size={14} /> View Resume
                            </motion.button>
                            <motion.button whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
                              <Download size={14} /> Resume
                            </motion.button>
                            
                            {/* License Conditional Rendering */}
                            {emp.license_required && (
                              <>
                                <motion.button whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "12px", fontWeight: 500, cursor: "pointer", marginTop: "4px", transition: "all 0.2s" }}>
                                  <Eye size={14} /> View License
                                </motion.button>
                                <motion.button whileHover={{ backgroundColor: C.redActiveBg, borderColor: C.red, color: C.red }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textLabel, fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
                                  <Download size={14} /> License
                                </motion.button>
                              </>
                            )}
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <motion.button whileHover={{ scale: 1.1, backgroundColor: C.redActiveBg, color: C.red, borderColor: C.red }} whileTap={{ scale: 0.9 }} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textHint, cursor: "pointer", padding: "8px", display: "flex", transition: "all 0.2s" }}>
                              <Eye size={16} />
                            </motion.button>
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
              
              {/* Pagination Footer */}
              <div style={{ padding: "16px 32px", borderTop: `1px solid ${C.border}`, background: C.inputBg, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <span style={{ fontSize: "13px", color: C.textMuted }}>
                  Showing <span style={{ color: C.textHeading, fontWeight: 600 }}>{totalItems > 0 ? startIndex + 1 : 0}</span> to <span style={{ color: C.textHeading, fontWeight: 600 }}>{endIndex}</span> of {totalItems} results
                </span>
                
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "8px 12px", background: "transparent", border: "none", color: currentPage === 1 ? C.textHint : C.textLabel, fontSize: "13px", fontWeight: 500, cursor: currentPage === 1 ? "not-allowed" : "pointer", transition: "color 0.2s" }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  
                  <button style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "6px", color: C.textHeading, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    1
                  </button>
                  
                  <button 
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={endIndex >= totalItems}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "8px 12px", background: "transparent", border: "none", color: endIndex >= totalItems ? C.textHint : C.textLabel, fontSize: "13px", fontWeight: 500, cursor: endIndex >= totalItems ? "not-allowed" : "pointer", transition: "color 0.2s" }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </motion.div>

          </main>
        </div>
      </div>
    </>
  );
}