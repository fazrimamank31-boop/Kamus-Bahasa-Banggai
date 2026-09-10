import { DictionaryEntry, SearchResult, SearchDirection } from '../types';

/**
 * Pembersih token kata (menghilangkan tanda baca dan lowercase)
 */
export function cleanWord(word: string): string {
  return word.toLowerCase().replace(/^[^\w\u00C0-\u024F\']+|[^\w\u00C0-\u024F\']+$/g, '').trim();
}

/**
 * Memecah kalimat menjadi array kata bersih beserta offset posisi aslinya
 */
export function tokenizeWithOffset(text: string): { word: string; clean: string; start: number; end: number }[] {
  const tokens: { word: string; clean: string; start: number; end: number }[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const clean = cleanWord(raw);
    if (clean) {
      tokens.push({
        word: raw,
        clean,
        start: match.index,
        end: match.index + raw.length,
      });
    }
  }

  return tokens;
}

/**
 * Membangun kamus kata tunggal untuk membantu penyelarasan kata (word alignment)
 */
function buildVocabularyLookup(dictionary: DictionaryEntry[]): Map<string, Set<string>> {
  const sourceToTarget = new Map<string, Set<string>>();

  for (const entry of dictionary) {
    const srcTokens = tokenizeWithOffset(entry.source);
    const tgtTokens = tokenizeWithOffset(entry.target);

    // Jika kata tunggal ke kata tunggal
    if (srcTokens.length === 1 && tgtTokens.length === 1) {
      const s = srcTokens[0].clean;
      const t = tgtTokens[0].clean;
      if (!sourceToTarget.has(s)) sourceToTarget.set(s, new Set());
      sourceToTarget.get(s)!.add(t);
    }
  }

  return sourceToTarget;
}

/**
 * Algoritma cerdas untuk mengekstrak arti kata spesifik dari dalam kalimat.
 * Contoh: "i was here" = "aku berada disini", mencari "here" -> menghasilkan "disini".
 */
export function extractSpecificWordTranslation(
  query: string,
  entry: DictionaryEntry,
  vocabLookup: Map<string, Set<string>>
): {
  specificWord: string;
  specificTranslation: string;
  sourceRange?: { start: number; end: number };
  targetRange?: { start: number; end: number };
  explanation?: string;
  confidence: number;
} | null {
  const q = cleanWord(query);
  if (!q) return null;

  const srcTokens = tokenizeWithOffset(entry.source);
  const tgtTokens = tokenizeWithOffset(entry.target);

  if (srcTokens.length === 0 || tgtTokens.length === 0) return null;

  // Kasus 1: Query ada di kalimat sumber (Bahasa Banggai / Source)
  const matchedSrcIndex = srcTokens.findIndex(t => t.clean === q || t.clean.startsWith(q));

  if (matchedSrcIndex !== -1) {
    const srcToken = srcTokens[matchedSrcIndex];

    // Cek A: Apakah ada padanan kata tunggal yang sudah terdaftar di kamus umum?
    const knownTranslations = vocabLookup.get(srcToken.clean);
    if (knownTranslations) {
      for (const knownTarget of knownTranslations) {
        const foundTgtIndex = tgtTokens.findIndex(t => t.clean === knownTarget);
        if (foundTgtIndex !== -1) {
          return {
            specificWord: srcToken.word,
            specificTranslation: tgtTokens[foundTgtIndex].word,
            sourceRange: { start: srcToken.start, end: srcToken.end },
            targetRange: { start: tgtTokens[foundTgtIndex].start, end: tgtTokens[foundTgtIndex].end },
            explanation: `Ditemukan kecocokan leksikal langsung "${srcToken.clean}" = "${tgtTokens[foundTgtIndex].clean}" di dalam kalimat`,
            confidence: 0.95,
          };
        }
      }
    }

    // Cek B: Penyelarasan Posisi Proporsional (Positional Alignment)
    // Jika jumlah kata sama: 1-ke-1 alignment (seperti "i was here" (3 kata) -> "aku berada disini" (3 kata))
    if (srcTokens.length === tgtTokens.length) {
      const tgtToken = tgtTokens[matchedSrcIndex];
      return {
        specificWord: srcToken.word,
        specificTranslation: tgtToken.word,
        sourceRange: { start: srcToken.start, end: srcToken.end },
        targetRange: { start: tgtToken.start, end: tgtToken.end },
        explanation: `Posisi kata ke-${matchedSrcIndex + 1} ("${srcToken.clean}") selaras langsung dengan kata ke-${matchedSrcIndex + 1} target ("${tgtToken.clean}")`,
        confidence: 0.9,
      };
    }

    // Jika jumlah kata berbeda: hitung posisi relatif ternormalisasi
    const relPos = srcTokens.length > 1 ? matchedSrcIndex / (srcTokens.length - 1) : 0;
    const estimatedTgtIndex = Math.min(
      tgtTokens.length - 1,
      Math.max(0, Math.round(relPos * (tgtTokens.length - 1)))
    );
    const tgtToken = tgtTokens[estimatedTgtIndex];

    return {
      specificWord: srcToken.word,
      specificTranslation: tgtToken.word,
      sourceRange: { start: srcToken.start, end: srcToken.end },
      targetRange: { start: tgtToken.start, end: tgtToken.end },
      explanation: `Dideteksi melalui analisis posisi relatif kalimat (${Math.round(relPos * 100)}% urutan kalimat)`,
      confidence: 0.75,
    };
  }

  // Kasus 2: Query ada di kalimat target (Bahasa Indonesia / Target)
  const matchedTgtIndex = tgtTokens.findIndex(t => t.clean === q || t.clean.startsWith(q));

  if (matchedTgtIndex !== -1) {
    const tgtToken = tgtTokens[matchedTgtIndex];

    // Penyelarasan 1-ke-1 terbalik
    if (srcTokens.length === tgtTokens.length) {
      const srcToken = srcTokens[matchedTgtIndex];
      return {
        specificWord: tgtToken.word,
        specificTranslation: srcToken.word,
        sourceRange: { start: srcToken.start, end: srcToken.end },
        targetRange: { start: tgtToken.start, end: tgtToken.end },
        explanation: `Pencarian dari Bahasa Indonesia: "${tgtToken.clean}" terpetakan ke kata Banggai "${srcToken.clean}"`,
        confidence: 0.9,
      };
    }

    // Penyelarasan relatif terbalik
    const relPos = tgtTokens.length > 1 ? matchedTgtIndex / (tgtTokens.length - 1) : 0;
    const estimatedSrcIndex = Math.min(
      srcTokens.length - 1,
      Math.max(0, Math.round(relPos * (srcTokens.length - 1)))
    );
    const srcToken = srcTokens[estimatedSrcIndex];

    return {
      specificWord: tgtToken.word,
      specificTranslation: srcToken.word,
      sourceRange: { start: srcToken.start, end: srcToken.end },
      targetRange: { start: tgtToken.start, end: tgtToken.end },
      explanation: `Dideteksi dari Bahasa Indonesia ke Banggai berdasarkan posisi kalimat`,
      confidence: 0.75,
    };
  }

  return null;
}

/**
 * Mesin pencarian pintar dengan deteksi kata bersarang dan peringkat skor relevansi
 */
export function searchDictionary(
  query: string,
  dictionary: DictionaryEntry[],
  direction: SearchDirection = 'all'
): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) {
    // Jika query kosong, kembalikan semua data diurutkan abjad
    return dictionary.map(entry => ({
      entry,
      matchType: 'exact',
      query: '',
      matchedField: 'source',
      score: 1,
    }));
  }

  const q = cleanWord(trimmed);
  const vocabLookup = buildVocabularyLookup(dictionary);
  const results: SearchResult[] = [];

  for (const entry of dictionary) {
    const srcClean = entry.source.toLowerCase();
    const tgtClean = entry.target.toLowerCase();

    const checkSource = direction === 'all' || direction === 'banggai_to_id';
    const checkTarget = direction === 'all' || direction === 'id_to_banggai';

    // 1. Exact Match (Kecocokan Sempurna)
    if (checkSource && cleanWord(entry.source) === q) {
      results.push({
        entry,
        matchType: 'exact',
        query: trimmed,
        matchedField: 'source',
        specificSourceWord: entry.source,
        specificTargetWord: entry.target,
        score: 100,
        alignmentExplanation: 'Kecocokan leksikal kata utama',
      });
      continue;
    }

    if (checkTarget && cleanWord(entry.target) === q) {
      results.push({
        entry,
        matchType: 'exact',
        query: trimmed,
        matchedField: 'target',
        specificSourceWord: entry.source,
        specificTargetWord: entry.target,
        score: 98,
        alignmentExplanation: 'Kecocokan langsung terjemahan bahasa Indonesia',
      });
      continue;
    }

    // 2. Prefix Match (Awalan Kata)
    if (checkSource && cleanWord(entry.source).startsWith(q)) {
      results.push({
        entry,
        matchType: 'prefix',
        query: trimmed,
        matchedField: 'source',
        specificSourceWord: entry.source,
        specificTargetWord: entry.target,
        score: 85,
      });
      continue;
    }

    if (checkTarget && cleanWord(entry.target).startsWith(q)) {
      results.push({
        entry,
        matchType: 'prefix',
        query: trimmed,
        matchedField: 'target',
        specificSourceWord: entry.source,
        specificTargetWord: entry.target,
        score: 80,
      });
      continue;
    }

    // 3. Smart Extraction: Deteksi kata di dalam kalimat (Word in phrase alignment)
    // Contoh kasus kunci: "i was here" -> mencari "here" menghasilkan "disini"
    const alignment = extractSpecificWordTranslation(trimmed, entry, vocabLookup);

    if (alignment) {
      const isFromSource = srcClean.includes(q);
      results.push({
        entry,
        matchType: 'aligned_word',
        query: trimmed,
        matchedField: isFromSource ? 'source' : 'target',
        specificSourceWord: isFromSource ? alignment.specificWord : alignment.specificTranslation,
        specificTargetWord: isFromSource ? alignment.specificTranslation : alignment.specificWord,
        alignmentExplanation: alignment.explanation,
        score: 70 + Math.round(alignment.confidence * 20),
      });
      continue;
    }

    // 4. Substring Match biasa jika belum terdeteksi
    if (checkSource && srcClean.includes(q)) {
      results.push({
        entry,
        matchType: 'word_in_phrase',
        query: trimmed,
        matchedField: 'source',
        score: 50,
      });
      continue;
    }

    if (checkTarget && tgtClean.includes(q)) {
      results.push({
        entry,
        matchType: 'word_in_phrase',
        query: trimmed,
        matchedField: 'target',
        score: 45,
      });
      continue;
    }
  }

  // Urutkan berdasarkan skor tertinggi
  return results.sort((a, b) => b.score - a.score);
}
