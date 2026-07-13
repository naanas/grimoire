import type { Metadata, Viewport } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import StructuredData from '@/components/StructuredData';
import {
    DEFAULT_OG_IMAGE,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_TAGLINE,
    SITE_URL,
} from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#07050d',
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} - ${SITE_TAGLINE}`,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    applicationName: SITE_NAME,
    category: 'games',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: '/',
        languages: { 'id-ID': '/' },
    },
    openGraph: {
        type: 'website',
        locale: 'id_ID',
        url: '/',
        siteName: SITE_NAME,
        title: `${SITE_NAME} - ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 512,
                height: 512,
                alt: `${SITE_NAME} - Platform Top Up Game Indonesia`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} - ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE],
        creator: '@grimoirecoins',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        // google: 'your-google-search-console-code',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id" className="dark" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${cinzel.variable} bg-(--background) text-white min-h-screen selection:bg-(--blood-red) selection:text-white antialiased`}
                suppressHydrationWarning
            >
                <StructuredData />
                <LayoutWrapper>{children}</LayoutWrapper>
            </body>
        </html>
    );
}
