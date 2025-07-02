# Invoice Maker

A professional Python-based invoice generator that creates beautiful PDF invoices with comprehensive business information.

## Features

✅ **Complete Contact Information Support**
- Company name, contact person, and full address
- Tax ID for both issuer and client
- Phone and email contact information

✅ **Flexible Invoice Items**
- Add multiple items with description, quantity, and rate
- Automatic total calculation per item
- Support for discount items (negative amounts)

✅ **Tax and Discount Management**
- Configurable tax rate percentage
- Multiple discount items support
- Accurate subtotal and total calculations

✅ **Professional PDF Output**
- Clean, professional invoice layout
- Proper "Bill From" and "Bill To" sections
- Detailed items table with headers
- Tax and discount breakdown
- Contact information footer

✅ **Invoice Management**
- Manual invoice ID setting or auto-generation
- Invoice date and due date configuration
- Date validation and formatting

## Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd invoice-maker
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Interactive Mode (Recommended)

Simply run the script to enter interactive mode:

```bash
python invoice_maker.py
```

or explicitly:

```bash
python invoice_maker.py --interactive
```

The interactive mode will guide you through:

1. **Invoice Details**
   - Invoice ID (auto-generated if not provided)
   - Invoice date (defaults to today)
   - Due date (defaults to 30 days from invoice date)

2. **Issuer Information**
   - Your company details
   - Complete address and contact information
   - Tax ID

3. **Client Information**
   - Client company details
   - Complete address and contact information
   - Tax ID

4. **Invoice Items**
   - Add multiple items with description, quantity, and rate
   - Automatic total calculation

5. **Discounts (Optional)**
   - Add discount items with negative amounts

6. **Tax Configuration**
   - Set tax rate percentage (0 for no tax)

### Example Invoice Structure

The generated PDF will include:

```
                           INVOICE

Invoice ID: INV-20240702-145102
Invoice Date: July 02, 2024
Due Date: August 01, 2024

Bill From:                          Bill To:
Acme Corporation                    Client Company Inc.
John Smith                          Jane Doe
123 Business St                     456 Client Ave
Suite 100                           Floor 2
New York, NY 10001                  Los Angeles, CA 90210
United States                       United States
Tax ID: 12-3456789                  Tax ID: 98-7654321

┌─────────────────────────────────────────────────────────────────────┐
│ Description          │ Quantity │    Rate │    Total                │
├─────────────────────────────────────────────────────────────────────┤
│ Web Development      │     40.0 │ $150.00 │ $6,000.00              │
│ Design Services      │     20.0 │ $100.00 │ $2,000.00              │
│ Early Payment Disc.  │      1.0 │ $-200.00│  $-200.00              │
└─────────────────────────────────────────────────────────────────────┘

                                    Subtotal: $8,000.00
                                    Discount:  $-200.00
                                    Tax (8.5%): $663.00
                                    Total: $8,463.00

               Phone: (555) 123-4567 | Email: john@acme.com
```

## File Structure

```
invoice-maker/
├── invoice_maker.py      # Main application
├── requirements.txt      # Python dependencies
├── README.md            # Documentation
└── *.pdf               # Generated invoices
```

## Generated Invoice Features

- **Professional Layout**: Clean, business-ready design
- **Comprehensive Information**: All business details included
- **Accurate Calculations**: Precise decimal handling
- **Tax Support**: Configurable tax rates with proper calculations
- **Discount Support**: Negative amounts displayed correctly
- **Contact Footer**: Easy reference for client communication

## Technical Details

- **Language**: Python 3.6+
- **PDF Generation**: ReportLab library
- **Decimal Precision**: Proper financial calculations
- **Date Handling**: Flexible date input with defaults
- **Error Handling**: Input validation and user-friendly messages

## Requirements

- Python 3.6 or higher
- ReportLab library (`pip install reportlab`)

## Example Usage

1. Run `python invoice_maker.py`
2. Follow the interactive prompts
3. Your PDF invoice will be generated as `invoice_[ID].pdf`

## License

Open source - feel free to modify and use for your business needs.

## Support

For issues or feature requests, please create an issue in the repository.
