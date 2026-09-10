import React from 'react';
import { Search, Database, Code2, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'search' | 'admin' | 'code';
  setActiveTab: (tab: 'search' | 'admin' | 'code') => void;
  totalEntries: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, totalEntries }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                  Kamus Digital Bahasa Banggai
                </h1>
                <span className="text-[11px] font-semibold tracking-wide bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                  {totalEntries} Kosa Kata
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Bahasa Banggai (Sulawesi Tengah) &harr; Bahasa Indonesia &bull; Pencarian Cerdas & Parser OCR
              </p>
            </div>
          </div>

          {/* Tab Navigasi */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200">
            <button
              id="tab-search"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Pencarian</span>
            </button>

            <button
              id="tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Input Data (OCR)</span>
            </button>

            <button
              id="tab-code"
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'code'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>File Kode</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
