import jsPDF from "jspdf";
import { InvoiceData, ContactInfo } from "@/types/invoice";
import {
  calculateInvoiceAmounts,
  formatCurrency,
} from "@/lib/utils/invoice-calculations";

export class InvoicePDFGenerator {
  private doc: jsPDF;
  private invoice: InvoiceData;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;

  constructor(invoice: InvoiceData) {
    this.invoice = invoice;
    this.doc = new jsPDF("p", "pt", "letter");
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margin = 72; // 1 inch margins
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

  private addHeader(): void {
    // Title with Invoice ID (improved as requested)
    this.doc.setFontSize(20); // Reduced from 24 as requested
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(25, 25, 112); // Dark blue color

    const titleText = `INVOICE #${this.invoice.invoiceId}`;
    const titleWidth = this.doc.getTextWidth(titleText);
    const titleX = (this.pageWidth - titleWidth) / 2;

    this.doc.text(titleText, titleX, 100);
  }

  private addInvoiceDetails(): void {
    let yPos = 150;

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(0, 0, 0);

    const details = [
      ["Invoice ID:", this.invoice.invoiceId],
      [
        "Invoice Date:",
        new Date(this.invoice.invoiceDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ],
      [
        "Due Date:",
        new Date(this.invoice.dueDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ],
    ];

    details.forEach(([label, value]) => {
      this.doc.setFont("helvetica", "bold");
      this.doc.text(label, this.margin, yPos);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(value, this.margin + 80, yPos);
      yPos += 20;
    });
  }

  private addPartiesInfo(): void {
    const yStart = 250;

    // Bill From (left side)
    this.addContactInfo(this.invoice.issuer, "Bill From:", this.margin, yStart);

    // Bill To (right side)
    this.addContactInfo(
      this.invoice.client,
      "Bill To:",
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

    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, x, yPos);
    yPos += 20;

    this.doc.setFontSize(10);

    if (contact.companyName) {
      this.doc.setFont("helvetica", "bold");
      this.doc.text(contact.companyName, x, yPos);
      yPos += 15;
    }

    this.doc.setFont("helvetica", "normal");

    // For Bill From (issuer), exclude phone and email
    const excludeContact = title === "Bill From:";
    
    const contactLines = [
      contact.contactPerson,
      contact.addressLine1,
      contact.addressLine2,
      [contact.city, contact.state, contact.zipCode].filter(Boolean).join(", "),
      contact.country,
      !excludeContact ? contact.phone : "",
      !excludeContact ? contact.email : "",
      contact.taxId ? `Tax ID: ${contact.taxId}` : "",
    ].filter(Boolean);

    contactLines.forEach((line) => {
      if (line) {
        this.doc.text(line, x, yPos);
        yPos += 15;
      }
    });
  }

  private addItemsTable(): void {
    const yStart = 400;
    const calculations = calculateInvoiceAmounts(this.invoice);

    // Table headers
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");

    const headers = ["Description", "Qty", "Rate", "Total"];
    const colWidths = [250, 60, 80, 80];
    const colPositions = [this.margin];

    for (let i = 1; i < colWidths.length; i++) {
      colPositions.push(colPositions[i - 1] + colWidths[i - 1]);
    }

    // Draw header row
    let yPos = yStart;
    headers.forEach((header, index) => {
      if (index === 0) {
        // Left align description
        this.doc.text(header, colPositions[index], yPos);
      } else {
        // Right align Qty, Rate, Total
        const textWidth = this.doc.getTextWidth(header);
        this.doc.text(
          header,
          colPositions[index] + colWidths[index] - textWidth,
          yPos
        );
      }
    });

    // Draw header line
    yPos += 5;
    this.doc.line(this.margin, yPos, this.pageWidth - this.margin, yPos);
    yPos += 20;

    // Draw items
    this.doc.setFont("helvetica", "normal");
    this.invoice.items.forEach((item) => {
      const total = item.quantity * item.rate;
      const rowData = [
        item.description,
        item.quantity.toString(),
        `${this.invoice.currency} ${item.rate.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        `${this.invoice.currency} ${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      ];

      rowData.forEach((data, index) => {
        if (index === 0) {
          // Left align description
          this.doc.text(data, colPositions[index], yPos);
        } else {
          // Right align numbers
          const textWidth = this.doc.getTextWidth(data);
          this.doc.text(
            data,
            colPositions[index] + colWidths[index] - textWidth,
            yPos
          );
        }
      });
      yPos += 20;
    });

    // Add discounts only if there are multiple discounts
    if (this.invoice.discounts.length > 1) {
      this.invoice.discounts.forEach((discount) => {
        const rowData = [
          discount.description,
          "",
          "",
          `-${this.invoice.currency} ${discount.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        ];

        rowData.forEach((data, index) => {
          if (index === 0) {
            this.doc.text(data, colPositions[index], yPos);
          } else if (data) {
            const textWidth = this.doc.getTextWidth(data);
            this.doc.text(
              data,
              colPositions[index] + colWidths[index] - textWidth,
              yPos
            );
          }
        });
        yPos += 20;
      });
    }
  }

  private addTotals(): void {
    const calculations = calculateInvoiceAmounts(this.invoice);
    const yStart = 600;
    const rightAlign = this.pageWidth - this.margin;

    let yPos = yStart;

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");

    const totals = [
      [
        "Subtotal:",
        formatCurrency(calculations.subtotal, this.invoice.currency),
      ],
    ];

    if (calculations.discountTotal !== 0) {
      // If single discount, show its description, otherwise show generic "Discount"
      const discountLabel = 
        this.invoice.discounts.length === 1 
          ? `${this.invoice.discounts[0].description}:`
          : "Discount:";
      totals.push([
        discountLabel,
        formatCurrency(calculations.discountTotal, this.invoice.currency),
      ]);
    }

    if (this.invoice.taxRate > 0) {
      totals.push([
        `Tax (${this.invoice.taxRate}%):`,
        formatCurrency(calculations.taxAmount, this.invoice.currency),
      ]);
    }

    totals.push([
      "Total:",
      formatCurrency(calculations.totalAmount, this.invoice.currency),
    ]);

    totals.forEach(([label, amount], index) => {
      const isTotal = index === totals.length - 1;

      if (isTotal) {
        this.doc.setFont("helvetica", "bold");
        this.doc.setFontSize(12);
      }

      // Right align both label and amount
      const amountWidth = this.doc.getTextWidth(amount);
      const labelWidth = this.doc.getTextWidth(label);

      this.doc.text(amount, rightAlign - amountWidth, yPos);
      this.doc.text(label, rightAlign - amountWidth - 30 - labelWidth, yPos);

      if (isTotal) {
        // Draw line above total
        const lineStartX = rightAlign - Math.max(amountWidth + labelWidth + 40, 150);
        this.doc.line(
          lineStartX,
          yPos - 10,
          rightAlign,
          yPos - 10
        );
      }

      yPos += isTotal ? 25 : 20;
    });
  }

  private addFooter(): void {
    const yPos = this.pageHeight - 50;

    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(128, 128, 128);

    // Show issuer contact information in footer
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
