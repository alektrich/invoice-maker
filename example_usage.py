#!/usr/bin/env python3
"""
Example usage of the Invoice Maker
This demonstrates how to create invoices programmatically
"""

from datetime import datetime, timedelta
from decimal import Decimal
from invoice_maker import ContactInfo, InvoiceItem, DiscountItem, Invoice, InvoicePDFGenerator

def create_sample_invoice():
    """Create a sample invoice programmatically"""
    
    # Create issuer information
    issuer = ContactInfo(
        company_name="Acme Corporation",
        contact_person="John Smith",
        address_line1="123 Business Street",
        address_line2="Suite 100",
        city="New York",
        state="NY",
        zip_code="10001",
        country="United States",
        phone="(555) 123-4567",
        email="john@acmecorp.com",
        tax_id="12-3456789"
    )
    
    # Create client information
    client = ContactInfo(
        company_name="Client Company Inc.",
        contact_person="Jane Doe",
        address_line1="456 Client Avenue",
        address_line2="Floor 2",
        city="Los Angeles",
        state="CA",
        zip_code="90210",
        country="United States",
        phone="(555) 987-6543",
        email="jane@clientcompany.com",
        tax_id="98-7654321"
    )
    
    # Create invoice items
    items = [
        InvoiceItem(
            description="Web Development Services",
            quantity=Decimal("40.0"),
            rate=Decimal("150.00")
        ),
        InvoiceItem(
            description="Design and UI/UX Services",
            quantity=Decimal("20.0"),
            rate=Decimal("100.00")
        ),
        InvoiceItem(
            description="Project Management",
            quantity=Decimal("10.0"),
            rate=Decimal("75.00")
        )
    ]
    
    # Create discount items
    discounts = [
        DiscountItem(
            description="Early Payment Discount (5%)",
            amount=Decimal("287.50")  # 5% of subtotal
        )
    ]
    
    # Create invoice
    invoice = Invoice(
        invoice_id="INV-2024-001",
        invoice_date=datetime.now(),
        due_date=datetime.now() + timedelta(days=30),
        issuer=issuer,
        client=client,
        items=items,
        discounts=discounts,
        tax_rate=Decimal("8.5")  # 8.5% tax rate
    )
    
    # Generate PDF
    output_path = "sample_invoice.pdf"
    generator = InvoicePDFGenerator(invoice, output_path)
    generator.generate()
    
    print(f"Sample invoice created: {output_path}")
    print(f"Invoice total: ${invoice.total_amount}")

if __name__ == "__main__":
    create_sample_invoice()
