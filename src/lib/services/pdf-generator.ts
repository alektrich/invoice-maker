import jsPDF from "jspdf";
import { InvoiceData, ContactInfo } from "@/types/invoice";
import {
  calculateInvoiceAmounts,
  formatCurrency,
} from "@/lib/utils/invoice-calculations";
import {
  getInvoiceTemplate,
  InvoiceTemplate,
  InvoiceTemplatePalette,
  getColorScheme,
  getGradientStyle,
  GradientType,
  getLayoutStyle,
} from "@/lib/templates/invoice-templates";

export class InvoicePDFGenerator {
  private doc: jsPDF;
  private invoice: InvoiceData;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private template: InvoiceTemplate;
  private palette: InvoiceTemplatePalette;
  private gradientStyleId: string;
  private colorSchemeId: string;
  private layoutStyleId: string;

  constructor(invoice: InvoiceData) {
    this.invoice = invoice;
    this.doc = new jsPDF("p", "pt", "letter");
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margin = 72; // 1 inch margins
    this.template = getInvoiceTemplate(invoice.templateId);
    // Support new template system with colorSchemeId, gradientStyleId, and layoutStyleId
    this.colorSchemeId = (invoice as any).colorSchemeId || "navy-blue";
    this.gradientStyleId = (invoice as any).gradientStyleId || "solid";
    this.layoutStyleId = (invoice as any).layoutStyleId || "classic";
    // Use color scheme palette if available, otherwise fall back to template palette
    const colorScheme = getColorScheme(this.colorSchemeId);
    this.palette = colorScheme.palette;
  }

  generatePDF(): jsPDF {
    this.addHeader();
    this.addInvoiceDetails();
    this.addPartiesInfo();
    this.addItemsTable();
    this.addTotals();
    this.addFooter();

    return this.doc;
  }

  private setTextColor(color: [number, number, number]): void {
    this.doc.setTextColor(color[0], color[1], color[2]);
  }

  private setFillColor(color: [number, number, number]): void {
    this.doc.setFillColor(color[0], color[1], color[2]);
  }

  private setDrawColor(color: [number, number, number]): void {
    this.doc.setDrawColor(color[0], color[1], color[2]);
  }

  private applyGradientFill(
    x: number,
    y: number,
    width: number,
    height: number,
    gradientType: GradientType,
    startColor: [number, number, number],
    endColor: [number, number, number]
  ): void {
    if (gradientType === "solid") {
      this.setFillColor(startColor);
      this.doc.rect(x, y, width, height, "F");
      return;
    }

    // jsPDF doesn't have native gradient support, so we'll simulate it
    // by drawing multiple rectangles with interpolated colors
    const steps = 20;
    const stepHeight = height / steps;
    const stepWidth = width / steps;

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * ratio);
      const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * ratio);
      const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * ratio);

      this.setFillColor([r, g, b]);

      if (gradientType === "linear-vertical") {
        this.doc.rect(x, y + i * stepHeight, width, stepHeight + 1, "F");
      } else if (gradientType === "linear-horizontal") {
        this.doc.rect(x + i * stepWidth, y, stepWidth + 1, height, "F");
      } else if (gradientType === "radial") {
        // For radial, we'll approximate with concentric rectangles
        // Clamp to the bounds of the header area
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const maxRadius = Math.max(width, height) / 2;
        const currentRadius = maxRadius * (1 - ratio);
        const rectX = Math.max(x, centerX - currentRadius);
        const rectY = Math.max(y, centerY - currentRadius);
        const rectWidth = Math.min(width, currentRadius * 2);
        const rectHeight = Math.min(height, currentRadius * 2);
        // Ensure we don't draw outside bounds
        if (rectX < x + width && rectY < y + height && rectWidth > 0 && rectHeight > 0) {
          this.doc.rect(rectX, rectY, rectWidth, rectHeight, "F");
        }
      }
    }
  }

  private addHeader(): void {
    const gradientStyle = getGradientStyle(this.gradientStyleId);
    const colorScheme = getColorScheme(this.colorSchemeId);
    
    // Get start and end colors for gradient
    const startColor = colorScheme.palette.accent;
    // Create a slightly lighter/darker version for end color
    const endColor: [number, number, number] = [
      Math.min(255, Math.max(0, startColor[0] + (gradientStyle.type === "solid" ? 0 : 30))),
      Math.min(255, Math.max(0, startColor[1] + (gradientStyle.type === "solid" ? 0 : 30))),
      Math.min(255, Math.max(0, startColor[2] + (gradientStyle.type === "solid" ? 0 : 30))),
    ];

    this.applyGradientFill(0, 0, this.pageWidth, 90, gradientStyle.type, startColor, endColor);

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(26);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text("INVOICE", this.margin, 45);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(12);
    this.doc.text(`#${this.invoice.invoiceId}`, this.margin, 65);
  }

  private addInvoiceDetails(): void {
    let yPos = 140;

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.setTextColor(this.palette.headerText);
    this.doc.text("Invoice Details", this.margin, yPos);
    yPos += 24;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);

    const details: Array<[string, string]> = [
      ["Invoice ID", this.invoice.invoiceId],
      [
        "Invoice Date",
        new Date(this.invoice.invoiceDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ],
      [
        "Due Date",
        new Date(this.invoice.dueDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ],
    ];

    details.forEach(([label, value]) => {
      this.doc.setFont("helvetica", "bold");
      this.setTextColor(this.palette.headerSubtext);
      this.doc.text(`${label}:`, this.margin, yPos);

      this.doc.setFont("helvetica", "normal");
      this.setTextColor(this.palette.bodyText);
      this.doc.text(value, this.margin + 90, yPos);
      yPos += 18;
    });

    this.setDrawColor(this.palette.border);
    this.doc.line(this.margin, yPos + 6, this.pageWidth - this.margin, yPos + 6);
  }

  private addPartiesInfo(): void {
    const yStart = 280;

    this.addContactInfo(this.invoice.issuer, "Bill From", this.margin, yStart);
    this.addContactInfo(
      this.invoice.client,
      "Bill To",
      this.pageWidth / 2,
      yStart
    );
  }

  private addContactInfo(
    contact: ContactInfo,
    title: string,
    x: number,
    y: number
  ): void {
    let yPos = y;

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.setTextColor(this.palette.headerText);
    this.doc.text(title, x, yPos);
    yPos += 22;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.setTextColor(this.palette.bodyText);

    if (contact.companyName) {
      this.doc.setFont("helvetica", "bold");
      this.setTextColor(this.palette.headerText);
      this.doc.text(contact.companyName, x, yPos);
      yPos += 16;
      this.doc.setFont("helvetica", "normal");
      this.setTextColor(this.palette.bodyText);
    }

    const excludeContact = title === "Bill From";

    const contactLines = [
      contact.contactPerson,
      contact.addressLine1,
      contact.addressLine2,
      [contact.city, contact.state, contact.zipCode].filter(Boolean).join(", "),
      contact.country,
      !excludeContact ? contact.phone : "",
      !excludeContact ? contact.email : "",
      contact.taxId ? `Tax ID: ${contact.taxId}` : "",
    ].filter((value): value is string => Boolean(value));

    contactLines.forEach((line) => {
      this.doc.text(line, x, yPos);
      yPos += 14;
    });
  }

  private addItemsTable(): void {
    const yStart = 420;

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10);

    const headers = ["Description", "Qty", "Rate", "Total"];
    const availableWidth = this.pageWidth - this.margin * 2;
    const colWidths = [260, 60, 80, availableWidth - 260 - 60 - 80];
    const colPositions = [this.margin];

    for (let i = 1; i < colWidths.length; i++) {
      colPositions.push(colPositions[i - 1] + colWidths[i - 1]);
    }

    this.setFillColor(this.palette.tableHeaderFill);
    this.doc.rect(
      this.margin,
      yStart - 14,
      this.pageWidth - this.margin * 2,
      28,
      "F"
    );

    this.setTextColor(this.palette.tableHeaderText);
    headers.forEach((header, index) => {
      if (index === 0) {
        this.doc.text(header, colPositions[index] + 8, yStart);
      } else {
        const textWidth = this.doc.getTextWidth(header);
        const padding = index === 3 ? 8 : 0;
        this.doc.text(
          header,
          colPositions[index] + colWidths[index] - textWidth - padding,
          yStart
        );
      }
    });

    let yPos = yStart + 28;
    this.doc.setFont("helvetica", "normal");
    this.setTextColor(this.palette.bodyText);

    this.invoice.items.forEach((item, index) => {
      const total = item.quantity * item.rate;
      const rowData = [
        item.description,
        item.quantity.toString(),
        `${this.invoice.currency} ${item.rate
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        `${this.invoice.currency} ${total
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      ];

      if (index % 2 === 1) {
        this.setFillColor(this.palette.accentLight);
        this.doc.rect(
          this.margin,
          yPos - 12,
          this.pageWidth - this.margin * 2,
          22,
          "F"
        );
      }

      rowData.forEach((data, columnIndex) => {
        if (columnIndex === 0) {
          this.doc.text(data, colPositions[columnIndex], yPos);
        } else {
          const textWidth = this.doc.getTextWidth(data);
          this.doc.text(
            data,
            colPositions[columnIndex] + colWidths[columnIndex] - textWidth,
            yPos
          );
        }
      });

      yPos += 22;
    });

    if (this.invoice.discounts.length > 0) {
      this.doc.setFont("helvetica", "italic");
      this.setTextColor(this.palette.headerSubtext);

      this.invoice.discounts.forEach((discount) => {
        const amountText = `- ${this.invoice.currency} ${discount.amount
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

        this.doc.text(discount.description, colPositions[0], yPos);

        const amountWidth = this.doc.getTextWidth(amountText);
        this.doc.text(
          amountText,
          colPositions[3] + colWidths[3] - amountWidth,
          yPos
        );

        yPos += 20;
      });

      this.doc.setFont("helvetica", "normal");
      this.setTextColor(this.palette.bodyText);
    }
  }

  private addTotals(): void {
    const calculations = calculateInvoiceAmounts(this.invoice);
    const rightAlign = this.pageWidth - this.margin;
    let yPos = 600;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);

    const totals: Array<[string, string]> = [
      ["Subtotal", formatCurrency(calculations.subtotal, this.invoice.currency)],
    ];

    if (calculations.discountTotal !== 0) {
      const discountLabel =
        this.invoice.discounts.length === 1
          ? this.invoice.discounts[0].description
          : "Discount";
      totals.push([
        discountLabel,
        formatCurrency(calculations.discountTotal, this.invoice.currency),
      ]);
    }

    if (this.invoice.taxRate > 0) {
      totals.push([
        `Tax (${this.invoice.taxRate}%)`,
        formatCurrency(calculations.taxAmount, this.invoice.currency),
      ]);
    }

    totals.push([
      "Total Due",
      formatCurrency(calculations.totalAmount, this.invoice.currency),
    ]);

    totals.forEach(([label, amount], index) => {
      const isTotal = index === totals.length - 1;

      if (isTotal) {
        this.setFillColor(this.palette.accentLight);
        this.doc.rect(rightAlign - 210, yPos - 14, 210, 28, "F");
        this.doc.setFont("helvetica", "bold");
        this.doc.setFontSize(12);
        this.setTextColor(this.palette.accent);
      } else {
        this.doc.setFont("helvetica", "normal");
        this.doc.setFontSize(10);
        this.setTextColor(this.palette.bodyText);
      }

      const amountWidth = this.doc.getTextWidth(amount);
      const labelWidth = this.doc.getTextWidth(`${label}:`);

      this.doc.text(amount, rightAlign - amountWidth, yPos);
      this.doc.text(`${label}:`, rightAlign - amountWidth - 24 - labelWidth, yPos);

      yPos += isTotal ? 30 : 22;
    });
  }

  private addFooter(): void {
    const yPos = this.pageHeight - 50;

    this.setDrawColor(this.palette.border);
    this.doc.line(this.margin, yPos - 20, this.pageWidth - this.margin, yPos - 20);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    this.setTextColor(this.palette.footerText);

    const contactInfo: string[] = [];

    if (this.invoice.issuer.email) {
      contactInfo.push(`Email: ${this.invoice.issuer.email}`);
    }

    if (this.invoice.issuer.phone) {
      contactInfo.push(`Phone: ${this.invoice.issuer.phone}`);
    }

    if (contactInfo.length > 0) {
      const footerText = contactInfo.join(" | ");
      const textWidth = this.doc.getTextWidth(footerText);
      const xPos = (this.pageWidth - textWidth) / 2;
      this.doc.text(footerText, xPos, yPos);
    }
  }
}

export const generateInvoicePDF = (invoice: InvoiceData): Promise<Blob> => {
  return new Promise((resolve) => {
    const generator = new InvoicePDFGenerator(invoice);
    const doc = generator.generatePDF();
    const pdfBlob = doc.output("blob");
    resolve(pdfBlob);
  });
};

export const downloadPDF = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
