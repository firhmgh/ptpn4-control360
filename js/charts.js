/**
 * PALM-CONTROL360 — Custom Native Canvas Chart Engine
 * File: js/charts.js
 * 100% Native HTML5 Canvas (Zero External Library, Zero CDN, 100% Offline Safe)
 */

class NativeChartEngine {
  constructor() {}

  /**
   * Render Regional Comparison Bar Chart
   * @param {string} canvasId 
   * @param {Array} labels - ['RPC1', 'RPC2', ...]
   * @param {Array} planData - [RKAP values]
   * @param {Array} actualData - [Realisasi values]
   */
  renderRegionalChart(canvasId, labels, planData, actualData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI display sizing
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = (rect.height || 320) * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const width = rect.width;
    const height = rect.height || 320;
    const padding = { top: 40, right: 30, bottom: 50, left: 70 };

    ctx.clearRect(0, 0, width, height);

    if (!labels || labels.length === 0) {
      ctx.fillStyle = "#64748b";
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Tidak ada data untuk grafik regional", width / 2, height / 2);
      return;
    }

    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    const maxVal = Math.max(...planData, ...actualData, 1) * 1.15;

    // Draw Grid Lines & Y-Axis Labels
    const steps = 4;
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "right";

    for (let i = 0; i <= steps; i++) {
      const yVal = (maxVal / steps) * i;
      const yPos = padding.top + graphHeight - (i / steps) * graphHeight;

      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(width - padding.right, yPos);
      ctx.stroke();

      // Format Y value in Billions/Millions
      let formattedY = yVal >= 1e9 ? (yVal / 1e9).toFixed(1) + "M" : (yVal / 1e6).toFixed(0) + "Jt";
      if (yVal === 0) formattedY = "0";
      ctx.fillText(formattedY, padding.left - 8, yPos + 4);
    }

    // Draw Bars
    const groupWidth = graphWidth / labels.length;
    const barWidth = Math.min(groupWidth * 0.32, 28);

    labels.forEach((label, idx) => {
      const groupX = padding.left + idx * groupWidth + groupWidth / 2;

      // Plan Bar (RKAP - Teal)
      const pVal = planData[idx] || 0;
      const pHeight = (pVal / maxVal) * graphHeight;
      const pX = groupX - barWidth - 2;
      const pY = padding.top + graphHeight - pHeight;

      ctx.fillStyle = "#00a389";
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(pX, pY, barWidth, pHeight, [4, 4, 0, 0]) : ctx.fillRect(pX, pY, barWidth, pHeight);
      ctx.fill();

      // Actual Bar (Realisasi - Green)
      const aVal = actualData[idx] || 0;
      const aHeight = (aVal / maxVal) * graphHeight;
      const aX = groupX + 2;
      const aY = padding.top + graphHeight - aHeight;

      ctx.fillStyle = "#00875a";
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(aX, aY, barWidth, aHeight, [4, 4, 0, 0]) : ctx.fillRect(aX, aY, barWidth, aHeight);
      ctx.fill();

      // X Label
      ctx.fillStyle = "#334155";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(label, groupX, padding.top + graphHeight + 20);
    });

    // Draw Legend
    const legendX = width - padding.right - 180;
    const legendY = 18;

    // Plan Legend
    ctx.fillStyle = "#00a389";
    ctx.fillRect(legendX, legendY, 12, 12);
    ctx.fillStyle = "#334155";
    ctx.font = "11px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("RKAP (Plan)", legendX + 18, legendY + 10);

    // Actual Legend
    ctx.fillStyle = "#00875a";
    ctx.fillRect(legendX + 90, legendY, 12, 12);
    ctx.fillStyle = "#334155";
    ctx.fillText("Realisasi", legendX + 108, legendY + 10);
  }

  /**
   * Render 12-Month S-Curve Progress Line Chart
   * @param {string} canvasId 
   * @param {Array} monthLabels - ['Jan', 'Feb', ..., 'Des']
   * @param {Array} planProgress - [6.25, 12.50, ..., 75.0] (%)
   * @param {Array} actualProgress - [6.08, 12.16, ..., 72.98] (%)
   */
  renderSCurveChart(canvasId, monthLabels, planProgress, actualProgress) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = (rect.height || 320) * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const width = rect.width;
    const height = rect.height || 320;
    const padding = { top: 40, right: 30, bottom: 50, left: 50 };

    ctx.clearRect(0, 0, width, height);

    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;
    const maxVal = 100; // Percentage scale

    // Y-Axis Grid Lines & Labels
    const steps = 5; // 0%, 20%, 40%, 60%, 80%, 100%
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.textAlign = "right";

    for (let i = 0; i <= steps; i++) {
      const yVal = (maxVal / steps) * i;
      const yPos = padding.top + graphHeight - (i / steps) * graphHeight;

      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(width - padding.right, yPos);
      ctx.stroke();

      ctx.fillText(yVal + "%", padding.left - 8, yPos + 4);
    }

    // X Points calculation
    const stepX = monthLabels.length > 1 ? graphWidth / (monthLabels.length - 1) : graphWidth;

    // Function to get point coordinates
    const getCoords = (val, idx) => {
      const x = padding.left + idx * stepX;
      const y = padding.top + graphHeight - (Math.min(val, 100) / maxVal) * graphHeight;
      return { x, y };
    };

    // Draw Plan S-Curve (Dashed Gold Line)
    ctx.beginPath();
    ctx.strokeStyle = "#f5a623";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 4]);

    planProgress.forEach((val, idx) => {
      const { x, y } = getCoords(val, idx);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Draw Actual S-Curve (Solid Green Line with Fill)
    ctx.beginPath();
    ctx.strokeStyle = "#00875a";
    ctx.lineWidth = 3;

    actualProgress.forEach((val, idx) => {
      const { x, y } = getCoords(val, idx);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Data Points & X-Axis Labels
    monthLabels.forEach((label, idx) => {
      const pPt = getCoords(planProgress[idx] || 0, idx);
      const aPt = getCoords(actualProgress[idx] || 0, idx);

      // Plan Point
      ctx.fillStyle = "#f5a623";
      ctx.beginPath();
      ctx.arc(pPt.x, pPt.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Actual Point
      ctx.fillStyle = "#00875a";
      ctx.beginPath();
      ctx.arc(aPt.x, aPt.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // X Axis Label
      ctx.fillStyle = "#334155";
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(label, pPt.x, padding.top + graphHeight + 20);
    });

    // Draw Legend
    const legendX = width - padding.right - 230;
    const legendY = 18;

    // Plan Legend
    ctx.strokeStyle = "#f5a623";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(legendX, legendY + 6);
    ctx.lineTo(legendX + 20, legendY + 6);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#334155";
    ctx.font = "11px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Plan Progress S-Curve", legendX + 26, legendY + 10);

    // Actual Legend
    ctx.strokeStyle = "#00875a";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(legendX + 140, legendY + 6);
    ctx.lineTo(legendX + 160, legendY + 6);
    ctx.stroke();
    ctx.fillStyle = "#334155";
    ctx.fillText("Actual Progress", legendX + 166, legendY + 10);
  }
}

window.chartEngine = new NativeChartEngine();
