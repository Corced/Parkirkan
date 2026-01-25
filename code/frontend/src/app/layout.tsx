import type { Metadata } from "next";
import { Montserrat, Montserrat_Alternates } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const montserratMono = Montserrat_Alternates({
  variable: "--font-montserrat-mono",
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Parkirkan - Solusi Management Parkir Modern",
  description: "Aplikasi management parkir terbaik untuk Admin, Petugas, dan Owner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${montserratMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
