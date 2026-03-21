import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grimoirecoins.store';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const currentDate = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/games`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
        { url: `${baseUrl}/topup`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/track`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.6 },
        { url: `${baseUrl}/about-us`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/login`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
        { url: `${baseUrl}/register`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
        { url: `${baseUrl}/privacy-policy`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terms-of-service`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/refund-policy`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
    ];

    // Dynamic game pages — fetch all categories from API
    let gamePages: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${apiUrl}/categories`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
            gamePages = data.data
                .filter((cat: any) => cat.isActive !== false)
                .map((cat: any) => ({
                    url: `${baseUrl}/order/${cat.slug}`,
                    lastModified: currentDate,
                    changeFrequency: 'weekly' as const,
                    priority: 0.85, // High priority — these are the money pages
                }));
        }
    } catch (err) {
        // Fallback: manually add popular games if API is unavailable
        const popularSlugs = [
            'mobile-legends', 'free-fire', 'pubg-mobile', 'genshin-impact',
            'honkai-star-rail', 'valorant', 'point-blank', 'call-of-duty-mobile'
        ];
        gamePages = popularSlugs.map(slug => ({
            url: `${baseUrl}/order/${slug}`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.85,
        }));
    }

    return [...staticPages, ...gamePages];
}
