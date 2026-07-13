import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const currentDate = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        { url: SITE_URL, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
        { url: `${SITE_URL}/games`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
        { url: `${SITE_URL}/topup`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${SITE_URL}/track`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
        { url: `${SITE_URL}/leaderboard`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.6 },
        { url: `${SITE_URL}/about-us`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${SITE_URL}/login`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.3 },
        { url: `${SITE_URL}/register`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.3 },
        { url: `${SITE_URL}/privacy-policy`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.25 },
        { url: `${SITE_URL}/terms-of-service`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.25 },
        { url: `${SITE_URL}/refund-policy`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.25 },
    ];

    let gamePages: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${apiUrl}/categories?all=true`, {
            next: { revalidate: 3600 },
        });
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
            gamePages = data.data
                .filter((cat: { slug?: string; isActive?: boolean }) => cat.slug && cat.isActive !== false)
                .map((cat: { slug: string; updatedAt?: string }) => ({
                    url: `${SITE_URL}/order/${cat.slug}`,
                    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : currentDate,
                    changeFrequency: 'weekly' as const,
                    priority: 0.9,
                }));
        }
    } catch {
        const popularSlugs = [
            'mobile-legends-a-956',
            'free-fire',
            'pubg-mobile',
            'genshin-impact',
            'honkai-star-rail',
            'valorant',
        ];
        gamePages = popularSlugs.map((slug) => ({
            url: `${SITE_URL}/order/${slug}`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));
    }

    return [...staticPages, ...gamePages];
}
