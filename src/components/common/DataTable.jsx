import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { exportToCSV } from "../../utils/calculations";

export function DataTable({
  title,
  subtitle,
  columns,
  data = [],
  searchable = true,
  searchPlaceholder = "Cari data...",
  searchKeys = [],
  exportFilename = "data_export.csv",
  actionButtons = null,
  pageSize = 8,
  emptyMessage = "Tidak ada data yang ditemukan"
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Search Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter(item => {
      if (searchKeys.length > 0) {
        return searchKeys.some(key => {
          const val = item[key];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
        });
      }
      // Fallback search across all stringifiable values
      return Object.values(item).some(val =>
        val !== undefined && val !== null && String(val).toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm, searchKeys]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // CSV Export Action
  const handleExport = () => {
    const headers = columns.map(c => c.header);
    const rows = filteredData.map(item =>
      columns.map(c => {
        if (c.exportValue) return c.exportValue(item);
        if (typeof c.accessor === "function") return c.accessor(item);
        return item[c.accessor] ?? "";
      })
    );
    exportToCSV(exportFilename, headers, rows);
  };

  return (
    <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E2E8F0] overflow-hidden">
      <div className="p-3.5 sm:p-5 border-b border-[#E2E8F0]">
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-[#1E293B] tracking-tight">{title}</h4>
            {subtitle && <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 leading-relaxed">{subtitle}</p>}
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-2">
            {searchable && (
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="pl-8 pr-3 py-2 sm:py-1.5 text-xs bg-[#F8FAFC] hover:bg-slate-100/70 focus:bg-white border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00875A] focus:border-[#00875A] transition-all w-full sm:w-48 md:w-56 min-h-[38px] sm:min-h-[32px]"
                />
              </div>
            )}

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-[#1E293B] bg-[#F8FAFC] hover:bg-slate-100 rounded-md transition-colors cursor-pointer border border-[#E2E8F0] whitespace-nowrap flex-shrink-0 min-h-[38px] sm:min-h-[32px]"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>

            {actionButtons && <div className="flex-shrink-0">{actionButtons}</div>}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b-2 border-[#E2E8F0] text-[#64748B] text-[11px] sm:text-xs uppercase tracking-wider font-semibold">
              {columns.map((col, idx) => (
                <th key={idx} className={`py-2.5 px-3 sm:py-3 sm:px-4 whitespace-nowrap ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-[#64748B]">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="font-semibold text-[#1E293B]">{emptyMessage}</p>
                    <span className="text-xs text-[#64748B]">Silakan sesuaikan filter atau pencarian Anda.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr key={row.id || rIdx} className="hover:bg-[#F1F5F9] transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`py-2.5 px-3 sm:py-3 sm:px-4 text-[#1E293B] ${col.cellClassName || ""}`}>
                      {col.render ? col.render(row) : (typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredData.length > pageSize && (
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <div>
            Menampilkan <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> -{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * pageSize, filteredData.length)}
            </span>{" "}
            dari <span className="font-semibold text-slate-700">{filteredData.length}</span> data
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
