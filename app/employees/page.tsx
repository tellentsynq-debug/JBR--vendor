"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  LogOut, Search, ChevronDown, Download, CheckCircle, 
  MessageCircle, Users, Trash2, Eye, Edit2, ChevronLeft, 
  ChevronRight, Square, CheckSquare, Calendar, FileSpreadsheet
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
  .table-min-width { min-width: 1450px; }

  select { appearance: none; background-color: transparent; cursor: pointer; }
  select option { background-color: ${C.panel}; color: ${C.white}; }
`;

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const MOCK_JOB_CATEGORIES = [
  { id: "cat-1", name: "General Labour" },
  { id: "cat-2", name: "Security" },
  { id: "cat-3", name: "Warehouse" }
];

const MOCK_PROVINCES = [
  { id: "prov-1", name: "British Columbia" },
  { id: "prov-2", name: "Ontario" }
];

const MOCK_CITIES = [
  { id: "city-1", name: "Surrey" },
  { id: "city-2", name: "Vancouver" },
  { id: "city-3", name: "Toronto" }
];

const EMPLOYEES_DATA = [
  { id: 1, first_name: "Noorie", last_name: "Noorie", email: "nooriegkme@gmail.com", phone_number: "+12362341786", gender: "Female", job_categories: { name: "Warehouse Associate" }, cities: { name: "Surrey" }, provinces: { name: "British Columbia" }, verification_status: "pending", created_at: "2026-05-28T10:00:00Z", license_required: false },
  { id: 2, first_name: "Gagandeep", last_name: "Kaur", email: "kaurgaganchd@gmail.com", phone_number: "+16047616556", gender: "Female", job_categories: { name: "Security guards" }, cities: { name: "Surrey" }, provinces: { name: "British Columbia" }, verification_status: "pending", created_at: "2026-05-28T09:30:00Z", license_required: true },
  { id: 3, first_name: "Harkeerat", last_name: "Singh", email: "harkeerat794@gmail.com", phone_number: "+14376622973", gender: "Male", job_categories: { name: "General Labour" }, cities: { name: "Surrey" }, provinces: { name: "British Columbia" }, verification_status: "verified", created_at: "2026-05-27T14:15:00Z", license_required: false },
  { id: 4, first_name: "Bhavna", last_name: "Patel", email: "bhavnabenpatel1976@gmail.com", phone_number: "+17789642411", gender: "Female", job_categories: { name: "General Labour" }, cities: { name: "Surrey" }, provinces: { name: "British Columbia" }, verification_status: "rejected", created_at: "2026-05-27T11:20:00Z", license_required: false },
];

/* ─── HELPER FUNCTIONS ───────────────────────────────────────── */
// Fixes the Next.js Hydration Error by strictly defining the format (MM/DD/YYYY)
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const getVerificationBadge = (status: string) => {
  switch (status) {
    case 'verified': return { bg: "rgba(5, 150, 105, 0.1)", border: "rgba(5, 150, 105, 0.3)", color: C.emerald, label: "Verified" };
    case 'pending': return { bg: C.goldDim, border: "rgba(191,164,106,0.3)", color: C.gold, label: "Pending" };
    case 'rejected': return { bg: C.redGlow, border: "rgba(229,57,53,0.3)", color: C.redBright, label: "Rejected" };
    default: return { bg: "rgba(255,255,255,0.05)", border: C.border, color: C.mutedLight, label: "Unknown" };
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
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.muted }}>Main</span>
        <span style={{ color: C.mutedLight }}>/</span>
        <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: C.white, fontWeight: 500 }}>Employees</span>
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
export default function EmployeesPage() {
  // Navigation State
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [jobCategoryFilter, setJobCategoryFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  // Pagination & Selection State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  // Derived Values
  const totalItems = EMPLOYEES_DATA.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  // Custom Table Layout
  const tableGridTemplate = "40px 1.2fr 1.8fr 1.2fr 0.8fr 1.2fr 1.5fr 0.8fr 1fr 1.8fr 100px"; 

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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 600, color: C.white, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                <Users size={32} color={C.red} strokeWidth={1.5} /> Employee Management
              </h1>
              <p style={{ fontSize: "14px", color: C.mutedLight }}>
                View and manage registered candidates and their information.
              </p>
            </motion.div>

            {/* Filters Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="glass-card" style={{ padding: "24px 32px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: C.white, marginBottom: "4px" }}>Filters</h3>
              <p style={{ fontSize: "12px", color: C.mutedLight, marginBottom: "20px" }}>Filter candidates by various criteria</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                
                {/* Search */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: C.mutedLight, marginBottom: "8px" }}>Search</label>
                  <div style={{ position: "relative" }}>
                    <Search size={16} color={C.muted} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                      type="text" placeholder="Search by name, email, or phone" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 16px 10px 36px", color: C.white, fontSize: "13px", outline: "none", transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = C.red}
                      onBlur={(e) => e.target.style.borderColor = C.border}
                    />
                  </div>
                </div>

                {/* Verification Status */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: C.mutedLight, marginBottom: "8px" }}>Verification Status</label>
                  <div style={{ position: "relative" }}>
                    <select 
                      value={verificationFilter}
                      onChange={(e) => setVerificationFilter(e.target.value)}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 36px 10px 16px", color: C.offWhite, fontSize: "13px", outline: "none", transition: "border-color 0.2s"
                      }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <ChevronDown size={14} color={C.muted} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Job Category */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: C.mutedLight, marginBottom: "8px" }}>Job Category</label>
                  <div style={{ position: "relative" }}>
                    <select 
                      value={jobCategoryFilter}
                      onChange={(e) => setJobCategoryFilter(e.target.value)}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 36px 10px 16px", color: C.offWhite, fontSize: "13px", outline: "none", transition: "border-color 0.2s"
                      }}
                    >
                      <option value="all">All Categories</option>
                      {MOCK_JOB_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <ChevronDown size={14} color={C.muted} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Province */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: C.mutedLight, marginBottom: "8px" }}>Province</label>
                  <div style={{ position: "relative" }}>
                    <select 
                      value={provinceFilter}
                      onChange={(e) => { setProvinceFilter(e.target.value); setCityFilter("all"); }}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 36px 10px 16px", color: C.offWhite, fontSize: "13px", outline: "none", transition: "border-color 0.2s"
                      }}
                    >
                      <option value="all">All Provinces</option>
                      {MOCK_PROVINCES.map(prov => <option key={prov.id} value={prov.id}>{prov.name}</option>)}
                    </select>
                    <ChevronDown size={14} color={C.muted} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: C.mutedLight, marginBottom: "8px" }}>City</label>
                  <div style={{ position: "relative" }}>
                    <select 
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "8px",
                        padding: "10px 36px 10px 16px", color: C.offWhite, fontSize: "13px", outline: "none", transition: "border-color 0.2s"
                      }}
                    >
                      <option value="all">All Cities</option>
                      {MOCK_CITIES.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                    </select>
                    <ChevronDown size={14} color={C.muted} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Data Table Section */}
            <motion.div variants={containerVars} initial="hidden" animate="show" className="glass-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              {/* Table Header Controls */}
              <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: 600, color: C.white, display: "flex", alignItems: "center", gap: "8px" }}>
                      Employees <span style={{ color: C.redBright }}>({totalItems})</span>
                    </h3>
                    <p style={{ fontSize: "12px", color: C.mutedLight, marginTop: "4px" }}>
                      Registered candidates and their information (Showing {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} of {totalItems})
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: C.muted }}>Rows per page:</span>
                    <div style={{ position: "relative" }}>
                      <select 
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                        style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "6px", padding: "6px 28px 6px 12px", color: C.white, fontSize: "12px", outline: "none" }}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <ChevronDown size={12} color={C.muted} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>

                {/* Bulk Actions Row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "rgba(5,150,105,0.1)", border: `1px solid rgba(5,150,105,0.3)`, borderRadius: "6px", color: C.emerald, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                    <FileSpreadsheet size={14} /> Download Excel ({totalItems})
                  </motion.button>

                  <button disabled={selectedEmployees.length === 0} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: selectedEmployees.length > 0 ? "rgba(5,150,105,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${selectedEmployees.length > 0 ? "rgba(5,150,105,0.3)" : C.border}`, borderRadius: "6px", color: selectedEmployees.length > 0 ? C.emerald : C.muted, fontSize: "12px", fontWeight: 500, cursor: selectedEmployees.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                    <CheckCircle size={14} /> Bulk Verify ({selectedEmployees.length})
                  </button>

                  <button disabled={selectedEmployees.length === 0} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: selectedEmployees.length > 0 ? "rgba(59, 130, 246, 0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${selectedEmployees.length > 0 ? "rgba(59, 130, 246, 0.3)" : C.border}`, borderRadius: "6px", color: selectedEmployees.length > 0 ? "#60A5FA" : C.muted, fontSize: "12px", fontWeight: 500, cursor: selectedEmployees.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                    <MessageCircle size={14} /> Send WhatsApp ({selectedEmployees.length})
                  </button>

                  <button disabled={selectedEmployees.length === 0} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: selectedEmployees.length > 0 ? "rgba(168, 85, 247, 0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${selectedEmployees.length > 0 ? "rgba(168, 85, 247, 0.3)" : C.border}`, borderRadius: "6px", color: selectedEmployees.length > 0 ? "#C084FC" : C.muted, fontSize: "12px", fontWeight: 500, cursor: selectedEmployees.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                    <Users size={14} /> Assign to Group(s) ({selectedEmployees.length})
                  </button>

                  <button disabled={selectedEmployees.length === 0} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: selectedEmployees.length > 0 ? "rgba(229,57,53,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${selectedEmployees.length > 0 ? "rgba(229,57,53,0.3)" : C.border}`, borderRadius: "6px", color: selectedEmployees.length > 0 ? C.redBright : C.muted, fontSize: "12px", fontWeight: 500, cursor: selectedEmployees.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                    <Trash2 size={14} /> Bulk Delete ({selectedEmployees.length})
                  </button>
                </div>
              </div>

              {/* Responsive Table Container */}
              <div className="table-container">
                <div className="table-min-width">
                  
                  {/* Table Column Headers */}
                  <div style={{ display: "grid", gridTemplateColumns: tableGridTemplate, padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: "rgba(0,0,0,0.2)", alignItems: "center" }}>
                    <button onClick={toggleAll} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", padding: 0, display: "flex" }}>
                      {selectedEmployees.length === totalItems && totalItems > 0 ? <CheckSquare size={16} color={C.red} /> : <Square size={16} />}
                    </button>
                    {["Name", "Email", "Phone", "Gender", "Job Category", "Location", "Status", "Registration Date", "Documents", "Actions"].map((head, i) => (
                      <span key={i} style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: C.mutedLight, fontWeight: 500 }}>{head}</span>
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
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                          style={{ 
                            display: "grid", gridTemplateColumns: tableGridTemplate, alignItems: "center",
                            padding: "16px 32px", borderBottom: idx !== EMPLOYEES_DATA.length - 1 ? `1px solid ${C.border}` : "none",
                            background: isSelected ? "rgba(198,40,40,0.03)" : "transparent",
                            transition: "background-color 0.2s ease"
                          }}
                        >
                          {/* Checkbox */}
                          <button onClick={() => toggleRow(emp.id)} style={{ background: "none", border: "none", color: isSelected ? C.red : C.muted, cursor: "pointer", padding: 0, display: "flex" }}>
                            {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                          </button>

                          {/* Name */}
                          <div style={{ fontSize: "13px", fontWeight: 600, color: C.white, lineHeight: 1.4 }}>
                            <div>{emp.first_name}</div>
                            <div>{emp.last_name}</div>
                          </div>
                          
                          {/* Email */}
                          <div style={{ fontSize: "13px", color: C.mutedLight, wordBreak: "break-all", paddingRight: "16px" }}>{emp.email}</div>
                          
                          {/* Phone */}
                          <div style={{ fontSize: "13px", color: C.mutedLight }}>{emp.phone_number}</div>

                          {/* Gender */}
                          <div style={{ fontSize: "13px", color: C.mutedLight }}>{emp.gender || 'Not Specified'}</div>
                          
                          {/* Job */}
                          <div style={{ fontSize: "13px", color: C.white, fontWeight: 500 }}>{emp.job_categories?.name}</div>

                          {/* Location */}
                          <div style={{ fontSize: "12px", color: C.mutedLight, lineHeight: 1.4 }}>
                            <div>{emp.cities?.name},</div>
                            <div>{emp.provinces?.name}</div>
                          </div>
                          
                          {/* Status Badge */}
                          <div>
                            <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: "20px", background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              {badge.label}
                            </div>
                          </div>

                          {/* FIX APPLIED: Explicit Date Formatting */}
                          <div style={{ fontSize: "12px", color: C.mutedLight, display: "flex", alignItems: "center", gap: "6px" }}>
                            <Calendar size={12} /> {formatDate(emp.created_at)}
                          </div>

                          {/* Documents */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
                            <motion.button whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "4px", color: C.white, fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
                              <Eye size={12} /> View Resume
                            </motion.button>
                            <motion.button whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "4px", color: C.mutedLight, fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
                              <Download size={12} /> Resume
                            </motion.button>
                            
                            {/* License Conditional Rendering */}
                            {emp.license_required && (
                              <>
                                <motion.button whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "4px", color: C.gold, fontSize: "11px", fontWeight: 500, cursor: "pointer", marginTop: "4px" }}>
                                  <Eye size={12} /> View License
                                </motion.button>
                                <motion.button whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "4px", color: C.goldDim, fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
                                  <Download size={12} /> License
                                </motion.button>
                              </>
                            )}
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <motion.button whileHover={{ scale: 1.1, color: C.white, borderColor: C.borderHover }} whileTap={{ scale: 0.9 }} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.mutedLight, cursor: "pointer", padding: "6px", display: "flex" }}>
                              <Eye size={14} />
                            </motion.button>
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
              
              {/* Pagination Footer */}
              <div style={{ padding: "16px 32px", borderTop: `1px solid ${C.border}`, background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <span style={{ fontSize: "12px", color: C.mutedLight }}>
                  Showing <span style={{ color: C.white, fontWeight: 500 }}>{totalItems > 0 ? startIndex + 1 : 0}</span> to <span style={{ color: C.white, fontWeight: 500 }}>{endIndex}</span> of {totalItems} results
                </span>
                
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "transparent", border: "none", color: currentPage === 1 ? C.muted : C.white, fontSize: "12px", cursor: currentPage === 1 ? "not-allowed" : "pointer", transition: "color 0.2s" }}
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  
                  <button style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: "6px", color: C.white, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                    1
                  </button>
                  
                  <button 
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={endIndex >= totalItems}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "transparent", border: "none", color: endIndex >= totalItems ? C.muted : C.white, fontSize: "12px", cursor: endIndex >= totalItems ? "not-allowed" : "pointer", transition: "color 0.2s" }}
                  >
                    Next <ChevronRight size={14} />
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