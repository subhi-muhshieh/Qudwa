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

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-theme="qudwaTheme"> 
      <body className={`${tajawal.className} ${nastaliq.variable} ${sloganFont.variable}`}>
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