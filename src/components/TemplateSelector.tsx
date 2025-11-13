import React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import {
  INVOICE_TEMPLATES,
  InvoiceTemplate,
} from "@/lib/templates/invoice-templates";

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
  onContinue: () => void;
  isContinueDisabled?: boolean;
}

const TemplatePreview: React.FC<{ template: InvoiceTemplate }> = ({
  template,
}) => {
  return (
    <div
      className="h-16 w-full rounded-md"
      style={{
        backgroundImage: `linear-gradient(135deg, ${template.previewGradient[0]}, ${template.previewGradient[1]})`,
      }}
    />
  );
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelect,
  onContinue,
  isContinueDisabled = false,
}) => {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Step 1 of 2
        </span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Choose an Invoice Template
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Select the look and feel for your invoice. You can adjust the details
          on the next step.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {INVOICE_TEMPLATES.map((template) => {
          const isSelected = template.id === selectedTemplateId;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={cn(
                "group flex h-full flex-col rounded-xl border bg-white p-6 text-left shadow-sm transition-all focus:outline-none",
                "hover:-translate-y-1 hover:shadow-lg",
                isSelected ? "border-transparent" : "border-gray-200"
              )}
              style={
                isSelected
                  ? {
                      boxShadow: `0 10px 30px -12px ${template.accentHex}80`,
                      borderColor: template.accentHex,
                    }
                  : undefined
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: template.accentHex }}
                  >
                    {template.name}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {template.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
                    isSelected
                      ? "border-transparent text-white"
                      : "border-gray-300 text-gray-400"
                  )}
                  style={
                    isSelected
                      ? {
                          background: template.accentHex,
                          boxShadow: `0 0 0 4px ${template.accentHex}20`,
                        }
                      : undefined
                  }
                >
                  {isSelected ? (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="block h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400" />
                  )}
                </span>
              </div>

              <div className="mt-6">
                <TemplatePreview template={template} />
              </div>

              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-500">Accent</span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: template.accentHex }}
                >
                  {template.accentHex.toUpperCase()}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          You can always return to this step to switch templates later.
        </p>
        <Button
          type="button"
          onClick={onContinue}
          disabled={isContinueDisabled}
          className="sm:w-auto"
        >
          Continue to Invoice Details
        </Button>
      </div>
    </div>
  );
};
