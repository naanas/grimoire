import Script from 'next/script';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

type Props = {
    slug: string;
    gameName: string;
    description: string;
    image?: string | null;
};

export default function GameStructuredData({ slug, gameName, description, image }: Props) {
    const pageUrl = `${SITE_URL}/order/${slug}`;

    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: SITE_NAME,
                        item: SITE_URL,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Top Up Game',
                        item: `${SITE_URL}/games`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: gameName,
                        item: pageUrl,
                    },
                ],
            },
            {
                '@type': 'WebPage',
                '@id': `${pageUrl}#webpage`,
                url: pageUrl,
                name: `Top Up ${gameName} Murah | ${SITE_NAME}`,
                description,
                isPartOf: { '@id': `${SITE_URL}/#website` },
                about: { '@type': 'Thing', name: gameName },
                inLanguage: 'id-ID',
            },
            {
                '@type': 'Product',
                name: `Top Up ${gameName}`,
                description,
                url: pageUrl,
                image: image || `${SITE_URL}/icon.png`,
                brand: { '@type': 'Brand', name: SITE_NAME },
                offers: {
                    '@type': 'AggregateOffer',
                    priceCurrency: 'IDR',
                    lowPrice: '1000',
                    highPrice: '5000000',
                    offerCount: '50',
                    availability: 'https://schema.org/InStock',
                    seller: { '@id': `${SITE_URL}/#organization` },
                },
            },
        ],
    };

    return (
        <Script
            id={`game-structured-data-${slug}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
