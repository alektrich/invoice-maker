import React, { useEffect, useState } from "react";
import { Button } from "./ui/Button";

interface PDFPreviewProps {
  pdfBlob: Blob | null;
  invoiceId: string;
  onDownload?: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  pdfBlob,
  invoiceId,
  onDownload,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let pdfInstance: any;

    const renderPreview = async () => {
      if (!pdfBlob) {
        setPreviewUrl(null);
        return;
      }

      setIsRendering(true);

      try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");

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

  const renderPlaceholder = () => (
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

  if (!pdfBlob || (!previewUrl && !isRendering)) {
    return renderPlaceholder();
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
            alt={`Invoice ${invoiceId} preview`}
            className="max-h-[600px] w-full rounded-md object-contain"
          />
        )}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Preview of invoice {invoiceId} (reduced image quality)</p>
      </div>
    </div>
  );
};
