/**
 * PALM-CONTROL360 — Business Warehouse (BW) Module
 * File: js/modules/bw.js
 * Handles ETL Simulator, Data Cube Aggregations, & Executive Regional Analytics Chart
 */

class BWModule {
  constructor() {
    this.currentRegional = "ALL";
  }

  init(regionalId = "ALL") {
    this.currentRegional = regionalId;
    this.renderKPIs();
    this.renderDataCubeTable();
    this.renderRegionalChart();
  }

  renderKPIs() {
    const units = window.dbEngine.getUnits(this.currentRegional);

    const totalLuas = units.reduce((sum, u) => sum + (u.luas_area || 0), 0);
    const totalTBS = units.reduce((sum, u) => sum + (u.produksi_tbs || 0), 0);
    const totalCPO = units.reduce((sum, u) => sum + (u.produksi_cpo || 0), 0);
    
    const avgRendemen = units.length > 0 
      ? (units.reduce((sum, u) => sum + (u.rendemen_cpo || 23.94), 0) / units.length)
      : 23.94;

    const elLuas = document.getElementById("bw-kpi-luas");
    const elTBS = document.getElementById("bw-kpi-tbs");
    const elCPO = document.getElementById("bw-kpi-cpo");
    const elRendemen = document.getElementById("bw-kpi-rendemen");

    if (elLuas) elLuas.innerText = totalLuas.toLocaleString("id-ID") + " Ha";
    if (elTBS) elTBS.innerText = totalTBS.toLocaleString("id-ID") + " Ton";
    if (elCPO) elCPO.innerText = totalCPO.toLocaleString("id-ID") + " Ton";
    if (elRendemen) elRendemen.innerText = avgRendemen.toFixed(2) + "%";
  }

  renderDataCubeTable() {
    const tableBody = document.getElementById("bw-datacube-tbody");
    if (!tableBody) return;

    const units = window.dbEngine.getUnits(this.currentRegional);
    const regionals = window.dbEngine.data.ref_regional;

    if (units.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <p>Tidak ada data unit operasional untuk regional terpilih.</p>
          </td>
        </tr>`;
      return;
    }

    let html = "";
    units.forEach(unit => {
      const reg = regionals.find(r => r.id === unit.regional_id) || { kode_regional: "-" };

      html += `
        <tr>
          <td><strong>${unit.kode_unit}</strong></td>
          <td>${unit.nama_unit}</td>
          <td><span class="badge ${unit.jenis_unit === 'Kebun' ? 'badge-track' : 'badge-under'}">${unit.jenis_unit}</span></td>
          <td><code>${reg.kode_regional}</code></td>
          <td>${Number(unit.luas_area).toLocaleString("id-ID")} Ha</td>
          <td>${Number(unit.produksi_tbs).toLocaleString("id-ID")} Ton</td>
          <td><strong>${Number(unit.produksi_cpo).toLocaleString("id-ID")} Ton</strong></td>
        </tr>`;
    });
    tableBody.innerHTML = html;
  }

  renderRegionalChart() {
    const regionals = window.dbEngine.data.ref_regional;
    const bpcRkap = window.dbEngine.data.bpc_rkap;
    const units = window.dbEngine.data.ref_units;

    let targetRegionals = regionals;
    if (this.currentRegional !== "ALL") {
      targetRegionals = regionals.filter(r => r.id === this.currentRegional);
    }

    const labels = [];
    const planData = [];
    const actualData = [];

    targetRegionals.forEach(reg => {
      labels.push(reg.kode_regional);

      const regUnitIds = new Set(units.filter(u => u.regional_id === reg.id).map(u => u.id));
      const regBpc = bpcRkap.filter(b => regUnitIds.has(b.unit_id));

      const sumPlan = regBpc.reduce((s, b) => s + (b.rkap_amount || 0), 0);
      const sumActual = regBpc.reduce((s, b) => s + (b.realisasi_amount || 0), 0);

      planData.push(sumPlan);
      actualData.push(sumActual);
    });

    if (window.chartEngine) {
      window.chartEngine.renderRegionalChart("bw-regional-chart", labels, planData, actualData);
    }
  }

  runETLSimulation() {
    const overlay = document.getElementById("bw-etl-overlay");
    if (overlay) overlay.classList.remove("hidden");

    setTimeout(() => {
      if (overlay) overlay.classList.add("hidden");
      this.init(this.currentRegional);
      alert("Pipeline ETL Data Warehouse berhasil dijalankan! Data Cube & Analytics telah terbarui.");
    }, 1000);
  }
}

window.bwModule = new BWModule();
