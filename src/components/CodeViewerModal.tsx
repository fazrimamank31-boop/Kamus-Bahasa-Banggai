import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, ExternalLink, CheckCircle } from 'lucide-react';
import { STANDALONE_HTML, STANDALONE_CSS, STANDALONE_JS } from '../utils/standaloneCode';

export const CodeViewerModal: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const fileMap = {
    html: { name: 'index.html', content: STANDALONE_HTML, lang: 'html' },
    css: { name: 'style.css', content: STANDALONE_CSS, lang: 'css' },
    js: { name: 'scripts.js', content: STANDALONE_JS, lang: 'javascript' },
  };

  const current = fileMap[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCurrent = () => {
    const blob = new Blob([current.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = current.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    // Download ketiga file
    ['html', 'css', 'js'].forEach((key) => {
      const item = fileMap[key as 'html' | 'css' | 'js'];
      const blob = new Blob([item.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-600" />
            Struktur File Bersih Standalone (HTML, CSS, JS)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sesuai permintaan Anda, berikut adalah kode sumber murni lengkap dalam 3 file terpisah yang siap dipasang langsung pada server web biasa tanpa dependensi eksternal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadAll}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            Unduh Semua 3 File
          </button>
        </div>
      </div>

      {/* Tab Pilihan File */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveFile('html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFile === 'html' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            index.html
          </button>
          <button
            onClick={() => setActiveFile('css')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFile === 'css' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            style.css
          </button>
          <button
            onClick={() => setActiveFile('js')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFile === 'js' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            scripts.js
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin {current.name}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadCurrent}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            Unduh {current.name}
          </button>
        </div>
      </div>

      {/* Editor / Code Display Box */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{current.name}</span>
          <span>{current.content.split('\n').length} baris</span>
        </div>
        <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-400 max-h-[500px] leading-relaxed select-all">
          {current.content}
        </pre>
      </div>

      {/* Petunjuk Penggunaan Standalone */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1.5">
        <p className="font-bold flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          Cara Menjalankan File Standalone:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>Simpan ketiga file (<code className="font-semibold">index.html</code>, <code className="font-semibold">style.css</code>, dan <code className="font-semibold">scripts.js</code>) dalam satu folder yang sama.</li>
          <li>Cukup klik ganda file <code className="font-semibold">index.html</code> di peramban (browser) HP atau komputer Anda.</li>
          <li>Kamus digital akan langsung berjalan penuh secara offline dengan fitur pencarian cerdas bersarang dan parser OCR tanpa perlu server backend!</li>
        </ol>
      </div>
    </div>
  );
};
