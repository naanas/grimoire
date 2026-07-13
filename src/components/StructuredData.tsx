import Script from 'next/script';
import { SITE_DESCRIPTION, SITE_FAQ, SITE_NAME, SITE_URL } from '@/lib/seo';

export default function StructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${SITE_URL}/#organization`,
                name: SITE_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/icon.png`,
                description: SITE_DESCRIPTION,
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'Customer Service',
                    availableLanguage: ['Indonesian', 'English'],
                },
                sameAs: ['https://instagram.com/grimoirecoins'],
            },
            {
                '@type': 'OnlineStore',
                '@id': `${SITE_URL}/#store`,
                name: SITE_NAME,
                url: SITE_URL,
                image: `${SITE_URL}/icon.png`,
                description: SITE_DESCRIPTION,
                priceRange: 'Rp1.000 - Rp5.000.000',
                currenciesAccepted: 'IDR',
                paymentAccepted: 'QRIS, Bank Transfer, GoPay, OVO, Dana, ShopeePay',
                areaServed: {
                    '@type': 'Country',
                    name: 'Indonesia',
                },
                parentOrganization: { '@id': `${SITE_URL}/#organization` },
            },
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                url: SITE_URL,
                name: SITE_NAME,
                description: SITE_DESCRIPTION,
                inLanguage: 'id-ID',
                publisher: { '@id': `${SITE_URL}/#organization` },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${SITE_URL}/track?invoice={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                },
            },
            {
                '@type': 'FAQPage',
                '@id': `${SITE_URL}/#faq`,
                mainEntity: SITE_FAQ.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.answer,
                    },
                })),
            },
        ],
    };

    return (
        <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
