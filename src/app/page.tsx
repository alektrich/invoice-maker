"use client";

import React, { useState } from "react";
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
          </div>
        </div>
      </footer>
    </main>
  );
}
