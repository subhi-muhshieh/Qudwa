import { Tajawal, Noto_Nastaliq_Urdu } from "next/font/google"; 
import localFont from 'next/font/local';
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { ProfileProvider } from "./context/ProfileContext";
import JsonLd from "./components/JsonLd";
import dynamic from "next/dynamic";

const ChatIcon = dynamic(() => import("./components/ChatIcon"));

const SITE_URL = "https://qudwa.pages.dev";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "جمعية قدوة",
  alternateName: "Qudwa Association",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  slogan: "جيلٌ يبني... أثرٌ يبقى",
  description:
    "جمعية قدوة - جمعية تربوية غير ربحية تقدم برامج تعليمية وأنشطة مجتمعية للأطفال والشباب.",
  areaServed: "SY",
  sameAs: [
    "https://www.instagram.com/QudwaAssoc",
    "https://www.facebook.com/QudwaAssoc",
    "https://t.me/QudwaAssoc",
    "https://wa.me/963980931111",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+963-98-093-1111",
      availableLanguage: ["ar", "en"],
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: "جمعية قدوة",
  inLanguage: "ar",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/activities?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const tajawal = Tajawal({ 
  subsets: ["arabic"], 
  weight: ["300", "400", "500", "700", "800"],
  variable: '--font-tajawal',
  display: 'swap',
  preload: true,
});

const nastaliq = Noto_Nastaliq_Urdu({ 
  subsets: ["arabic"], 
  weight: ["400", "700"],
  variable: '--font-nastaliq',
  display: 'swap',
  preload: true,
});

const sloganFont = localFont({
  src: './fonts/FS_Future.ttf', 
  variable: '--font-slogan',
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: "جمعية قدوة | Qudwa Association",
  description: "جمعية قدوة - جيلٌ يبني... أثرٌ يبقى. جمعية تربوية غير ربحية تهدف لبناء جيل واعٍ من خلال البرامج التعليمية والأنشطة المجتمعية للأطفال والشباب",
  keywords: [
    "جمعية قدوة",
    "قدوة", 
    "Qudwa",
    "Qudwa Association",
    "أنشطة أطفال",
    "برامج تربوية",
    "جمعية غير ربحية",
    "تعليم الأطفال",
    "أنشطة تعليمية"
  ],
  metadataBase: new URL('https://qudwa.pages.dev'),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.js',
  verification: {
    google: 'zzjsP0y-DESw8LxGxAzckfiYf6aPWAMPN0nnXGsjjUM',
  },
  openGraph: {
    title: 'جمعية قدوة | Qudwa Association',
    description: 'جيلٌ يبني... أثرٌ يبقى - جمعية تربوية غير ربحية',
    url: 'https://qudwa.pages.dev',
    siteName: 'جمعية قدوة',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'شعار جمعية قدوة',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جمعية قدوة | Qudwa Association',
    description: 'جيلٌ يبني... أثرٌ يبقى',
    images: ['/logo.png'],
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
  alternates: {
    canonical: 'https://qudwa.pages.dev',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'قدوة',
    'application-name': 'قدوة',
    'msapplication-TileColor': '#1281c3',
    'theme-color': '#1281c3',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-theme="qudwaTheme" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <JsonLd data={organizationSchema} id="ld-organization" />
        <JsonLd data={websiteSchema} id="ld-website" />
      </head>
      <body
        className={`${tajawal.variable} ${nastaliq.variable} ${sloganFont.variable} font-sans`}
        suppressHydrationWarning
      >
        <ProfileProvider>
          <a href="#main-content" className="skip-link">
            تخطَّ إلى المحتوى الرئيسي
          </a>
          <Navbar />
          <div id="main-content">{children}</div>
          <Footer />
          <ChatIcon />

          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#0c4a6e',
                color: '#fff',
                borderRadius: '1rem',
                fontFamily: 'var(--font-tajawal)'
              }
            }}
          />
        </ProfileProvider>
      </body>
    </html>
  );
}