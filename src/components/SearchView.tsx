import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Volume2, Copy, Check, ArrowRightLeft, Info, HelpCircle } from 'lucide-react';
import { DictionaryEntry, SearchDirection, SearchResult } from '../types';
import { searchDictionary, cleanWord } from '../utils/searchEngine';

interface SearchViewProps {
  dictionary: DictionaryEntry[];
  onSelectEntry?: (entry: DictionaryEntry) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ dictionary, onSelectEntry }) => {
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<SearchDirection>('all');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Hasil pencarian menggunakan algoritma pencarian cerdas
  const searchResults = useMemo(() => {
    return searchDictionary(query, dictionary, direction);
  }, [query, dictionary, direction]);

  // Filter kategori
  const filteredResults = useMemo(() => {
    if (categoryFilter === 'Semua') return searchResults;
    return searchResults.filter(res => {
      const cat = (res.entry.category || '').toLowerCase();
      return cat.includes(categoryFilter.toLowerCase());
    });
  }, [searchResults, categoryFilter]);

  // Handle copy teks
  const handleCopy = (entry: DictionaryEntry) => {
    const text = `${entry.source} = ${entry.target}${entry.notes ? ` (${entry.notes})` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Pelafalan suara sederhana (SpeechSynthesis)
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Helper untuk menyorot kata dalam teks
  const renderHighlighted = (text: string, highlightWord?: string) => {
    if (!highlightWord || !highlightWord.trim()) return text;
    const cleanHighlight = cleanWord(highlightWord);
    if (!cleanHighlight) return text;

    const regex = new RegExp(`(${cleanHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === cleanHighlight ? (
        <mark key={i} className="bg-amber-200 text-amber-900 px-1 py-0.5 rounded font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const categories = ['Semua', 'Kata Benda', 'Kata Kerja', 'Kata Sifat', 'Kata Keterangan', 'Ungkapan / Kalimat'];

  return (
    <div className="space-y-5">
      {/* Kartu Input Pencarian Pintar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Pencarian Kosa Kata Pintar
            </h2>
            <p className="text-xs text-slate-500">
              Mendukung pencarian kata tunggal dan deteksi spesifik kata di dalam kalimat
            </p>
          </div>

          {/* Toggle Arah Bahasa */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setDirection('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                direction === 'all' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setDirection('banggai_to_id')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                direction === 'banggai_to_id' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Banggai &rarr; ID
            </button>
            <button
              onClick={() => setDirection('id_to_banggai')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                direction === 'id_to_banggai' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              ID &rarr; Banggai
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="main-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata atau kalimat (contoh: 'here', 'kono', 'disini', 'tabea', 'kuman')..."
            className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              title="Bersihkan pencarian"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick test prompt chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Uji Coba Logika:
          </span>
          <button
            onClick={() => setQuery('here')}
            className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-medium hover:bg-emerald-100 transition-colors"
          >
            "here" &rarr; deteksi "disini"
          </button>
          <button
            onClick={() => setQuery('kono')}
            className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-medium hover:bg-blue-100 transition-colors"
          >
            "kono" (disini)
          </button>
          <button
            onClick={() => setQuery('disini')}
            className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md hover:bg-slate-200 transition-colors"
          >
            "disini"
          </button>
          <button
            onClick={() => setQuery('tabea')}
            className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md hover:bg-slate-200 transition-colors"
          >
            "tabea" (salam)
          </button>
          <button
            onClick={() => setQuery('kuman')}
            className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md hover:bg-slate-200 transition-colors"
          >
            "kuman" (makan)
          </button>
        </div>
      </div>

      {/* Info Banner Logika Pencarian jika pengguna mencari kata spesifik */}
      {query.trim().toLowerCase() === 'here' && (
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3.5 sm:p-4 text-emerald-900 shadow-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-emerald-800">
                Logika Deteksi Kata Bersarang Aktif!
              </p>
              <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                Kata kunci <strong>"here"</strong> berhasil dideteksi di dalam kalimat <code className="bg-emerald-100 px-1 py-0.2 rounded font-mono">"i was here = aku berada disini"</code> dan diekstraksi maknanya secara presisi menjadi <strong>"disini"</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Kategori & Hasil Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-xs sm:text-sm font-semibold text-slate-600">
          Ditemukan <span className="text-blue-600 font-bold">{filteredResults.length}</span> kosa kata
          {query && <span> untuk "{query}"</span>}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Kartu Hasil */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Kosa Kata Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Tidak ada hasil yang cocok dengan kata kunci "{query}". Anda dapat menambahkan kata ini melalui tab <strong>Input Data (OCR)</strong>.
            </p>
            <button
              onClick={() => setQuery('')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          filteredResults.map((result) => {
            const { entry, specificTargetWord, specificSourceWord, alignmentExplanation, matchType } = result;
            const isAligned = matchType === 'aligned_word' && specificTargetWord;

            return (
              <div
                key={entry.id}
                className={`bg-white rounded-xl p-4 sm:p-5 border transition-all hover:shadow-sm ${
                  isAligned ? 'border-emerald-300 ring-1 ring-emerald-200/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Bagian Atas Kartu: Kata Sumber & Kategori */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-bold text-blue-900 tracking-tight">
                        {renderHighlighted(entry.source, query)}
                      </span>
                      <button
                        onClick={() => handleSpeak(entry.source)}
                        className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Dengarkan pelafalan"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-slate-500 italic">
                        {entry.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                      {entry.category || 'kosa kata'}
                    </span>
                    <button
                      onClick={() => handleCopy(entry)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Salin kata dan arti"
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 🎯 LOGIKA PINTAR: BADGE ARTI SPESIFIK JIKA COCOK DENGAN SUB-KATA DALAM KALIMAT */}
                {isAligned && (
                  <div className="my-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Arti Spesifik Kata yang Dicari:
                      </span>
                      <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono">
                        Ekstraksi Kalimat Cerdas
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-base font-bold text-emerald-950">
                      <span className="bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded">
                        "{specificSourceWord || query}"
                      </span>
                      <span className="text-emerald-600 font-normal">&rarr;</span>
                      <span className="text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300 shadow-2xs">
                        "{specificTargetWord}"
                      </span>
                    </div>

                    {alignmentExplanation && (
                      <p className="text-[11px] text-emerald-700 mt-1">
                        {alignmentExplanation}
                      </p>
                    )}
                  </div>
                )}

                {/* Arti / Terjemahan Lengkap */}
                <div className="pt-2 border-t border-slate-100 flex items-start gap-2">
                  <span className="text-xs font-semibold text-slate-400 shrink-0 mt-0.5">
                    Arti:
                  </span>
                  <div className="text-sm sm:text-base text-slate-800 font-medium">
                    {renderHighlighted(entry.target, isAligned ? specificTargetWord : query)}
                  </div>
                </div>

                {/* Contoh Kalimat Jika Tersedia */}
                {entry.examples && entry.examples.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 bg-slate-50/70 rounded-lg p-2.5 text-xs space-y-1">
                    <span className="font-semibold text-slate-500">Contoh Penggunaan:</span>
                    {entry.examples.map((ex, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <p className="font-medium text-slate-700 italic">"{ex.banggai}"</p>
                        <p className="text-slate-500">= "{ex.indonesia}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
