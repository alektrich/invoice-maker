import React, { useState } from "react";
import Head from "next/head";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { PDFPreview } from "@/components/PDFPreview";
import { downloadPDF } from "@/lib/services/pdf-generator";

export default function HomePage() {
  const [generatedPDF, setGeneratedPDF] = useState<Blob | null>(null);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string>("");

  const handlePDFGenerated = (pdfBlob: Blob, invoiceId?: string) => {
    setGeneratedPDF(pdfBlob);
    if (invoiceId) {
      setCurrentInvoiceId(invoiceId);
    }
  };

  const handleDownloadPDF = () => {
    if (generatedPDF && currentInvoiceId) {
      downloadPDF(generatedPDF, `invoice-${currentInvoiceId}.pdf`);
    }
  };

  return (
    <>
      <Head>
        <title>Invoice Generator - Create Professional Invoices</title>
        <meta
          name="description"
          content="Create professional invoices quickly and easily with our modern invoice generator. Support for multiple currencies, tax calculations, and instant PDF generation."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Form Section */}
            <div className="space-y-6">
              <InvoiceForm onPDFGenerated={handlePDFGenerated} />
            </div>

            {/* PDF Preview Section */}
            <div className="space-y-6">
              <div className="sticky top-8">
                <PDFPreview
                  pdfBlob={generatedPDF}
                  invoiceId={currentInvoiceId}
                  onDownload={handleDownloadPDF}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-600">
              <p>Invoice Generator - Professional invoices made simple</p>
              <p className="mt-1">Built with Next.js, React, and TypeScript</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
