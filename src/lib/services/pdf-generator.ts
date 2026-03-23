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
} from "@/lib/templates/invoice-templates";
import { t } from "@/lib/i18n/translations";

// jsPDF built-in fonts lack Serbian latin glyphs (Š,Đ,Č,Ć,Ž etc.)
// Transliterate to ASCII equivalents for correct PDF rendering.
const serbianCharMap: Record<string, string> = {
  "Š": "S",
  "Đ": "DJ",
  "Č": "C",
  "Ć": "C",
  "Ž": "Z",
};
const serbianRegex = new RegExp(Object.keys(serbianCharMap).join("|"), "g");

function transliterateSrb(text: string): string {
  return text.replace(serbianRegex, (ch) => serbianCharMap[ch] || ch);
}

export class InvoicePDFGenerator {
  private doc: jsPDF;
  private invoice: InvoiceData;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private template: InvoiceTemplate;
  private palette: InvoiceTemplatePalette;

  constructor(invoice: InvoiceData) {
    this.invoice = invoice;
    this.doc = new jsPDF("p", "pt", "letter");
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margin = 72; // 1 inch margins
    this.template = getInvoiceTemplate(invoice.templateId);
    this.palette = this.template.palette;
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

  private get lang() {
    return this.invoice.language || "en";
  }

  private get tr() {
    return t(this.lang);
  }

  private get dateLocale() {
    return this.lang === "sr" ? "sr-Latn" : "en-US";
  }

  private get isRSD() {
    return this.invoice.currency === "RSD";
  }

  /** Transliterate Serbian special chars for jsPDF rendering */
  private pdfText(text: string): string {
    return this.lang === "sr" ? transliterateSrb(text) : text;
  }

  private formatAmount(amount: number): string {
    const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return this.isRSD ? formatted : `${this.invoice.currency} ${formatted}`;
  }

  private addHeader(): void {
    this.setFillColor(this.palette.accent);
    this.doc.rect(0, 0, this.pageWidth, 90, "F");

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(26);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(this.tr.invoice, this.margin, 45);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(12);
    this.doc.text(`#${this.invoice.invoiceId}`, this.margin, 65);
  }

  private addInvoiceDetails(): void {
    let yPos = 140;

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.setTextColor(this.palette.headerText);
    this.doc.text(this.tr.invoiceDetails, this.margin, yPos);
    yPos += 24;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);

    const details: Array<[string, string]> = [
      [this.tr.invoiceId, this.invoice.invoiceId],
      [
        this.tr.invoiceDate,
        new Date(this.invoice.invoiceDate).toLocaleDateString(this.dateLocale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ],
      [
        this.tr.dueDate,
        new Date(this.invoice.dueDate).toLocaleDateString(this.dateLocale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ],
    ];

    if (this.lang === "sr" && this.invoice.placeOfIssue) {
      details.push([this.tr.placeOfIssue, this.invoice.placeOfIssue]);
    }

    details.forEach(([label, value]) => {
      this.doc.setFont("helvetica", "bold");
      this.setTextColor(this.palette.headerSubtext);
      this.doc.text(`${this.pdfText(label)}:`, this.margin, yPos);

      this.doc.setFont("helvetica", "normal");
      this.setTextColor(this.palette.bodyText);
      this.doc.text(this.pdfText(value), this.margin + 90, yPos);
      yPos += 18;
    });

    this.setDrawColor(this.palette.border);
    this.doc.line(this.margin, yPos + 6, this.pageWidth - this.margin, yPos + 6);
  }

  private addPartiesInfo(): void {
    const yStart = 280;

    this.addContactInfo(this.invoice.issuer, this.tr.billFrom, this.margin, yStart);
    this.addContactInfo(
      this.invoice.client,
      this.tr.billTo,
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

    const maxWidth = this.pageWidth / 2 - this.margin - 10;

    if (contact.companyName) {
      this.doc.setFont("helvetica", "bold");
      this.setTextColor(this.palette.headerText);
      const lines = this.doc.splitTextToSize(this.pdfText(contact.companyName), maxWidth);
      this.doc.text(lines, x, yPos);
      yPos += 16 * lines.length;
      this.doc.setFont("helvetica", "normal");
      this.setTextColor(this.palette.bodyText);
    }

    const excludeContact = title === this.tr.billFrom;

    const contactLines = [
      contact.contactPerson,
      contact.addressLine1,
      contact.addressLine2,
      [contact.city, contact.state, contact.zipCode].filter(Boolean).join(", "),
      contact.country,
      !excludeContact ? contact.phone : "",
      !excludeContact ? contact.email : "",
      contact.taxId ? `${this.tr.taxId}: ${contact.taxId.replace(/\s+/g, "").trim()}` : "",
    ].filter((value): value is string => Boolean(value));

    contactLines.forEach((line) => {
      // Transliterate Serbian chars first, then strip remaining non-ASCII
      const transliterated = this.pdfText(line);
      const clean = transliterated.replace(/[^\x20-\x7E]/g, (ch) => {
        if (ch.charCodeAt(0) >= 0x00C0 && ch.charCodeAt(0) <= 0x024F) return ch;
        return "";
      }).trim();
      this.doc.text(clean, x, yPos);
      yPos += 14;
    });
  }

  private addItemsTable(): void {
    const yStart = 420;

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10);

    const headers = [this.tr.description, this.tr.qty, this.tr.rate, this.tr.total];
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
      26,
      "F"
    );

    this.setTextColor(this.palette.tableHeaderText);
    headers.forEach((header, index) => {
      if (index === 0) {
        this.doc.text(header, colPositions[index], yStart);
      } else {
        const textWidth = this.doc.getTextWidth(header);
        this.doc.text(
          header,
          colPositions[index] + colWidths[index] - textWidth,
          yStart
        );
      }
    });

    this.setDrawColor(this.palette.border);
    this.doc.line(this.margin, yStart + 8, this.pageWidth - this.margin, yStart + 8);

    let yPos = yStart + 26;
    this.doc.setFont("helvetica", "normal");
    this.setTextColor(this.palette.bodyText);

    this.invoice.items.forEach((item, index) => {
      const total = item.quantity * item.rate;
      const rowData = [
        item.description,
        item.quantity.toString(),
        this.formatAmount(item.rate),
        this.formatAmount(total),
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
        const amountText = `- ${this.formatAmount(discount.amount)}`;

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

    const fmt = (amount: number) => this.isRSD
      ? this.formatAmount(amount)
      : formatCurrency(amount, this.invoice.currency);

    const totals: Array<[string, string]> = [
      [this.tr.subtotal, fmt(calculations.subtotal)],
    ];

    if (calculations.discountTotal !== 0) {
      const discountLabel =
        this.invoice.discounts.length === 1
          ? this.invoice.discounts[0].description
          : this.tr.discount;
      totals.push([
        discountLabel,
        fmt(calculations.discountTotal),
      ]);
    }

    if (this.invoice.taxRate > 0) {
      totals.push([
        `${this.tr.tax} (${this.invoice.taxRate}%)`,
        fmt(calculations.taxAmount),
      ]);
    }

    const totalDueLabel = this.isRSD
      ? `${this.tr.totalDue} (RSD)`
      : this.tr.totalDue;

    totals.push([
      totalDueLabel,
      fmt(calculations.totalAmount),
    ]);

    totals.forEach(([label, amount], index) => {
      const isTotal = index === totals.length - 1;

      if (isTotal) {
        this.setFillColor(this.palette.accentLight);
        this.doc.rect(rightAlign - 210, yPos - 14, 210, 26, "F");
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

      if (isTotal) {
        this.setDrawColor(this.palette.accent);
        this.doc.line(rightAlign - 210, yPos - 18, rightAlign, yPos - 18);
      }

      yPos += isTotal ? 30 : 22;
    });

    // Bank account for Serbian invoices
    if (this.lang === "sr" && this.invoice.bankAccount) {
      yPos += 10;
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(10);
      this.setTextColor(this.palette.headerText);
      this.doc.text(`${this.tr.bankAccount}: ${this.invoice.bankAccount}`, this.margin, yPos);
    }
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
      contactInfo.push(`${this.tr.email}: ${this.invoice.issuer.email}`);
    }

    if (this.invoice.issuer.phone) {
      contactInfo.push(`${this.tr.phone}: ${this.invoice.issuer.phone}`);
    }

    if (contactInfo.length > 0) {
      const footerText = contactInfo.join(" | ");
      const textWidth = this.doc.getTextWidth(footerText);
      const xPos = (this.pageWidth - textWidth) / 2;
      this.doc.text(footerText, xPos, yPos);
    }

    if (this.lang === "sr") {
      let footerY = yPos + 14;

      if (this.invoice.vatExemptNote) {
        this.doc.setFont("helvetica", "italic");
        this.doc.setFontSize(7);
        this.setTextColor(this.palette.footerText);
        const vatText = this.tr.vatExemptText;
        const vatWidth = this.doc.getTextWidth(vatText);
        this.doc.text(vatText, (this.pageWidth - vatWidth) / 2, footerY);
        footerY += 12;
      }

      const disclaimer = "Dokument je izradjen na racunaru i punovazan je i bez pecata i potpisa";
      this.doc.setFont("helvetica", "italic");
      this.doc.setFontSize(7);
      this.setTextColor(this.palette.footerText);
      const disclaimerWidth = this.doc.getTextWidth(disclaimer);
      this.doc.text(disclaimer, (this.pageWidth - disclaimerWidth) / 2, footerY);
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
