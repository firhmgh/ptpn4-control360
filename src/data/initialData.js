/**
 * PALM-CONTROL360 — Seed Data Store
 * Source of Truth: PRD FINAL TERKUNCI (Holding PTPN IV / PalmCo)
 *
 * ── VERIFIED BASELINE FACTS (AUDIT FORENSIK & PRD TERKUNCI) ─────────────────
 *   RKAP Biaya Replanting (PalmCo)  :  Rp 608.528.462.803
 *   Realisasi Replanting (PalmCo)   :  Rp 444.091.285.174
 *   Serapan Biaya Holding           :  72,98%
 *   Rendemen CPO Standar            :  23,94% (Indikator Berbasis Sumber Audit)
 *   Cash Cost Standar               :  Rp 4.469/Kg (Indikator Berbasis Sumber Audit)
 *   Periode                         :  2026
 *
 * ── VERIFIED ORG FACTS (PTPN IV PalmCo — Public Domain Sources) ─────────────
 *   Pembentukan PalmCo   : 1 Desember 2023
 *   Entitas Merger       : PTPN IV (surviving entity) + PTPN V (Riau) +
 *                          PTPN VI (Jambi/Sumbar) + PTPN XIII (Kalimantan)
 *   Holding Induk        : PT Perkebunan Nusantara III (Persero)
 *   Regional R1-R5       : Seed data konsolidasi operasional utama (R1-R5) serta
 *                          RPC1-RPC7 sebagai representasi regional operasional
 *                          prototype berbasis sumber audit.
 *
 * ── DATA CLASSIFICATION (DEMO / SIMULASI) ────────────────────────────────────
 *   DATA SIMULASI/DEMO   : Seluruh GL Account, Cost Center, transaksi individual,
 *                          simulasi ETL, dan data produksi/unit TIDAK memiliki
 *                          bukti sumber individual dan merupakan data simulasi demonstrasi.
 *                          TIDAK terhubung secara live ke SAP atau database produksi PTPN IV.
 *
 * ── MATH VERIFICATION ────────────────────────────────────────────────────────
 *   UNT-101 (12 bulan): 12 × 5.071.070.523 = 60.852.846.276 RKAP
 *                       12 × 3.700.760.709  = 44.409.128.508 Realisasi
 *   UNT-102..UNT-110  : 547.675.616.527 RKAP, 399.682.156.666 Realisasi
 *   ─────────────────────────────────────────────────────────────────────────
 *   TOTAL             : 608.528.462.803 RKAP Replanting = Audit ✓
 *   TOTAL             : 444.091.285.174 Realisasi Replanting = Audit ✓
 *   Serapan           : 444.091.285.174 / 608.528.462.803 = 72,98% = Audit ✓
 */

export const INITIAL_DB = {
  /**
   * Regional Operasional Prototype (Representasi Regional RPC1 - RPC7 / R1 - R5)
   * Catatan: Pemetaan ini merupakan representasi regional operasional yang digunakan
   * prototype berdasarkan sumber audit (R1–R5 sebagai seed konsolidasi utama).
   */
  ref_regional: [
    { id: "REG-1", kode_regional: "RPC1", nama_regional: "Regional 1 — Sumatera Utara (R1)" },
    { id: "REG-2", kode_regional: "RPC2", nama_regional: "Regional 2 — Riau (eks PTPN V / R2)" },
    { id: "REG-3", kode_regional: "RPC3", nama_regional: "Regional 3 — Jambi (eks PTPN VI / R3)" },
    { id: "REG-4", kode_regional: "RPC4", nama_regional: "Regional 4 — Sumatera Selatan (R4)" },
    { id: "REG-5", kode_regional: "RPC5", nama_regional: "Regional 5 — Kalimantan (eks PTPN XIII / R5)" },
    { id: "REG-6", kode_regional: "RPC6", nama_regional: "Regional 6 — Aceh" },
    { id: "REG-7", kode_regional: "RPC7", nama_regional: "Regional 7 — Sulawesi" }
  ],

  /**
   * Unit Kerja (Kebun & PKS) — DEMO SIMULASI
   * Nama unit, kode, dan angka produksi adalah ILUSTRATIF.
   * Rendemen CPO 23,94% = angka terverifikasi PRD.
   */
  ref_units: [
    // RPC1 — Sumatera Utara (core legacy PTPN IV)
    { id: "UNT-101", regional_id: "REG-1", kode_unit: "1E06", nama_unit: "Kebun Sei Kebara",    jenis_unit: "Kebun", luas_area: 4250, produksi_tbs: 85000,  produksi_cpo: 20349, rendemen_cpo: 23.94 },
    { id: "UNT-102", regional_id: "REG-1", kode_unit: "1E07", nama_unit: "Kebun Bah Jambi",     jenis_unit: "Kebun", luas_area: 5100, produksi_tbs: 102000, produksi_cpo: 24418, rendemen_cpo: 23.94 },
    { id: "UNT-103", regional_id: "REG-1", kode_unit: "1P01", nama_unit: "PKS Rambutan",         jenis_unit: "PKS",   luas_area: 0,    produksi_tbs: 150000, produksi_cpo: 35910, rendemen_cpo: 23.94 },
    // RPC2 — Riau
    { id: "UNT-104", regional_id: "REG-2", kode_unit: "2E01", nama_unit: "Kebun Sei Daun",       jenis_unit: "Kebun", luas_area: 3800, produksi_tbs: 76000,  produksi_cpo: 18194, rendemen_cpo: 23.94 },
    { id: "UNT-105", regional_id: "REG-2", kode_unit: "2P01", nama_unit: "PKS Sei Galuh",        jenis_unit: "PKS",   luas_area: 0,    produksi_tbs: 120000, produksi_cpo: 28728, rendemen_cpo: 23.94 },
    // RPC3 — Jambi
    { id: "UNT-106", regional_id: "REG-3", kode_unit: "3E01", nama_unit: "Kebun Aek Nabara",     jenis_unit: "Kebun", luas_area: 4600, produksi_tbs: 92000,  produksi_cpo: 22024, rendemen_cpo: 23.94 },
    // RPC4 — Sumatera Selatan
    { id: "UNT-107", regional_id: "REG-4", kode_unit: "4E01", nama_unit: "Kebun Suka Damai",     jenis_unit: "Kebun", luas_area: 3200, produksi_tbs: 64000,  produksi_cpo: 15321, rendemen_cpo: 23.94 },
    // RPC5 — Kalimantan
    { id: "UNT-108", regional_id: "REG-5", kode_unit: "5E01", nama_unit: "Kebun Parindu",        jenis_unit: "Kebun", luas_area: 3200, produksi_tbs: 64000,  produksi_cpo: 15321, rendemen_cpo: 23.94 },
    // RPC6 — Aceh
    { id: "UNT-109", regional_id: "REG-6", kode_unit: "6E01", nama_unit: "Kebun Cot Girek",      jenis_unit: "Kebun", luas_area: 2900, produksi_tbs: 58000,  produksi_cpo: 13885, rendemen_cpo: 23.94 },
    // RPC7 — Sulawesi
    { id: "UNT-110", regional_id: "REG-7", kode_unit: "7E01", nama_unit: "Kebun Rejosari",       jenis_unit: "Kebun", luas_area: 3100, produksi_tbs: 62000,  produksi_cpo: 14842, rendemen_cpo: 23.94 }
  ],

  /**
   * GL Accounts (Chart of Accounts) — DATA SIMULASI/DEMO
   * Kode GL bersifat ilustratif demonstrasi prototype (tidak terhubung ke sistem produksi).
   */
  gl_accounts: [
    { id: "GL-510100", gl_code: "510100", gl_name: "Biaya Pemeliharaan TBM / Immature",         kategori_biaya: "Direct Cost"      },
    { id: "GL-510200", gl_code: "510200", gl_name: "Biaya Pemupukan Organik & Anorganik",        kategori_biaya: "Direct Cost"      },
    { id: "GL-510300", gl_code: "510300", gl_name: "Biaya Panen & Pengangkutan TBS",             kategori_biaya: "Direct Cost"      },
    { id: "GL-520100", gl_code: "520100", gl_name: "Biaya Pengolahan Pabrik CPO",                kategori_biaya: "Processing Cost"  },
    { id: "GL-530100", gl_code: "530100", gl_name: "Biaya Gaji & Tunjangan Karyawan",            kategori_biaya: "Overhead"         },
    { id: "GL-540100", gl_code: "540100", gl_name: "Biaya Depresiasi Aset Tetap Perkebunan",     kategori_biaya: "Overhead"         }
  ],

  /**
   * Cost Centers — DEMO/SIMULASI
   * Cost Center = Unit kerja penerima alokasi biaya GL.
   */
  cost_centers: [
    { id: "CC-1E06", unit_id: "UNT-101", cost_center_code: "CC-1E06-TBM", cost_center_name: "Cost Center TBM Sei Kebara RPC1" },
    { id: "CC-1E07", unit_id: "UNT-102", cost_center_code: "CC-1E07-TBM", cost_center_name: "Cost Center TBM Bah Jambi RPC1"  },
    { id: "CC-1P01", unit_id: "UNT-103", cost_center_code: "CC-1P01-PKS", cost_center_name: "Cost Center PKS Rambutan RPC1"   },
    { id: "CC-2E01", unit_id: "UNT-104", cost_center_code: "CC-2E01-TBM", cost_center_name: "Cost Center TBM Sei Daun RPC2"   },
    { id: "CC-3E01", unit_id: "UNT-106", cost_center_code: "CC-3E01-TBM", cost_center_name: "Cost Center TBM Aek Nabara RPC3" }
  ],

  /**
   * CO Mappings (GL → Cost Center) — DEMO/SIMULASI
   */
  co_mappings: [
    { id: "MAP-001", gl_id: "GL-510100", cost_center_id: "CC-1E06", alokasi_pct: 100 },
    { id: "MAP-002", gl_id: "GL-510200", cost_center_id: "CC-1E07", alokasi_pct: 100 },
    { id: "MAP-003", gl_id: "GL-520100", cost_center_id: "CC-1P01", alokasi_pct: 100 },
    { id: "MAP-004", gl_id: "GL-510300", cost_center_id: "CC-2E01", alokasi_pct: 100 }
  ],

  /**
   * CO Transactions (Transaction Ledger) — DEMO/SIMULASI
   */
  co_transactions: [
    { id: "TRX-1001", mapping_id: "MAP-001", periode: "2026-08", nominal_biaya: 450000000,  keterangan: "Realisasi Pemeliharaan TBM Agustus — Sei Kebara"  },
    { id: "TRX-1002", mapping_id: "MAP-002", periode: "2026-08", nominal_biaya: 620000000,  keterangan: "Aplikasi Pupuk NPK TBM Phase 2 — Bah Jambi"        },
    { id: "TRX-1003", mapping_id: "MAP-003", periode: "2026-08", nominal_biaya: 890000000,  keterangan: "Biaya Pengolahan TBS PKS Rambutan Agustus"          },
    { id: "TRX-1004", mapping_id: "MAP-004", periode: "2026-07", nominal_biaya: 380000000,  keterangan: "Biaya Panen & Angkut TBS Kebun Sei Daun Juli"       },
    { id: "TRX-1005", mapping_id: "MAP-001", periode: "2026-07", nominal_biaya: 412000000,  keterangan: "Realisasi Pemeliharaan TBM Juli — Sei Kebara"       }
  ],

  /**
   * BPC RKAP — BREAKDOWN UNIT DENGAN TOTAL TERVERIFIKASI PRD
   *
   * ── MATH PROOF ────────────────────────────────────────────────────────────
   *   UNT-101 (12 bulan):
   *     RKAP       = 12 × 5.071.070.523 = 60.852.846.276
   *     Realisasi  = 12 × 3.700.760.709 = 44.409.128.508
   *
   *   UNT-102 (Kebun)  : RKAP= 80.000.000.000, Real= 58.000.000.000 (72,50%)
   *   UNT-103 (PKS)    : RKAP=100.000.000.000, Real= 90.000.000.000 (90,00%) ← Hijau B
   *   UNT-104 (Kebun)  : RKAP= 60.000.000.000, Real= 53.000.000.000 (88,33%) ← Hijau B
   *   UNT-105 (PKS)    : RKAP= 55.000.000.000, Real= 36.000.000.000 (65,45%) ← Hitam D
   *   UNT-106 (Kebun)  : RKAP= 70.000.000.000, Real= 58.000.000.000 (82,86%) ← Merah C
   *   UNT-107 (Kebun)  : RKAP= 40.000.000.000, Real= 25.000.000.000 (62,50%) ← Hitam D
   *   UNT-108 (Kebun)  : RKAP= 35.000.000.000, Real= 33.000.000.000 (94,29%) ← Emas A
   *   UNT-109 (Kebun)  : RKAP= 28.000.000.000, Real= 21.000.000.000 (75,00%) ← Hitam D
   *   UNT-110 (Kebun)  : RKAP= 79.675.616.527, Real= 25.682.156.666 (32,23%) ← Hitam D
   *
   *   SUM RKAP (UNT-102 s/d UNT-110):
   *     80+100+60+55+70+40+35+28 = 468.000.000.000
   *     + 79.675.616.527 = 547.675.616.527
   *   TOTAL HOLDING RKAP  = 60.852.846.276 + 547.675.616.527 = 608.528.462.803 ✓ (PRD)
   *
   *   SUM Realisasi (UNT-102 s/d UNT-110):
   *     58+90+53+36+58+25+33+21 = 374.000.000.000
   *     + 25.682.156.666 = 399.682.156.666
   *   TOTAL HOLDING Real   = 44.409.128.508 + 399.682.156.666 = 444.091.285.174 ✓ (PRD)
   *   Serapan Holding      = 444.091.285.174 / 608.528.462.803 = 72,98% ✓ (PRD)
   */
  bpc_rkap: [
    // ── UNT-101: 12-Month S-Curve Profile (Jan–Des 2026) [DEMO SIMULASI] ──
    { id: "BPC-001", unit_id: "UNT-101", tahun: 2026, bulan: 1,  rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 6.25,  actual_progress: 6.08  },
    { id: "BPC-002", unit_id: "UNT-101", tahun: 2026, bulan: 2,  rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 12.50, actual_progress: 12.16 },
    { id: "BPC-003", unit_id: "UNT-101", tahun: 2026, bulan: 3,  rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 18.75, actual_progress: 18.25 },
    { id: "BPC-004", unit_id: "UNT-101", tahun: 2026, bulan: 4,  rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 25.00, actual_progress: 24.33 },
    { id: "BPC-005", unit_id: "UNT-101", tahun: 2026, bulan: 5,  rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 31.25, actual_progress: 30.41 },
    { id: "BPC-006", unit_id: "UNT-101", tahun: 2026, bulan: 6,  rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 37.50, actual_progress: 36.49 },
    { id: "BPC-007", unit_id: "UNT-101", tahun: 2026, bulan: 7,  rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 43.75, actual_progress: 42.58 },
    { id: "BPC-008", unit_id: "UNT-101", tahun: 2026, bulan: 8,  rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 50.00, actual_progress: 48.66 },
    { id: "BPC-009", unit_id: "UNT-101", tahun: 2026, bulan: 9,  rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 56.25, actual_progress: 54.74 },
    { id: "BPC-010", unit_id: "UNT-101", tahun: 2026, bulan: 10, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 62.50, actual_progress: 60.82 },
    { id: "BPC-011", unit_id: "UNT-101", tahun: 2026, bulan: 11, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 68.75, actual_progress: 66.90 },
    { id: "BPC-012", unit_id: "UNT-101", tahun: 2026, bulan: 12, rkap_amount: 5071070523, realisasi_amount: 3700760709, plan_progress: 75.00, actual_progress: 72.98 },

    // ── Regional Unit Consolidation (Snapshot Des 2026) [DEMO SIMULASI] ───
    // Amounts are illustrative. Totals verified against PRD.
    { id: "BPC-013", unit_id: "UNT-102", tahun: 2026, bulan: 12, rkap_amount:  80000000000, realisasi_amount:  58000000000, plan_progress: 80.00, actual_progress: 72.50 },
    { id: "BPC-014", unit_id: "UNT-103", tahun: 2026, bulan: 12, rkap_amount: 100000000000, realisasi_amount:  90000000000, plan_progress: 95.00, actual_progress: 90.00 },
    { id: "BPC-015", unit_id: "UNT-104", tahun: 2026, bulan: 12, rkap_amount:  60000000000, realisasi_amount:  53000000000, plan_progress: 92.00, actual_progress: 88.33 },
    { id: "BPC-016", unit_id: "UNT-105", tahun: 2026, bulan: 12, rkap_amount:  55000000000, realisasi_amount:  36000000000, plan_progress: 78.00, actual_progress: 65.45 },
    { id: "BPC-017", unit_id: "UNT-106", tahun: 2026, bulan: 12, rkap_amount:  70000000000, realisasi_amount:  58000000000, plan_progress: 86.00, actual_progress: 82.86 },
    { id: "BPC-018", unit_id: "UNT-107", tahun: 2026, bulan: 12, rkap_amount:  40000000000, realisasi_amount:  25000000000, plan_progress: 75.00, actual_progress: 62.50 },
    { id: "BPC-019", unit_id: "UNT-108", tahun: 2026, bulan: 12, rkap_amount:  35000000000, realisasi_amount:  33000000000, plan_progress: 97.00, actual_progress: 94.29 },
    { id: "BPC-020", unit_id: "UNT-109", tahun: 2026, bulan: 12, rkap_amount:  28000000000, realisasi_amount:  21000000000, plan_progress: 80.00, actual_progress: 75.00 },
    // UNT-110 amount = residual to ensure PRD total match exactly
    // RKAP: 547.675.616.527 - 468.000.000.000 = 79.675.616.527
    // Real: 399.682.156.666 - 374.000.000.000 = 25.682.156.666
    { id: "BPC-021", unit_id: "UNT-110", tahun: 2026, bulan: 12, rkap_amount:  79675616527, realisasi_amount:  25682156666, plan_progress: 60.00, actual_progress: 32.23 }
  ],

  /**
   * BPC PICA Engine — DEMO/SIMULASI
   * Contoh catatan PICA untuk unit dengan deviasi anggaran signifikan.
   */
  bpc_pica: [
    {
      id: "PICA-001",
      unit_id: "UNT-101",
      why1: "Pertumbuhan Vegetatif TBM Dibawah Standar",
      why2: "Tanaman",
      why3: "Bibit Lewat Umur & Keterlambatan Aplikasi Pupuk Dasar",
      corrective_action: "Pemberian Pupuk Organik Ekstra Dosis + Penggantian Bibit Selektif",
      status_pica: "In-Progress"
    },
    {
      id: "PICA-002",
      unit_id: "UNT-107",
      why1: "Serapan Biaya Realisasi Hanya 62,5% dari Target RKAP",
      why2: "Pemeliharaan",
      why3: "Keterlambatan Pengadaan Pupuk Anorganik (NPK) — Antrian Suplier Nasional",
      corrective_action: "Percepatan Kontrak Langsung Suplier Lokal + Aktivasi Stok Buffer Regional",
      status_pica: "In-Progress"
    },
    {
      id: "PICA-003",
      unit_id: "UNT-110",
      why1: "Capaian Progress Realisasi Hanya 32% dari Target",
      why2: "Administrasi",
      why3: "Verifikasi Lahan KSO Terhambat Sengketa Batas Lahan RPC7",
      corrective_action: "Mediasi Legalitas Lahan + Eskalasi ke Direksi Regional & Legal Department",
      status_pica: "Pending"
    },
    {
      id: "PICA-004",
      unit_id: "UNT-105",
      why1: "Serapan PKS Sei Galuh 65,45% — Di Bawah Target 78%",
      why2: "Pengolahan Pabrik",
      why3: "Gangguan Mesin Presser CPO & Penggantian Sparepart Impor Terlambat",
      corrective_action: "Percepatan Pengadaan Sparepart via Domestic Substitution + Penjadwalan Overhaul",
      status_pica: "Completed"
    }
  ]
};
