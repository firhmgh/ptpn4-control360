import React, { useState } from "react";
import { useApp } from "./context/AppContext";
import { Header, Footer } from "./layouts/AppLayout";
import { COModule } from "./modules/co/COModule";
import { BWModule } from "./modules/bw/BWModule";
import { BPCModule } from "./modules/bpc/BPCModule";
import { Toast, ConfirmationModal } from "./components/common/Feedback";

export function App() {
  const { activeTab, toast, resetSeedData } = useApp();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B] font-sans antialiased selection:bg-[#00875A] selection:text-white overflow-x-hidden">
      {/* ── Sticky Header with Logo, Nav & Global Regional Filter ── */}
      <Header onResetClick={() => setIsResetConfirmOpen(true)} />

      {/* ── Main Module Workspace ── */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-5">
        {activeTab === "co" && <COModule />}
        {activeTab === "bw" && <BWModule />}
        {activeTab === "bpc" && <BPCModule />}
      </main>

      {/* ── Corporate Footer ── */}
      <Footer />

      {/* ── Global Toast Notification ── */}
      <Toast toast={toast} onClose={() => {}} />

      {/* ── Reset Seed Confirmation Modal ── */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        title="Reset ke Seed Data Baseline Audit?"
        message={
          <>
            Tindakan ini akan mengembalikan seluruh data ke baseline audit yang terverifikasi:
            <ul className="mt-2 text-xs space-y-0.5 list-disc list-inside text-slate-700">
              <li>RKAP Biaya Replanting (PalmCo): <strong>Rp 608.528.462.803</strong></li>
              <li>Realisasi Replanting (PalmCo): <strong>Rp 444.091.285.174</strong></li>
              <li>Serapan Biaya Holding: <strong>72,98%</strong></li>
              <li>Seluruh GL Mapping, Transaksi &amp; PICA akan direset</li>
            </ul>
          </>
        }
        confirmText="Reset Sekarang"
        confirmVariant="danger"
        onConfirm={() => {
          resetSeedData();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}

export default App;
