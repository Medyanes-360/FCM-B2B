import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import { ToastContainer } from "react-toastify";
// import { SpeedInsights } from "@vercel/speed-insights/next"
// import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Çalışkan Arı Bayi Portalı",
  description: "Online Sipariş Sistemi",
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* SessionProvider ile sarmallarız ki tüm route lara erişebilelim diye / yukarıda "use client" tanımlamayı unutma! */}
        <Providers session={session}>
          {/* <Navbar links={links}/> */}
          {/* <SpeedInsights />
          <Analytics /> */}
          <div className="bg-white">{children}</div>
          <Footer />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
