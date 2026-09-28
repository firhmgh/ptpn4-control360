/**
 * PALM-CONTROL360 — Corporate Controlling (CO) Module
 * File: js/modules/co.js
 * Handles GL Mapping CRUD, Transaction Ledger, & Cost Center Variance Matrix
 */

class COModule {
  constructor() {
    this.currentRegional = "ALL";
  }

  init(regionalId = "ALL") {
    this.currentRegional = regionalId;
    this.renderKPIs();
    this.renderMappingsTable();
    this.renderTransactionFormOptions();
    this.renderTransactionsTable();
    this.renderVarianceMatrix();
  }

  renderKPIs() {
    const mappings = window.dbEngine.getCOMappings(this.currentRegional);
    const costCenters = window.dbEngine.getCostCenters(this.currentRegional);
    const transactions = window.dbEngine.getCOTransactions(this.currentRegional);

    const totalGLMapped = new Set(mappings.map(m => m.gl_id)).size;
    const totalCCActive = costCenters.length;

    const totalNominalTrx = transactions.reduce((sum, t) => sum + (t.nominal_biaya || 0), 0);

    // Count Over-Budget Cost Centers
    let overBudgetCount = 0;
    const bpcRkap = window.dbEngine.getBPCRKAP(this.currentRegional);
    bpcRkap.forEach(item => {
      const vPct = window.dbEngine.calcVariancePct(item.realisasi_amount, item.rkap_amount);
      if (window.dbEngine.getBudgetStatus(vPct) === "Over Budget") {
        overBudgetCount++;
      }
    });

    const elGL = document.getElementById("co-kpi-gl-mapped");
    const elCC = document.getElementById("co-kpi-cc-active");
    const elTrx = document.getElementById("co-kpi-total-trx");
    const elOver = document.getElementById("co-kpi-over-budget");

    if (elGL) elGL.innerText = totalGLMapped;
    if (elCC) elCC.innerText = totalCCActive;
    if (elTrx) elTrx.innerText = "Rp " + totalNominalTrx.toLocaleString("id-ID");
    if (elOver) elOver.innerText = overBudgetCount + " Unit";
  }

  renderMappingsTable() {
    const tableBody = document.getElementById("co-mappings-tbody");
    if (!tableBody) return;

    const mappings = window.dbEngine.getCOMappings(this.currentRegional);
    const gls = window.dbEngine.data.gl_accounts;
    const ccs = window.dbEngine.data.cost_centers;
    const units = window.dbEngine.data.ref_units;

    if (mappings.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <p>Tidak ada data pemetaan GL Account untuk regional terpilih.</p>
          </td>
        </tr>`;
      return;
    }

    let html = "";
    mappings.forEach(map => {
      const gl = gls.find(g => g.id === map.gl_id) || { gl_code: "-", gl_name: "-" };
      const cc = ccs.find(c => c.id === map.cost_center_id) || { cost_center_code: "-", unit_id: "" };
      const unit = units.find(u => u.id === cc.unit_id) || { nama_unit: "-" };

      html += `
        <tr>
          <td><strong>${gl.gl_code}</strong></td>
          <td>${gl.gl_name}</td>
          <td><code>${cc.cost_center_code}</code></td>
          <td>${unit.nama_unit}</td>
          <td><strong>${map.alokasi_pct}%</strong></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="coModule.openEditMappingModal('${map.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="coModule.deleteMapping('${map.id}')">Hapus</button>
          </td>
        </tr>`;
    });
    tableBody.innerHTML = html;
  }

  renderTransactionFormOptions() {
    const selectMap = document.getElementById("co-trx-mapping-id");
    if (!selectMap) return;

    const mappings = window.dbEngine.getCOMappings(this.currentRegional);
    const gls = window.dbEngine.data.gl_accounts;
    const ccs = window.dbEngine.data.cost_centers;

    let html = '<option value="">-- Pilih Pemetaan GL to Cost Center --</option>';
    mappings.forEach(m => {
      const gl = gls.find(g => g.id === m.gl_id) || { gl_code: "-" };
      const cc = ccs.find(c => c.id === m.cost_center_id) || { cost_center_code: "-" };
      html += `<option value="${m.id}">[${gl.gl_code}] -> ${cc.cost_center_code} (${m.alokasi_pct}%)</option>`;
    });
    selectMap.innerHTML = html;
  }

  renderTransactionsTable() {
    const tableBody = document.getElementById("co-transactions-tbody");
    if (!tableBody) return;

    const transactions = window.dbEngine.getCOTransactions(this.currentRegional);
    const mappings = window.dbEngine.data.co_mappings;
    const gls = window.dbEngine.data.gl_accounts;
    const ccs = window.dbEngine.data.cost_centers;

    if (transactions.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <p>Belum ada transaksi alokasi biaya yang tercatat.</p>
          </td>
        </tr>`;
      return;
    }

    let html = "";
    transactions.forEach(trx => {
      const map = mappings.find(m => m.id === trx.mapping_id) || {};
      const gl = gls.find(g => g.id === map.gl_id) || { gl_code: "-" };
      const cc = ccs.find(c => c.id === map.cost_center_id) || { cost_center_code: "-" };

      html += `
        <tr>
          <td>${trx.periode}</td>
          <td><code>${gl.gl_code}</code> &rarr; <code>${cc.cost_center_code}</code></td>
          <td><strong>Rp ${Number(trx.nominal_biaya).toLocaleString("id-ID")}</strong></td>
          <td>${trx.keterangan || "-"}</td>
          <td><span class="badge badge-track">Validated</span></td>
        </tr>`;
    });
    tableBody.innerHTML = html;
  }

  renderVarianceMatrix() {
    const tableBody = document.getElementById("co-variance-matrix-tbody");
    if (!tableBody) return;

    const bpcRkap = window.dbEngine.getBPCRKAP(this.currentRegional);
    const units = window.dbEngine.data.ref_units;
    const ccs = window.dbEngine.data.cost_centers;

    if (bpcRkap.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <p>Tidak ada data matriks alokasi untuk regional terpilih.</p>
          </td>
        </tr>`;
      return;
    }

    let html = "";
    bpcRkap.forEach(item => {
      const unit = units.find(u => u.id === item.unit_id) || { nama_unit: "-" };
      const cc = ccs.find(c => c.unit_id === item.unit_id) || { cost_center_code: "-" };
      const varAmt = window.dbEngine.calcVarianceAmount(item.realisasi_amount, item.rkap_amount);
      const varPct = window.dbEngine.calcVariancePct(item.realisasi_amount, item.rkap_amount);
      const status = window.dbEngine.getBudgetStatus(varPct);

      let badgeCss = "badge-track";
      if (status === "Over Budget") badgeCss = "badge-over";
      if (status === "Under Budget") badgeCss = "badge-under";

      html += `
        <tr>
          <td><strong>${unit.nama_unit}</strong></td>
          <td><code>${cc.cost_center_code}</code></td>
          <td>Rp ${Number(item.rkap_amount).toLocaleString("id-ID")}</td>
          <td>Rp ${Number(item.realisasi_amount).toLocaleString("id-ID")}</td>
          <td>Rp ${Number(varAmt).toLocaleString("id-ID")}</td>
          <td><strong>${varPct.toFixed(2)}%</strong></td>
          <td><span class="badge ${badgeCss}">${status}</span></td>
        </tr>`;
    });
    tableBody.innerHTML = html;
  }

  // --- Handlers ---
  openAddMappingModal() {
    const glSelect = document.getElementById("modal-map-gl");
    const ccSelect = document.getElementById("modal-map-cc");

    if (glSelect) {
      glSelect.innerHTML = window.dbEngine.data.gl_accounts.map(g =>
        `<option value="${g.id}">[${g.gl_code}] ${g.gl_name}</option>`
      ).join("");
    }

    if (ccSelect) {
      const ccs = window.dbEngine.getCostCenters(this.currentRegional);
      ccSelect.innerHTML = ccs.map(c =>
        `<option value="${c.id}">${c.cost_center_code} - ${c.cost_center_name}</option>`
      ).join("");
    }

    document.getElementById("modal-mapping-title").innerText = "Tambah Mapping GL to Cost Center";
    document.getElementById("modal-mapping-id").value = "";
    document.getElementById("modal-map-pct").value = "100";
    document.getElementById("modal-mapping").classList.remove("hidden");
  }

  openEditMappingModal(id) {
    const map = window.dbEngine.data.co_mappings.find(m => m.id === id);
    if (!map) return;

    this.openAddMappingModal();
    document.getElementById("modal-mapping-title").innerText = "Edit Mapping GL to Cost Center";
    document.getElementById("modal-mapping-id").value = map.id;
    document.getElementById("modal-map-gl").value = map.gl_id;
    document.getElementById("modal-map-cc").value = map.cost_center_id;
    document.getElementById("modal-map-pct").value = map.alokasi_pct;
  }

  saveMappingFromModal() {
    const id = document.getElementById("modal-mapping-id").value;
    const gl_id = document.getElementById("modal-map-gl").value;
    const cost_center_id = document.getElementById("modal-map-cc").value;
    const alokasi_pct = Number(document.getElementById("modal-map-pct").value);

    if (!gl_id || !cost_center_id || isNaN(alokasi_pct) || alokasi_pct <= 0 || alokasi_pct > 100) {
      alert("Mohon isi form dengan lengkap dan persentase alokasi yang valid (1-100%).");
      return;
    }

    if (id) {
      window.dbEngine.updateCOMapping(id, { gl_id, cost_center_id, alokasi_pct });
    } else {
      window.dbEngine.addCOMapping({ gl_id, cost_center_id, alokasi_pct });
    }

    this.closeModal("modal-mapping");
    this.init(this.currentRegional);
  }

  deleteMapping(id) {
    if (confirm("Apakah Anda yakin ingin menghapus pemetaan GL ini?")) {
      window.dbEngine.deleteCOMapping(id);
      this.init(this.currentRegional);
    }
  }

  submitTransactionForm(e) {
    if (e) e.preventDefault();
    const mapping_id = document.getElementById("co-trx-mapping-id").value;
    const periode = document.getElementById("co-trx-periode").value;
    const nominal_biaya = Number(document.getElementById("co-trx-nominal").value);
    const keterangan = document.getElementById("co-trx-keterangan").value;

    if (!mapping_id || !periode || isNaN(nominal_biaya) || nominal_biaya <= 0) {
      alert("Mohon lengkapi data transaksi dengan nominal angka positif yang valid.");
      return;
    }

    window.dbEngine.addCOTransaction({ mapping_id, periode, nominal_biaya, keterangan });
    document.getElementById("co-trx-form").reset();
    this.init(this.currentRegional);
    alert("Transaksi alokasi biaya berhasil dicatat!");
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("hidden");
  }
}

window.coModule = new COModule();
