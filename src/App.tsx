import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchView } from './components/SearchView';
import { AdminInputView } from './components/AdminInputView';
import { CodeViewerModal } from './components/CodeViewerModal';
import { DictionaryEntry } from './types';
import { INITIAL_DICTIONARY } from './data/defaultDictionary';

const STORAGE_KEY = 'kamus_banggai_data_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'admin' | 'code'>('search');
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load dictionary from localStorage:', e);
    }
    return INITIAL_DICTIONARY;
  });

  // Simpan otomatis ke localStorage setiap ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dictionary));
    } catch (e) {
      console.error('Failed to save dictionary to localStorage:', e);
    }
  }, [dictionary]);

  // Tambah entri baru hasil OCR ke memori
  const handleSaveEntries = (newEntries: DictionaryEntry[]) => {
    setDictionary((prev) => [...newEntries, ...prev]);
  };

  // Reset data ke bawaan
  const handleResetDictionary = () => {
    setDictionary(INITIAL_DICTIONARY);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DICTIONARY));
    } catch (e) {
      console.error('Failed to reset localStorage:', e);
    }
  };

  // Ganti seluruh data (misal dari impor JSON)
  const handleReplaceDictionary = (entries: DictionaryEntry[]) => {
    setDictionary(entries);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header & Navigasi */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalEntries={dictionary.length}
      />

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'search' && (
          <SearchView dictionary={dictionary} />
        )}

        {activeTab === 'admin' && (
          <AdminInputView
            dictionary={dictionary}
            onSaveEntries={handleSaveEntries}
            onResetDictionary={handleResetDictionary}
            onReplaceDictionary={handleReplaceDictionary}
            onSwitchToSearch={() => setActiveTab('search')}
          />
        )}

        {activeTab === 'code' && (
          <CodeViewerModal />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">
            Kamus Digital Bahasa Banggai - Indonesia &bull; Preservasi Bahasa Daerah Sulawesi Tengah
          </p>
          <p>
            Dilengkapi algoritma pencarian kosa kata bersarang dan fungsi parser teks OCR ke format JSON.
          </p>
        </div>
      </footer>
    </div>
  );
}
