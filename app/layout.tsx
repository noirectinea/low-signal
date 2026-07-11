import type { Metadata } from "next";
import {
  Archivo,
  Bodoni_Moda,
  Inter,
  Libre_Caslon_Display,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const archivalDisplay = Libre_Caslon_Display({
  variable: "--font-display-archival",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const refinedDisplay = Bodoni_Moda({
  variable: "--font-display-refined",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "LOW SIGNAL",
  description: "LOW SIGNAL is an independent clothing brand: quiet, observant, and slightly strange.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivo.variable} ${archivalDisplay.variable} ${refinedDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#e5e6e1] text-[#121211]">
        {children}
      </body>
    </html>
  );
}
