import React from "react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Invoice Generator - Create Professional Invoices",
  description: "Create professional invoices quickly and easily with our modern invoice generator. Support for multiple currencies, tax calculations, and instant PDF generation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}