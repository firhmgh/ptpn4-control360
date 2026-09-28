# PALM-CONTROL360 — Enterprise Dashboard (React + Vite)
PT Perkebunan Nusantara IV (PalmCo)

Aplikasi enterprise dashboard modern berbasis **React + Vite** yang mengintegrasikan modul **Corporate Controlling (CO)**, **Business Warehouse (BW)**, dan **Business Planning & Consolidation (BPC)** dengan kepatuhan penuh terhadap **PRD FINAL TERKUNCI**.

---

## 🌟 Baseline & Fakta Terverifikasi (Holding PalmCo)

* **Total RKAP Biaya**: `Rp 608.528.462.803`
* **Total Realisasi Biaya**: `Rp 444.091.285.174`
* **Serapan Biaya Holding**: `72,98%`
* **Standar Rendemen CPO**: `23,94%`
* **Cakupan Wilayah Regional**: `RPC1 s/d RPC7` (Regional 1 - Regional 7)
* **Status Simulasi**: Seluruh kurva bulanan dan pipeline ETL ditandai transparan sebagai `DEMO/SIMULASI` tanpa memalsukan data sumber.

---

## 🏗️ Arsitektur & Teknologi

* **Frontend Framework**: React 19 + Vite 8
* **Styling & Design System**: Tailwind CSS v4 + Vanilla CSS Design Tokens
* **Iconography**: Lucide React
* **Data Visualization**: Recharts (Executive Regional Analytics Bar Chart & 12-Month S-Curve Tracking Line Chart)
* **Persistence Layer**: Client-Side `LocalStorage` (Pure zero-backend, zero database, zero external API)
* **State Management**: React Context (`AppContext`) dengan Global Filter Reactivity

---

## 🚀 Panduan Memulai

### 1. Menjalankan Server Development:
```bash
npm run dev
```
Buka peramban pada URL `http://localhost:5173/`.

### 2. Membangun Bundel Produksi:
```bash
npm run build
```

---

## 📋 Acceptance Criteria Compliance (AC-01 s/d AC-07)

* **AC-01 (Navigasi Instant Tanpa Reload)**: Beralih modul CO, BW, dan BPC dengan state preservation dan transisi mulus.
* **AC-02 (Global Regional Filter Consistency)**: Dropdown Regional (RPC1 - RPC7 & ALL) langsung memfilter seluruh KPI Card, tabel data, dan grafik secara reaktif.
* **AC-03 (CRUD CO Success)**: Penambahan, pengubahan, dan penghapusan pemetaan GL to Cost Center tersimpan ke LocalStorage. Pencatatan transaksi alokasi biaya tervalidasi.
* **AC-04 (ETL Simulator)**: Simulasi pipeline Extract-Transform-Load teranimasi dengan log progres berjenjang dan update Data Cube.
* **AC-05 (S-Curve & Consolidation Matrix)**: Visualisasi kurva-S 12 bulan (Plan vs Actual) & badge klasifikasi holding resmi (Emas, Hijau, Merah, Hitam).
* **AC-06 (Export CSV)**: Fitur unduh berkas .csv dengan encoding UTF-8 BOM pada seluruh tabel data.
* **AC-07 (Zero Console Error & LocalStorage Reset)**: Bebas error kompilasi dan tersedia dialog konfirmasi reset seed data baseline.
