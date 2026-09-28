/**
 * PALM-CONTROL360 — Data Store Engine & Inline Seed Data
 * File: js/db.js
 * 100% Offline & file:// Compatible (No fetch, no external dependencies)
 */

const STORAGE_KEY = 'PTPN4_CONTROL360_DB_V1';

const INITIAL_DB = {
  ref_regional: [
    { id: "REG-1", kode_regional: "RPC1", nama_regional: "Regional 1 (Sumut 1)" },
    { id: "REG-2", kode_regional: "RPC2", nama_regional: "Regional 2 (Sumut 2)" },
    { id: "REG-3", kode_regional: "RPC3", nama_regional: "Regional 3 (Riau)" },
    { id: "REG-4", kode_regional: "RPC4", nama_regional: "Regional 4 (Jambi)" },
    { id: "REG-5", kode_regional: "RPC5", nama_regional: "Regional 5 (Kalbar)" },
    { id: "REG-6", kode_regional: "RPC6", nama_regional: "Regional 6 (Aceh)" },
    { id: "REG-7", kode_regional: "RPC7", nama_regional: "Regional 7 (Lel)" }
  ],
  ref_units: [
    { id: "UNT-101", regional_id: "REG-1", kode_unit: "1E06", nama_unit: "Kebun Sei Kebara", jenis_unit: "Kebun", luas_area: 4250, produksi_tbs: 85000, produksi_cpo: 20349, rendemen_cpo: 23.94 },
    { id: "UNT-102", regional_id: "REG-2", kode_unit: "2E01", nama_unit: "Kebun Bah Jambi", jenis_unit: "Kebun", luas_area: 5100, produksi_tbs: 102000, produksi_cpo: 24418, rendemen_cpo: 23.94 },
    { id: "UNT-103", regional_id: "REG-1", kode_unit: "1P01", nama_unit: "PKS Rambutan", jenis_unit: "PKS", luas_area: 0, produksi_tbs: 150000, produksi_cpo: 35910, rendemen_cpo: 23.94 },
    { id: "UNT-104", regional_id: "REG-3", kode_unit: "3E02", nama_unit: "Kebun Sei Daun", jenis_unit: "Kebun", luas_area: 3800, produksi_tbs: 76000, produksi_cpo: 18194, rendemen_cpo: 23.94 },
    { id: "UNT-105", regional_id: "REG-4", kode_unit: "4E05", nama_unit: "Kebun Aek Nabara", jenis_unit: "Kebun", luas_area: 4600, produksi_tbs: 92000, produksi_cpo: 22024, rendemen_cpo: 23.94 },
    { id: "UNT-106", regional_id: "REG-5", kode_unit: "5E01", nama_unit: "Kebun Parindu", jenis_unit: "Kebun", luas_area: 3200, produksi_tbs: 64000, produksi_cpo: 15321, rendemen_cpo: 23.94 },
    { id: "UNT-107", regional_id: "REG-6", kode_unit: "6E01", nama_unit: "Kebun Cot Girek", jenis_unit: "Kebun", luas_area: 2900, produksi_tbs: 58000, produksi_cpo: 13885, rendemen_cpo: 23.94 },
    { id: "UNT-108", regional_id: "REG-7", kode_unit: "7E01", nama_unit: "Kebun Rejosari", jenis_unit: "Kebun", luas_area: 3100, produksi_tbs: 62000, produksi_cpo: 14842, rendemen_cpo: 23.94 }
  ],
  gl_accounts: [
    { id: "GL-510100", gl_code: "510100", gl_name: "Biaya Pemeliharaan TBM / Immature", kategori_biaya: "Direct Cost" },
    { id: "GL-510200", gl_code: "510200", gl_name: "Biaya Pemupukan Organik & Anorganik 5T", kategori_biaya: "Direct Cost" },
    { id: "GL-510300", gl_code: "510300", gl_name: "Biaya Panen & Pengangkutan TBS", kategori_biaya: "Direct Cost" },
    { id: "GL-520100", gl_code: "520100", gl_name: "Biaya Pengolahan Pabrik CPO", kategori_biaya: "Processing Cost" }
  ],
  cost_centers: [
    { id: "CC-1E06", unit_id: "UNT-101", cost_center_code: "CC-1E06-TBM", cost_center_name: "Cost Center TBM Sei Kebara" },
    { id: "CC-2E01", unit_id: "UNT-102", cost_center_code: "CC-2E01-TBM", cost_center_name: "Cost Center TBM Bah Jambi" },
    { id: "CC-1P01", unit_id: "UNT-103", cost_center_code: "CC-1P01-PKS", cost_center_name: "Cost Center PKS Rambutan" },
    { id: "CC-3E02", unit_id: "UNT-104", cost_center_code: "CC-3E02-TBM", cost_center_name: "Cost Center TBM Sei Daun" },
    { id: "CC-4E05", unit_id: "UNT-105", cost_center_code: "CC-4E05-TBM", cost_center_name: "Cost Center TBM Aek Nabara" }
  ],
  co_mappings: [
    { id: "MAP-001", gl_id: "GL-510100", cost_center_id: "CC-1E06", alokasi_pct: 100 },
    { id: "MAP-002", gl_id: "GL-510200", cost_center_id: "CC-2E01", alokasi_pct: 100 },
    { id: "MAP-003", gl_id: "GL-520100", cost_center_id: "CC-1P01", alokasi_pct: 100 },
    { id: "MAP-004", gl_id: "GL-510100", cost_center_id: "CC-3E02", alokasi_pct: 100 }
  ],
  co_transactions: [
    { id: "TRX-1001", mapping_id: "MAP-001", periode: "2026-08", nominal_biaya: 450000000, keterangan: "Realisasi Pemeliharaan TBM Bulan Agustus" },
    { id: "TRX-1002", mapping_id: "MAP-002", periode: "2026-08", nominal_biaya: 620000000, keterangan: "Aplikasi Pupuk NPK TBM Phase 2" },
    { id: "TRX-1003", mapping_id: "MAP-003", periode: "2026-08", nominal_biaya: 890000000, keterangan: "Biaya Pengolahan TBS PKS Rambutan" }
  ],
  bpc_rkap: [
    { id: "BPC-001", unit_id: "UNT-101", tahun: 2026, bulan: 1, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 6.25, actual_progress: 6.08 },
    { id: "BPC-002", unit_id: "UNT-101", tahun: 2026, bulan: 2, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 12.50, actual_progress: 12.16 },
    { id: "BPC-003", unit_id: "UNT-101", tahun: 2026, bulan: 3, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 18.75, actual_progress: 18.25 },
    { id: "BPC-004", unit_id: "UNT-101", tahun: 2026, bulan: 4, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 25.00, actual_progress: 24.33 },
    { id: "BPC-005", unit_id: "UNT-101", tahun: 2026, bulan: 5, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 31.25, actual_progress: 30.41 },
    { id: "BPC-006", unit_id: "UNT-101", tahun: 2026, bulan: 6, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 37.50, actual_progress: 36.49 },
    { id: "BPC-007", unit_id: "UNT-101", tahun: 2026, bulan: 7, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 43.75, actual_progress: 42.58 },
    { id: "BPC-008", unit_id: "UNT-101", tahun: 2026, bulan: 8, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 50.00, actual_progress: 48.66 },
    { id: "BPC-009", unit_id: "UNT-101", tahun: 2026, bulan: 9, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 56.25, actual_progress: 54.74 },
    { id: "BPC-010", unit_id: "UNT-101", tahun: 2026, bulan: 10, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 62.50, actual_progress: 60.82 },
    { id: "BPC-011", unit_id: "UNT-101", tahun: 2026, bulan: 11, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 68.75, actual_progress: 66.90 },
    { id: "BPC-012", unit_id: "UNT-101", tahun: 2026, bulan: 12, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 75.00, actual_progress: 72.98 },
    // Consolidated aggregate entries for additional units
    { id: "BPC-013", unit_id: "UNT-102", tahun: 2026, bulan: 12, rkap_amount: 120000000000, realisasi_amount: 98000000000, plan_progress: 85.00, actual_progress: 81.66 },
    { id: "BPC-014", unit_id: "UNT-103", tahun: 2026, bulan: 12, rkap_amount: 150000000000, realisasi_amount: 138000000000, plan_progress: 95.00, actual_progress: 92.00 },
    { id: "BPC-015", unit_id: "UNT-104", tahun: 2026, bulan: 12, rkap_amount: 80000000000, realisasi_amount: 71000000000, plan_progress: 90.00, actual_progress: 88.75 },
    { id: "BPC-016", unit_id: "UNT-105", tahun: 2026, bulan: 12, rkap_amount: 90000000000, realisasi_amount: 76000000000, plan_progress: 88.00, actual_progress: 84.44 },
    { id: "BPC-017", unit_id: "UNT-106", tahun: 2026, bulan: 12, rkap_amount: 50000000000, realisasi_amount: 31000000000, plan_progress: 80.00, actual_progress: 62.00 },
    { id: "BPC-018", unit_id: "UNT-107", tahun: 2026, bulan: 12, rkap_amount: 40000000000, realisasi_amount: 36000000000, plan_progress: 92.00, actual_progress: 90.00 },
    { id: "BPC-019", unit_id: "UNT-108", tahun: 2026, bulan: 12, rkap_amount: 176775616280, realisasi_amount: 114000000000, plan_progress: 70.00, actual_progress: 64.49 }
  ],
  bpc_pica: [
    { id: "PICA-001", unit_id: "UNT-101", why1: "Pertumbuhan Vegetatif Dibawah Standar", why2: "Tanaman", why3: "Bibit Lewat Umur & Keterlambatan Pupuk", corrective_action: "Pemberian Pupuk Organik & Extra Dose", status_pica: "In-Progress" },
    { id: "PICA-002", unit_id: "UNT-102", why1: "Deviasi Serapan Biaya Pemupukan", why2: "Pemeliharaan", why3: "Keterlambatan Pengadaan Pupuk Anorganik", corrective_action: "Percepatan Kontrak Suplier Local", status_pica: "In-Progress" },
    { id: "PICA-003", unit_id: "UNT-106", why1: "Capaian Progress Replanting Rendah", why2: "Administrasi", why3: "Verifikasi Lahan KSO Terhambat Sengketa", corrective_action: "Penyelesaian Legalitas & Mediasi Lahan", status_pica: "Pending" }
  ]
};

class DBEngine {
  constructor() {
    this.data = this.loadDB();
  }

  loadDB() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Basic schema integrity check
        if (parsed.ref_regional && parsed.co_mappings && parsed.bpc_rkap) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("LocalStorage access error, using inline fallback data:", e);
    }
    this.saveDB(INITIAL_DB);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }

  saveDB(dataToSave) {
    const data = dataToSave || this.data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save to LocalStorage:", e);
    }
  }

  resetDB() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = JSON.parse(JSON.stringify(INITIAL_DB));
    this.saveDB();
    return this.data;
  }

  // --- Formula Helper Methods ---
  calcSerapan(realisasi, rkap) {
    if (!rkap || rkap <= 0) return 0;
    return (realisasi / rkap) * 100;
  }

  calcVarianceAmount(realisasi, rkap) {
    return realisasi - rkap;
  }

  calcVariancePct(realisasi, rkap) {
    if (!rkap || rkap <= 0) return 0;
    return ((realisasi - rkap) / rkap) * 100;
  }

  getBudgetStatus(variancePct) {
    if (variancePct > 10) return "Over Budget";
    if (variancePct < -10) return "Under Budget";
    return "On Track";
  }

  calcSPI(actualProgress, planProgress) {
    if (!planProgress || planProgress <= 0) return 1.0;
    return actualProgress / planProgress;
  }

  getPerformanceBadge(scorePct) {
    if (scorePct > 92) return { code: "GOLD", label: "Emas (Kelas A)", css: "badge-gold" };
    if (scorePct > 87) return { code: "GREEN", label: "Hijau (Kelas B)", css: "badge-green" };
    if (scorePct >= 82) return { code: "RED", label: "Merah (Kelas C)", css: "badge-red" };
    return { code: "BLACK", label: "Hitam (Kelas D)", css: "badge-black" };
  }

  // --- Query Helpers with Regional Filter ---
  getUnits(regionalId = "ALL") {
    if (!regionalId || regionalId === "ALL") return this.data.ref_units;
    return this.data.ref_units.filter(u => u.regional_id === regionalId);
  }

  getCostCenters(regionalId = "ALL") {
    const validUnitIds = new Set(this.getUnits(regionalId).map(u => u.id));
    return this.data.cost_centers.filter(cc => validUnitIds.has(cc.unit_id));
  }

  getCOMappings(regionalId = "ALL") {
    const validCCIds = new Set(this.getCostCenters(regionalId).map(cc => cc.id));
    return this.data.co_mappings.filter(m => validCCIds.has(m.cost_center_id));
  }

  getCOTransactions(regionalId = "ALL") {
    const validMappingIds = new Set(this.getCOMappings(regionalId).map(m => m.id));
    return this.data.co_transactions.filter(t => validMappingIds.has(t.mapping_id));
  }

  getBPCRKAP(regionalId = "ALL") {
    const validUnitIds = new Set(this.getUnits(regionalId).map(u => u.id));
    return this.data.bpc_rkap.filter(b => validUnitIds.has(b.unit_id));
  }

  getBPCPICA(regionalId = "ALL") {
    const validUnitIds = new Set(this.getUnits(regionalId).map(u => u.id));
    return this.data.bpc_pica.filter(p => validUnitIds.has(p.unit_id));
  }

  // --- CRUD Operations ---
  // CO Mappings
  addCOMapping(mapping) {
    const newId = "MAP-" + String(Date.now()).slice(-6);
    const newRecord = { id: newId, ...mapping, alokasi_pct: Number(mapping.alokasi_pct) };
    this.data.co_mappings.push(newRecord);
    this.saveDB();
    return newRecord;
  }

  updateCOMapping(id, updatedFields) {
    const index = this.data.co_mappings.findIndex(m => m.id === id);
    if (index !== -1) {
      this.data.co_mappings[index] = { ...this.data.co_mappings[index], ...updatedFields };
      if (updatedFields.alokasi_pct !== undefined) {
        this.data.co_mappings[index].alokasi_pct = Number(updatedFields.alokasi_pct);
      }
      this.saveDB();
      return true;
    }
    return false;
  }

  deleteCOMapping(id) {
    this.data.co_mappings = this.data.co_mappings.filter(m => m.id !== id);
    // Also cleanup associated transactions
    this.data.co_transactions = this.data.co_transactions.filter(t => t.mapping_id !== id);
    this.saveDB();
    return true;
  }

  // CO Transactions
  addCOTransaction(trx) {
    const newId = "TRX-" + String(Date.now()).slice(-6);
    const newRecord = { id: newId, ...trx, nominal_biaya: Number(trx.nominal_biaya) };
    this.data.co_transactions.push(newRecord);
    this.saveDB();
    return newRecord;
  }

  // BPC PICA CRUD
  addPICA(pica) {
    const newId = "PICA-" + String(Date.now()).slice(-6);
    const newRecord = { id: newId, ...pica };
    this.data.bpc_pica.push(newRecord);
    this.saveDB();
    return newRecord;
  }

  updatePICAStatus(id, newStatus) {
    const index = this.data.bpc_pica.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.bpc_pica[index].status_pica = newStatus;
      this.saveDB();
      return true;
    }
    return false;
  }

  deletePICA(id) {
    this.data.bpc_pica = this.data.bpc_pica.filter(p => p.id !== id);
    this.saveDB();
    return true;
  }
}

// Global Singleton Instance
window.dbEngine = new DBEngine();
