# Invoice Generator Web App

A modern, professional invoice generator built with Next.js 15, React 19, TypeScript, and Tailwind CSS. This web application converts the original Python CLI invoice maker into a beautiful, user-friendly web interface.

## Features

- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 📝 **Form Validation**: Comprehensive validation using react-hook-form and Zod
- 📄 **PDF Generation**: High-quality PDF invoices with improved layout
- 👀 **Live Preview**: Real-time PDF preview as you edit
- 💾 **Instant Download**: Download generated PDFs immediately
- 💰 **Multi-Currency**: Support for multiple currencies (USD, EUR, GBP, JPY, INR)
- 🧮 **Auto Calculations**: Automatic subtotal, tax, discount, and total calculations
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices

## Key Improvements over Python CLI

1. **Invoice ID Display**: Shows invoice ID next to the title in the PDF
2. **Reduced Title Size**: Smaller, more professional title font size
3. **Web Interface**: No more command-line interaction needed
4. **Live Preview**: See your invoice as you create it
5. **Better UX**: Form validation, auto-calculations, and error handling

## Technology Stack

- **Framework**: Next.js 15 (Page Router)
- **Frontend**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: react-hook-form
- **Validation**: Zod
- **PDF Generation**: jsPDF
- **Build Tool**: SWC

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Usage

1. **Fill out the invoice form** with your business information and client details
2. **Add invoice items** with descriptions, quantities, and rates
3. **Add discounts** if applicable
4. **Set tax rate** and currency
5. **Generate PDF** and see the live preview
6. **Download** the PDF when you're satisfied

## Form Sections

### Invoice Details

- Invoice ID (auto-generated or custom)
- Invoice Date
- Due Date
- Tax Rate (%)
- Currency Selection

### Bill From (Your Information)

- Company Name (required)
- Contact Person
- Complete Address
- Phone, Email, Tax ID

### Bill To (Client Information)

- Company Name (required)
- Contact Person
- Complete Address
- Phone, Email, Tax ID

### Invoice Items

- Description (required)
- Quantity (required)
- Rate (required)
- Automatic total calculation
- Add/remove items dynamically

### Discounts (Optional)

- Description
- Amount
- Add/remove discounts dynamically

## PDF Features

The generated PDF includes:

- Professional header with invoice ID
- Complete billing information
- Itemized list with calculations
- Tax calculations
- Professional footer
- Responsive layout

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # React components
│   ├── forms/          # Form components
│   ├── ui/             # UI components
│   └── PDFPreview.tsx  # PDF preview component
├── lib/                # Utility libraries
│   ├── services/       # Services (PDF generation)
│   ├── utils/          # Utility functions
│   └── validations/    # Zod schemas
├── pages/              # Next.js pages
├── styles/             # Global styles
└── types/              # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please create an issue in the repository.

---

**Built with ❤️ using Next.js, React, and TypeScript**
