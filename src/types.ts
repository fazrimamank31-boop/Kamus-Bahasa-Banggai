export interface DictionaryEntry {
  id: string;
  source: string; // Kata atau kalimat dalam Bahasa Banggai
  target: string; // Arti atau terjemahan dalam Bahasa Indonesia
  category?: string; // e.g., kata benda, kata kerja, kata sifat, ungkapan/kalimat
  notes?: string; // Catatan fonetik, dialek, atau konteks pemakaian
  examples?: {
    banggai: string;
    indonesia: string;
  }[];
  isCustom?: boolean; // Ditambahkan oleh Admin dari OCR
  dateAdded?: string;
}

export interface AlignedWordMatch {
  sourceWord: string;
  targetWord: string;
  sourceWordIndex: number;
  targetWordIndex: number;
  confidence: number;
}

export interface SearchResult {
  entry: DictionaryEntry;
  matchType: 'exact' | 'prefix' | 'word_in_phrase' | 'aligned_word' | 'fuzzy';
  query: string;
  matchedField: 'source' | 'target';
  specificSourceWord?: string;
  specificTargetWord?: string; // e.g. "here" -> "disini" or "kono" -> "disini"
  alignmentExplanation?: string;
  score: number;
}

export interface ParseResult {
  entries: DictionaryEntry[];
  errors: { line: number; rawText: string; reason: string }[];
  stats: {
    totalLines: number;
    parsedCount: number;
    skippedCount: number;
  };
}

export type SearchDirection = 'all' | 'banggai_to_id' | 'id_to_banggai';
