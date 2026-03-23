import { z } from "zod";

export const contactInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  taxId: z.string().optional(),
});

export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  rate: z.number().min(0, "Rate must be greater than or equal to 0"),
});

export const discountItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be greater than or equal to 0"),
});

export const invoiceFormSchema = z
  .object({
    invoiceId: z.string().min(1, "Invoice ID is required"),
    invoiceDate: z.string().min(1, "Invoice date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    templateId: z.string().min(1, "Template selection is required"),
    issuer: contactInfoSchema,
    client: contactInfoSchema,
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
    discounts: z.array(discountItemSchema).default([]),
    taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
    currency: z.string().min(1, "Currency is required"),
    language: z.enum(["en", "sr"]).default("en"),
    bankAccount: z.string().optional().default(""),
    vatExemptNote: z.boolean().optional().default(false),
    placeOfIssue: z.string().optional().default(""),
  })
  .refine(
    (data) => {
      const invoiceDate = new Date(data.invoiceDate);
      const dueDate = new Date(data.dueDate);
      return dueDate >= invoiceDate;
    },
    {
      message: "Due date must be on or after invoice date",
      path: ["dueDate"],
    }
  );

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
