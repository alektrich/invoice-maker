import React, { useEffect, useState, useMemo } from "react";
import { Button } from "./ui/Button";
import { getInvoiceTemplate } from "@/lib/templates/invoice-templates";

interface PDFPreviewProps {
  pdfBlob: Blob | null;
  invoiceId?: string;
  templateId?: string;
  step?: 1 | 2;
  onDownload?: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  pdfBlob,
  invoiceId = "",
  templateId,
  step,
  onDownload,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  
  const template = useMemo(() => {
    if (templateId) {
      return getInvoiceTemplate(templateId);
    }
    return null;
  }, [templateId]);

  useEffect(() => {
    let isCancelled = false;
    let pdfInstance: any;

    const renderPreview = async () => {
      if (!pdfBlob) {
        setPreviewUrl(null);
        setIsRendering(false);
        return;
      }

      setIsRendering(true);

      try {
        // Dynamic import for pdfjs-dist to avoid SSR issues
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");

        // Set worker source if not already set
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        }

        const data = await pdfBlob.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data });
        pdfInstance = await loadingTask.promise;

        const page = await pdfInstance.getPage(1);
        const viewport = page.getViewport({ scale: 0.9 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to create canvas rendering context");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        if (isCancelled) {
          return;
        }

        const dataUrl = canvas.toDataURL("image/jpeg", 0.45);
        setPreviewUrl(dataUrl);

        page.cleanup();
      } catch (error) {
        if (!isCancelled) {
          console.error("Error rendering PDF preview:", error);
          setPreviewUrl(null);
        }
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
        if (pdfInstance) {
          pdfInstance.destroy?.();
        }
      }
    };

    renderPreview();

    return () => {
      isCancelled = true;
    };
  }, [pdfBlob]);

  const renderTemplatePreview = () => {
    if (!template) return null;

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Template Preview</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            {/* Header */}
            <div
              className="rounded-t-lg px-6 py-4"
              style={{ backgroundColor: template.accentHex }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">INVOICE</h3>
                  <p className="mt-1 text-sm text-white/90">#INV-2025-001</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="px-6">
              <h4 className="mb-3 text-sm font-semibold" style={{ color: template.accentHex }}>
                Invoice Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice ID:</span>
                  <span className="font-medium text-gray-900">INV-2025-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Date:</span>
                  <span className="font-medium text-gray-900">January 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium text-gray-900">February 14, 2025</span>
                </div>
              </div>
            </div>

            {/* Bill From / Bill To */}
            <div className="grid grid-cols-2 gap-6 px-6">
              <div>
                <h4 className="mb-2 text-sm font-semibold" style={{ color: template.accentHex }}>
                  Bill From
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-semibold">Your Company Name</p>
                  <p>123 Business Street</p>
                  <p>City, State 12345</p>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold" style={{ color: template.accentHex }}>
                  Bill To
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-semibold">Client Company Name</p>
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
                  <div>Description</div>
                  <div className="text-right">Qty</div>
                  <div className="text-right">Rate</div>
                  <div className="text-right">Total</div>
                </div>
              </div>
              <div className="divide-y border-x border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
                  <div>Service</div>
                  <div className="text-right">2</div>
                  <div className="text-right">$150.00</div>
                  <div className="text-right font-medium">$300.00</div>
                </div>
                <div
                  className="grid grid-cols-4 gap-4 px-4 py-3 text-sm"
                  style={{ backgroundColor: template.palette.accentLight.toString() }}
                >
                  <div>Another Service</div>
                  <div className="text-right">1</div>
                  <div className="text-right">$200.00</div>
                  <div className="text-right font-medium">$200.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">
          <p>Preview of selected template with sample content</p>
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
            {isRendering ? "Rendering preview…" : "No PDF generated yet"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isRendering
              ? "Creating a lightweight preview image."
              : 'Fill out the form and click "Generate Invoice PDF" to see the preview.'}
          </p>
        </div>
      </div>
    );
  };

  // If we have a PDF blob, show the preview (even if still rendering)
  // Only show placeholder if no PDF blob exists or we're on template selection step
  if (!pdfBlob) {
    return renderPlaceholder();
  }

  // If we have pdfBlob but no previewUrl yet, show loading state
  if (!previewUrl && !isRendering) {
    // This shouldn't happen, but if it does, show loading
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Invoice Preview</h2>
          {onDownload && (
            <Button onClick={onDownload} variant="outline">
              Download PDF
            </Button>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
              <p className="mt-4 text-sm text-gray-500">
                Rendering preview image…
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Invoice Preview</h2>
        <Button onClick={onDownload} variant="outline">
          Download PDF
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        {isRendering || !previewUrl ? (
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
              <p className="mt-4 text-sm text-gray-500">
                Rendering preview image…
              </p>
            </div>
          </div>
        ) : (
          <img
            src={previewUrl}
            alt={invoiceId ? `Invoice ${invoiceId} preview` : "Invoice preview"}
            className="max-h-[600px] w-full rounded-md object-contain"
          />
        )}
      </div>

      {invoiceId && (
        <div className="text-center text-sm text-gray-500">
          <p>Preview of invoice {invoiceId} (reduced image quality)</p>
        </div>
      )}
    </div>
  );
};
