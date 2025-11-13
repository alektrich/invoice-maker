export interface ContactInfo {
  companyName: string;
  contactPerson?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  taxId?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface DiscountItem {
  id: string;
  description: string;
  amount: number;
}

export interface InvoiceData {
  invoiceId: string;
  invoiceDate: string; // ISO date string
  dueDate: string; // ISO date string
  templateId: string; // Legacy template ID for backward compatibility
  colorSchemeId?: string; // New: Color scheme ID
  gradientStyleId?: string; // New: Gradient style ID
  layoutStyleId?: string; // New: Layout style ID
  issuer: ContactInfo;
  client: ContactInfo;
  items: InvoiceItem[];
  discounts: DiscountItem[];
  taxRate: number; // Percentage (e.g., 10.5 for 10.5%)
  currency: string; // Currency symbol
}

export interface InvoiceCalculations {
  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export type InvoiceFormData = InvoiceData;

// Validation schemas will be defined separately using Zod
