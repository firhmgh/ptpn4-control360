import React from "react";

export function KPICard({ title, value, subtext, icon: Icon, badge, color = "emerald" }) {
  const colorSchemes = {
    emerald: {
      border:  "border-l-4 border-l-[#00875A]",
      iconBg:  "bg-emerald-50 text-[#00875A]",
    },
    teal: {
      border:  "border-l-4 border-l-[#00A389]",
      iconBg:  "bg-teal-50 text-[#00A389]",
    },
    amber: {
      border:  "border-l-4 border-l-[#F5A623]",
      iconBg:  "bg-amber-50 text-[#D97706]",
    },
    blue: {
      border:  "border-l-4 border-l-blue-600",
      iconBg:  "bg-blue-50 text-blue-600",
    },
    rose: {
      border:  "border-l-4 border-l-rose-500",
      iconBg:  "bg-rose-50 text-rose-600",
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.emerald;

  return (
    <div
      className={`bg-white rounded-lg p-3.5 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E2E8F0] transition-all duration-150 hover:shadow-md ${scheme.border} flex flex-col justify-between`}
    >
      {/* Top row: title label + icon */}
      <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-2">
        <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#64748B] leading-snug">
          {title}
        </span>
        {Icon && (
          <div className={`p-1.5 sm:p-2 rounded-md flex-shrink-0 ${scheme.iconBg}`}>
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        )}
      </div>

      {/* Value + Badge: 24px-32px hierarchy */}
      <div className="flex items-baseline gap-2 flex-wrap mb-1">
        <h3 className="text-xl sm:text-[26px] lg:text-[28px] font-bold text-[#1E293B] tracking-tight leading-tight break-all">
          {value}
        </h3>
        {badge && <span className="flex-shrink-0">{badge}</span>}
      </div>

      {/* Subtext metadata: 11px-12px */}
      {subtext && (
        <p className="text-[11px] sm:text-[12px] text-[#64748B] font-medium leading-relaxed mt-0.5">
          {subtext}
        </p>
      )}
    </div>
  );
}
