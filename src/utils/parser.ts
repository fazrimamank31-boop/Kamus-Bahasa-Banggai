import { DictionaryEntry, ParseResult } from '../types';

export interface ParseOptions {
  delimiter?: string; // Default: '='
  autoDetectDelimiter?: boolean;
  cleanPageNoise?: boolean;
  autoExtractCategory?: boolean;
}

/**
 * Memecah (parse) teks mentah hasil pembacaan OCR per halaman kamus
 * berformat "kata/kalimat=arti" menjadi struktur data JSON (Array of Objects)
 */
export function parseOCRText(rawText: string, options: ParseOptions = {}): ParseResult {
  const {
    delimiter = '=',
    autoDetectDelimiter = true,
    cleanPageNoise = true,
    autoExtractCategory = true,
  } = options;

  const lines = rawText.split(/\r?\n/);
  const entries: DictionaryEntry[] = [];
  const errors: { line: number; rawText: string; reason: string }[] = [];

  let skippedCount = 0;
  let parsedCount = 0;

  lines.forEach((lineText, index) => {
    const lineNum = index + 1;
    let line = lineText.trim();

    // 1. Lewati baris kosong
    if (!line) {
      skippedCount++;
      return;
    }

    // 2. Bersihkan noise OCR jika diaktifkan (header halaman, nomor halaman, garis pembatas)
    if (cleanPageNoise) {
      // Pola baris pembatas atau header halaman seperti: --- HALAMAN 12 ---, === BAB 1 ===
      if (/^[-=~*#]{2,}/.test(line) || /[-=~*#]{2,}$/.test(line)) {
        skippedCount++;
        return;
      }
      // Pola judul header: KAMUS BANGGAI, HALAMAN 42, PAGE 10
      if (/^(halaman|page|kamus|bab|chapter)\s+\d+/i.test(line) || /^\[ocr/i.test(line)) {
        skippedCount++;
        return;
      }
      // Pola hanya angka halaman di satu baris (misal "42")
      if (/^\d{1,4}$/.test(line)) {
        skippedCount++;
        return;
      }
    }

    // 3. Bersihkan nomor urut di awal baris jika ada (misal "1. kata = arti" atau "• kata = arti")
    line = line.replace(/^[\d]+[\.\)\-]\s*/, '').replace(/^[•\-\*]\s*/, '').trim();

    // 4. Deteksi delimiter
    let sep = delimiter;
    if (autoDetectDelimiter) {
      if (line.includes('=')) {
        sep = '=';
      } else if (line.includes('->')) {
        sep = '->';
      } else if (line.includes('—')) {
        sep = '—';
      } else if (line.includes('–')) {
        sep = '–';
      } else if (line.includes(':') && !line.startsWith('http')) {
        sep = ':';
      } else if (line.includes(' - ')) {
        sep = ' - ';
      }
    }

    // Periksa apakah terdapat pemisah
    const sepIndex = line.indexOf(sep);
    if (sepIndex === -1) {
      errors.push({
        line: lineNum,
        rawText: lineText,
        reason: `Format tidak sesuai. Tidak ditemukan tanda pemisah "${sep}" (format harus: kata/kalimat ${sep} arti)`,
      });
      skippedCount++;
      return;
    }

    let sourcePart = line.substring(0, sepIndex).trim();
    let targetPart = line.substring(sepIndex + sep.length).trim();

    if (!sourcePart || !targetPart) {
      errors.push({
        line: lineNum,
        rawText: lineText,
        reason: 'Sisi kata atau sisi arti tidak boleh kosong',
      });
      skippedCount++;
      return;
    }

    // 5. Ekstraksi kategori gramatikal dari teks jika ada
    let category = 'kosa kata';
    let notes = '';

    if (autoExtractCategory) {
      // Deteksi tag seperti (n), (v), (adj), [kb], [kk], [ks]
      const categoryMatch = sourcePart.match(/\s*[\(\[](n|v|adj|adv|pron|num|kb|kk|ks|ket|ungkapan|kalimat|sapaan)[\)\]]\s*/i)
        || targetPart.match(/\s*[\(\[](n|v|adj|adv|pron|num|kb|kk|ks|ket|ungkapan|kalimat|sapaan)[\)\]]\s*/i);

      if (categoryMatch) {
        const rawCat = categoryMatch[1].toLowerCase();
        const catMap: Record<string, string> = {
          n: 'kata benda',
          kb: 'kata benda',
          v: 'kata kerja',
          kk: 'kata kerja',
          adj: 'kata sifat',
          ks: 'kata sifat',
          adv: 'kata keterangan',
          ket: 'kata keterangan',
          pron: 'kata ganti',
          num: 'angka / bilangan',
          ungkapan: 'ungkapan',
          kalimat: 'kalimat',
          sapaan: 'sapaan / salam'
        };
        category = catMap[rawCat] || rawCat;
        // Bersihkan tanda dari teks
        sourcePart = sourcePart.replace(categoryMatch[0], '').trim();
        targetPart = targetPart.replace(categoryMatch[0], '').trim();
      } else if (sourcePart.split(/\s+/).length >= 3) {
        category = 'ungkapan / kalimat';
      }
    }

    // Deteksi catatan dalam kurung kurawal atau kurung biasa di akhir
    const notesMatch = targetPart.match(/\s*\((.*?)\)\s*$/);
    if (notesMatch) {
      notes = notesMatch[1];
      targetPart = targetPart.replace(notesMatch[0], '').trim();
    }

    // Bersihkan sisa tanda baca di ujung
    targetPart = targetPart.replace(/[;,.\s]+$/, '');
    sourcePart = sourcePart.replace(/[;,.\s]+$/, '');

    const newEntry: DictionaryEntry = {
      id: `ocr-${Date.now()}-${parsedCount}-${Math.random().toString(36).substring(2, 6)}`,
      source: sourcePart,
      target: targetPart,
      category,
      notes: notes || undefined,
      isCustom: true,
      dateAdded: new Date().toISOString(),
    };

    entries.push(newEntry);
    parsedCount++;
  });

  return {
    entries,
    errors,
    stats: {
      totalLines: lines.length,
      parsedCount,
      skippedCount,
    },
  };
}

/**
 * Format array of DictionaryEntry kembali menjadi teks OCR kata=arti
 */
export function formatEntriesToOCRText(entries: DictionaryEntry[]): string {
  return entries
    .map(e => {
      let line = `${e.source} = ${e.target}`;
      if (e.notes) {
        line += ` (${e.notes})`;
      }
      return line;
    })
    .join('\n');
}
