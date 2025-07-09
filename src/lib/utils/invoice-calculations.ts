import {
  InvoiceData,
  InvoiceCalculations,
  InvoiceItem,
  DiscountItem,
} from "@/types/invoice";

export const calculateInvoiceAmounts = (
  data: InvoiceData
): InvoiceCalculations => {
  const subtotal = calculateSubtotal(data.items);
  const discountTotal = calculateDiscountTotal(data.discounts);
  const taxableAmount = subtotal + discountTotal;
  const taxAmount = calculateTaxAmount(taxableAmount, data.taxRate);
  const totalAmount = taxableAmount + taxAmount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountTotal: Number(discountTotal.toFixed(2)),
    taxableAmount: Number(taxableAmount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
  };
};

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((total, item) => {
    return total + item.quantity * item.rate;
  }, 0);
};

export const calculateDiscountTotal = (discounts: DiscountItem[]): number => {
  if (!discounts.length) return 0;

  return discounts.reduce((total, discount) => {
    return total - Math.abs(discount.amount);
  }, 0);
};

export const calculateTaxAmount = (
  taxableAmount: number,
  taxRate: number
): number => {
  if (taxRate === 0) return 0;
  return (taxableAmount * taxRate) / 100;
};

export const formatCurrency = (
  amount: number,
  currency: string = "$"
): string => {
  // Format number with thousand separators and 2 decimal places
  const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${currency} ${formattedAmount}`;
};

export const generateInvoiceId = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `INV-${year}-${timestamp}`;
};
