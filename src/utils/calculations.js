/**
 * PALM-CONTROL360 — PRD Calculations & Mathematical Helpers
 * All formulas align strictly with PRD FINAL TERKUNCI specifications.
 *
 * ─── VERIFIED FORMULAS ───────────────────────────────────────────────────────
 * Variance Amount = Realisasi - RKAP
 * Variance %      = ((Realisasi - RKAP) / RKAP) × 100
 * Over Budget     = Variance% > +10%
 * On Track        = -10% ≤ Variance% ≤ +10%
 * Under Budget    = Variance% < -10%
 *
 * Serapan Biaya   = (Realisasi / RKAP) × 100
 * SPI             = Actual Progress / Plan Progress
 * Rendemen CPO    = (Produksi CPO / Produksi TBS) × 100
 *
 * ─── PERFORMANCE CLASSIFICATION (PRD) ───────────────────────────────────────
 * Emas  (Kelas A): > 92% s/d 100%   (exclusive lower: score > 92)
 * Hijau (Kelas B): > 87% s/d 92%    (exclusive lower: score > 87 AND score <= 92)
 * Merah (Kelas C): 82% s/d 87%      (inclusive lower: score >= 82 AND score <= 87)
 * Hitam (Kelas D): < 82%            (score < 82)
 */

/**
 * Serapan Biaya Formula: (Realisasi / RKAP) × 100
 */
export function calcSerapan(realisasi, rkap) {
  if (!rkap || rkap <= 0) return 0;
  const pct = ((realisasi || 0) / rkap) * 100;
  return Math.min(pct, 999); // safety cap
}

/**
 * Variance Amount: Realisasi - RKAP
 */
export function calcVarianceAmount(realisasi, rkap) {
  return (realisasi || 0) - (rkap || 0);
}

/**
 * Variance Percentage: ((Realisasi - RKAP) / RKAP) × 100
 */
export function calcVariancePct(realisasi, rkap) {
  if (!rkap || rkap <= 0) return 0;
  return (((realisasi || 0) - rkap) / rkap) * 100;
}

/**
 * Budget Status:
 * Over Budget  = Variance% > +10%
 * Under Budget = Variance% < -10%
 * On Track     = -10% ≤ Variance% ≤ +10%
 */
export function getBudgetStatus(variancePct) {
  if (variancePct > 10) return "Over Budget";
  if (variancePct < -10) return "Under Budget";
  return "On Track";
}

/**
 * Schedule Performance Index (SPI): Actual Progress / Plan Progress
 */
export function calcSPI(actualProgress, planProgress) {
  if (!planProgress || planProgress <= 0) return 1.0;
  return (actualProgress || 0) / planProgress;
}

/**
 * Rendemen CPO: (Produksi CPO / Produksi TBS) × 100
 */
export function calcRendemen(produksiCPO, produksiTBS) {
  if (!produksiTBS || produksiTBS <= 0) return 0;
  return (produksiCPO / produksiTBS) * 100;
}

/**
 * Performance Badge Classification (Explicit PRD boundary implementation):
 * Emas  (Kelas A): score >  92  (exclusive: 92.01% - 100%)
 * Hijau (Kelas B): score >  87 AND score <= 92 (87.01% - 92%)
 * Merah (Kelas C): score >= 82 AND score <= 87 (82% - 87%)
 * Hitam (Kelas D): score <  82  (< 82%)
 *
 * Note: Boundary values 92.00 → Hijau (not Emas), 87.00 → Merah (not Hijau), 82.00 → Merah (not Hitam)
 */
export function getPerformanceBadge(scorePct) {
  const score = Number(scorePct) || 0;

  if (score > 92) {
    return {
      code: "GOLD",
      label: "Emas (Kelas A)",
      shortLabel: "Emas",
      bg: "bg-[#FEF3C7] text-[#92400E] border-[#FDE047]",
      pill: "bg-[#FEF3C7] text-[#92400E] border border-[#FDE047]",
      dot: "bg-[#F5A623]",
      badgeColor: "#F5A623"
    };
  }
  if (score > 87) {
    return {
      code: "GREEN",
      label: "Hijau (Kelas B)",
      shortLabel: "Hijau",
      bg: "bg-[#D1FAE5] text-[#065F46] border-[#86EFAC]",
      pill: "bg-[#D1FAE5] text-[#065F46] border border-[#86EFAC]",
      dot: "bg-[#00875A]",
      badgeColor: "#00875A"
    };
  }
  if (score >= 82) {
    return {
      code: "RED",
      label: "Merah (Kelas C)",
      shortLabel: "Merah",
      bg: "bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]",
      pill: "bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]",
      dot: "bg-rose-500",
      badgeColor: "#EF4444"
    };
  }
  return {
    code: "BLACK",
    label: "Hitam (Kelas D)",
    shortLabel: "Hitam",
    bg: "bg-[#1E293B] text-white border-slate-700",
    pill: "bg-[#1E293B] text-white border border-slate-700",
    dot: "bg-slate-400",
    badgeColor: "#1E293B"
  };
}

/**
 * Format currency to Rupiah string (Indonesian locale)
 */
export function formatRupiah(amount, abbreviated = false) {
  const val = Math.round(Number(amount) || 0);
  if (abbreviated) {
    if (Math.abs(val) >= 1e12) return `Rp ${(val / 1e12).toFixed(2)} T`;
    if (Math.abs(val) >= 1e9)  return `Rp ${(val / 1e9).toFixed(2)} M`;
    if (Math.abs(val) >= 1e6)  return `Rp ${(val / 1e6).toFixed(1)} Jt`;
  }
  return "Rp " + val.toLocaleString("id-ID");
}

/**
 * Format standard number with thousand separator (Indonesian locale)
 */
export function formatNumber(val, decimals = 0) {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format percentage string (Indonesian locale)
 */
export function formatPercent(val, decimals = 2) {
  if (val === undefined || val === null || isNaN(val)) return "0,00%";
  return Number(val).toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + "%";
}

/**
 * Export tabular data to CSV file with UTF-8 BOM (Excel compatible)
 */
export function exportToCSV(filename, headers, rows) {
  if (!rows || rows.length === 0) {
    alert("Tidak ada data untuk di-export. Pastikan tabel memiliki data sebelum mengekspor.");
    return false;
  }

  const csvRows = [];
  csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(","));
  rows.forEach(row => {
    csvRows.push(row.map(col => `"${String(col ?? "").replace(/"/g, '""')}"`).join(","));
  });

  const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Deterministic S-Curve Generator (Jan-Des 12 months)
 *
 * NOTE: This function generates a DEMO/SIMULASI S-Curve using a cosine-based
 * sigmoid function anchored to PRD baseline targets. It does NOT represent
 * actual monthly transaction data from PTPN IV internal systems.
 *
 * PRD Baseline Anchors:
 * - Plan  target: 75.00% cumulative by December
 * - Actual target: 72.98% cumulative by December
 */
export function generateDeterministicSCurve(bpcRkapList) {
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  const monthlyData = [];

  for (let m = 1; m <= 12; m++) {
    const records = bpcRkapList.filter(item => item.bulan === m);

    if (records.length > 0) {
      // Use real data-derived progress values
      const avgPlan = records.reduce((s, r) => s + (r.plan_progress || 0), 0) / records.length;
      const avgActual = records.reduce((s, r) => s + (r.actual_progress || 0), 0) / records.length;
      monthlyData.push({
        month: monthLabels[m - 1],
        monthIndex: m,
        plan: Number(avgPlan.toFixed(2)),
        actual: Number(avgActual.toFixed(2)),
        isSimulated: false
      });
    } else {
      // Deterministic sigmoid S-Curve from baseline — explicitly marked SIMULASI
      const t = m / 12;
      // Cosine-based smooth S-curve approximation
      const factor = (1 - Math.cos(t * Math.PI)) / 2;
      const simPlan = Number((factor * 75.0).toFixed(2));
      const simActual = Number((factor * 72.98).toFixed(2));
      monthlyData.push({
        month: monthLabels[m - 1],
        monthIndex: m,
        plan: simPlan,
        actual: simActual,
        isSimulated: true   // ← SIMULASI: Not real PTPN IV monthly data
      });
    }
  }

  return monthlyData;
}
