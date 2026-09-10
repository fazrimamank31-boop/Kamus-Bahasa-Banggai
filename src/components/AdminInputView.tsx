import React, { useState } from 'react';
import {
  FileText,
  Play,
  Save,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Code,
  Table as TableIcon,
  Plus,
  Sparkles,
  Info
} from 'lucide-react';
import { DictionaryEntry } from '../types';
import { parseOCRText, ParseOptions } from '../utils/parser';
import { SAMPLE_OCR_PAGE } from '../data/defaultDictionary';

interface AdminInputViewProps {
  dictionary: DictionaryEntry[];
  onSaveEntries: (newEntries: DictionaryEntry[]) => void;
  onResetDictionary: () => void;
  onReplaceDictionary: (entries: DictionaryEntry[]) => void;
  onSwitchToSearch: () => void;
}

export const AdminInputView: React.FC<AdminInputViewProps> = ({
  dictionary,
  onSaveEntries,
  onResetDictionary,
  onReplaceDictionary,
  onSwitchToSearch,
}) => {
  const [ocrText, setOcrText] = useState(SAMPLE_OCR_PAGE);
  const [delimiter, setDelimiter] = useState('=');
  const [autoDetect, setAutoDetect] = useState(true);
  const [cleanNoise, setCleanNoise] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  // Hasil pemecahan teks OCR
  const [parsedEntries, setParsedEntries] = useState<DictionaryEntry[]>([]);
  const [parseStats, setParseStats] = useState<{
    totalLines: number;
    parsedCount: number;
    skippedCount: number;
    errors: { line: number; rawText: string; reason: string }[];
  } | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ⚡ Fungsi parser OCR
  const handleParse = () => {
    if (!ocrText.trim()) {
      showNotification('error', 'Masukkan teks hasil OCR terlebih dahulu.');
      return;
    }

    const options: ParseOptions = {
      delimiter,
      autoDetectDelimiter: autoDetect,
      cleanPageNoise: cleanNoise,
      autoExtractCategory: true,
    };

    const result = parseOCRText(ocrText, options);
    setParsedEntries(result.entries);
    setParseStats({
      totalLines: result.stats.totalLines,
      parsedCount: result.stats.parsedCount,
      skippedCount: result.stats.skippedCount,
      errors: result.errors,
    });

    if (result.entries.length > 0) {
      showNotification(
        'success',
        `Berhasil mengekstrak ${result.entries.length} data JSON dari teks OCR!`
      );
    } else {
      showNotification('error', 'Tidak ada data valid yang dapat di-parse. Periksa tanda pemisah =.');
    }
  };

  // 💾 Simpan ke memori aplikasi
  const handleSaveToMemory = () => {
    if (parsedEntries.length === 0) {
      showNotification('error', 'Tidak ada data hasil parse untuk disimpan.');
      return;
    }

    onSaveEntries(parsedEntries);
    showNotification(
      'success',
      `${parsedEntries.length} entri berhasil ditambahkan ke memori kamus!`
    );
  };

  // Hapus satu entri sebelum disimpan
  const handleDeleteParsed = (index: number) => {
    const updated = [...parsedEntries];
    updated.splice(index, 1);
    setParsedEntries(updated);
  };

  // Edit inline pada tabel
  const handleUpdateEntry = (index: number, field: keyof DictionaryEntry, val: string) => {
    const updated = [...parsedEntries];
    updated[index] = { ...updated[index], [field]: val };
    setParsedEntries(updated);
  };

  // Ekspor JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dictionary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kamus_banggai_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('success', 'File JSON berhasil diunduh.');
  };

  // Impor JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onReplaceDictionary(imported);
          showNotification('success', `Berhasil memuat ${imported.length} data kamus dari file JSON!`);
        } else {
          showNotification('error', 'Format file JSON tidak valid (harus array).');
        }
      } catch (err) {
        showNotification('error', 'Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Banner Notifikasi */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border shadow-xs transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Kartu Input Teks OCR */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Input & Parsing Teks OCR Kamus
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Area input simulasi hasil OCR scan buku kamus. Format baris: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-700">kata/kalimat = arti</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOcrText(SAMPLE_OCR_PAGE)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Isi dengan teks scan OCR per halaman kamus Banggai"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Muat Contoh Teks OCR
            </button>
            <button
              onClick={() => setOcrText('')}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition-colors"
            >
              Kosongkan
            </button>
          </div>
        </div>

        {/* Textarea OCR */}
        <div className="relative">
          <textarea
            rows={10}
            value={ocrText}
            onChange={(e) => setOcrText(e.target.value)}
            placeholder={`Masukkan hasil scan OCR di sini, contoh:\nkono = disini\ni was here = aku berada disini\ntabea = salam, permisi\nyaku = aku, saya\nkuman = makan\nturu = tidur\nbola = rumah`}
            className="w-full p-4 bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed"
          />
          <div className="absolute bottom-3 right-3 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded">
            {ocrText.split(/\r?\n/).filter(Boolean).length} Baris Terisi
          </div>
        </div>

        {/* Pengaturan Ekstraksi */}
        <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700">Pemisah Kata:</label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 font-mono"
            >
              <option value="=">= (Sama Dengan)</option>
              <option value=":">: (Titik Dua)</option>
              <option value="-">- (Tanda Hubung)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={(e) => setAutoDetect(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Deteksi Pemisah Otomatis</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={cleanNoise}
              onChange={(e) => setCleanNoise(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Bersihkan Noise Header / Hal.</span>
          </label>
        </div>

        {/* Tombol Aksi Utama */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            onClick={handleParse}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
            ⚡ Pecah & Ekstrak Data (JSON)
          </button>

          <button
            onClick={handleSaveToMemory}
            disabled={parsedEntries.length === 0}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              parsedEntries.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <Save className="w-4 h-4" />
            Simpan ke Memori Aplikasi ({parsedEntries.length})
          </button>

          <button
            onClick={onSwitchToSearch}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
          >
            Buka Halaman Pencarian &rarr;
          </button>
        </div>
      </div>

      {/* Statistik Parsing */}
      {parseStats && (
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                Status Pemecahan (Parser) Selesai
              </p>
              <p className="text-slate-500">
                Total Baris: <span className="font-semibold text-slate-700">{parseStats.totalLines}</span> &bull; Valid: <span className="font-semibold text-emerald-600">{parseStats.parsedCount}</span> &bull; Dilewati / Noise: <span className="font-semibold text-amber-600">{parseStats.skippedCount}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Tabel
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold ${
                viewMode === 'json' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              JSON
            </button>
          </div>
        </div>
      )}

      {/* Tampilan Hasil Parsing: Tabel atau JSON */}
      {parsedEntries.length > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              Struktur Data Hasil Parsing ({parsedEntries.length} Objek)
            </h3>
            <span className="text-xs text-slate-500">
              Data siap disimpan langsung ke memori web browser
            </span>
          </div>

          {viewMode === 'table' ? (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">No</th>
                    <th className="py-2.5 px-3">Kata / Kalimat (Banggai)</th>
                    <th className="py-2.5 px-3">Arti (Bahasa Indonesia)</th>
                    <th className="py-2.5 px-3 w-32">Kategori</th>
                    <th className="py-2.5 px-3 w-16 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedEntries.map((entry, idx) => (
                    <tr key={entry.id} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={entry.source}
                          onChange={(e) => handleUpdateEntry(idx, 'source', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-hidden font-medium text-slate-900"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={entry.target}
                          onChange={(e) => handleUpdateEntry(idx, 'target', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-hidden text-slate-700"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium">
                          {entry.category || 'kosa kata'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleDeleteParsed(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Hapus baris ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto max-h-96">
              <pre className="text-xs text-sky-400 font-mono">
                {JSON.stringify(parsedEntries, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Manajemen Cadangan Data (Backup, Export, Reset) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Save className="w-4 h-4 text-blue-600" />
          Manajemen & Cadangan Memori Kamus ({dictionary.length} Total Entri)
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            Ekspor Data Kamus (.json)
          </button>

          <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Impor File JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (confirm('Yakin ingin mereset data kamus kembali ke kosa kata awal bawaan?')) {
                onResetDictionary();
                showNotification('success', 'Data kamus berhasil direset ke kosa kata bawaan.');
              }
            }}
            className="px-3 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data Bawaan
          </button>
        </div>
      </div>
    </div>
  );
};
