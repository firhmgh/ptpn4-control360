/**
 * PALM-CONTROL360 — Main SPA Controller
 * File: js/app.js
 * Handles Tab Switching, Global Filters, CSV Export, & Lifecycle Hooks
 */

class AppController {
  constructor() {
    this.activeTab = "tab-co";
    this.currentRegional = "ALL";
  }

  init() {
    // Initial module render
    this.renderActiveTab();

    // Window resize handler for canvas charts
    window.addEventListener("resize", () => {
      if (this.activeTab === "tab-bw" && window.bwModule) {
        window.bwModule.renderRegionalChart();
      } else if (this.activeTab === "tab-bpc" && window.bpcModule) {
        window.bpcModule.renderSCurve();
      }
    });
  }

  switchTab(tabId) {
    if (this.activeTab === tabId) return;

    this.activeTab = tabId;

    // Update Tab Buttons
    const tabs = document.querySelectorAll(".nav-tab");
    tabs.forEach(tab => {
      if (tab.getAttribute("data-tab") === tabId) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Update Tab Panels
    const panels = document.querySelectorAll(".tab-panel");
    panels.forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    this.renderActiveTab();
  }

  onRegionalChange(regionalId) {
    this.currentRegional = regionalId;
    this.renderActiveTab();
  }

  renderActiveTab() {
    if (this.activeTab === "tab-co" && window.coModule) {
      window.coModule.init(this.currentRegional);
    } else if (this.activeTab === "tab-bw" && window.bwModule) {
      window.bwModule.init(this.currentRegional);
    } else if (this.activeTab === "tab-bpc" && window.bpcModule) {
      window.bpcModule.init(this.currentRegional);
    }
  }

  resetSeedData() {
    if (confirm("Apakah Anda yakin ingin mengembalikan seluruh data ke kondisi awal (seed data)? Data yang baru diubah akan direset.")) {
      window.dbEngine.resetDB();
      this.renderActiveTab();
      alert("Seed data berhasil di-reset!");
    }
  }

  exportTableToCSV(tbodyId, filename = "Export_Data.csv") {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr"));
    if (rows.length === 0 || tbody.querySelector(".empty-state")) {
      alert("Tidak ada data untuk di-export.");
      return;
    }

    const csvContent = [];
    rows.forEach(row => {
      const cols = Array.from(row.querySelectorAll("td, th"));
      const rowData = cols.map(col => {
        let text = col.innerText.replace(/\n/g, " ").trim();
        // Remove badge or button text noise if present
        text = text.replace(/"/g, '""');
        return `"${text}"`;
      });
      csvContent.push(rowData.join(","));
    });

    const csvString = "data:text/csv;charset=utf-8,\uFEFF" + csvContent.join("\n");
    const encodedUri = encodeURI(csvString);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Instantiate Global Controller
window.appController = new AppController();

// DOM Content Loaded Listener
document.addEventListener("DOMContentLoaded", () => {
  window.appController.init();
});
