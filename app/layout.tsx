import type { Metadata } from "next";
import {
  Archivo,
  Inter,
  Libre_Caslon_Display,
} from "next/font/google";
import "./globals.css";
import { AnalyticsBridge } from "@/components/AnalyticsBridge";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
});

const archivalDisplay = Libre_Caslon_Display({
  variable: "--font-display-archival",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://low-signal-nine.vercel.app"),
  title: "LOW SIGNAL",
  description: "LOW SIGNAL is an independent clothing brand: quiet, observant, and slightly strange.",
  openGraph: {
    siteName: "LOW SIGNAL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${archivo.variable} ${archivalDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#e5e6e1] text-[#121211]">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              email: "studio@lowsignal.com",
              name: "LOW SIGNAL",
              sameAs: ["https://www.instagram.com/lowsignal/"],
              url: "https://low-signal-nine.vercel.app",
            }).replaceAll("<", "\\u003c"),
          }}
          type="application/ld+json"
        />
        <AnalyticsBridge />
        {children}
      </body>
    </html>
  );
}
