import { Tajawal, Noto_Nastaliq_Urdu } from "next/font/google"; 
import localFont from 'next/font/local';
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { ProfileProvider } from "./context/ProfileContext";

const tajawal = Tajawal({ 
  subsets: ["arabic"], 
  weight: ["300", "400", "500", "700", "800"],
  variable: '--font-tajawal',
  display: 'swap',
  preload: true, // React 19 optimization
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
    <html lang="ar" dir="rtl" data-theme="qudwaTheme" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body 
        className={`${tajawal.variable} ${nastaliq.variable} ${sloganFont.variable} font-sans`}
        suppressHydrationWarning
      >
        <ProfileProvider>
          <Navbar />
          {children}
          <Footer />
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