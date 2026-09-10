export const STANDALONE_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kamus Digital Bahasa Banggai - Indonesia</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Header & Navigasi Tab -->
  <header class="app-header">
    <div class="header-container">
      <div class="brand">
        <span class="brand-badge">Banggai Laut & Kepulauan</span>
        <h1>Kamus Digital Banggai</h1>
        <p class="subtitle">Pencarian cerdas kosa kata & parser data hasil scan OCR</p>
      </div>
      <nav class="nav-tabs">
        <button id="tabSearchBtn" class="tab-btn active" onclick="switchTab('search')">
          🔍 Pencarian Umum
        </button>
        <button id="tabAdminBtn" class="tab-btn" onclick="switchTab('admin')">
          ⚙️ Input Data (Admin OCR)
        </button>
      </nav>
    </div>
  </header>

  <main class="main-container">
    <!-- HALAMAN 1: PENCARIAN (UNTUK UMUM) -->
    <section id="pageSearch" class="page-section active">
      <div class="search-box-card">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            id="searchInput" 
            placeholder="Ketik kata/kalimat (contoh: 'here', 'kono', 'tabea', 'disini')..."
            autocomplete="off"
          >
          <button id="clearSearchBtn" class="clear-btn" onclick="clearSearch()" title="Hapus pencarian">✕</button>
        </div>
        <div class="search-hint">
          💡 <strong>Tips Pencarian Pintar:</strong> Coba ketik <span class="badge-chip" onclick="quickSearch('here')">here</span> atau <span class="badge-chip" onclick="quickSearch('kono')">kono</span>. Sistem otomatis mendeteksi arti kata spesifik dari dalam kalimat!
        </div>
      </div>

      <!-- Statistik & Filter -->
      <div class="results-header">
        <div class="results-count" id="resultsCount">Memuat data...</div>
        <div class="quick-tags">
          <button class="filter-chip active" onclick="filterCategory('semua')">Semua</button>
          <button class="filter-chip" onclick="filterCategory('kata benda')">Kata Benda</button>
          <button class="filter-chip" onclick="filterCategory('kata kerja')">Kata Kerja</button>
          <button class="filter-chip" onclick="filterCategory('ungkapan / kalimat')">Kalimat</button>
        </div>
      </div>

      <!-- Daftar Hasil Pencarian -->
      <div id="resultsList" class="results-grid"></div>
    </section>

    <!-- HALAMAN 2: INPUT DATA (UNTUK ADMIN / OCR SCAN) -->
    <section id="pageAdmin" class="page-section">
      <div class="admin-card">
        <div class="admin-header">
          <div>
            <h2>Input & Parsing Teks OCR Kamus</h2>
            <p class="text-muted">Tempelkan hasil scan teks OCR dari buku kamus. Format per baris: <code>kata/kalimat = arti</code></p>
          </div>
          <button class="btn btn-secondary" onclick="loadSampleOCR()">
            📄 Muat Contoh Hasil OCR
          </button>
        </div>

        <div class="textarea-wrapper">
          <textarea 
            id="ocrTextarea" 
            rows="9" 
            placeholder="Contoh:&#10;kono = disini&#10;i was here = aku berada disini&#10;kuman = makan&#10;turu = tidur"
          ></textarea>
        </div>

        <div class="admin-actions">
          <button class="btn btn-primary" onclick="handleParseOCR()">
            ⚡ Proses & Ekstrak Data (JSON)
          </button>
          <button class="btn btn-success" id="saveMemoryBtn" onclick="saveToMemory()" disabled>
            💾 Simpan ke Memori Aplikasi
          </button>
          <button class="btn btn-outline" onclick="exportDataJSON()">
            📥 Ekspor JSON
          </button>
          <button class="btn btn-outline" onclick="document.getElementById('importFileInput').click()">
            📤 Impor JSON
          </button>
          <input type="file" id="importFileInput" accept=".json" style="display:none" onchange="importDataJSON(event)">
        </div>

        <!-- Panel Hasil Parsing JSON & Preview -->
        <div id="parseStats" class="parse-stats-banner" style="display:none;"></div>
        
        <div class="preview-section">
          <h3>Hasil Parsing Struktur Data JSON (<span id="parsedItemCount">0</span> Entri)</h3>
          <div class="json-preview-box">
            <pre><code id="jsonPreviewCode">// Klik "Proses & Ekstrak Data" untuk melihat struktur JSON Array of Objects di sini</code></pre>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="app-footer">
    <p>Kamus Digital Bahasa Banggai - Indonesia &copy; 2025. Terintegrasi Memori Lokal & Parser Cerdas.</p>
  </footer>

  <script src="scripts.js"></script>
</body>
</html>`;

export const STANDALONE_CSS = `/* Reset & Base Styling */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .header-container {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.brand-badge {
  display: inline-block;
  background: #e0e7ff;
  color: #3730a3;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  margin-bottom: 0.25rem;
}

.brand h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.brand .subtitle {
  font-size: 0.875rem;
  color: #64748b;
}

/* Navigasi Tab */
.nav-tabs {
  display: flex;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 0.5rem;
  gap: 0.25rem;
}

.tab-btn {
  border: none;
  background: transparent;
  padding: 0.6rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.tab-btn.active {
  background: #ffffff;
  color: #0284c7;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

/* Main Container */
.main-container {
  max-width: 960px;
  width: 100%;
  margin: 1.5rem auto;
  padding: 0 1rem;
  flex: 1;
}

.page-section {
  display: none;
}

.page-section.active {
  display: block;
}

/* Kotak Pencarian */
.search-box-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04);
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.1rem;
  color: #94a3b8;
  pointer-events: none;
}

.search-input-wrapper input {
  width: 100%;
  padding: 0.9rem 2.75rem 0.9rem 2.85rem;
  font-size: 1.05rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.2s;
  background: #f8fafc;
}

.search-input-wrapper input:focus {
  border-color: #0284c7;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.clear-btn:hover {
  color: #0f172a;
}

.search-hint {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #64748b;
}

.badge-chip {
  display: inline-block;
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.15rem 0.45rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
}

/* Hasil Header */
.results-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .results-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.results-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.quick-tags {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.filter-chip {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  cursor: pointer;
  color: #475569;
  white-space: nowrap;
}

.filter-chip.active {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
}

/* Kartu Hasil Kamus */
.results-grid {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.entry-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  padding: 1.15rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.entry-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.entry-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.source-word {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0369a1;
}

.category-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
}

/* Penyorotan Cerdas Kata Bersarang */
.specific-aligned-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.625rem;
  padding: 0.75rem;
  margin: 0.6rem 0;
}

.specific-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #166534;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.25rem;
}

.specific-highlight {
  font-size: 1.05rem;
  color: #15803d;
  font-weight: 600;
}

.specific-highlight mark {
  background: #fef08a;
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-weight: 700;
}

.target-word {
  font-size: 1.05rem;
  color: #334155;
  margin-top: 0.35rem;
}

.full-context {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  border-top: 1px dashed #e2e8f0;
  padding-top: 0.5rem;
}

/* Highlight Text */
mark {
  background: #fef08a;
  color: #854d0e;
  padding: 0.05rem 0.2rem;
  border-radius: 0.2rem;
}

/* Halaman Admin & Textarea OCR */
.admin-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
}

.admin-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .admin-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.text-muted {
  font-size: 0.875rem;
  color: #64748b;
}

.textarea-wrapper textarea {
  width: 100%;
  padding: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.95rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 0.75rem;
  background: #f8fafc;
  outline: none;
  resize: vertical;
}

.textarea-wrapper textarea:focus {
  border-color: #0284c7;
  background: #ffffff;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Tombol */
.btn {
  padding: 0.6rem 1.15rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary {
  background: #0284c7;
  color: #ffffff;
}

.btn-primary:hover {
  background: #0369a1;
}

.btn-success {
  background: #16a34a;
  color: #ffffff;
}

.btn-success:hover {
  background: #15803d;
}

.btn-success:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f1f5f9;
  color: #334155;
  border-color: #cbd5e1;
}

.btn-outline {
  background: #ffffff;
  color: #475569;
  border-color: #cbd5e1;
}

.btn-outline:hover {
  background: #f8fafc;
}

/* Parse Stats Banner */
.parse-stats-banner {
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  font-size: 0.875rem;
  color: #166534;
}

/* JSON Preview Box */
.preview-section {
  margin-top: 1.5rem;
}

.preview-section h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #334155;
}

.json-preview-box {
  background: #0f172a;
  color: #38bdf8;
  padding: 1rem;
  border-radius: 0.75rem;
  max-height: 320px;
  overflow: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 1.5rem 1rem;
  font-size: 0.8rem;
  color: #94a3b8;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
}
`;

export const STANDALONE_JS = `/**
 * Kamus Digital Bahasa Banggai - Indonesia
 * Logika Pencarian Pintar (Smart Alignment) & OCR Parser
 */

// 1. DATA DATABASE DEFAULT
const DEFAULT_DATABASE = [
  {
    id: "bgg-0",
    source: "i was here",
    target: "aku berada disini",
    category: "ungkapan / kalimat",
    notes: "Contoh pengujian kata bersarang (here -> disini)"
  },
  {
    id: "bgg-1",
    source: "i yaku do kono",
    target: "aku berada disini",
    category: "ungkapan / kalimat",
    notes: "Bahasa Banggai asli: yaku = aku, kono = disini"
  },
  {
    id: "bgg-2",
    source: "kono",
    target: "disini",
    category: "kata keterangan",
    notes: "Menunjukkan tempat dekat penutur"
  },
  {
    id: "bgg-3",
    source: "tabea",
    target: "salam permisi",
    category: "sapaan",
    notes: "Sapaan adat Banggai"
  },
  {
    id: "bgg-4",
    source: "kuman",
    target: "makan",
    category: "kata kerja"
  },
  {
    id: "bgg-5",
    source: "turu",
    target: "tidur",
    category: "kata kerja"
  },
  {
    id: "bgg-6",
    source: "bola",
    target: "rumah",
    category: "kata benda"
  },
  {
    id: "bgg-7",
    source: "tano",
    target: "tanah tempat bumi",
    category: "kata benda"
  },
  {
    id: "bgg-8",
    source: "nuak",
    target: "air",
    category: "kata benda"
  },
  {
    id: "bgg-9",
    source: "mo'utang",
    target: "terima kasih",
    category: "ungkapan"
  },
  {
    id: "bgg-10",
    source: "i yaku kuman do bola",
    target: "aku makan di rumah",
    category: "ungkapan / kalimat"
  }
];

// Inisialisasi Memori Aplikasi (dari localStorage atau default)
let currentDictionary = [];
let parsedPendingEntries = [];
let activeCategoryFilter = 'semua';

function initApp() {
  const saved = localStorage.getItem('kamus_banggai_data');
  if (saved) {
    try {
      currentDictionary = JSON.parse(saved);
    } catch (e) {
      currentDictionary = [...DEFAULT_DATABASE];
    }
  } else {
    currentDictionary = [...DEFAULT_DATABASE];
  }

  // Setup event listener pencarian realtime
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderSearchResults(searchInput.value);
    });
  }

  renderSearchResults('');
}

// 2. LOGIKA PENCARIAN PINTAR (SMART SUB-WORD & SENTENCE ALIGNMENT)
function cleanWord(str) {
  return (str || '').toLowerCase().replace(/^[^\w\u00C0-\u024F\']+|[^\w\u00C0-\u024F\']+$/g, '').trim();
}

/**
 * Algoritma Cerdas: Jika dalam database terdapat "i was here = aku berada disini",
 * ketika pengguna mengetik "here", fungsi ini mendeteksi dan mengembalikan "disini".
 */
function extractSpecificAlignedWord(query, entry) {
  const q = cleanWord(query);
  if (!q) return null;

  const srcWords = entry.source.split(/\\s+/);
  const tgtWords = entry.target.split(/\\s+/);

  // Cari index di sisi source (Banggai / Asal)
  const srcIdx = srcWords.findIndex(w => cleanWord(w) === q);
  if (srcIdx !== -1) {
    // Penyelarasan 1-ke-1 langsung (contoh "i was here" -> index 2 adalah "here")
    if (srcWords.length === tgtWords.length) {
      return {
        matchedSide: 'source',
        specificQueryWord: srcWords[srcIdx],
        specificMeaning: tgtWords[srcIdx],
        explanation: 'Ekstraksi spesifik dari posisi kata ke-' + (srcIdx + 1)
      };
    }
    // Penyelarasan proporsional jika jumlah kata sedikit berbeda
    const relPos = srcWords.length > 1 ? srcIdx / (srcWords.length - 1) : 0;
    const tgtIdx = Math.min(tgtWords.length - 1, Math.round(relPos * (tgtWords.length - 1)));
    return {
      matchedSide: 'source',
      specificQueryWord: srcWords[srcIdx],
      specificMeaning: tgtWords[tgtIdx],
      explanation: 'Dideteksi berdasarkan keselarasan kalimat'
    };
  }

  // Cari jika pengguna mencari dari sisi Bahasa Indonesia
  const tgtIdx = tgtWords.findIndex(w => cleanWord(w) === q);
  if (tgtIdx !== -1) {
    if (srcWords.length === tgtWords.length) {
      return {
        matchedSide: 'target',
        specificQueryWord: tgtWords[tgtIdx],
        specificMeaning: srcWords[tgtIdx],
        explanation: 'Pencarian dari Bahasa Indonesia ke Banggai'
      };
    }
    const relPos = tgtWords.length > 1 ? tgtIdx / (tgtWords.length - 1) : 0;
    const srcIdxEst = Math.min(srcWords.length - 1, Math.round(relPos * (srcWords.length - 1)));
    return {
      matchedSide: 'target',
      specificQueryWord: tgtWords[tgtIdx],
      specificMeaning: srcWords[srcIdxEst],
      explanation: 'Pencarian terbalik ke kata Banggai'
    };
  }

  return null;
}

// 3. FUNGSI PARSER OCR TEKS (kata/kalimat = arti -> Array of Objects JSON)
function parseOCRText(rawText) {
  const lines = rawText.split(/\\r?\\n/);
  const parsedEntries = [];
  const errors = [];
  let skipped = 0;

  lines.forEach((lineText, idx) => {
    let line = lineText.trim();
    if (!line) {
      skipped++;
      return;
    }

    // Bersihkan garis pemisah scan OCR
    if (/^[-=~*#]{2,}/.test(line) || /^(halaman|page|kamus)\s+\\d+/i.test(line)) {
      skipped++;
      return;
    }

    // Bersihkan nomor urut OCR seperti "1. "
    line = line.replace(/^[\\d]+[\\.\\)\\-]\\s*/, '');

    // Cari pemisah '=' (atau toleransi ':')
    let sep = '=';
    if (!line.includes('=') && line.includes(':')) sep = ':';

    const sepIdx = line.indexOf(sep);
    if (sepIdx === -1) {
      errors.push({ line: idx + 1, text: lineText, reason: 'Tidak ada tanda pemisah =' });
      skipped++;
      return;
    }

    const source = line.substring(0, sepIdx).trim();
    const target = line.substring(sepIdx + sep.length).trim();

    if (!source || !target) {
      skipped++;
      return;
    }

    parsedEntries.push({
      id: 'ocr-' + Date.now() + '-' + idx,
      source: source,
      target: target,
      category: source.split(/\\s+/).length >= 3 ? 'ungkapan / kalimat' : 'kosa kata'
    });
  });

  return { parsedEntries, errors, total: lines.length, skipped };
}

// 4. RENDERING & UI ACTIONS
function renderSearchResults(keyword) {
  const listEl = document.getElementById('resultsList');
  const countEl = document.getElementById('resultsCount');
  if (!listEl) return;

  const query = (keyword || '').trim();
  const qClean = cleanWord(query);

  let filtered = currentDictionary;

  if (activeCategoryFilter !== 'semua') {
    filtered = filtered.filter(item => (item.category || '').toLowerCase().includes(activeCategoryFilter));
  }

  if (qClean) {
    filtered = filtered.map(item => {
      let score = 0;
      let aligned = null;

      if (cleanWord(item.source) === qClean) {
        score = 100;
      } else if (cleanWord(item.target) === qClean) {
        score = 95;
      } else {
        aligned = extractSpecificAlignedWord(qClean, item);
        if (aligned) {
          score = 80;
        } else if (item.source.toLowerCase().includes(qClean) || item.target.toLowerCase().includes(qClean)) {
          score = 50;
        }
      }

      return { item, score, aligned };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => ({ ...r.item, _aligned: r.aligned }));
  }

  countEl.innerText = 'Menampilkan ' + filtered.length + ' kosa kata';

  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="entry-card" style="text-align:center; padding:2rem; color:#64748b;">Tidak ada kata yang cocok dengan "' + escapeHtml(query) + '". Coba kata lain.</div>';
    return;
  }

  listEl.innerHTML = filtered.map(item => {
    let alignedHtml = '';

    // Tampilkan arti spesifik jika query adalah sub-kata dalam kalimat
    if (item._aligned) {
      alignedHtml = \`
        <div class="specific-aligned-box">
          <div class="specific-title">🎯 Arti Spesifik Terdeteksi:</div>
          <div class="specific-highlight">
            "\${escapeHtml(item._aligned.specificQueryWord)}" ➔ <strong>"\${escapeHtml(item._aligned.specificMeaning)}"</strong>
          </div>
          <div style="font-size:0.75rem; color:#166534; margin-top:0.2rem;">
            \${item._aligned.explanation}
          </div>
        </div>
      \`;
    }

    return \`
      <div class="entry-card">
        <div class="entry-top">
          <span class="source-word">\${highlightText(item.source, query)}</span>
          <span class="category-tag">\${item.category || 'kosa kata'}</span>
        </div>
        \${alignedHtml}
        <div class="target-word"><strong>Arti:</strong> \${highlightText(item.target, query)}</div>
        \${item.notes ? '<div class="full-context">' + escapeHtml(item.notes) + '</div>' : ''}
      </div>
    \`;
  }).join('');
}

function highlightText(text, keyword) {
  if (!keyword || !keyword.trim()) return escapeHtml(text);
  const clean = cleanWord(keyword);
  if (!clean) return escapeHtml(text);
  const regex = new RegExp('(' + escapeRegex(clean) + ')', 'gi');
  return escapeHtml(text).replace(regex, '<mark>$1</mark>');
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&');
}

// 5. EVENT HANDLERS
function switchTab(tabName) {
  document.getElementById('pageSearch').classList.toggle('active', tabName === 'search');
  document.getElementById('pageAdmin').classList.toggle('active', tabName === 'admin');
  document.getElementById('tabSearchBtn').classList.toggle('active', tabName === 'search');
  document.getElementById('tabAdminBtn').classList.toggle('active', tabName === 'admin');
}

function quickSearch(word) {
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = word;
    renderSearchResults(word);
  }
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = '';
    renderSearchResults('');
    input.focus();
  }
}

function filterCategory(cat) {
  activeCategoryFilter = cat;
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.toggle('active', c.innerText.toLowerCase().includes(cat.toLowerCase()));
  });
  renderSearchResults(document.getElementById('searchInput').value);
}

// ADMIN OCR ACTIONS
function loadSampleOCR() {
  const sample = 
\`i was here = aku berada disini
kono = disini
tabea = salam, permisi
yaku = aku, saya
kompua = kamu, anda
kuman = makan
turu = tidur
bola = rumah
tano = tanah, tempat
nuak = air
mo'utang = terima kasih
i yaku kuman do bola = aku makan di rumah\`;
  document.getElementById('ocrTextarea').value = sample;
}

function handleParseOCR() {
  const raw = document.getElementById('ocrTextarea').value;
  if (!raw.trim()) {
    alert('Silakan masukkan teks OCR terlebih dahulu!');
    return;
  }

  const res = parseOCRText(raw);
  parsedPendingEntries = res.parsedEntries;

  // Tampilkan statistik
  const statsEl = document.getElementById('parseStats');
  statsEl.style.display = 'block';
  statsEl.innerHTML = '✅ Berhasil memecah <strong>' + res.parsedEntries.length + '</strong> data entri valid (Dilewati: ' + res.skipped + ' baris).';

  document.getElementById('parsedItemCount').innerText = res.parsedEntries.length;
  document.getElementById('jsonPreviewCode').textContent = JSON.stringify(res.parsedEntries, null, 2);

  // Aktifkan tombol simpan
  const saveBtn = document.getElementById('saveMemoryBtn');
  if (saveBtn) saveBtn.disabled = res.parsedEntries.length === 0;
}

function saveToMemory() {
  if (!parsedPendingEntries.length) return;
  
  // Gabungkan ke kamus aktif
  currentDictionary = [...parsedPendingEntries, ...currentDictionary];
  localStorage.setItem('kamus_banggai_data', JSON.stringify(currentDictionary));

  alert('Berhasil menyimpan ' + parsedPendingEntries.length + ' entri baru ke memori aplikasi!');
  
  // Pindah ke tab pencarian untuk melihat data baru
  switchTab('search');
  renderSearchResults('');
}

function exportDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentDictionary, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "kamus_banggai_data.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importDataJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (Array.isArray(imported)) {
        currentDictionary = imported;
        localStorage.setItem('kamus_banggai_data', JSON.stringify(currentDictionary));
        alert('Berhasil mengimpor ' + imported.length + ' data kamus!');
        renderSearchResults('');
      }
    } catch (err) {
      alert('Format file JSON tidak valid!');
    }
  };
  reader.readAsText(file);
}

// Jalankan inisialisasi saat window dimuat
window.addEventListener('DOMContentLoaded', initApp);
`;
