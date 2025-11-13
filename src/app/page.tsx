"use client";

import React, { useEffect, useState } from "react";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { PDFPreview } from "@/components/PDFPreview";
import { downloadPDF } from "@/lib/services/pdf-generator";
import { TemplateSelector } from "@/components/TemplateSelector";
import {
  INVOICE_TEMPLATE_STORAGE_KEY,
} from "@/lib/constants/storage";
import { DEFAULT_TEMPLATE_ID } from "@/lib/templates/invoice-templates";

export default function HomePage() {
  const [generatedPDF, setGeneratedPDF] = useState<Blob | null>(null);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string>("");
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>(DEFAULT_TEMPLATE_ID);

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storedTemplate = localStorage.getItem(
      INVOICE_TEMPLATE_STORAGE_KEY
    );
    if (storedTemplate) {
      setSelectedTemplateId(storedTemplate);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(
      INVOICE_TEMPLATE_STORAGE_KEY,
      selectedTemplateId
    );
  }, [selectedTemplateId]);

  useEffect(() => {
    setGeneratedPDF(null);
    setCurrentInvoiceId("");
  }, [selectedTemplateId, step]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleContinueToForm = () => {
    setStep(2);
  };

  const handleBackToTemplates = () => {
    setStep(1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="space-y-6">
            {step === 1 ? (
              <TemplateSelector
                selectedTemplateId={selectedTemplateId}
                onSelect={handleTemplateSelect}
                onContinue={handleContinueToForm}
                isContinueDisabled={!selectedTemplateId}
              />
            ) : (
              <InvoiceForm
                templateId={selectedTemplateId}
                onPDFGenerated={handlePDFGenerated}
                onChangeTemplate={handleBackToTemplates}
              />
            )}
          </div>

          {/* PDF Preview Section */}
          <div className="space-y-6">
            <div className="sticky top-8">
              <PDFPreview
                pdfBlob={generatedPDF}
                invoiceId={currentInvoiceId}
                templateId={selectedTemplateId}
                step={step}
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
