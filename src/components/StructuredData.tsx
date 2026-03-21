import Script from 'next/script';

export default function StructuredData() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grimoirecoins.store';

    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${baseUrl}/#organization`,
                name: 'Grimoire Coins',
                url: baseUrl,
                logo: `${baseUrl}/logo.png`,
                description: 'Platform top-up game murah dan terpercaya di Indonesia dengan proses instan 24/7.',
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'Customer Service',
                    availableLanguage: ['Indonesian', 'English']
                },
                sameAs: [
                    'https://instagram.com/grimoirecoins',
                ]
            },
            {
                '@type': 'WebSite',
                '@id': `${baseUrl}/#website`,
                url: baseUrl,
                name: 'Grimoire Coins',
                description: 'Top up game murah, aman, dan instan!',
                publisher: {
                    '@id': `${baseUrl}/#organization`
                },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${baseUrl}/track?invoice={search_term_string}`
                    },
                    'query-input': 'required name=search_term_string'
                }
            }
        ]
    };

    return (
        <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
