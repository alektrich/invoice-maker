import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactInfoForm } from "./ContactInfoForm";
import { InvoiceItemsForm } from "./InvoiceItemsForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  invoiceFormSchema,
  InvoiceFormValues,
} from "@/lib/validations/invoice";
import { generateInvoicePDF, downloadPDF } from "@/lib/services/pdf-generator";
import { generateInvoiceId } from "@/lib/utils/invoice-calculations";
import { INVOICE_FORM_STORAGE_KEY } from "@/lib/constants/storage";
import {
  getInvoiceTemplate,
  InvoiceTemplate,
} from "@/lib/templates/invoice-templates";
import { Language, t } from "@/lib/i18n/translations";

interface InvoiceFormProps {
  templateId: string;
  onPDFGenerated?: (pdfBlob: Blob, invoiceId?: string) => void;
  onChangeTemplate?: () => void;
  language: Language;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  templateId,
  onPDFGenerated,
  onChangeTemplate,
  language,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPDF, setGeneratedPDF] = useState<Blob | null>(null);
  const [includeVat, setIncludeVat] = useState(false);
  const tr = t(language);
  const template = useMemo<InvoiceTemplate>(
    () => getInvoiceTemplate(templateId),
    [templateId]
  );

  const defaultValuesRef = useRef<InvoiceFormValues | null>(null);

  if (!defaultValuesRef.current) {
    defaultValuesRef.current = {
      invoiceId: generateInvoiceId(),
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      templateId,
      issuer: {
        companyName: "",
        contactPerson: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
        email: "",
        taxId: "",
      },
      client: {
        companyName: "",
        contactPerson: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
        email: "",
        taxId: "",
      },
      items: [
        {
          id: "item-1",
          description: "",
          quantity: 1,
          rate: 0,
        },
      ],
      discounts: [],
      taxRate: 0,
      currency: "$",
      language: "en",
      bankAccount: "",
      vatExemptNote: false,
      placeOfIssue: "",
    };
  }

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: defaultValuesRef.current ?? undefined,
    mode: "onChange",
  });

  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      hasHydratedRef.current = true;
      return;
    }

    if (!hasHydratedRef.current) {
      try {
        const stored = localStorage.getItem(INVOICE_FORM_STORAGE_KEY);
        const baseDefaults = {
          ...(defaultValuesRef.current as InvoiceFormValues),
          templateId,
        };

        if (stored) {
          const parsed = JSON.parse(stored);
          // Ensure all optional string fields default to empty string instead of undefined
          const normalizedParsed = {
            ...parsed,
            // Always ensure invoiceId, invoiceDate, and dueDate are set (they're not persisted)
            invoiceId: parsed.invoiceId || baseDefaults.invoiceId,
            invoiceDate: parsed.invoiceDate || baseDefaults.invoiceDate,
            dueDate: parsed.dueDate || baseDefaults.dueDate,
            issuer: {
              companyName: "",
              contactPerson: "",
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
              phone: "",
              email: "",
              taxId: "",
              ...parsed.issuer,
            },
            client: {
              companyName: "",
              contactPerson: "",
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
              phone: "",
              email: "",
              taxId: "",
              ...parsed.client,
            },
          };
          reset({
            ...baseDefaults,
            ...normalizedParsed,
            templateId,
          });
        } else {
          reset(baseDefaults);
        }
      } catch (error) {
        console.error("Error loading invoice draft from storage:", error);
        reset({
          ...(defaultValuesRef.current as InvoiceFormValues),
          templateId,
        });
      }
      hasHydratedRef.current = true;
      return;
    }

    if (getValues("templateId") !== templateId) {
      setValue("templateId", templateId, { shouldDirty: true });
    }
  }, [getValues, reset, setValue, templateId]);

  // Sync language prop into form
  useEffect(() => {
    if (hasHydratedRef.current) {
      setValue("language", language);
    }
  }, [language, setValue]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (!hasHydratedRef.current) {
        return;
      }

      const { invoiceId, invoiceDate, dueDate, ...persistable } =
        value as InvoiceFormValues;

      try {
        localStorage.setItem(
          INVOICE_FORM_STORAGE_KEY,
          JSON.stringify(persistable)
        );
      } catch (error) {
        console.error("Error saving invoice draft to storage:", error);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    setGeneratedPDF(null);
  }, [templateId]);

  const watchedData = watch();

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsGenerating(true);
    try {
      const pdfBlob = await generateInvoicePDF(data);
      setGeneratedPDF(pdfBlob);
      onPDFGenerated?.(pdfBlob, data.invoiceId);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (generatedPDF) {
      downloadPDF(generatedPDF, `invoice-${watchedData.invoiceId}.pdf`);
    }
  };

  const handleGenerateNewId = () => {
    setValue("invoiceId", generateInvoiceId(), { shouldValidate: true, shouldDirty: true });
  };

  const handleVatToggle = (checked: boolean) => {
    setIncludeVat(checked);
    if (checked) {
      setValue("taxRate", 20, { shouldValidate: true });
    } else {
      setValue("taxRate", 0, { shouldValidate: true });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {tr.step2of2}
            </span>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {tr.provideDetails}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {tr.provideDetailsDesc}
            </p>
          </div>

          {onChangeTemplate && (
            <Button
              type="button"
              variant="outline"
              onClick={onChangeTemplate}
              className="whitespace-nowrap"
            >
              {tr.changeTemplate}
            </Button>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {tr.selectedTemplate}
            </p>
            <p
              className="mt-1 text-xl font-semibold"
              style={{ color: template.accentHex }}
            >
              {template.name}
            </p>
            <p className="mt-1 text-sm text-gray-600">{template.description}</p>
          </div>
          <div
            className="h-16 w-full rounded-md sm:w-40"
            style={{
              backgroundImage: `linear-gradient(135deg, ${template.previewGradient[0]}, ${template.previewGradient[1]})`,
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <input type="hidden" {...register("templateId")} />
        <input type="hidden" {...register("language")} />
        {/* Invoice Details Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {tr.invoiceDetails}
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tr.invoiceId}
              </label>
              <div className="flex space-x-2">
                <Controller
                  name="invoiceId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ""}
                      error={errors.invoiceId?.message}
                      placeholder="INV-2024-001"
                      className="flex-1"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={handleGenerateNewId}
                  className="group relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label={tr.generateId}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="absolute bottom-full mb-2 hidden whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                    {tr.generateId}
                  </span>
                </button>
              </div>
            </div>

            <Controller
              name="invoiceDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  label={tr.invoiceDate}
                  type="date"
                  error={errors.invoiceDate?.message}
                />
              )}
            />

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  label={tr.dueDate}
                  type="date"
                  error={errors.dueDate?.message}
                />
              )}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Controller
                name="taxRate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value === undefined || field.value === null ? "" : String(field.value)}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : parseFloat(e.target.value) || 0;
                      field.onChange(value);
                    }}
                    label={tr.taxRate}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    error={errors.taxRate?.message}
                    placeholder="0.00"
                    disabled={language === "sr" && includeVat}
                  />
                )}
              />
              {language === "sr" && (
                <label className="mt-3 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeVat}
                    onChange={(e) => handleVatToggle(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{tr.includeVat}</span>
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {tr.currency}
              </label>
              <select
                {...register("currency")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="¥">JPY (¥)</option>
                <option value="₹">INR (₹)</option>
                <option value="RSD">RSD</option>
              </select>
              {errors.currency && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>

          {language === "sr" && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Controller
                name="bankAccount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    label={tr.bankAccount}
                    placeholder="265-6190310001123-39"
                  />
                )}
              />
              <Controller
                name="placeOfIssue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    label={tr.placeOfIssue}
                    placeholder="Beograd"
                  />
                )}
              />
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    {...register("vatExemptNote")}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{tr.vatExemptNote}</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Issuer Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <ContactInfoForm
            control={control}
            name="issuer"
            title={tr.billFromYourInfo}
            language={language}
          />
        </div>

        {/* Client Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <ContactInfoForm
            control={control}
            name="client"
            title={tr.billToClientInfo}
            language={language}
          />
        </div>

        {/* Invoice Items and Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <InvoiceItemsForm control={control} watch={watch} language={language} />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button
            type="submit"
            isLoading={isGenerating}
            disabled={!isValid || isGenerating}
            className="flex-1"
          >
            {isGenerating ? tr.generatingPdf : tr.generateInvoicePdf}
          </Button>

          {generatedPDF && (
            <Button
              type="button"
              onClick={handleDownloadPDF}
              variant="outline"
              className="flex-1"
            >
              {tr.downloadPdf}
            </Button>
          )}
        </div>

        {/* Form Errors Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="text-sm font-medium text-red-800">
              {tr.fixErrors}
            </h3>
            <ul className="mt-2 text-sm text-red-700">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field} className="list-disc list-inside">
                  {field}: {error?.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};
