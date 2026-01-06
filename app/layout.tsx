import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Thesis Vault - Virtual Library",
  description: "Explore and discover publicly shared academic research.",
  icons: {
    icon: '/tablogo.png',
  },
};

import { ContentWrapper } from '@/components/ContentWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50`}
      >
        <Suspense fallback={<div className="h-24 bg-gray-50 animate-pulse" />}>
          <Navbar />
        </Suspense>
        <ContentWrapper>
          {children}
        </ContentWrapper>
        <Footer />
      </body>
    </html>
  );
}
