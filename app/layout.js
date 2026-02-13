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
  variable: '--font-tajawal'
});

const nastaliq = Noto_Nastaliq_Urdu({ 
  subsets: ["arabic"], 
  weight: ["400", "700"],
  variable: '--font-nastaliq'
});

const sloganFont = localFont({
  src: './fonts/FS_Future.ttf', 
  variable: '--font-slogan',
  display: 'swap',
});

export const metadata = {
  title: "منظمة قدوة | Qudwa Association",
  description: "منظمة قدوة - جيلٌ يبني... أثرٌ يبقى. منظمة تربوية غير ربحية تهدف لبناء جيل واعٍ من خلال البرامج التعليمية والأنشطة المجتمعية للأطفال والشباب",
  keywords: [
    "منظمة قدوة",
    "جمعية قدوة", 
    "قدوة",
    "Qudwa",
    "Qudwa Association",
    "أنشطة أطفال",
    "برامج تربوية",
    "منظمة غير ربحية",
    "تعليم الأطفال",
    "أنشطة تعليمية"
  ],
  metadataBase: new URL('https://qudwa.pages.dev'),
  icons: {
    icon: '/logo.png',
  },
  verification: {
    google: 'zzjsP0y-DESw8LxGxAzckfiYf6aPWAMPN0nnXGsjjUM',
  },
  openGraph: {
    title: 'منظمة قدوة | Qudwa Association',
    description: 'جيلٌ يبني... أثرٌ يبقى - منظمة تربوية غير ربحية',
    url: 'https://qudwa.pages.dev',
    siteName: 'منظمة قدوة',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'شعار منظمة قدوة',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'منظمة قدوة | Qudwa Association',
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-theme="qudwaTheme"> 
      <head>
        <link rel="preload" href="/logo.png" as="image" />
      </head>
     <body className={`${tajawal.variable} ${nastaliq.variable} ${sloganFont.variable} font-sans`}>
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