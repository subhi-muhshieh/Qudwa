import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Qudwa",
  description: "Non-profit organization",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="cupcake"> 
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}