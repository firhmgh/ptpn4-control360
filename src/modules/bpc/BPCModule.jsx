import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { KPICard } from "../../components/common/KPICard";
import { DataTable } from "../../components/common/DataTable";
import { Badge, ConfirmationModal } from "../../components/common/Feedback";
import {
  calcSerapan,
  getPerformanceBadge,
  generateDeterministicSCurve,
  formatRupiah,
  formatPercent,
} from "../../utils/calculations";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Wallet,
  Coins,
  TrendingUp,
  Activity,
  PlusCircle,
  HelpCircle,
  X,
  FileCheck2,
  Trash2,
  CheckCircle,
} from "lucide-react";

export function BPCModule() {
  const {
    units,
    allUnits,
    bpcRkap,
    allBpcRkap,
    picaList,
    globalKPIs,
    addPICA,
    updatePICAStatus,
    deletePICA,
    selectedRegional,
  } = useApp();

  // Helper Maps
  const unitMap = new Map(allUnits.map((u) => [u.id, u]));

  // Modal State for PICA Engine Form
  const [isPICAModalOpen, setIsPICAModalOpen] = useState(false);
  const [picaFormData, setPicaFormData] = useState({
    unit_id: "",
    why1: "",
    why2: "Tanaman",
    why3: "",
    corrective_action: "",
  });

  // Delete Confirmation State for PICA
  const [picaToDelete, setPicaToDelete] = useState(null);

  // Feature 3.1: 12-Month S-Curve Tracking (Deterministic Generator without claiming false monthly source records)
  const scurveData = useMemo(() => {
    return generateDeterministicSCurve(bpcRkap, selectedRegional);
  }, [bpcRkap, selectedRegional]);

  // Feature 3.2: Holding Financial Consolidation Matrix (Deduplicated per unit)
  const consolidationData = useMemo(() => {
    // Group records by unit_id to get annual/latest consolidated status
    const grouped = new Map();
    bpcRkap.forEach((item) => {
      if (!grouped.has(item.unit_id)) {
        grouped.set(item.unit_id, {
          id: item.id,
          unit_id: item.unit_id,
          rkap_amount: item.rkap_amount,
          realisasi_amount: item.realisasi_amount,
          plan_progress: item.plan_progress,
          actual_progress: item.actual_progress,
        });
      }
    });

    return Array.from(grouped.values()).map((row) => {
      const unit = unitMap.get(row.unit_id);
      const serapan = calcSerapan(row.realisasi_amount, row.rkap_amount);
      const perf = getPerformanceBadge(serapan);

      return {
        ...row,
        unit_code: unit?.kode_unit || "-",
        unit_name: unit?.nama_unit || "-",
        serapan_pct: serapan,
        perf,
      };
    });
  }, [bpcRkap, unitMap]);

  // Columns for Feature 3.2: Holding Financial Consolidation Matrix
  const consolidationColumns = [
    {
      header: "Kode Unit",
      accessor: "unit_code",
      render: (row) => (
        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
          {row.unit_code}
        </span>
      ),
    },
    {
      header: "Nama Unit Kerja",
      accessor: "unit_name",
      render: (row) => <span className="font-bold text-slate-800">{row.unit_name}</span>,
    },
    {
      header: "RKAP Replanting (PalmCo)",
      accessor: "rkap_amount",
      exportValue: (row) => row.rkap_amount,
      render: (row) => <span className="font-mono text-slate-700">{formatRupiah(row.rkap_amount)}</span>,
    },
    {
      header: "Realisasi Replanting (PalmCo)",
      accessor: "realisasi_amount",
      exportValue: (row) => row.realisasi_amount,
      render: (row) => (
        <span className="font-mono font-bold text-slate-900">{formatRupiah(row.realisasi_amount)}</span>
      ),
    },
    {
      header: "Serapan (%)",
      accessor: "serapan_pct",
      exportValue: (row) => `${row.serapan_pct.toFixed(2)}%`,
      render: (row) => (
        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          {formatPercent(row.serapan_pct)}
        </span>
      ),
    },
    {
      header: "Actual Progress",
      accessor: "actual_progress",
      exportValue: (row) => `${row.actual_progress.toFixed(2)}%`,
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {formatPercent(row.actual_progress)}
        </span>
      ),
    },
    {
      header: "Kelas Kinerja (Holding)",
      accessor: (row) => row.perf.label,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${row.perf.bg}`}
        >
          {row.perf.label}
        </span>
      ),
    },
  ];

  // Columns for Feature 3.3: PICA Engine (CRUD)
  const picaColumns = [
    {
      header: "Unit Kerja",
      accessor: (row) => unitMap.get(row.unit_id)?.nama_unit || "-",
      render: (row) => (
        <span className="font-bold text-slate-800">{unitMap.get(row.unit_id)?.nama_unit || "-"}</span>
      ),
    },
    {
      header: "Why 1 (Masalah)",
      accessor: "why1",
      render: (row) => <span className="font-medium text-slate-900 text-xs">{row.why1}</span>,
    },
    {
      header: "Why 2 (Kategori)",
      accessor: "why2",
      render: (row) => (
        <Badge variant={row.why2 === "Tanaman" ? "success" : row.why2 === "Pemeliharaan" ? "warning" : "default"}>
          {row.why2}
        </Badge>
      ),
    },
    {
      header: "Why 3 (Akar Masalah)",
      accessor: "why3",
      render: (row) => <span className="text-slate-600 text-xs">{row.why3}</span>,
    },
    {
      header: "Corrective Action",
      accessor: "corrective_action",
      render: (row) => (
        <span className="font-semibold text-emerald-900 text-xs bg-emerald-50/70 p-1.5 rounded block border border-emerald-100">
          {row.corrective_action}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status_pica",
      render: (row) => {
        const isDone = row.status_pica === "Completed";
        return (
          <Badge variant={isDone ? "success" : row.status_pica === "In-Progress" ? "warning" : "danger"}>
            {row.status_pica}
          </Badge>
        );
      },
    },
    {
      header: "Aksi",
      className: "text-right",
      cellClassName: "text-right",
      render: (row) => {
        const isDone = row.status_pica === "Completed";
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => updatePICAStatus(row.id, isDone ? "In-Progress" : "Completed")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDone
                  ? "text-amber-600 hover:bg-amber-50"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
              title={isDone ? "Tandai In-Progress" : "Tandai Selesai (Completed)"}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPicaToDelete(row)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Hapus Catatan PICA"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  // Open Add PICA Modal
  const handleOpenAddPICA = () => {
    setPicaFormData({
      unit_id: units[0]?.id || "",
      why1: "",
      why2: "Tanaman",
      why3: "",
      corrective_action: "",
    });
    setIsPICAModalOpen(true);
  };

  // Submit PICA Form
  const handleSavePICA = (e) => {
    e.preventDefault();
    if (!picaFormData.unit_id || !picaFormData.why1 || !picaFormData.why3 || !picaFormData.corrective_action) {
      return;
    }

    addPICA({
      unit_id: picaFormData.unit_id,
      why1: picaFormData.why1,
      why2: picaFormData.why2,
      why3: picaFormData.why3,
      corrective_action: picaFormData.corrective_action,
      status_pica: "In-Progress",
    });

    setIsPICAModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Module Header Overview */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] inline-block flex-shrink-0"></span>
              <span>Modul Business Planning &amp; Consolidation (BPC)</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
              Monitoring kurva-S bulanan, konsolidasi program replanting (seed utama R1–R5), dan tindak lanjut PICA.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs px-2.5 py-1 rounded-md bg-[#FEF3C7] text-[#92400E] font-semibold border border-[#FDE047] whitespace-nowrap text-[11px] sm:text-xs">
              RKAP Replanting Rp 608,5 M · Serapan 72,98%
            </span>
          </div>
        </div>

        {/* Baris Klasifikasi Kinerja Resmi Palmvest360 (4 Color Badges) */}
        <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2 text-[11px]">
          <span className="font-semibold text-[#64748B] uppercase tracking-wider text-[10px] mr-1">
            Standar Klasifikasi:
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE047] font-semibold">
            🥇 Emas (&gt; 92% – 100%)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] border border-[#86EFAC] font-semibold">
            🟢 Hijau (&gt; 87% – 92%)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5] font-semibold">
            🔴 Merah (82% – 87%)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1E293B] text-white border border-slate-700 font-semibold">
            ⬛ Hitam (&lt; 82%)
          </span>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title="RKAP Biaya Replanting (PalmCo)"
          value={formatRupiah(globalKPIs.totalRKAP)}
          subtext="Plafon program replanting holding 2026"
          icon={Wallet}
          color="teal"
        />
        <KPICard
          title="Realisasi Replanting (PalmCo)"
          value={formatRupiah(globalKPIs.totalRealisasi)}
          subtext="Serapan realisasi replanting tercatat"
          icon={Coins}
          color="emerald"
        />
        <KPICard
          title="Serapan Biaya Total"
          value={formatPercent(globalKPIs.serapanPct)}
          subtext="Target Baseline Holding: 72,98%"
          icon={TrendingUp}
          color="amber"
          badge={
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {getPerformanceBadge(globalKPIs.serapanPct).code}
            </span>
          }
        />
        <KPICard
          title="Schedule Performance Index (SPI)"
          value={globalKPIs.avgSPI.toFixed(2)}
          subtext="Actual Progress / Plan Progress"
          icon={Activity}
          color="blue"
          badge={
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                globalKPIs.avgSPI >= 1.0 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {globalKPIs.avgSPI >= 1.0 ? "On Track" : "Behind Schedule"}
            </span>
          }
        />
      </div>

      {/* 3. Feature 3.1: 12-Month RKAP vs Realisasi S-Curve Tracking */}
      <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E2E8F0] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-[#1E293B] tracking-tight">
                12-Month RKAP vs Realisasi S-Curve Tracking
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-50 text-[#00875A] border border-emerald-200">
                DEMO / SIMULASI KURVA BULANAN
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">
              Akumulasi kemajuan proyek dan serapan anggaran (Januari s/d Desember 2026).
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-[#F5A623] inline-block border-t-2 border-dashed border-[#F5A623]"></span>
              <span className="text-[#64748B] text-[11px]">Plan Progress (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-[#00875A] inline-block rounded-full"></span>
              <span className="text-[#1E293B] text-[11px]">Actual Progress (%)</span>
            </div>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scurveData} margin={{ top: 15, right: 20, left: 0, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
              />
              <Tooltip
                formatter={(val, name) => [
                  `${Number(val).toFixed(2)}%`,
                  name === "plan" ? "Plan Progress (S-Curve)" : "Actual Progress",
                ]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#E2E8F0",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  fontSize: "12px",
                }}
              />
              <Legend
                formatter={(val) => (val === "plan" ? "Plan Progress (S-Curve)" : "Actual Progress")}
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
              <Line
                type="monotone"
                dataKey="plan"
                stroke="#F5A623"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: "#F5A623" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#00875A"
                strokeWidth={3}
                dot={{ r: 4, fill: "#00875A" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Feature 3.2: Holding Financial Consolidation Matrix */}
      <DataTable
        title="Holding Financial Consolidation Matrix"
        subtitle="Konsolidasi realisasi replanting dan klasifikasi kinerja holding (Seed Konsolidasi Utama: R1–R5)"
        columns={consolidationColumns}
        data={consolidationData}
        searchPlaceholder="Cari kode unit atau kebun..."
        searchKeys={["unit_code", "unit_name"]}
        exportFilename="Holding_Financial_Consolidation_Export.csv"
      />

      {/* 5. Feature 3.3: PICA Engine (Problem Identification & Corrective Action) */}
      <DataTable
        title="PICA Engine (Problem Identification & Corrective Action)"
        subtitle="Sistem pemantauan akar masalah 3-Tingkat (Why 1, Why 2, Why 3) beserta rencana mitigasi korektif"
        columns={picaColumns}
        data={picaList}
        searchPlaceholder="Cari masalah, kategori, atau unit..."
        searchKeys={["why1", "why2", "why3", "corrective_action", "status_pica"]}
        exportFilename="PICA_Engine_Export.csv"
        actionButtons={
          <button
            onClick={handleOpenAddPICA}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tambah PICA</span>
          </button>
        }
      />

      {/* Modal Add PICA Engine */}
      {isPICAModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                Tambah Catatan PICA Engine
              </h3>
              <button
                onClick={() => setIsPICAModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePICA} className="space-y-3.5 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Unit Kerja Terkait</label>
                <select
                  value={picaFormData.unit_id}
                  onChange={(e) => setPicaFormData((p) => ({ ...p, unit_id: e.target.value }))}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.kode_unit} — {u.nama_unit} ({u.jenis_unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Why 1 (Masalah Utama)</label>
                <input
                  type="text"
                  placeholder="Contoh: Pertumbuhan Vegetatif Dibawah Standar"
                  value={picaFormData.why1}
                  onChange={(e) => setPicaFormData((p) => ({ ...p, why1: e.target.value }))}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Why 2 (Kategori Masalah)</label>
                <select
                  value={picaFormData.why2}
                  onChange={(e) => setPicaFormData((p) => ({ ...p, why2: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Tanaman">Tanaman</option>
                  <option value="Pemeliharaan">Pemeliharaan</option>
                  <option value="Administrasi">Administrasi</option>
                  <option value="Pengolahan Pabrik">Pengolahan Pabrik</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Why 3 (Akar Masalah)</label>
                <input
                  type="text"
                  placeholder="Contoh: Bibit Lewat Umur & Keterlambatan Pupuk"
                  value={picaFormData.why3}
                  onChange={(e) => setPicaFormData((p) => ({ ...p, why3: e.target.value }))}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Corrective Action (Aksi Mitigasi)</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Pemberian Pupuk Organik & Extra Dose Pemeliharaan"
                  value={picaFormData.corrective_action}
                  onChange={(e) => setPicaFormData((p) => ({ ...p, corrective_action: e.target.value }))}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsPICAModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#1E293B] hover:bg-slate-100 rounded-md transition-colors cursor-pointer border border-[#E2E8F0] min-h-[40px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#00875A] hover:bg-[#006b47] rounded-md shadow-xs transition-all cursor-pointer min-h-[40px]"
                >
                  Simpan Catatan PICA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal Delete PICA */}
      <ConfirmationModal
        isOpen={Boolean(picaToDelete)}
        title="Hapus Catatan PICA?"
        message={`Apakah Anda yakin ingin menghapus catatan PICA untuk unit "${unitMap.get(picaToDelete?.unit_id)?.nama_unit || ""}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus PICA"
        confirmVariant="danger"
        onConfirm={() => {
          if (picaToDelete) {
            deletePICA(picaToDelete.id);
            setPicaToDelete(null);
          }
        }}
        onCancel={() => setPicaToDelete(null)}
      />
    </div>
  );
}
