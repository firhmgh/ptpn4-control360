import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { INITIAL_DB } from "../data/initialData";
import { calcSerapan, calcSPI } from "../utils/calculations";

const STORAGE_KEY = "PTPN4_CONTROL360_DB_V4";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 1. Data Store from LocalStorage with fallback to INITIAL_DB
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ref_regional && parsed.co_mappings && parsed.bpc_rkap) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading from LocalStorage:", e);
    }
    return INITIAL_DB;
  });

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist data to LocalStorage:", e);
    }
  }, [data]);

  // 2. Global State: Active Tab & Global Regional Filter
  const [activeTab, setActiveTab] = useState("co"); // 'co' | 'bw' | 'bpc'
  const [selectedRegional, setSelectedRegional] = useState("ALL"); // 'ALL' | 'REG-1' .. 'REG-7'
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'info' | 'error' }

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Reset to verified seed baseline
  const resetSeedData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setData(JSON.parse(JSON.stringify(INITIAL_DB)));
      setSelectedRegional("ALL");
      showToast("Data berhasil direset ke Seed Baseline Terverifikasi!", "info");
    } catch (e) {
      console.error("Reset failed:", e);
      showToast("Gagal melakukan reset data.", "error");
    }
  }, [showToast]);

  // 3. Filtered Selectors based on Global Regional Filter
  const filteredUnits = useMemo(() => {
    if (!selectedRegional || selectedRegional === "ALL") return data.ref_units;
    return data.ref_units.filter(u => u.regional_id === selectedRegional);
  }, [data.ref_units, selectedRegional]);

  const filteredCostCenters = useMemo(() => {
    const validUnitIds = new Set(filteredUnits.map(u => u.id));
    return data.cost_centers.filter(cc => validUnitIds.has(cc.unit_id));
  }, [data.cost_centers, filteredUnits]);

  const filteredMappings = useMemo(() => {
    const validCCIds = new Set(filteredCostCenters.map(cc => cc.id));
    return data.co_mappings.filter(m => validCCIds.has(m.cost_center_id));
  }, [data.co_mappings, filteredCostCenters]);

  const filteredTransactions = useMemo(() => {
    const validMapIds = new Set(filteredMappings.map(m => m.id));
    return data.co_transactions.filter(t => validMapIds.has(t.mapping_id));
  }, [data.co_transactions, filteredMappings]);

  const filteredBPCRkap = useMemo(() => {
    const validUnitIds = new Set(filteredUnits.map(u => u.id));
    return data.bpc_rkap.filter(b => validUnitIds.has(b.unit_id));
  }, [data.bpc_rkap, filteredUnits]);

  const filteredPICA = useMemo(() => {
    const validUnitIds = new Set(filteredUnits.map(u => u.id));
    return data.bpc_pica.filter(p => validUnitIds.has(p.unit_id));
  }, [data.bpc_pica, filteredUnits]);

  // 4. Global Baseline KPIs (Directly Derived)
  const globalKPIs = useMemo(() => {
    const totalRKAP = filteredBPCRkap.reduce((acc, curr) => acc + (curr.rkap_amount || 0), 0);
    const totalRealisasi = filteredBPCRkap.reduce((acc, curr) => acc + (curr.realisasi_amount || 0), 0);
    const serapanPct = calcSerapan(totalRealisasi, totalRKAP);

    const totalLuas = filteredUnits.reduce((acc, curr) => acc + (curr.luas_area || 0), 0);
    const totalTBS = filteredUnits.reduce((acc, curr) => acc + (curr.produksi_tbs || 0), 0);
    const totalCPO = filteredUnits.reduce((acc, curr) => acc + (curr.produksi_cpo || 0), 0);

    const avgRendemen = filteredUnits.length > 0
      ? filteredUnits.reduce((acc, curr) => acc + (curr.rendemen_cpo || 23.94), 0) / filteredUnits.length
      : 23.94;

    const avgSPI = filteredBPCRkap.length > 0
      ? filteredBPCRkap.reduce((acc, curr) => acc + calcSPI(curr.actual_progress, curr.plan_progress), 0) / filteredBPCRkap.length
      : 1.0;

    return {
      totalRKAP,
      totalRealisasi,
      serapanPct,
      totalLuas,
      totalTBS,
      totalCPO,
      avgRendemen,
      avgSPI,
      mappedGLCount: new Set(filteredMappings.map(m => m.gl_id)).size,
      activeCostCentersCount: filteredCostCenters.length,
      totalTrxNominal: filteredTransactions.reduce((acc, t) => acc + (t.nominal_biaya || 0), 0),
    };
  }, [filteredBPCRkap, filteredUnits, filteredMappings, filteredCostCenters, filteredTransactions]);

  // 5. CRUD Operations for CO Module
  const addCOMapping = useCallback((mapping) => {
    const newId = "MAP-" + String(Date.now()).slice(-6);
    const record = { id: newId, ...mapping, alokasi_pct: Number(mapping.alokasi_pct) };
    setData(prev => ({
      ...prev,
      co_mappings: [...prev.co_mappings, record]
    }));
    showToast("Pemetaan GL ke Cost Center berhasil ditambahkan!");
    return record;
  }, [showToast]);

  const updateCOMapping = useCallback((id, updatedFields) => {
    setData(prev => ({
      ...prev,
      co_mappings: prev.co_mappings.map(m => m.id === id ? {
        ...m,
        ...updatedFields,
        alokasi_pct: updatedFields.alokasi_pct !== undefined ? Number(updatedFields.alokasi_pct) : m.alokasi_pct
      } : m)
    }));
    showToast("Pemetaan GL berhasil diperbarui!");
  }, [showToast]);

  const deleteCOMapping = useCallback((id) => {
    setData(prev => ({
      ...prev,
      co_mappings: prev.co_mappings.filter(m => m.id !== id),
      co_transactions: prev.co_transactions.filter(t => t.mapping_id !== id)
    }));
    showToast("Pemetaan GL berhasil dihapus!", "info");
  }, [showToast]);

  const addCOTransaction = useCallback((trx) => {
    const newId = "TRX-" + String(Date.now()).slice(-6);
    const record = { id: newId, ...trx, nominal_biaya: Number(trx.nominal_biaya) };
    setData(prev => ({
      ...prev,
      co_transactions: [...prev.co_transactions, record]
    }));
    showToast("Transaksi alokasi biaya berhasil dicatat ke Ledger!");
    return record;
  }, [showToast]);

  // 6. CRUD Operations for BPC Module (PICA Engine)
  const addPICA = useCallback((pica) => {
    const newId = "PICA-" + String(Date.now()).slice(-6);
    const record = { id: newId, ...pica, status_pica: pica.status_pica || "In-Progress" };
    setData(prev => ({
      ...prev,
      bpc_pica: [...prev.bpc_pica, record]
    }));
    showToast("Catatan PICA Engine berhasil ditambahkan!");
    return record;
  }, [showToast]);

  const updatePICAStatus = useCallback((id, newStatus) => {
    setData(prev => ({
      ...prev,
      bpc_pica: prev.bpc_pica.map(p => p.id === id ? { ...p, status_pica: newStatus } : p)
    }));
    showToast(`Status PICA berhasil diubah menjadi ${newStatus}!`);
  }, [showToast]);

  const deletePICA = useCallback((id) => {
    setData(prev => ({
      ...prev,
      bpc_pica: prev.bpc_pica.filter(p => p.id !== id)
    }));
    showToast("Catatan PICA berhasil dihapus!", "info");
  }, [showToast]);

  // 7. Data Warehouse ETL Simulator
  const [isETLRunning, setIsETLRunning] = useState(false);
  const [etlProgressStep, setEtlProgressStep] = useState("");
  const [lastETLTimestamp, setLastETLTimestamp] = useState("2026-09-28 21:00:00");

  const runETLSimulation = useCallback(() => {
    setIsETLRunning(true);
    setEtlProgressStep("Mengekstrak dataset simulasi Financial Ledger...");

    setTimeout(() => {
      setEtlProgressStep("Transforming Cost Allocations & Standardizing Metrics...");
    }, 400);

    setTimeout(() => {
      setEtlProgressStep("Loading into Aggregated High-Performance Data Cube...");
    }, 750);

    setTimeout(() => {
      setIsETLRunning(false);
      setEtlProgressStep("");
      const nowStr = new Date().toLocaleTimeString("id-ID", { hour12: false });
      setLastETLTimestamp(`Hari ini, ${nowStr} WIB`);
      showToast("Pipeline ETL Data Warehouse berhasil disinkronkan ke Data Cube!", "success");
    }, 1100);
  }, [showToast]);

  const value = {
    data,
    activeTab,
    setActiveTab,
    selectedRegional,
    setSelectedRegional,
    regionals: data.ref_regional,
    units: filteredUnits,
    allUnits: data.ref_units,
    costCenters: filteredCostCenters,
    glAccounts: data.gl_accounts,
    coMappings: filteredMappings,
    allCOMappings: data.co_mappings,
    coTransactions: filteredTransactions,
    bpcRkap: filteredBPCRkap,
    allBpcRkap: data.bpc_rkap,
    picaList: filteredPICA,
    globalKPIs,
    addCOMapping,
    updateCOMapping,
    deleteCOMapping,
    addCOTransaction,
    addPICA,
    updatePICAStatus,
    deletePICA,
    resetSeedData,
    toast,
    showToast,
    isETLRunning,
    etlProgressStep,
    lastETLTimestamp,
    runETLSimulation
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
