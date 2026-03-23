"use client";

import React, { useEffect, useState } from "react";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { PDFPreview } from "@/components/PDFPreview";
import { downloadPDF } from "@/lib/services/pdf-generator";
import { TemplateSelector } from "@/components/TemplateSelector";
import {
  INVOICE_TEMPLATE_STORAGE_KEY,
  INVOICE_LANGUAGE_STORAGE_KEY,
} from "@/lib/constants/storage";
import { DEFAULT_TEMPLATE_ID } from "@/lib/templates/invoice-templates";
import { Language, t } from "@/lib/i18n/translations";

export default function HomePage() {
  const [generatedPDF, setGeneratedPDF] = useState<Blob | null>(null);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string>("");
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>(DEFAULT_TEMPLATE_ID);
  const [language, setLanguage] = useState<Language>("en");

  const tr = t(language);

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
    const storedLanguage = localStorage.getItem(INVOICE_LANGUAGE_STORAGE_KEY);
    if (storedLanguage === "en" || storedLanguage === "sr") {
      setLanguage(storedLanguage);
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
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(INVOICE_LANGUAGE_STORAGE_KEY, language);
  }, [language]);

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
        {/* Language Selector */}
        <div className="mb-6 flex justify-end">
          <div className="flex items-center gap-2">
            <label htmlFor="language-select" className="text-sm font-medium text-gray-600">
              {tr.language}:
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="en">English</option>
              <option value="sr">Srpski</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="space-y-6">
            {step === 1 ? (
              <TemplateSelector
                selectedTemplateId={selectedTemplateId}
                onSelect={handleTemplateSelect}
                onContinue={handleContinueToForm}
                isContinueDisabled={!selectedTemplateId}
                language={language}
              />
            ) : (
              <InvoiceForm
                templateId={selectedTemplateId}
                onPDFGenerated={handlePDFGenerated}
                onChangeTemplate={handleBackToTemplates}
                language={language}
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
                language={language}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>{tr.footerTagline}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
