import React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import {
  INVOICE_TEMPLATES,
  InvoiceTemplate,
} from "@/lib/templates/invoice-templates";
import { Language, t } from "@/lib/i18n/translations";

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
  onContinue: () => void;
  isContinueDisabled?: boolean;
  language: Language;
}

const TemplatePreview: React.FC<{ template: InvoiceTemplate }> = ({
  template,
}) => (
  <div
    className="flex items-center justify-center h-16 w-full rounded-md"
    style={{
      backgroundImage: `linear-gradient(135deg, ${template.previewGradient[0]}, ${template.previewGradient[1]})`,
    }}
  >
    <span className="text-sm font-semibold text-white">
      {template.accentHex.toUpperCase()}
    </span>
  </div>
);

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelect,
  onContinue,
  isContinueDisabled = false,
  language,
}) => {
  const tr = t(language);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {tr.step1of2}
        </span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {tr.chooseTemplate}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {tr.chooseTemplateDesc}
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
                "group flex h-full flex-col justify-between rounded-xl border bg-white p-6 text-left shadow-sm transition-all focus:outline-none",
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
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                </span>
              </div>

              <div className="mt-6">
                <TemplatePreview template={template} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          {tr.canReturnToSwitch}
        </p>
        <Button
          type="button"
          onClick={onContinue}
          disabled={isContinueDisabled}
          className="sm:w-auto"
        >
          {tr.nextInvoiceForm}
        </Button>
      </div>
    </div>
  );
};
