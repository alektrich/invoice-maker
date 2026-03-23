"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "./ui/Button";
import { getInvoiceTemplate } from "@/lib/templates/invoice-templates";
import { Language, t } from "@/lib/i18n/translations";

interface PDFPreviewProps {
  pdfBlob: Blob | null;
  invoiceId?: string;
  templateId?: string;
  step?: 1 | 2;
  onDownload?: () => void;
  language: Language;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  pdfBlob,
  invoiceId = "",
  templateId,
  step,
  onDownload,
  language,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const tr = t(language);

  const template = useMemo(() => {
    if (templateId) {
      return getInvoiceTemplate(templateId);
    }
    return null;
  }, [templateId]);

  useEffect(() => {
    if (!pdfBlob) {
      setPreviewUrl(null);
      return;
    }

    // Create object URL for the PDF blob
    const url = URL.createObjectURL(pdfBlob);
    setPreviewUrl(url);

    // Cleanup: revoke the object URL when component unmounts or blob changes
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdfBlob]);

  const renderTemplatePreview = () => {
    if (!template) return null;

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">{tr.templatePreview}</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            {/* Header */}
            <div
              className="rounded-t-lg px-6 py-4"
              style={{ backgroundColor: template.accentHex }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">{tr.invoice}</h3>
                  <p className="mt-1 text-sm text-white/90">#INV-2025-001</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="px-6">
              <h4 className="mb-3 text-sm font-semibold" style={{ color: template.accentHex }}>
                {tr.invoiceDetails}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tr.invoiceId}:</span>
                  <span className="font-medium text-gray-900">INV-2025-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tr.invoiceDate}:</span>
                  <span className="font-medium text-gray-900">January 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tr.dueDate}:</span>
                  <span className="font-medium text-gray-900">February 14, 2025</span>
                </div>
              </div>
            </div>

            {/* Bill From / Bill To */}
            <div className="grid grid-cols-2 gap-6 px-6">
              <div>
                <h4 className="mb-2 text-sm font-semibold" style={{ color: template.accentHex }}>
                  {tr.billFrom}
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-semibold">{tr.yourCompanyName}</p>
                  <p>123 Business Street</p>
                  <p>City, State 12345</p>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold" style={{ color: template.accentHex }}>
                  {tr.billTo}
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-semibold">{tr.clientCompanyName}</p>
                  <p>456 Client Avenue</p>
                  <p>City, State 67890</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="px-6">
              <div
                className="rounded-t px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: template.palette.tableHeaderFill.toString(),
                  color: template.accentHex,
                }}
              >
                <div className="grid grid-cols-4 gap-4">
                  <div>{tr.description}</div>
                  <div className="text-right">{tr.qty}</div>
                  <div className="text-right">{tr.rate}</div>
                  <div className="text-right">{tr.total}</div>
                </div>
              </div>
              <div className="divide-y border-x border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
                  <div>{tr.service}</div>
                  <div className="text-right">2</div>
                  <div className="text-right">$150.00</div>
                  <div className="text-right font-medium">$300.00</div>
                </div>
                <div
                  className="grid grid-cols-4 gap-4 px-4 py-3 text-sm"
                  style={{ backgroundColor: template.palette.accentLight.toString() }}
                >
                  <div>{tr.anotherService}</div>
                  <div className="text-right">1</div>
                  <div className="text-right">$200.00</div>
                  <div className="text-right font-medium">$200.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">
          <p>{tr.previewSampleContent}</p>
        </div>
      </div>
    );
  };

  const renderPlaceholder = () => {
    // Show template preview if on step 1 (template selection)
    if (step === 1 && template) {
      return renderTemplatePreview();
    }

    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {tr.noPdfYet}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {tr.noPdfYetDesc}
          </p>
        </div>
      </div>
    );
  };

  // If we have a PDF blob, show the preview
  // Only show placeholder if no PDF blob exists or we're on template selection step
  if (!pdfBlob) {
    return renderPlaceholder();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{tr.invoicePreview}</h2>
        {onDownload && (
          <Button onClick={onDownload} variant="outline">
            {tr.downloadPdf}
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="h-[600px] w-full rounded-md"
            title={invoiceId ? `${tr.previewOfInvoice} ${invoiceId}` : tr.invoicePreview}
          />
        ) : (
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
              <p className="mt-4 text-sm text-gray-500">{tr.loadingPreview}</p>
            </div>
          </div>
        )}
      </div>

      {invoiceId && (
        <div className="text-center text-sm text-gray-500">
          <p>{tr.previewOfInvoice} {invoiceId}</p>
        </div>
      )}
    </div>
  );
};
