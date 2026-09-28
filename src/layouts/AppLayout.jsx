import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Building2,
  Database,
  BarChart3,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Menu,
  X,
  Shield,
  Info
} from "lucide-react";

// ─── Header Component ─────────────────────────────────────────────────────────
export function Header({ onResetClick }) {
  const { selectedRegional, setSelectedRegional, regionals, activeTab, setActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "co", name: "CO", fullName: "Corporate Controlling", icon: Building2 },
    { id: "bw", name: "BW", fullName: "Warehouse & Analytics", icon: Database },
    { id: "bpc", name: "BPC", fullName: "Planning & Consolidation", icon: BarChart3 },
  ];

  return (
    <>
      {/* ── Main Header Bar (PTPN IV Palmvest360° Pattern) ────────────────── */}
      <header className="bg-[#1E293B] border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm">
        <div className="w-full px-3 sm:px-4 lg:px-6">
          <div className="flex items-center h-14 justify-between gap-2">

            {/* ── LEFT: Logo + Corporate Identity ── */}
            <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
              <img
                src="/images/logo-ptpn4.png"
                alt="PTPN IV"
                className="h-8 w-auto object-contain flex-shrink-0"
                style={{ maxWidth: 64 }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="hidden sm:flex flex-col leading-tight border-l border-slate-700 pl-2.5 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-extrabold text-[13px] tracking-tight text-white whitespace-nowrap">
                    PALM-CONTROL360
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 leading-none hidden lg:block truncate max-w-[280px]">
                  Enterprise Controlling, Data Warehouse &amp; BPC
                </span>
              </div>
            </div>

            {/* ── CENTER: Desktop Navigation Tabs (Active: Forest Green #00875A & Indicator) ── */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center px-2 min-w-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${isActive
                        ? "bg-[#00875A] text-white shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="hidden lg:inline">{tab.name} — {tab.fullName}</span>
                    <span className="lg:hidden">{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* ── RIGHT: User Reference + Controls ── */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">

              {/* Palmvest360 Context Badge (Desktop) */}
              <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700/60 text-[11px] text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A389] animate-pulse"></span>
                <span className="truncate max-w-[140px] font-medium text-slate-300">ASISTEN INVESTASI</span>
              </div>

              {/* Global Regional Filter — always visible */}
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-[#00875A] flex-shrink-0">
                <SlidersHorizontal className="w-3 h-3 text-[#00A389] flex-shrink-0 hidden sm:block" />
                <label htmlFor="global-regional-select" className="sr-only">Filter Regional</label>
                <div className="relative flex items-center">
                  <select
                    id="global-regional-select"
                    value={selectedRegional}
                    onChange={(e) => setSelectedRegional(e.target.value)}
                    className="bg-transparent text-[11px] font-bold text-emerald-300 pr-4 pl-0.5 py-0.5 rounded focus:outline-none cursor-pointer appearance-none min-h-[32px]"
                    style={{ maxWidth: "clamp(90px, 15vw, 160px)" }}
                  >
                    <option value="ALL" className="bg-slate-900 text-white">Semua Regional</option>
                    {regionals.map((r) => (
                      <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                        {r.kode_regional} — {r.nama_regional.includes("(R") ? r.nama_regional.split(" — ")[1] : r.nama_regional.split(" — ")[0]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 pointer-events-none flex-shrink-0" />
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={onResetClick}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-amber-300 border border-slate-700 rounded-md transition-all cursor-pointer active:scale-95 flex-shrink-0 min-h-[32px]"
                title="Reset ke baseline seed data PRD"
              >
                <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Reset</span>
              </button>

              {/* Mobile Menu Toggle (touch target 44px) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-11 h-11 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer flex-shrink-0"
                aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              >
                {mobileMenuOpen
                  ? <X className="w-5 h-5" />
                  : <Menu className="w-5 h-5" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#1E293B] shadow-xl">
            {/* Module Nav Links (44px touch targets) */}
            <div className="px-3 py-2 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2 mb-1">
                Pilih Modul Dashboard
              </p>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-sm rounded-md cursor-pointer transition-colors min-h-[44px] ${isActive
                        ? "bg-[#00875A] text-white font-semibold shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{tab.name} — {tab.fullName}</span>
                  </button>
                );
              })}
            </div>

            {/* User info drawer footer */}
            <div className="border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/50">
              <span>PTPN IV Palmvest360° Reference</span>
              <span className="text-[#00A389] font-semibold">Demo Prototype</span>
            </div>
          </div>
        )}
      </header>

      {/* ── Prototype Warning Banner ── */}
      <div className="bg-[#FEF3C7] border-b border-[#FDE047] px-3 sm:px-4 py-1.5 flex items-start sm:items-center gap-2">
        <Shield className="w-3.5 h-3.5 flex-shrink-0 text-[#92400E] mt-0.5 sm:mt-0" />
        <p className="text-[11px] text-[#92400E] leading-relaxed">
          <span className="font-bold">INDEPENDENT ENTERPRISE DEMONSTRATION PROTOTYPE</span>
          <span className="hidden sm:inline"> — </span>
          <span className="text-[#92400E]/90">
            Bukan sistem resmi PTPN IV. Menggunakan baseline data PRD &amp; Palmvest360° terverifikasi. Seluruh GL, Cost Center, transaksi, ETL simulator, dan data produksi adalah DATA SIMULASI/DEMO tanpa koneksi live produksi.
          </span>
        </p>
      </div>
    </>
  );
}

// ─── Footer Component ─────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-3.5 px-3 sm:px-6 text-xs text-[#64748B]">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] min-w-0">
          <img
            src="/images/logo-ptpn4.png"
            alt="Logo PTPN IV"
            className="h-5 w-auto flex-shrink-0"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <span className="font-bold text-[#1E293B] whitespace-nowrap">PALM-CONTROL360</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="hidden sm:inline truncate text-[#64748B]">Independent Enterprise Demonstration Prototype — Bukan Sistem Resmi PTPN IV</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#64748B] flex-shrink-0">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#00875A] font-semibold border border-emerald-200 whitespace-nowrap">
            LocalStorage
          </span>
          <span className="hidden sm:inline whitespace-nowrap">· Baseline Audit Terverifikasi (2026)</span>
        </div>
      </div>
    </footer>
  );
}
