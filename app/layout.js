export const runtime = 'edge';
import { Tajawal, Noto_Nastaliq_Urdu, Changa } from "next/font/google"; // Added Changa
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

// 1. Body Font (Clean, Modern)
const tajawal = Tajawal({ 
  subsets: ["arabic"], 
  weight: ["300", "400", "500", "700", "800"],
  variable: '--font-tajawal'
});

// 2. Logo Font (Calligraphy)
const nastaliq = Noto_Nastaliq_Urdu({ 
  subsets: ["arabic"], 
  weight: ["400", "700"],
  variable: '--font-nastaliq'
});

// 3. Slogan Font (Geometric/Future style - similar to HS Future)
const sloganFont = Changa({ 
  subsets: ["arabic"], 
  weight: ["400", "600", "800"], // 800 is very close to HS Future Bold
  variable: '--font-slogan'
});
export const metadata = {
  title: "قدوة - Qudwa",
  description: "جيلٌ يبني، أثرٌ يبقى",
  icons: {
    icon: '/logo.png', // This points to the public folder
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-theme="qudwaTheme"> 
      <body className={`${tajawal.className} ${nastaliq.variable} ${sloganFont.variable}`}>
        <Navbar />
        {children}
        <Toaster 
          position="bottom-center" 
          toastOptions={{ 
            style: {
              background: '#0c4a6e', // Matching your brand dark blue
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