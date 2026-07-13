import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://grimoirecoins.store';
export const SITE_NAME = 'Grimoire Coins';
export const SITE_TAGLINE = 'Top Up Game Murah, Cepat & Aman';

/** ~155 chars — fits Google SERP snippet without awkward truncation */
export const SITE_DESCRIPTION =
    'Grimoire Coins — top up Mobile Legends, Free Fire, PUBG & 100+ game. Proses instan 24 jam, harga murah, bayar QRIS & e-wallet. Aman & terpercaya.';

export const DEFAULT_OG_IMAGE = '/icon.png';

export const SITE_KEYWORDS = [
    'grimoire coins',
    'top up game',
    'topup game murah',
    'top up game indonesia',
    'diamond ml',
    'diamond mobile legends',
    'topup ml murah',
    'dm ff',
    'diamond free fire',
    'uc pubg mobile',
    'top up genshin impact',
    'valorant points',
    'voucher game murah',
    'top up otomatis 24 jam',
];

export const SITE_FAQ = [
    {
        question: 'Apa itu Grimoire Coins?',
        answer:
            'Grimoire Coins adalah platform top-up game online di Indonesia untuk Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, dan ratusan game lain. Proses otomatis 24 jam dengan pembayaran QRIS, transfer bank, dan e-wallet.',
    },
    {
        question: 'Berapa lama proses top up di Grimoire Coins?',
        answer:
            'Sebagian besar pesanan diproses otomatis dalam hitungan detik hingga beberapa menit setelah pembayaran berhasil. Sistem kami aktif 24/7 tanpa antrian manual.',
    },
    {
        question: 'Metode pembayaran apa saja yang tersedia?',
        answer:
            'Kamu bisa bayar via QRIS, virtual account (BCA, Mandiri, BNI, BRI), Alfamart/Indomaret, serta e-wallet seperti GoPay, OVO, Dana, dan ShopeePay.',
    },
    {
        question: 'Apakah top up di Grimoire Coins aman?',
        answer:
            'Ya. Kami menggunakan gateway pembayaran resmi, enkripsi SSL, dan proses top-up melalui supplier terpercaya. Data transaksi kamu dilindungi.',
    },
    {
        question: 'Bagaimana cara cek status pesanan?',
        answer:
            'Gunakan halaman Lacak Pesanan di grimoirecoins.store/track dengan nomor invoice (contoh: GRM-xxxxxxxx). Status akan diperbarui otomatis setelah pembayaran dan proses top-up selesai.',
    },
];

const GAME_KEYWORD_MAP: Record<string, string[]> = {
    'mobile-legends': [
        'diamond ml',
        'topup mobile legends',
        'beli diamond ml',
        'top up ml murah',
        'diamond mobile legends murah',
        'mlbb top up',
    ],
    'free-fire': ['dm ff', 'diamond free fire', 'topup ff murah', 'beli diamond ff', 'ff diamond murah'],
    'pubg-mobile': ['uc pubg', 'topup pubg mobile', 'beli uc pubg', 'unknown cash pubg murah'],
    'genshin-impact': ['genesis crystal genshin', 'topup genshin', 'primogem genshin', 'top up genshin murah'],
    'honkai-star-rail': ['stellar jade', 'topup honkai star rail', 'oneiric shard'],
    'valorant': ['vp valorant', 'topup valorant', 'valorant points murah'],
    'point-blank': ['pb cash', 'topup point blank', 'top up pb murah'],
    'call-of-duty-mobile': ['codm cp', 'top up cod mobile', 'cp codm murah'],
};

export function resolveGameKeywordBase(slug: string): string {
    return Object.keys(GAME_KEYWORD_MAP).find((key) => slug.startsWith(key)) || '';
}

export function getGameKeywords(slug: string, gameName: string): string[] {
    const base = resolveGameKeywordBase(slug);
    const specific = base ? GAME_KEYWORD_MAP[base] : [];
    const normalized = gameName.toLowerCase();

    return [
        `topup ${normalized}`,
        `top up ${normalized} murah`,
        `beli ${normalized}`,
        `${normalized} murah`,
        ...specific,
        'topup game murah',
        'top up game indonesia',
        'grimoire coins',
    ];
}

export function buildPageMetadata({
    title,
    description,
    path,
    keywords = [],
    noIndex = false,
}: {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    noIndex?: boolean;
}): Metadata {
    const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

    return {
        title,
        description,
        keywords: keywords.length > 0 ? keywords : SITE_KEYWORDS,
        alternates: { canonical: url },
        openGraph: {
            type: 'website',
            locale: 'id_ID',
            url,
            siteName: SITE_NAME,
            title,
            description,
            images: [
                {
                    url: DEFAULT_OG_IMAGE,
                    width: 512,
                    height: 512,
                    alt: `${SITE_NAME} Logo`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [DEFAULT_OG_IMAGE],
        },
        robots: noIndex
            ? { index: false, follow: false }
            : {
                  index: true,
                  follow: true,
                  googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
              },
    };
}
