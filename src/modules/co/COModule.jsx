import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { KPICard } from "../../components/common/KPICard";
import { DataTable } from "../../components/common/DataTable";
import { Badge, ConfirmationModal } from "../../components/common/Feedback";
import {
  calcVarianceAmount,
  calcVariancePct,
  getBudgetStatus,
  formatRupiah,
  formatPercent,
} from "../../utils/calculations";
import {
  Link2,
  Layers,
  ReceiptText,
  AlertOctagon,
  PlusCircle,
  X,
  FileSpreadsheet,
  Edit2,
  Trash2,
} from "lucide-react";

export function COModule() {
  const {
    glAccounts,
    costCenters,
    coMappings,
    allCOMappings,
    coTransactions,
    bpcRkap,
    units,
    globalKPIs,
    addCOMapping,
    updateCOMapping,
    deleteCOMapping,
    addCOTransaction,
  } = useApp();

  // Modal State for GL Mapping CRUD
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);
  const [mapFormData, setMapFormData] = useState({ gl_id: "", cost_center_id: "", alokasi_pct: 100 });

  // Delete Confirmation State
  const [mappingToDelete, setMappingToDelete] = useState(null);

  // Form State for Transaction Entry
  const [trxFormData, setTrxFormData] = useState({
    mapping_id: "",
    periode: "2026-08",
    nominal_biaya: "",
    keterangan: "",
  });

  // Calculate Over Budget Cost Centers Count
  const overBudgetUnitsCount = bpcRkap.filter((item) => {
    const vPct = calcVariancePct(item.realisasi_amount, item.rkap_amount);
    return getBudgetStatus(vPct) === "Over Budget";
  }).length;

  // Handle Mapping Modal Open (Add or Edit)
  const handleOpenAddMapping = () => {
    setEditingMapping(null);
    setMapFormData({
      gl_id: glAccounts[0]?.id || "",
      cost_center_id: costCenters[0]?.id || "",
      alokasi_pct: 100,
    });
    setIsMappingModalOpen(true);
  };

  const handleOpenEditMapping = (mapping) => {
    setEditingMapping(mapping);
    setMapFormData({
      gl_id: mapping.gl_id,
      cost_center_id: mapping.cost_center_id,
      alokasi_pct: mapping.alokasi_pct,
    });
    setIsMappingModalOpen(true);
  };

  const handleSaveMapping = (e) => {
    e.preventDefault();
    if (!mapFormData.gl_id || !mapFormData.cost_center_id || !mapFormData.alokasi_pct) return;

    if (editingMapping) {
      updateCOMapping(editingMapping.id, mapFormData);
    } else {
      addCOMapping(mapFormData);
    }
    setIsMappingModalOpen(false);
  };

  // Handle Transaction Submit
  const handleTrxSubmit = (e) => {
    e.preventDefault();
    if (!trxFormData.mapping_id || !trxFormData.periode || !trxFormData.nominal_biaya) return;

    addCOTransaction({
      mapping_id: trxFormData.mapping_id,
      periode: trxFormData.periode,
      nominal_biaya: Number(trxFormData.nominal_biaya),
      keterangan: trxFormData.keterangan || "Alokasi Operasional",
    });

    setTrxFormData({
      mapping_id: trxFormData.mapping_id,
      periode: "2026-08",
      nominal_biaya: "",
      keterangan: "",
    });
  };

  // Helper Maps for quick lookups
  const glMap = new Map(glAccounts.map((g) => [g.id, g]));
  const ccMap = new Map(costCenters.map((c) => [c.id, c]));
  const unitMap = new Map(units.map((u) => [u.id, u]));

  // Table 1.1 Columns: GL Mapping
  const mappingColumns = [
    {
      header: "Kode GL",
      accessor: "gl_id",
      exportValue: (row) => glMap.get(row.gl_id)?.gl_code || "-",
      render: (row) => (
        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {glMap.get(row.gl_id)?.gl_code || "-"}
        </span>
      ),
    },
    {
      header: "Nama GL Account",
      accessor: "gl_id",
      exportValue: (row) => glMap.get(row.gl_id)?.gl_name || "-",
      render: (row) => <span className="font-medium text-slate-800">{glMap.get(row.gl_id)?.gl_name || "-"}</span>,
    },
    {
      header: "Cost Center",
      accessor: "cost_center_id",
      exportValue: (row) => ccMap.get(row.cost_center_id)?.cost_center_code || "-",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {ccMap.get(row.cost_center_id)?.cost_center_code || "-"}
        </span>
      ),
    },
    {
      header: "Unit Kebun/PKS",
      accessor: (row) => {
        const cc = ccMap.get(row.cost_center_id);
        const unit = cc ? unitMap.get(cc.unit_id) : null;
        return unit?.nama_unit || "-";
      },
    },
    {
      header: "Alokasi",
      accessor: "alokasi_pct",
      exportValue: (row) => `${row.alokasi_pct}%`,
      render: (row) => (
        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full text-xs">
          {row.alokasi_pct}%
        </span>
      ),
    },
    {
      header: "Aksi",
      className: "text-right",
      cellClassName: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEditMapping(row)}
            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Mapping"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setMappingToDelete(row)}
            className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Hapus Mapping"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Table 1.2 Columns: Transaction Ledger
  const trxColumns = [
    {
      header: "Periode",
      accessor: "periode",
      render: (row) => <span className="font-mono font-medium text-slate-600">{row.periode}</span>,
    },
    {
      header: "Aliran Biaya (GL → Cost Center)",
      accessor: "mapping_id",
      exportValue: (row) => {
        const map = allCOMappings.find((m) => m.id === row.mapping_id);
        const gl = map ? glMap.get(map.gl_id) : null;
        const cc = map ? ccMap.get(map.cost_center_id) : null;
        return `${gl?.gl_code || "-"} -> ${cc?.cost_center_code || "-"}`;
      },
      render: (row) => {
        const map = allCOMappings.find((m) => m.id === row.mapping_id);
        const gl = map ? glMap.get(map.gl_id) : null;
        const cc = map ? ccMap.get(map.cost_center_id) : null;
        return (
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="font-bold text-slate-800">{gl?.gl_code || "-"}</span>
            <span className="text-slate-400">→</span>
            <span className="text-emerald-700 font-semibold">{cc?.cost_center_code || "-"}</span>
          </div>
        );
      },
    },
    {
      header: "Nominal Biaya",
      accessor: "nominal_biaya",
      exportValue: (row) => row.nominal_biaya,
      render: (row) => (
        <span className="font-mono font-bold text-slate-900">{formatRupiah(row.nominal_biaya)}</span>
      ),
    },
    {
      header: "Keterangan",
      accessor: "keterangan",
      render: (row) => <span className="text-slate-600 text-xs">{row.keterangan || "-"}</span>,
    },
    {
      header: "Status",
      accessor: () => "Validated",
      render: () => <Badge variant="success">Validated</Badge>,
    },
  ];

  // Table 1.3 Columns: Cost Center Variance Matrix
  const varianceMatrixData = bpcRkap.map((item) => {
    const unit = unitMap.get(item.unit_id);
    const cc = costCenters.find((c) => c.unit_id === item.unit_id);
    const varAmt = calcVarianceAmount(item.realisasi_amount, item.rkap_amount);
    const varPct = calcVariancePct(item.realisasi_amount, item.rkap_amount);
    const status = getBudgetStatus(varPct);

    return {
      id: item.id,
      unit_name: unit?.nama_unit || "-",
      cost_center_code: cc?.cost_center_code || "-",
      rkap_amount: item.rkap_amount,
      realisasi_amount: item.realisasi_amount,
      variance_amount: varAmt,
      variance_pct: varPct,
      status,
    };
  });

  const varianceColumns = [
    {
      header: "Unit Kerja",
      accessor: "unit_name",
      render: (row) => <span className="font-bold text-slate-800">{row.unit_name}</span>,
    },
    {
      header: "Cost Center",
      accessor: "cost_center_code",
      render: (row) => (
        <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {row.cost_center_code}
        </span>
      ),
    },
    {
      header: "RKAP Biaya",
      accessor: "rkap_amount",
      exportValue: (row) => row.rkap_amount,
      render: (row) => <span className="font-mono text-slate-700">{formatRupiah(row.rkap_amount)}</span>,
    },
    {
      header: "Realisasi Biaya",
      accessor: "realisasi_amount",
      exportValue: (row) => row.realisasi_amount,
      render: (row) => (
        <span className="font-mono font-bold text-slate-900">{formatRupiah(row.realisasi_amount)}</span>
      ),
    },
    {
      header: "Variance (Rp)",
      accessor: "variance_amount",
      exportValue: (row) => row.variance_amount,
      render: (row) => {
        const isNeg = row.variance_amount < 0;
        return (
          <span className={`font-mono text-xs font-semibold ${isNeg ? "text-emerald-700" : "text-rose-700"}`}>
            {isNeg ? "-" : "+"}{formatRupiah(Math.abs(row.variance_amount))}
          </span>
        );
      },
    },
    {
      header: "Variance (%)",
      accessor: "variance_pct",
      exportValue: (row) => `${row.variance_pct.toFixed(2)}%`,
      render: (row) => {
        const isNeg = row.variance_pct < 0;
        return (
          <span className={`font-mono font-bold text-xs ${isNeg ? "text-emerald-700" : "text-rose-700"}`}>
            {row.variance_pct > 0 ? "+" : ""}{row.variance_pct.toFixed(2)}%
          </span>
        );
      },
    },
    {
      header: "Status Budget",
      accessor: "status",
      render: (row) => {
        if (row.status === "Over Budget") return <Badge variant="danger">Over Budget</Badge>;
        if (row.status === "Under Budget") return <Badge variant="info">Under Budget</Badge>;
        return <Badge variant="success">On Track</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header & Module Overview (Palmvest360 / MyPalm Command Center) */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] inline-block flex-shrink-0"></span>
              <span>Modul Corporate Controlling (CO)</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
              Pemetaan General Ledger, pencatatan transaksi alokasi biaya, dan evaluasi varians cost center.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs px-2.5 py-1 rounded-md bg-[#FEF3C7] text-[#92400E] font-semibold border border-[#FDE047] whitespace-nowrap text-[11px] sm:text-xs">
              DATA SIMULASI / DEMO
            </span>
          </div>
        </div>

        {/* Legend status varians anggaran operasional */}
        <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2 text-[11px]">
          <span className="font-semibold text-[#64748B] uppercase tracking-wider text-[10px] mr-1">
            Status Varians Anggaran:
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5] font-semibold">
            Over Budget (&gt; +10%)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] border border-[#86EFAC] font-semibold">
            On Track (-10% s.d. +10%)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
            Under Budget (&lt; -10%)
          </span>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title="GL Accounts Mapped"
          value={globalKPIs.mappedGLCount}
          subtext="Akun GL dialokasikan [DATA SIMULASI/DEMO]"
          icon={Link2}
          color="emerald"
        />
        <KPICard
          title="Cost Center Aktif"
          value={globalKPIs.activeCostCentersCount}
          subtext="Unit Kebun dan PKS [DATA SIMULASI/DEMO]"
          icon={Layers}
          color="teal"
        />
        <KPICard
          title="Total Transaksi Biaya"
          value={formatRupiah(globalKPIs.totalTrxNominal)}
          subtext="Nominal tercatat [DATA SIMULASI/DEMO]"
          icon={ReceiptText}
          color="blue"
        />
        <KPICard
          title="Status Over Budget"
          value={`${overBudgetUnitsCount} Unit`}
          subtext="Deviasi realisasi biaya > +10%"
          icon={AlertOctagon}
          color={overBudgetUnitsCount > 0 ? "rose" : "emerald"}
          badge={
            overBudgetUnitsCount > 0 ? (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                Perhatian
              </span>
            ) : (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Aman
              </span>
            )
          }
        />
      </div>

      {/* 3. Feature 1.1: Master Mapping GL Account to Cost Center */}
      <DataTable
        title="Master Pemetaan GL Account ke Cost Center"
        subtitle="Alokasi bagan akun GL ke unit cost center kerja [DATA SIMULASI/DEMO — Tanpa Koneksi Live SAP/ERP]"
        columns={mappingColumns}
        data={coMappings}
        searchPlaceholder="Cari GL atau Cost Center..."
        searchKeys={["gl_id", "cost_center_id"]}
        exportFilename="GL_CostCenter_Mappings_Export.csv"
        actionButtons={
          <button
            onClick={handleOpenAddMapping}
            className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-white bg-[#00875A] hover:bg-[#006b47] rounded-md shadow-xs transition-all cursor-pointer min-h-[38px] sm:min-h-[32px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tambah Pemetaan</span>
          </button>
        }
      />

      {/* 4. Feature 1.2: Transaction Ledger & Form Alokasi Biaya */}
      <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E2E8F0] p-4 sm:p-5 space-y-4">
        <div className="border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#00875A] flex-shrink-0" />
              Form Pencatatan Transaction Ledger &amp; Cost Allocation
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-slate-100 text-[#1E293B] border border-slate-200">
              SIMULASI LEDGER
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">
            Catat pembebanan biaya langsung maupun alokasi pabrik ke ledger cost center [DATA SIMULASI/DEMO].
          </p>
        </div>

        <form onSubmit={handleTrxSubmit} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Pilih Pemetaan GL &rarr; CC</label>
            <select
              value={trxFormData.mapping_id}
              onChange={(e) => setTrxFormData((p) => ({ ...p, mapping_id: e.target.value }))}
              required
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
            >
              <option value="">-- Pilih Pemetaan --</option>
              {coMappings.map((m) => {
                const gl = glMap.get(m.gl_id);
                const cc = ccMap.get(m.cost_center_id);
                return (
                  <option key={m.id} value={m.id}>
                    [{gl?.gl_code || "-"}] → {cc?.cost_center_code || "-"} ({m.alokasi_pct}%)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Periode Transaksi</label>
            <input
              type="month"
              value={trxFormData.periode}
              onChange={(e) => setTrxFormData((p) => ({ ...p, periode: e.target.value }))}
              required
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Nominal Biaya (Rp)</label>
            <input
              type="number"
              min="1"
              step="1000"
              placeholder="Contoh: 350000000"
              value={trxFormData.nominal_biaya}
              onChange={(e) => setTrxFormData((p) => ({ ...p, nominal_biaya: e.target.value }))}
              required
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Keterangan Biaya</label>
            <input
              type="text"
              placeholder="Contoh: Pemupukan Tambahan Blok A"
              value={trxFormData.keterangan}
              onChange={(e) => setTrxFormData((p) => ({ ...p, keterangan: e.target.value }))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full text-xs font-bold text-white bg-[#00875A] hover:bg-[#006b47] py-2.5 px-4 rounded-md shadow-xs transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5"
            >
              + Simpan Transaksi
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <DataTable
            title="Riwayat Alokasi Biaya (Transaction Ledger)"
            subtitle="Daftar transaksi biaya operasional per unit cost center"
            columns={trxColumns}
            data={coTransactions}
            searchPlaceholder="Cari transaksi atau keterangan..."
            searchKeys={["keterangan", "periode"]}
            exportFilename="CO_Transaction_Ledger_Export.csv"
            pageSize={5}
          />
        </div>
      </div>

      {/* 5. Feature 1.3: Cost Center Variance Matrix */}
      <DataTable
        title="Cost Center Variance Matrix"
        subtitle="Analisis deviasi serapan biaya aktual terhadap plafon anggaran [DATA SIMULASI/DEMO]"
        columns={varianceColumns}
        data={varianceMatrixData}
        searchPlaceholder="Cari unit atau cost center..."
        searchKeys={["unit_name", "cost_center_code", "status"]}
        exportFilename="CostCenter_Variance_Matrix_Export.csv"
      />

      {/* Modal CRUD GL Mapping */}
      {isMappingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingMapping ? "Edit Pemetaan GL to Cost Center" : "Tambah Pemetaan GL to Cost Center"}
              </h3>
              <button
                onClick={() => setIsMappingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMapping} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">General Ledger (GL Account)</label>
                <select
                  value={mapFormData.gl_id}
                  onChange={(e) => setMapFormData((p) => ({ ...p, gl_id: e.target.value }))}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                >
                  {glAccounts.map((gl) => (
                    <option key={gl.id} value={gl.id}>
                      [{gl.gl_code}] {gl.gl_name} ({gl.kategori_biaya})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Cost Center Target</label>
                <select
                  value={mapFormData.cost_center_id}
                  onChange={(e) => setMapFormData((p) => ({ ...p, cost_center_id: e.target.value }))}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                >
                  {costCenters.map((cc) => (
                    <option key={cc.id} value={cc.id}>
                      {cc.cost_center_code} — {cc.cost_center_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Persentase Alokasi (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={mapFormData.alokasi_pct}
                  onChange={(e) => setMapFormData((p) => ({ ...p, alokasi_pct: e.target.value }))}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsMappingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#1E293B] hover:bg-slate-100 rounded-md transition-colors cursor-pointer border border-[#E2E8F0] min-h-[40px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#00875A] hover:bg-[#006b47] rounded-md shadow-xs transition-all cursor-pointer min-h-[40px]"
                >
                  Simpan Pemetaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal Delete */}
      <ConfirmationModal
        isOpen={Boolean(mappingToDelete)}
        title="Hapus Pemetaan GL?"
        message={`Apakah Anda yakin ingin menghapus pemetaan akun GL ini? Semua riwayat transaksi yang terkait dengan pemetaan ini juga akan dibersihkan dari ledger.`}
        confirmText="Hapus Pemetaan"
        confirmVariant="danger"
        onConfirm={() => {
          if (mappingToDelete) {
            deleteCOMapping(mappingToDelete.id);
            setMappingToDelete(null);
          }
        }}
        onCancel={() => setMappingToDelete(null)}
      />
    </div>
  );
}
