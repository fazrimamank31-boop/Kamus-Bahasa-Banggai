import { DictionaryEntry } from '../types';

export const INITIAL_DICTIONARY: DictionaryEntry[] = [
  // Contoh spesifik sesuai permintaan prompt pengguna:
  {
    id: 'bgg-test-0',
    source: 'i was here',
    target: 'aku berada disini',
    category: 'ungkapan / kalimat',
    notes: 'Contoh kalimat pengujian deteksi kata bersarang (here -> disini)',
    examples: [
      { banggai: 'i was here', indonesia: 'aku berada disini' }
    ]
  },
  {
    id: 'bgg-1',
    source: 'i yaku do kono',
    target: 'aku berada disini',
    category: 'ungkapan / kalimat',
    notes: 'Bahasa Banggai asli: yaku = aku, do = di/berada di, kono = disini',
    examples: [
      { banggai: 'I yaku do kono koono ini', indonesia: 'Aku berada disini saat ini' }
    ]
  },
  {
    id: 'bgg-2',
    source: 'kono',
    target: 'disini',
    category: 'kata keterangan',
    notes: 'Menunjukkan lokasi yang dekat dengan penutur',
  },
  {
    id: 'bgg-3',
    source: 'konoa',
    target: 'disitu',
    category: 'kata keterangan',
    notes: 'Menunjukkan lokasi yang dekat dengan lawan bicara',
  },
  {
    id: 'bgg-4',
    source: 'koolo',
    target: 'disana',
    category: 'kata keterangan',
    notes: 'Menunjukkan lokasi yang jauh dari kedua penutur',
  },
  {
    id: 'bgg-5',
    source: 'tabea',
    target: 'salam permisi',
    category: 'ungkapan',
    notes: 'Ucapan penghormatan adat saat menyapa atau mohon izin',
  },
  {
    id: 'bgg-6',
    source: 'yaku',
    target: 'aku saya',
    category: 'kata ganti',
    notes: 'Kata ganti orang pertama tunggal',
  },
  {
    id: 'bgg-7',
    source: 'kompua',
    target: 'kamu anda',
    category: 'kata ganti',
    notes: 'Kata ganti orang kedua tunggal',
  },
  {
    id: 'bgg-8',
    source: 'kuman',
    target: 'makan',
    category: 'kata kerja',
    notes: 'Aktivitas mengonsumsi makanan',
  },
  {
    id: 'bgg-9',
    source: 'mo\'inum',
    target: 'minum',
    category: 'kata kerja',
    notes: 'Aktivitas meminum cairan',
  },
  {
    id: 'bgg-10',
    source: 'turu',
    target: 'tidur',
    category: 'kata kerja',
    notes: 'Istirahat terlelap',
  },
  {
    id: 'bgg-11',
    source: 'bola',
    target: 'rumah',
    category: 'kata benda',
    notes: 'Tempat tinggal atau kediaman',
  },
  {
    id: 'bgg-12',
    source: 'tano',
    target: 'tanah tempat bumi',
    category: 'kata benda',
    notes: 'Wilayah daratan atau tempat kediaman',
  },
  {
    id: 'bgg-13',
    source: 'nuak',
    target: 'air',
    category: 'kata benda',
    notes: 'Zat cair untuk kehidupan sehari-hari',
  },
  {
    id: 'bgg-14',
    source: 'apui',
    target: 'api',
    category: 'kata benda',
    notes: 'Zat panas / bara api',
  },
  {
    id: 'bgg-15',
    source: 'pai',
    target: 'pergi',
    category: 'kata kerja',
    notes: 'Melangkah meninggalkan tempat',
  },
  {
    id: 'bgg-16',
    source: 'tula',
    target: 'datang tiba',
    category: 'kata kerja',
    notes: 'Hadir ke suatu tempat',
  },
  {
    id: 'bgg-17',
    source: 'babasal',
    target: 'besar agung',
    category: 'kata sifat',
    notes: 'Ukuran besar atau kehormatan bangsawan',
  },
  {
    id: 'bgg-18',
    source: 'koto',
    target: 'kecil',
    category: 'kata sifat',
    notes: 'Ukuran kecil',
  },
  {
    id: 'bgg-19',
    source: 'baine',
    target: 'wanita perempuan',
    category: 'kata benda',
    notes: 'Sosok perempuan',
  },
  {
    id: 'bgg-20',
    source: 'mane',
    target: 'lelaki pria',
    category: 'kata benda',
    notes: 'Sosok laki-laki',
  },
  {
    id: 'bgg-21',
    source: 'sa\'',
    target: 'satu',
    category: 'angka / bilangan',
    notes: 'Bilangan 1',
  },
  {
    id: 'bgg-22',
    source: 'rua',
    target: 'dua',
    category: 'angka / bilangan',
    notes: 'Bilangan 2',
  },
  {
    id: 'bgg-23',
    source: 'tolu',
    target: 'tiga',
    category: 'angka / bilangan',
    notes: 'Bilangan 3',
  },
  {
    id: 'bgg-24',
    source: 'paat',
    target: 'empat',
    category: 'angka / bilangan',
    notes: 'Bilangan 4',
  },
  {
    id: 'bgg-25',
    source: 'lima',
    target: 'lima',
    category: 'angka / bilangan',
    notes: 'Bilangan 5',
  },
  {
    id: 'bgg-26',
    source: 'i yaku kuman do bola',
    target: 'aku makan di rumah',
    category: 'ungkapan / kalimat',
    notes: 'Contoh kalimat sehari-hari',
  },
  {
    id: 'bgg-27',
    source: 'i kompua tula do tano ini',
    target: 'kamu datang di tempat ini',
    category: 'ungkapan / kalimat',
    notes: 'Ungkapan penyambutan tamu',
  },
  {
    id: 'bgg-28',
    source: 'mo\'utang',
    target: 'terima kasih',
    category: 'ungkapan',
    notes: 'Ungkapan rasa terima kasih dan syukur',
  },
  {
    id: 'bgg-29',
    source: 'sinondak',
    target: 'masak memasak',
    category: 'kata kerja',
    notes: 'Aktivitas mengolah masakan di dapur',
  },
  {
    id: 'bgg-30',
    source: 'lombon',
    target: 'hutan belantara',
    category: 'kata benda',
    notes: 'Kawasan hutan rimba pulau Banggai',
  }
];

export const SAMPLE_OCR_PAGE = `--- KAMUS BAHASA BANGGAI - INDONESIA (HALAMAN 42) ---
[OCR SCAN HASIL KAMUS CETAK]

i was here = aku berada disini
kono = disini
konoa = disitu
koolo = disana
tabea = salam, permisi
yaku = aku, saya
kompua = kamu, anda
kuman = makan
mo'inum = minum
turu = tidur
bola = rumah
tano = tanah, tempat
nuak = air
apui = api
pai = pergi
tula = datang
babasal = besar, agung
koto = kecil
baine = wanita, perempuan
mane = lelaki, pria
mo'utang = terima kasih
i yaku kuman do bola = aku makan di rumah
i kompua tula do tano ini = kamu datang di tempat ini
sinondak = memasak`;
