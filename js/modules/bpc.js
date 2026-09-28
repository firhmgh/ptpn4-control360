/**
 * PALM-CONTROL360 — Business Planning & Consolidation (BPC) & PICA Module
 * File: js/modules/bpc.js
 * Handles S-Curve 12-Month Progress, Financial Consolidation Matrix, & PICA CRUD Engine
 */

class BPCModule {
  constructor() {
    this.currentRegional = "ALL";
  }

  init(regionalId = "ALL") {
    this.currentRegional = regionalId;
    this.renderKPIs();
    this.renderSCurve();
    this.renderConsolidationMatrix();
    this.renderPICATable();
  }

  renderKPIs() {
    const bpcRkap = window.dbEngine.getBPCRKAP(this.currentRegional);

    const totalRKAP = bpcRkap.reduce((sum, item) => sum + (item.rkap_amount || 0), 0);
    const totalRealisasi = bpcRkap.reduce((sum, item) => sum + (item.realisasi_amount || 0), 0);
    const serapanPct = window.dbEngine.calcSerapan(totalRealisasi, totalRKAP);

    // Calculate SPI average
    let avgSPI = 1.0;
    if (bpcRkap.length > 0) {
      const sumSPI = bpcRkap.reduce((sum, item) => sum + window.dbEngine.calcSPI(item.actual_progress, item.plan_progress), 0);
      avgSPI = sumSPI / bpcRkap.length;
    }

    const elRKAP = document.getElementById("bpc-kpi-rkap");
    const elReal = document.getElementById("bpc-kpi-realisasi");
    const elSerapan = document.getElementById("bpc-kpi-serapan");
    const elSPI = document.getElementById("bpc-kpi-spi");

    if (elRKAP) elRKAP.innerText = "Rp " + totalRKAP.toLocaleString("id-ID");
    if (elReal) elReal.innerText = "Rp " + totalRealisasi.toLocaleString("id-ID");
    if (elSerapan) elSerapan.innerText = serapanPct.toFixed(2) + "%";
    if (elSPI) elSPI.innerText = avgSPI.toFixed(2) + " (On Track)";
  }

  renderSCurve() {
    const bpcRkap = window.dbEngine.getBPCRKAP(this.currentRegional);
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];

    const planProgress = [];
    const actualProgress = [];

    // Group 12 months average for S-Curve
    for (let m = 1; m <= 12; m++) {
      const monthData = bpcRkap.filter(b => b.bulan === m);
      if (monthData.length > 0) {
        const avgPlan = monthData.reduce((s, b) => s + (b.plan_progress || 0), 0) / monthData.length;
        const avgActual = monthData.reduce((s, b) => s + (b.actual_progress || 0), 0) / monthData.length;
        planProgress.push(avgPlan);
        actualProgress.push(avgActual);
      } else {
        // Linear fallback estimation if specific month is missing
        const estPlan = (m / 12) * 75.0;
        const estActual = (m / 12) * 72.98;
        planProgress.push(estPlan);
        actualProgress.push(estActual);
      }
    }

    if (window.chartEngine) {
      window.chartEngine.renderSCurveChart("bpc-scurve-chart", monthLabels, planProgress, actualProgress);
    }
  }

  renderConsolidationMatrix() {
    const tableBody = document.getElementById("bpc-consolidation-tbody");
    if (!tableBody) return;

    const bpcRkap = window.dbEngine.getBPCRKAP(this.currentRegional);
    const units = window.dbEngine.data.ref_units;

    if (bpcRkap.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <p>Tidak ada data konsolidasi untuk regional terpilih.</p>
          </td>
        </tr>`;
      return;
    }

    // Deduplicate or group by unit
    const unitMap = new Map();
    bpcRkap.forEach(item => {
      if (!unitMap.has(item.unit_id)) {
        unitMap.set(item.unit_id, {
          unit_id: item.unit_id,
          rkap_amount: item.rkap_amount,
          realisasi_amount: item.realisasi_amount,
          actual_progress: item.actual_progress
        });
      }
    });

    let html = "";
    unitMap.forEach(record => {
      const unit = units.find(u => u.id === record.unit_id) || { kode_unit: "-", nama_unit: "-" };
      const serapan = window.dbEngine.calcSerapan(record.realisasi_amount, record.rkap_amount);
      const perfBadge = window.dbEngine.getPerformanceBadge(serapan);

      html += `
        <tr>
          <td><strong>${unit.kode_unit}</strong></td>
          <td>${unit.nama_unit}</td>
          <td>Rp ${Number(record.rkap_amount).toLocaleString("id-ID")}</td>
          <td>Rp ${Number(record.realisasi_amount).toLocaleString("id-ID")}</td>
          <td><strong>${serapan.toFixed(2)}%</strong></td>
          <td>${record.actual_progress.toFixed(2)}%</td>
          <td><span class="badge ${perfBadge.css}">${perfBadge.label}</span></td>
        </tr>`;
    });
    tableBody.innerHTML = html;
  }

  renderPICATable() {
    const tableBody = document.getElementById("bpc-pica-tbody");
    if (!tableBody) return;

    const picaList = window.dbEngine.getBPCPICA(this.currentRegional);
    const units = window.dbEngine.data.ref_units;

    if (picaList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <p>Tidak ada data PICA untuk regional terpilih.</p>
          </td>
        </tr>`;
      return;
    }

    let html = "";
    picaList.forEach(pica => {
      const unit = units.find(u => u.id === pica.unit_id) || { nama_unit: "-" };

      let badgeCss = "badge-over";
      if (pica.status_pica === "Completed") badgeCss = "badge-track";
      if (pica.status_pica === "In-Progress") badgeCss = "badge-under";

      html += `
        <tr>
          <td><strong>${unit.nama_unit}</strong></td>
          <td>${pica.why1}</td>
          <td><span class="badge badge-secondary">${pica.why2}</span></td>
          <td>${pica.why3}</td>
          <td><strong>${pica.corrective_action}</strong></td>
          <td><span class="badge ${badgeCss}">${pica.status_pica}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="bpcModule.togglePICAStatus('${pica.id}')">Toggle Status</button>
            <button class="btn btn-danger btn-sm" onclick="bpcModule.deletePICA('${pica.id}')">Hapus</button>
          </td>
        </tr>`;
    });
    tableBody.innerHTML = html;
  }

  // --- Handlers ---
  openAddPICAModal() {
    const unitSelect = document.getElementById("modal-pica-unit");
    if (unitSelect) {
      const units = window.dbEngine.getUnits(this.currentRegional);
      unitSelect.innerHTML = units.map(u =>
        `<option value="${u.id}">${u.kode_unit} - ${u.nama_unit}</option>`
      ).join("");
    }

    document.getElementById("modal-pica-why1").value = "";
    document.getElementById("modal-pica-why2").value = "Tanaman";
    document.getElementById("modal-pica-why3").value = "";
    document.getElementById("modal-pica-ca").value = "";
    document.getElementById("modal-pica").classList.remove("hidden");
  }

  savePICAFromModal() {
    const unit_id = document.getElementById("modal-pica-unit").value;
    const why1 = document.getElementById("modal-pica-why1").value.trim();
    const why2 = document.getElementById("modal-pica-why2").value;
    const why3 = document.getElementById("modal-pica-why3").value.trim();
    const corrective_action = document.getElementById("modal-pica-ca").value.trim();

    if (!unit_id || !why1 || !why3 || !corrective_action) {
      alert("Mohon lengkapi seluruh formulir PICA dengan informasi yang valid.");
      return;
    }

    window.dbEngine.addPICA({
      unit_id,
      why1,
      why2,
      why3,
      corrective_action,
      status_pica: "In-Progress"
    });

    this.closeModal("modal-pica");
    this.init(this.currentRegional);
  }

  togglePICAStatus(id) {
    const pica = window.dbEngine.data.bpc_pica.find(p => p.id === id);
    if (!pica) return;

    const newStatus = pica.status_pica === "Completed" ? "In-Progress" : "Completed";
    window.dbEngine.updatePICAStatus(id, newStatus);
    this.init(this.currentRegional);
  }

  deletePICA(id) {
    if (confirm("Apakah Anda yakin ingin menghapus catatan PICA ini?")) {
      window.dbEngine.deletePICA(id);
      this.init(this.currentRegional);
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("hidden");
  }
}

window.bpcModule = new BPCModule();
