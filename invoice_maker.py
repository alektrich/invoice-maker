#!/usr/bin/env python3
"""
Invoice Maker - Generate professional invoices in PDF format
"""

import argparse
import json
import os
from datetime import datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP
from dataclasses import dataclass, asdict
from typing import List, Optional
import sys

# Check if ReportLab is available
try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
except ImportError:
    print("Error: ReportLab is required. Install it with: pip install reportlab")
    sys.exit(1)


@dataclass
class ContactInfo:
    """Contact information for issuer or client"""
    company_name: str
    contact_person: str = ""
    address_line1: str = ""
    address_line2: str = ""
    city: str = ""
    state: str = ""
    zip_code: str = ""
    country: str = ""
    phone: str = ""
    email: str = ""
    tax_id: str = ""


@dataclass
class InvoiceItem:
    """Individual invoice item"""
    description: str
    quantity: Decimal
    rate: Decimal
    
    @property
    def total(self) -> Decimal:
        return (self.quantity * self.rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


@dataclass
class DiscountItem:
    """Discount item (negative amount)"""
    description: str
    amount: Decimal
    
    @property
    def total(self) -> Decimal:
        return -abs(self.amount).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


@dataclass
class Invoice:
    """Complete invoice data"""
    invoice_id: str
    invoice_date: datetime
    due_date: datetime
    issuer: ContactInfo
    client: ContactInfo
    items: List[InvoiceItem]
    discounts: List[DiscountItem]
    tax_rate: Decimal = Decimal('0.00')  # Tax rate as percentage (e.g., 10.5 for 10.5%)
    currency: str = "$"  # Currency symbol
    
    @property
    def subtotal(self) -> Decimal:
        return sum(item.total for item in self.items).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    @property
    def discount_total(self) -> Decimal:
        if not self.discounts:
            return Decimal('0.00')
        return sum(discount.total for discount in self.discounts).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    @property
    def taxable_amount(self) -> Decimal:
        return (self.subtotal + self.discount_total).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    @property
    def tax_amount(self) -> Decimal:
        if self.tax_rate == 0:
            return Decimal('0.00')
        return (self.taxable_amount * self.tax_rate / 100).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    @property
    def total_amount(self) -> Decimal:
        return (self.taxable_amount + self.tax_amount).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


class InvoicePDFGenerator:
    """Generate PDF invoices using ReportLab"""
    
    def __init__(self, invoice: Invoice, output_path: str):
        self.invoice = invoice
        self.output_path = output_path
        self.doc = SimpleDocTemplate(output_path, pagesize=letter, 
                                   rightMargin=72, leftMargin=72,
                                   topMargin=72, bottomMargin=18)
        self.styles = getSampleStyleSheet()
        self.story = []
    
    def generate(self):
        """Generate the PDF invoice"""
        self._add_header()
        self._add_invoice_details()
        self._add_parties_info()
        self._add_items_table()
        self._add_totals()
        self._add_contact_info()
        
        # Build the PDF
        self.doc.build(self.story)
        print(f"Invoice generated successfully: {self.output_path}")
    
    def _add_header(self):
        """Add invoice header"""
        title_style = ParagraphStyle(
            'InvoiceTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        )
        
        title = Paragraph(f"<b>INVOICE</b>", title_style)
        self.story.append(title)
        self.story.append(Spacer(1, 20))
    
    def _add_invoice_details(self):
        """Add invoice ID, date, and due date"""
        details_data = [
            ['Invoice ID:', self.invoice.invoice_id],
            ['Invoice Date:', self.invoice.invoice_date.strftime('%B %d, %Y')],
            ['Due Date:', self.invoice.due_date.strftime('%B %d, %Y')]
        ]
        
        details_table = Table(details_data, colWidths=[2*inch, 2*inch])
        details_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        self.story.append(details_table)
        self.story.append(Spacer(1, 20))
    
    def _add_parties_info(self):
        """Add issuer and client information"""
        # Create bill from and bill to sections
        issuer_info = self._format_contact_info(self.invoice.issuer, "Bill From:")
        client_info = self._format_contact_info(self.invoice.client, "Bill To:")
        
        # Use the exact same first column width as the items table for perfect alignment
        parties_data = [[issuer_info, client_info]]
        parties_table = Table(parties_data, colWidths=[3.5*inch, 3*inch])
        parties_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        self.story.append(parties_table)
        self.story.append(Spacer(1, 30))
    
    def _format_contact_info(self, contact: ContactInfo, title: str) -> Paragraph:
        """Format contact information as a paragraph"""
        info_lines = [f"<b>{title}</b>"]
        
        if contact.company_name:
            info_lines.append(f"<b>{contact.company_name}</b>")
        
        if contact.contact_person:
            info_lines.append(contact.contact_person)
        
        if contact.address_line1:
            info_lines.append(contact.address_line1)
        
        if contact.address_line2:
            info_lines.append(contact.address_line2)
        
        # City, State ZIP
        location_parts = []
        if contact.city:
            location_parts.append(contact.city)
        if contact.state:
            location_parts.append(contact.state)
        if contact.zip_code:
            location_parts.append(contact.zip_code)
        
        if location_parts:
            if contact.state and contact.zip_code:
                location = f"{contact.city}, {contact.state} {contact.zip_code}"
            else:
                location = " ".join(location_parts)
            info_lines.append(location)
        
        if contact.country:
            info_lines.append(contact.country)
        
        if contact.tax_id:
            info_lines.append(f"Tax ID: {contact.tax_id}")
        
        info_text = "<br/>".join(info_lines)
        return Paragraph(info_text, self.styles['Normal'])
    
    def _add_items_table(self):
        """Add items table with description, quantity, rate, and total"""
        # Table headers
        headers = ['Description', 'Quantity', 'Rate', 'Total']
        data = [headers]
        
        # Add invoice items
        for item in self.invoice.items:
            data.append([
                item.description,
                str(item.quantity),
                f"{self.invoice.currency} {item.rate:.2f}",
                f"{self.invoice.currency} {item.total:.2f}"
            ])
        
        # Add discount items (spanning all columns for clean display)
        for discount in self.invoice.discounts:
            data.append([
                discount.description,
                "",
                "",
                f"{self.invoice.currency} {discount.total:.2f}"
            ])
        
        # Create table
        table = Table(data, colWidths=[3.5*inch, 1*inch, 1*inch, 1*inch])
        table.setStyle(TableStyle([
            # Header styling
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            
            # Body styling
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),  # Right align numbers
            ('ALIGN', (0, 1), (0, -1), 'LEFT'),    # Left align descriptions
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            
            # Grid lines
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.darkblue),
        ]))
        
        self.story.append(table)
        self.story.append(Spacer(1, 20))
    
    def _add_totals(self):
        """Add totals section"""
        totals_data = []
        
        # Subtotal
        totals_data.append(['Subtotal:', f"{self.invoice.currency} {self.invoice.subtotal:.2f}"])
        
        # Discounts (if any)
        if self.invoice.discounts:
            totals_data.append(['Discount:', f"{self.invoice.currency} {self.invoice.discount_total:.2f}"])
        
        # Tax (if applicable)
        if self.invoice.tax_rate > 0:
            totals_data.append([f'Tax ({self.invoice.tax_rate}%):', f"{self.invoice.currency} {self.invoice.tax_amount:.2f}"])
        
        # Total
        totals_data.append(['Total:', f"{self.invoice.currency} {self.invoice.total_amount:.2f}"])
        
        # Create totals table
        totals_table = Table(totals_data, colWidths=[1.5*inch, 1*inch])
        totals_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, -2), 'Helvetica'),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -2), 10),
            ('FONTSIZE', (0, -1), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LINEABOVE', (0, -1), (-1, -1), 1, colors.black),
        ]))
        
        # Right-align the totals table
        totals_wrapper = Table([[totals_table]], colWidths=[6.5*inch])
        totals_wrapper.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        self.story.append(totals_wrapper)
        self.story.append(Spacer(1, 30))
    
    def _add_contact_info(self):
        """Add contact information at the bottom"""
        contact_style = ParagraphStyle(
            'ContactInfo',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
        
        contact_lines = []
        
        # Add issuer contact info
        if self.invoice.issuer.phone or self.invoice.issuer.email:
            contact_parts = []
            if self.invoice.issuer.phone:
                contact_parts.append(f"Phone: {self.invoice.issuer.phone}")
            if self.invoice.issuer.email:
                contact_parts.append(f"Email: {self.invoice.issuer.email}")
            contact_lines.append(" | ".join(contact_parts))
        
        if contact_lines:
            contact_text = "<br/>".join(contact_lines)
            contact_para = Paragraph(contact_text, contact_style)
            self.story.append(contact_para)


class InvoiceMaker:
    """Main invoice maker class"""
    
    def __init__(self):
        self.invoice_data = {}
    
    def interactive_mode(self):
        """Interactive mode for creating invoices"""
        print("=== Invoice Maker ===")
        print("Creating a new invoice interactively...\n")
        
        # Get invoice details
        invoice_id = input("Invoice ID: ").strip()
        if not invoice_id:
            invoice_id = f"INV-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
            print(f"Using auto-generated ID: {invoice_id}")
        
        invoice_date = self._get_date("Invoice date (YYYY-MM-DD) [today]: ")
        if not invoice_date:
            invoice_date = datetime.now()
        
        due_date = self._get_date("Due date (YYYY-MM-DD) [30 days from invoice date]: ")
        if not due_date:
            due_date = invoice_date + timedelta(days=30)
        
        # Get issuer information
        print("\n--- Issuer Information ---")
        issuer = self._get_contact_info("issuer")
        
        # Get client information
        print("\n--- Client Information ---")
        client = self._get_contact_info("client")
        
        # Get invoice items
        print("\n--- Invoice Items ---")
        items = self._get_items()
        
        # Get discounts
        print("\n--- Discounts (optional) ---")
        discounts = self._get_discounts()
        
        # Get tax rate
        tax_rate = self._get_decimal("Tax rate percentage (0 for no tax): ", default=Decimal('0'))
        
        # Get currency
        currency = self._get_currency()
        
        # Create invoice
        invoice = Invoice(
            invoice_id=invoice_id,
            invoice_date=invoice_date,
            due_date=due_date,
            issuer=issuer,
            client=client,
            items=items,
            discounts=discounts,
            tax_rate=tax_rate,
            currency=currency
        )
        
        # Generate PDF
        output_path = f"invoice_{invoice_id.replace('/', '_')}.pdf"
        generator = InvoicePDFGenerator(invoice, output_path)
        generator.generate()
        
        return output_path
    
    def _get_contact_info(self, party_type: str) -> ContactInfo:
        """Get contact information interactively"""
        company_name = input(f"{party_type.title()} company name: ").strip()
        contact_person = input(f"Contact person: ").strip()
        address_line1 = input(f"Address line 1: ").strip()
        address_line2 = input(f"Address line 2 (optional): ").strip()
        city = input(f"City: ").strip()
        state = input(f"State/Province: ").strip()
        zip_code = input(f"ZIP/Postal code: ").strip()
        country = input(f"Country: ").strip()
        phone = input(f"Phone: ").strip()
        email = input(f"Email: ").strip()
        tax_id = input(f"Tax ID: ").strip()
        
        return ContactInfo(
            company_name=company_name,
            contact_person=contact_person,
            address_line1=address_line1,
            address_line2=address_line2,
            city=city,
            state=state,
            zip_code=zip_code,
            country=country,
            phone=phone,
            email=email,
            tax_id=tax_id
        )
    
    def _get_items(self) -> List[InvoiceItem]:
        """Get invoice items interactively"""
        items = []
        
        while True:
            print(f"\nItem {len(items) + 1}:")
            description = input("Description: ").strip()
            if not description:
                break
            
            quantity = self._get_decimal("Quantity: ", required=True)
            rate = self._get_decimal("Rate: ", required=True)
            
            items.append(InvoiceItem(description=description, quantity=quantity, rate=rate))
            
            if input("Add another item? (y/N): ").strip().lower() != 'y':
                break
        
        if not items:
            print("Warning: No items added. Adding a default item.")
            items.append(InvoiceItem(
                description="Service",
                quantity=Decimal('1'),
                rate=Decimal('0.00')
            ))
        
        return items
    
    def _get_discounts(self) -> List[DiscountItem]:
        """Get discount items interactively"""
        discounts = []
        
        if input("Add discounts? (y/N): ").strip().lower() != 'y':
            return discounts
        
        while True:
            print(f"\nDiscount {len(discounts) + 1}:")
            description = input("Description: ").strip()
            if not description:
                break
            
            amount = self._get_decimal("Discount amount: ", required=True)
            
            discounts.append(DiscountItem(description=description, amount=amount))
            
            if input("Add another discount? (y/N): ").strip().lower() != 'y':
                break
        
        return discounts
    
    def _get_date(self, prompt: str) -> Optional[datetime]:
        """Get date input from user"""
        date_str = input(prompt).strip()
        if not date_str:
            return None
        
        try:
            return datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            print("Invalid date format. Using default.")
            return None
    
    def _get_decimal(self, prompt: str, required: bool = False, default: Optional[Decimal] = None) -> Decimal:
        """Get decimal input from user"""
        while True:
            value_str = input(prompt).strip()
            
            if not value_str:
                if not required and default is not None:
                    return default
                elif not required:
                    return Decimal('0.00')
                else:
                    print("This field is required.")
                    continue
            
            try:
                return Decimal(value_str)
            except:
                print("Invalid number. Please try again.")
    
    def _get_currency(self) -> str:
        """Get currency selection from user"""
        currencies = {
            '1': '$',
            '2': '€'
        }
        
        print("\n--- Currency Selection ---")
        print("1. USD ($)")
        print("2. EUR (€)")
        
        while True:
            choice = input("Select currency (1-2) [1]: ").strip()
            
            if not choice:
                return '$'  # Default to USD
            
            if choice in currencies:
                return currencies[choice]
            
            print("Invalid choice. Please select 1 or 2.")


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Generate professional invoices in PDF format')
    parser.add_argument('--interactive', '-i', action='store_true', 
                       help='Run in interactive mode')
    parser.add_argument('--version', action='version', version='Invoice Maker 1.0')
    
    args = parser.parse_args()
    
    if args.interactive or len(sys.argv) == 1:
        # Run in interactive mode
        maker = InvoiceMaker()
        try:
            output_path = maker.interactive_mode()
            print(f"\nInvoice generated successfully: {output_path}")
        except KeyboardInterrupt:
            print("\nOperation cancelled.")
            sys.exit(1)
        except Exception as e:
            print(f"\nError: {e}")
            sys.exit(1)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
