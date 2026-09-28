import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { KPICard } from "../../components/common/KPICard";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Feedback";
import { formatNumber, formatPercent, formatRupiah } from "../../utils/calculations";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  MapPin,
  Sprout,
  Factory,
  Percent,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

export function BWModule() {
  const {
    units,
    allUnits,
    regionals,
    allBpcRkap,
    globalKPIs,
    isETLRunning,
    etlProgressStep,
    lastETLTimestamp,
    runETLSimulation,
    selectedRegional,
  } = useApp();

  // Helper Maps
  const regMap = new Map(regionals.map((r) => [r.id, r]));

  // Table 2.1 Columns: On-Farm & Off-Farm Data Cube
  const dataCubeColumns = [
    {
      header: "Kode Unit",
      accessor: "kode_unit",
      render: (row) => (
        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
          {row.kode_unit}
        </span>
      ),
    },
    {
      header: "Nama Unit Kerja",
      accessor: "nama_unit",
      render: (row) => <span className="font-bold text-slate-800">{row.nama_unit}</span>,
    },
    {
      header: "Jenis Unit",
      accessor: "jenis_unit",
      render: (row) => (
        <Badge variant={row.jenis_unit === "Kebun" ? "success" : "info"}>
          {row.jenis_unit}
        </Badge>
      ),
    },
    {
      header: "Regional",
      accessor: "regional_id",
      exportValue: (row) => regMap.get(row.regional_id)?.kode_regional || "-",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-emerald-800">
          {regMap.get(row.regional_id)?.kode_regional || "-"}
        </span>
      ),
    },
    {
      header: "Luas Area (Ha)",
      accessor: "luas_area",
      exportValue: (row) => row.luas_area,
      render: (row) => (
        <span className="font-mono text-slate-700">
          {row.luas_area > 0 ? `${formatNumber(row.luas_area)} Ha` : "-"}
        </span>
      ),
    },
    {
      header: "Produksi TBS (Ton)",
      accessor: "produksi_tbs",
      exportValue: (row) => row.produksi_tbs,
      render: (row) => (
        <span className="font-mono font-medium text-slate-700">
          {formatNumber(row.produksi_tbs)} Ton
        </span>
      ),
    },
    {
      header: "Produksi CPO (Ton)",
      accessor: "produksi_cpo",
      exportValue: (row) => row.produksi_cpo,
      render: (row) => (
        <span className="font-mono font-bold text-emerald-700">
          {formatNumber(row.produksi_cpo)} Ton
        </span>
      ),
    },
    {
      header: "Rendemen CPO",
      accessor: "rendemen_cpo",
      exportValue: (row) => `${row.rendemen_cpo.toFixed(2)}%`,
      render: (row) => (
        <span
          className="font-mono font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs cursor-default"
          title={`Rendemen CPO = (Prod. CPO / Prod. TBS) × 100 = (${row.produksi_cpo} / ${row.produksi_tbs}) × 100 = ${row.rendemen_cpo}%`}
        >
          {formatPercent(row.rendemen_cpo)}
        </span>
      ),
    },
  ];

  // Feature 2.3: Executive Regional Performance Analytics (Recharts Bar Chart)
  const regionalChartData = useMemo(() => {
    let targetRegionals = regionals;
    if (selectedRegional !== "ALL") {
      targetRegionals = regionals.filter((r) => r.id === selectedRegional);
    }

    return targetRegionals.map((reg) => {
      const regUnitIds = new Set(allUnits.filter((u) => u.regional_id === reg.id).map((u) => u.id));
      const regBpc = allBpcRkap.filter((b) => regUnitIds.has(b.unit_id));

      const sumPlan = regBpc.reduce((acc, b) => acc + (b.rkap_amount || 0), 0);
      const sumActual = regBpc.reduce((acc, b) => acc + (b.realisasi_amount || 0), 0);

      return {
        name: reg.kode_regional,
        fullName: reg.nama_regional,
        rkap: sumPlan,
        realisasi: sumActual,
        rkapMilyar: Number((sumPlan / 1e9).toFixed(2)),
        realisasiMilyar: Number((sumActual / 1e9).toFixed(2)),
      };
    });
  }, [regionals, selectedRegional, allUnits, allBpcRkap]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header Overview (Palmvest360 / MyPalm Command Center) */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A389] inline-block flex-shrink-0"></span>
              <span>Modul Business Warehouse (BW) &amp; Analytics</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
              Simulasi Pipeline ETL, On-Farm &amp; Off-Farm Data Cube, dan agregasi analytics lintas regional.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <span
              className="text-xs px-2.5 py-1 rounded-md bg-teal-50 text-[#00A389] font-semibold border border-teal-200 flex items-center gap-1.5 cursor-default whitespace-nowrap text-[11px] sm:text-xs"
              title="Rendemen CPO = (Produksi CPO / Produksi TBS) × 100. Standar 23,94% sebagai indikator berbasis sumber audit."
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00A389] flex-shrink-0" />
              Rendemen Standar: 23,94% (Audit)
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-md bg-[#F8FAFC] text-[#1E293B] font-semibold border border-[#E2E8F0] flex items-center gap-1.5 cursor-default whitespace-nowrap text-[11px] sm:text-xs"
              title="Cash Cost Standar: Rp 4.469/Kg sebagai indikator berbasis sumber audit."
            >
              <Sparkles className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />
              Cash Cost: Rp 4.469/Kg (Audit)
            </span>
          </div>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title="Luas Area Kebun"
          value={`${formatNumber(globalKPIs.totalLuas)} Ha`}
          subtext="Total luasan tanaman [DATA SIMULASI/DEMO]"
          icon={MapPin}
          color="emerald"
        />
        <KPICard
          title="Produksi TBS"
          value={`${formatNumber(globalKPIs.totalTBS)} Ton`}
          subtext="Total panen tandan buah [DATA SIMULASI/DEMO]"
          icon={Sprout}
          color="teal"
        />
        <KPICard
          title="Produksi CPO Pabrik"
          value={`${formatNumber(globalKPIs.totalCPO)} Ton`}
          subtext="Total olahan minyak mentah [DATA SIMULASI/DEMO]"
          icon={Factory}
          color="amber"
        />
        <KPICard
          title="Rata-Rata Rendemen CPO"
          value={formatPercent(globalKPIs.avgRendemen)}
          subtext="Ekstraksi minyak (Indikator Audit: 23,94%)"
          icon={Percent}
          color="blue"
          badge={
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Indikator Audit
            </span>
          }
        />
      </div>

      {/* 3. Feature 2.1 & 2.2: Automated Data ETL Simulator & Data Cube */}
      <div className="space-y-4">
        <div className="bg-[#1E293B] text-white rounded-lg p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-md bg-[#00A389]/20 text-[#00A389] border border-[#00A389]/40 flex items-center justify-center shrink-0">
              <Cpu className={`w-5 h-5 ${isETLRunning ? "animate-spin text-teal-300" : ""}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Simulasi Pipeline ETL Data Warehouse
                </h4>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-teal-400/20 text-[#00A389] border border-teal-400/30">
                  DATA SIMULASI / DEMO
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                {isETLRunning ? (
                  <span className="text-amber-300 font-semibold animate-pulse">
                    {etlProgressStep}
                  </span>
                ) : (
                  <span>
                    Status Pipeline Simulator (Tanpa Live SAP/DB): Terakhir dijalankan{" "}
                    <strong className="text-white font-medium">{lastETLTimestamp}</strong>
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={runETLSimulation}
            disabled={isETLRunning}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#00A389] hover:bg-[#00875A] rounded-md shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <RefreshCw className={`w-4 h-4 ${isETLRunning ? "animate-spin" : ""}`} />
            <span>{isETLRunning ? "Pipeline Berjalan..." : "Run Simulasi Pipeline ETL"}</span>
          </button>
        </div>

        {/* Data Cube Table */}
        <DataTable
          title="On-Farm & Off-Farm Data Cube Aggregations"
          subtitle="Tabel agregasi dimensi fisik kebun dan PKS per regional [DATA SIMULASI/DEMO — Bukan Data Produksi Aktual]"
          columns={dataCubeColumns}
          data={units}
          searchPlaceholder="Cari kebun, PKS, atau regional..."
          searchKeys={["nama_unit", "kode_unit", "jenis_unit"]}
          exportFilename="OnFarm_OffFarm_DataCube_Export.csv"
        />
      </div>

      {/* 4. Feature 2.3: Executive Regional Performance Analytics */}
      <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E2E8F0] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00A389]" />
                Executive Regional Performance Analytics
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-slate-100 text-[#1E293B] border border-slate-200">
                Seed Utama R1–R5
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">
              Komparasi alokasi RKAP Replanting vs Realisasi Replanting antar Regional operasional prototype (Nilai dalam Miliar Rupiah)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#00A389] inline-block"></span>
              <span className="text-[#64748B] text-[11px]">RKAP Plan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#00875A] inline-block"></span>
              <span className="text-[#1E293B] text-[11px]">Realisasi Aktual</span>
            </div>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={regionalChartData}
              margin={{ top: 15, right: 20, left: 0, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(val) => `${val}M`}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
              />
              <Tooltip
                formatter={(val, name) => [
                  `Rp ${Number(val).toLocaleString("id-ID")} Miliar`,
                  name === "rkapMilyar" ? "RKAP Plan" : "Realisasi Aktual",
                ]}
                labelFormatter={(lbl) => {
                  const reg = regionalChartData.find((r) => r.name === lbl);
                  return `${lbl} — ${reg?.fullName || ""}`;
                }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#E2E8F0",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  fontSize: "12px",
                }}
              />
              <Legend
                formatter={(val) => (val === "rkapMilyar" ? "RKAP Plan" : "Realisasi Aktual")}
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
              <Bar dataKey="rkapMilyar" name="rkapMilyar" fill="#00A389" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="realisasiMilyar" name="realisasiMilyar" fill="#00875A" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
