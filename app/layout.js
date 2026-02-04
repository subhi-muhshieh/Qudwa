import { Tajawal, Noto_Nastaliq_Urdu } from "next/font/google"; 
import localFont from 'next/font/local'; // <--- NEW IMPORT
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer"; 

// 1. Body Font (Tajawal - Google)
const tajawal = Tajawal({ 
  subsets: ["arabic"], 
  weight: ["300", "400", "500", "700", "800"],
  variable: '--font-tajawal'
});

// 2. Logo Font (Nastaliq - Google)
const nastaliq = Noto_Nastaliq_Urdu({ 
  subsets: ["arabic"], 
  weight: ["400", "700"],
  variable: '--font-nastaliq'
});

// 3. Slogan Font (HS Future - Local File)
// This looks inside app/fonts/HSFuture.ttf
const sloganFont = localFont({
  src: './fonts/HSFuture.ttf', 
  variable: '--font-slogan',
  display: 'swap',
});

export const metadata = {
  title: "قدوة - Qudwa",
  description: "جيلٌ يبني، أثرٌ يبقى",
  icons: {
    icon: '/logo.png',
  },
};

export const runtime = 'edge';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-theme="qudwaTheme"> 
      <body className={`${tajawal.className} ${nastaliq.variable} ${sloganFont.variable}`}>
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
      </body>
    </html>
  );
}