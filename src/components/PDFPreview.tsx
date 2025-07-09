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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // Cleanup function to revoke the URL when component unmounts or pdfBlob changes
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPdfUrl(null);
    }
  }, [pdfBlob]);

  if (!pdfBlob || !pdfUrl) {
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
            No PDF generated yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill out the form and click "Generate Invoice PDF" to see the
            preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">PDF Preview</h2>
        <Button onClick={onDownload} variant="outline">
          Download PDF
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <iframe
          src={pdfUrl}
          className="h-[600px] w-full rounded-lg"
          title={`Invoice ${invoiceId} Preview`}
        />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">Preview of invoice {invoiceId}</p>
      </div>
    </div>
  );
};
