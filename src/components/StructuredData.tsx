import Script from 'next/script';

export default function StructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Grimoire Coins',
        url: 'https://grimoirecoins.store',
        logo: 'https://grimoirecoins.store/logo.png',
        description: 'Platform top-up game terpercaya di Indonesia dengan proses instan, aman, dan resmi.',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            availableLanguage: ['Indonesian', 'English']
        },
        sameAs: [
            // Add your social media URLs here when available
            // 'https://facebook.com/grimoirecoins',
            // 'https://instagram.com/grimoirecoins',
            // 'https://twitter.com/grimoirecoins',
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
