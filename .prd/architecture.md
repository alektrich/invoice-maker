# Invoice Maker - Architecture Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Overview](#architecture-overview)
5. [Core Components](#core-components)
6. [Services & Utilities](#services--utilities)
7. [Data Flow](#data-flow)
8. [State Management](#state-management)
9. [Styling & Theming](#styling--theming)
10. [PDF Generation](#pdf-generation)
11. [Form Validation](#form-validation)
12. [Storage & Persistence](#storage--persistence)
13. [Type System](#type-system)
14. [Configuration](#configuration)
15. [Build & Deployment](#build--deployment)

---

## Project Overview

**Invoice Maker** is a modern, client-side web application for generating professional PDF invoices. It's built as a Next.js 15 application using React 19, TypeScript, and Tailwind CSS. The application allows users to:

- Select from multiple invoice templates with different color schemes
- Fill out invoice details through a multi-step form
- Preview invoices in real-time
- Generate and download PDF invoices
- Persist form data in browser localStorage

### Key Features

- 🎨 **Multiple Templates**: 5 pre-configured invoice templates with unique color palettes
- 📝 **Form Validation**: Comprehensive validation using react-hook-form and Zod
- 📄 **PDF Generation**: Client-side PDF generation using jsPDF
- 👀 **Live Preview**: Real-time PDF preview in an iframe
- 💾 **Auto-save**: Form data persisted to localStorage
- 💰 **Multi-Currency**: Support for USD, EUR, GBP, JPY, INR
- 🧮 **Auto Calculations**: Automatic subtotal, tax, discount, and total calculations
- 📱 **Responsive**: Mobile-first responsive design

---

## Technology Stack

### Core Framework
- **Next.js 15** (Page Router) - React framework with App Router support
- **React 19** - UI library
- **TypeScript 5.3** - Type-safe JavaScript

### Form Management
- **react-hook-form 7.48** - Performant form library
- **Zod 3.22** - Schema validation
- **@hookform/resolvers 3.3** - Zod integration for react-hook-form

### PDF Generation
- **jsPDF 2.5** - PDF generation library
- **pdfjs-dist 5.4.394** - PDF.js for rendering (configured but not actively used)
- **react-pdf 7.6** - React wrapper for PDF.js (installed but not used)

### Styling
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **tailwind-merge 2.0** - Merge Tailwind classes
- **clsx 2.0** - Conditional class names

### Utilities
- **date-fns 2.30** - Date formatting utilities

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## Project Structure

```
invoice-maker/
├── .prd/                          # Product requirements and documentation
│   ├── architecture.md            # This file
│   └── more_templates.md          # Future template requirements
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx            # Root layout with metadata and fonts
│   │   └── page.tsx              # Main page component (client-side)
│   ├── components/                # React components
│   │   ├── forms/                # Form components
│   │   │   ├── InvoiceForm.tsx  # Main invoice form wrapper
│   │   │   ├── ContactInfoForm.tsx  # Contact information form
│   │   │   └── InvoiceItemsForm.tsx # Items and discounts form
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx        # Button component
│   │   │   └── Input.tsx         # Input component
│   │   ├── PDFPreview.tsx        # PDF preview component
│   │   └── TemplateSelector.tsx  # Template selection component
│   ├── lib/                      # Utility libraries and services
│   │   ├── constants/            # Application constants
│   │   │   └── storage.ts        # LocalStorage keys
│   │   ├── services/             # Business logic services
│   │   │   └── pdf-generator.ts  # PDF generation service
│   │   ├── templates/            # Invoice templates
│   │   │   └── invoice-templates.ts  # Template definitions
│   │   ├── utils/                # Utility functions
│   │   │   ├── cn.ts             # Class name utility
│   │   │   └── invoice-calculations.ts  # Invoice calculations
│   │   └── validations/          # Validation schemas
│   │       └── invoice.ts        # Zod validation schemas
│   ├── types/                    # TypeScript type definitions
│   │   ├── invoice.ts            # Invoice-related types
│   │   └── pdfjs.d.ts            # PDF.js type declarations
│   └── styles/                   # Global styles
│       └── globals.css           # Global CSS and Tailwind imports
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

---

## Architecture Overview

### Architecture Pattern

The application follows a **component-based architecture** with clear separation of concerns:

1. **Presentation Layer**: React components (`src/components/`)
2. **Business Logic Layer**: Services and utilities (`src/lib/`)
3. **Data Layer**: Types and validation schemas (`src/types/`, `src/lib/validations/`)
4. **Configuration Layer**: Templates, constants, and configs (`src/lib/templates/`, `src/lib/constants/`)

### Application Flow

```
User Interaction
    ↓
Template Selection (Step 1)
    ↓
Form Filling (Step 2)
    ↓
Form Validation (Zod + react-hook-form)
    ↓
PDF Generation (jsPDF)
    ↓
PDF Preview (Blob URL in iframe)
    ↓
PDF Download
```

### Key Architectural Decisions

1. **Client-Side Only**: All processing happens in the browser (no backend required)
2. **LocalStorage Persistence**: Form data auto-saved to browser storage
3. **Template System**: Extensible template system with color palettes
4. **Form State Management**: react-hook-form for efficient form state management
5. **Type Safety**: Full TypeScript coverage with Zod runtime validation

---

## Core Components

### 1. Main Page (`src/app/page.tsx`)

**Type**: Client Component (`"use client"`)

**Responsibilities**:
- Orchestrates the two-step flow (template selection → form)
- Manages PDF blob state
- Handles template selection persistence
- Coordinates between form and preview components

**Key State**:
- `generatedPDF: Blob | null` - Generated PDF blob
- `currentInvoiceId: string` - Current invoice ID
- `step: 1 | 2` - Current step (1 = template selection, 2 = form)
- `selectedTemplateId: string` - Selected template ID

**Key Features**:
- Two-column layout (form on left, preview on right)
- Sticky preview panel
- Template selection persistence in localStorage
- PDF generation callback handling

### 2. Invoice Form (`src/components/forms/InvoiceForm.tsx`)

**Type**: Client Component

**Responsibilities**:
- Main form container with react-hook-form integration
- Form validation using Zod schemas
- Form data persistence to localStorage
- PDF generation triggering
- Template display and change handler

**Key Features**:
- Auto-save form data to localStorage (excludes invoiceId, invoiceDate, dueDate)
- Hydration handling to prevent SSR/client mismatches
- Dynamic template display
- Form validation with error display
- Invoice ID generation button

**Form Sections**:
1. Invoice Details (ID, dates, tax rate, currency)
2. Bill From (Issuer information)
3. Bill To (Client information)
4. Invoice Items (dynamic items with add/remove)
5. Discounts (optional dynamic discounts)
6. Invoice Summary (calculated totals)

### 3. Contact Info Form (`src/components/forms/ContactInfoForm.tsx`)

**Type**: Client Component

**Responsibilities**:
- Reusable contact information form
- Used for both "Bill From" and "Bill To" sections
- Field-level validation using react-hook-form Controller

**Fields**:
- Company Name (required)
- Contact Person
- Address (Line 1, Line 2, City, State, ZIP, Country)
- Phone
- Email (with email validation)
- Tax ID

### 4. Invoice Items Form (`src/components/forms/InvoiceItemsForm.tsx`)

**Type**: Client Component

**Responsibilities**:
- Dynamic invoice items management (add/remove)
- Dynamic discounts management (add/remove)
- Real-time calculation display
- Invoice summary with totals

**Features**:
- useFieldArray for dynamic items/discounts
- Real-time calculations using `calculateInvoiceAmounts`
- Currency formatting
- Item total calculation per row
- Summary section with subtotal, discount, tax, and total

### 5. Template Selector (`src/components/TemplateSelector.tsx`)

**Type**: Client Component

**Responsibilities**:
- Display available invoice templates
- Handle template selection
- Visual template preview
- Continue to form step

**Features**:
- Grid layout of template cards
- Visual preview with gradient backgrounds
- Selected state with accent color border
- Template metadata display (name, description, accent color)

### 6. PDF Preview (`src/components/PDFPreview.tsx`)

**Type**: Client Component

**Responsibilities**:
- Display PDF preview in iframe
- Show template preview when no PDF generated
- Handle PDF blob URL creation and cleanup
- Download button integration

**Features**:
- Blob URL management with cleanup
- Template preview when on step 1
- Placeholder when no PDF available
- Loading state handling
- iframe-based PDF rendering

### 7. UI Components

#### Button (`src/components/ui/Button.tsx`)

**Variants**: `primary`, `secondary`, `outline`, `danger`
**Sizes**: `sm`, `md`, `lg`
**Features**: Loading state, disabled state, focus styles

#### Input (`src/components/ui/Input.tsx`)

**Features**: Label, error message, help text, forwarded ref, error state styling

---

## Services & Utilities

### 1. PDF Generator (`src/lib/services/pdf-generator.ts`)

**Class**: `InvoicePDFGenerator`

**Responsibilities**:
- Generate PDF from invoice data using jsPDF
- Apply template styling and colors
- Layout PDF elements (header, details, parties, items, totals, footer)

**Key Methods**:
- `generatePDF(): jsPDF` - Main generation method
- `addHeader()` - Invoice header with template accent color
- `addInvoiceDetails()` - Invoice ID, dates
- `addPartiesInfo()` - Bill From / Bill To sections
- `addItemsTable()` - Items table with alternating row colors
- `addTotals()` - Subtotal, discount, tax, total
- `addFooter()` - Footer with contact information

**Color Management**:
- Converts hex colors to RGB for jsPDF
- Uses template palette for consistent styling
- Supports accent colors, text colors, borders, backgrounds

**Export Functions**:
- `generateInvoicePDF(invoice: InvoiceData): Promise<Blob>` - Async PDF generation
- `downloadPDF(blob: Blob, filename: string): void` - Trigger browser download

### 2. Invoice Calculations (`src/lib/utils/invoice-calculations.ts`)

**Functions**:
- `calculateInvoiceAmounts(data: InvoiceData): InvoiceCalculations`
  - Calculates subtotal, discount total, taxable amount, tax amount, total amount
- `calculateSubtotal(items: InvoiceItem[]): number`
- `calculateDiscountTotal(discounts: DiscountItem[]): number`
- `calculateTaxAmount(taxableAmount: number, taxRate: number): number`
- `formatCurrency(amount: number, currency: string): string`
  - Formats with thousand separators and 2 decimal places
- `generateInvoiceId(): string`
  - Generates ID in format: `INV-{YEAR}-{TIMESTAMP}`

### 3. Class Name Utility (`src/lib/utils/cn.ts`)

**Function**: `cn(...inputs: ClassValue[]): string`
- Merges Tailwind classes using `clsx` and `tailwind-merge`
- Prevents class conflicts and ensures proper Tailwind class precedence

---

## Data Flow

### Form Data Flow

```
User Input
    ↓
react-hook-form Controller
    ↓
Form State (react-hook-form)
    ↓
Zod Validation (onChange mode)
    ↓
LocalStorage Persistence (debounced via watch subscription)
    ↓
PDF Generation (on submit)
    ↓
PDF Blob → Preview Component
    ↓
Download (user action)
```

### Template Selection Flow

```
User Selects Template
    ↓
Template ID State Update
    ↓
LocalStorage Persistence
    ↓
Template Applied to Form
    ↓
Template Applied to PDF Generation
```

### PDF Generation Flow

```
Form Submit (validated)
    ↓
InvoiceData Object Created
    ↓
InvoicePDFGenerator Instantiated
    ↓
PDF Generated (jsPDF)
    ↓
PDF Blob Created
    ↓
Blob URL Created
    ↓
Preview Component Updates
    ↓
User Can Download
```

---

## State Management

### Form State (react-hook-form)

**Library**: react-hook-form 7.48

**Configuration**:
- **Mode**: `onChange` - Validates on every change
- **Resolver**: `zodResolver(invoiceFormSchema)` - Zod validation
- **Default Values**: Generated with invoice ID, today's date, 30-day due date

**Form State**:
- Managed internally by react-hook-form
- Watched for localStorage persistence
- Validated in real-time with Zod

### Application State (React useState)

**Main Page State**:
- `generatedPDF: Blob | null`
- `currentInvoiceId: string`
- `step: 1 | 2`
- `selectedTemplateId: string`

**Form Component State**:
- `isGenerating: boolean` - PDF generation loading state
- `generatedPDF: Blob | null` - Local PDF state

### Persistence State (LocalStorage)

**Keys**:
- `invoice-maker:last-form` - Form data (excluding invoiceId, invoiceDate, dueDate)
- `invoice-maker:last-template` - Selected template ID

**Persistence Strategy**:
- Form data: Persisted on every change (via watch subscription)
- Template: Persisted on selection change
- Invoice ID, dates: Not persisted (always regenerated/updated)

---

## Styling & Theming

### Tailwind CSS Configuration

**Custom Colors**:
- Primary palette: Blue scale (50-900)
- Custom accent colors per template

**Custom Fonts**:
- Inter font family (loaded via Next.js font optimization)

**Content Paths**:
- `./src/pages/**/*.{js,ts,jsx,tsx,mdx}`
- `./src/components/**/*.{js,ts,jsx,tsx,mdx}`
- `./src/app/**/*.{js,ts,jsx,tsx,mdx}`

### Global Styles (`src/styles/globals.css`)

**Tailwind Directives**:
- `@tailwind base` - Base styles
- `@tailwind components` - Component classes
- `@tailwind utilities` - Utility classes

**Custom Styles**:
- Antialiased body
- Container utility class
- Text balance utility

### Template System

**Template Structure** (`src/lib/templates/invoice-templates.ts`):
- Template ID, name, description
- Accent color (hex)
- Preview gradient
- Color palette (RGB values for PDF)

**Available Templates**:
1. **Default Classic** - Navy blue (`#1D4ED8`)
2. **Emerald Elegance** - Green (`#047857`)
3. **Sunset Copper** - Orange/copper (`#B45309`)
4. **Midnight Slate** - Charcoal (`#1E293B`)
5. **Royal Plum** - Purple (`#6B21A8`)

**Template Palette**:
- `accent: RGB` - Main accent color
- `accentLight: RGB` - Light accent for backgrounds
- `headerText: RGB` - Header text color
- `headerSubtext: RGB` - Subheader text color
- `bodyText: RGB` - Body text color
- `tableHeaderFill: RGB` - Table header background
- `tableHeaderText: RGB` - Table header text
- `border: RGB` - Border color
- `footerText: RGB` - Footer text color

---

## PDF Generation

### PDF Library: jsPDF

**Version**: 2.5.0

**Configuration**:
- Page size: Letter (8.5" × 11")
- Orientation: Portrait
- Units: Points (pt)
- Margins: 72pt (1 inch)

### PDF Structure

1. **Header** (0-90pt)
   - Accent color background
   - "INVOICE" title (26pt, bold, white)
   - Invoice ID (#INV-XXX-XXX) (12pt, white)

2. **Invoice Details** (140pt+)
   - Section title (12pt, bold)
   - Invoice ID, Invoice Date, Due Date (10pt)
   - Horizontal divider line

3. **Parties Information** (280pt+)
   - Bill From section (left)
   - Bill To section (right)
   - Company name (bold), address, contact info

4. **Items Table** (420pt+)
   - Table header (accent background)
   - Columns: Description, Qty, Rate, Total
   - Alternating row colors
   - Discounts (italic, if applicable)

5. **Totals Section** (600pt+)
   - Subtotal
   - Discount (if applicable)
   - Tax (if applicable)
   - Total Due (bold, accent background)

6. **Footer** (bottom-50pt)
   - Horizontal divider
   - Contact information (email, phone)

### Color Conversion

**Hex to RGB**: Templates define colors in hex, converted to RGB for jsPDF:
```typescript
function hexToRgb(hex: string): RGB {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}
```

### PDF Generation Process

1. **Instantiate Generator**: `new InvoicePDFGenerator(invoiceData)`
2. **Generate PDF**: `generator.generatePDF()`
3. **Export to Blob**: `doc.output("blob")`
4. **Create Blob URL**: `URL.createObjectURL(blob)`
5. **Display in iframe**: `<iframe src={blobUrl} />`
6. **Download**: Create `<a>` element with download attribute

---

## Form Validation

### Validation Library: Zod

**Version**: 3.22.0

### Validation Schemas (`src/lib/validations/invoice.ts`)

#### Contact Info Schema
```typescript
contactInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().optional(),
  // ... other optional fields
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
})
```

#### Invoice Item Schema
```typescript
invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  rate: z.number().min(0, "Rate must be greater than or equal to 0"),
})
```

#### Invoice Form Schema
```typescript
invoiceFormSchema = z.object({
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
)
```

### Validation Integration

**react-hook-form + Zod**:
- Resolver: `zodResolver(invoiceFormSchema)`
- Mode: `onChange` - Validates on every change
- Error display: Field-level and form-level error summaries

### Validation Rules

1. **Required Fields**:
   - Invoice ID
   - Invoice Date
   - Due Date
   - Template ID
   - Issuer Company Name
   - Client Company Name
   - At least one invoice item

2. **Format Validation**:
   - Email: Must be valid email format (if provided)
   - Dates: Must be valid date strings
   - Numbers: Quantity > 0, Rate >= 0, Tax Rate 0-100

3. **Business Rules**:
   - Due Date >= Invoice Date
   - At least one item required
   - Quantity must be > 0
   - Tax rate must be 0-100%

---

## Storage & Persistence

### LocalStorage Keys

**Constants** (`src/lib/constants/storage.ts`):
- `INVOICE_FORM_STORAGE_KEY = "invoice-maker:last-form"`
- `INVOICE_TEMPLATE_STORAGE_KEY = "invoice-maker:last-template"`

### Persistence Strategy

#### Form Data Persistence

**What is Persisted**:
- Template ID
- Issuer information
- Client information
- Items (descriptions, quantities, rates)
- Discounts (descriptions, amounts)
- Tax rate
- Currency

**What is NOT Persisted**:
- Invoice ID (always regenerated)
- Invoice Date (always set to today)
- Due Date (always set to 30 days from today)

**Persistence Mechanism**:
- Watches form changes via `watch()` subscription
- Debounced persistence (on every change)
- JSON serialization/deserialization
- Error handling for localStorage quota exceeded

#### Template Persistence

**What is Persisted**:
- Selected template ID

**Persistence Mechanism**:
- Persisted on template selection change
- Loaded on page load
- Defaults to `DEFAULT_TEMPLATE_ID` if not found

### Hydration Handling

**Problem**: Server-side rendering (SSR) doesn't have access to localStorage

**Solution**:
- `hasHydratedRef` flag to track hydration state
- Only access localStorage after hydration
- Load persisted data on first render (client-side only)
- Prevent SSR/client mismatches

**Implementation**:
```typescript
const hasHydratedRef = useRef(false);

useEffect(() => {
  if (typeof window === "undefined") {
    hasHydratedRef.current = true;
    return;
  }

  if (!hasHydratedRef.current) {
    // Load from localStorage
    const stored = localStorage.getItem(INVOICE_FORM_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      reset({ ...baseDefaults, ...parsed, templateId });
    }
    hasHydratedRef.current = true;
  }
}, []);
```

---

## Type System

### Type Definitions (`src/types/invoice.ts`)

#### ContactInfo
```typescript
interface ContactInfo {
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
```

#### InvoiceItem
```typescript
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}
```

#### DiscountItem
```typescript
interface DiscountItem {
  id: string;
  description: string;
  amount: number;
}
```

#### InvoiceData
```typescript
interface InvoiceData {
  invoiceId: string;
  invoiceDate: string; // ISO date string
  dueDate: string; // ISO date string
  templateId: string;
  issuer: ContactInfo;
  client: ContactInfo;
  items: InvoiceItem[];
  discounts: DiscountItem[];
  taxRate: number; // Percentage (e.g., 10.5 for 10.5%)
  currency: string; // Currency symbol
}
```

#### InvoiceCalculations
```typescript
interface InvoiceCalculations {
  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
}
```

### Template Types (`src/lib/templates/invoice-templates.ts`)

#### InvoiceTemplatePalette
```typescript
interface InvoiceTemplatePalette {
  headerText: RGB;
  headerSubtext: RGB;
  bodyText: RGB;
  accent: RGB;
  accentLight: RGB;
  tableHeaderFill: RGB;
  tableHeaderText: RGB;
  border: RGB;
  footerText: RGB;
}
```

#### InvoiceTemplate
```typescript
interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  accentHex: string;
  accentForegroundHex: string;
  previewGradient: [string, string];
  palette: InvoiceTemplatePalette;
}
```

### Validation Types

**Zod Inferred Types** (`src/lib/validations/invoice.ts`):
- `InvoiceFormValues = z.infer<typeof invoiceFormSchema>`
- Used for form typing and validation

---

## Configuration

### Next.js Configuration (`next.config.js`)

**Key Settings**:
- `reactStrictMode: true` - React strict mode enabled
- `experimental.typedRoutes: true` - Type-safe routes

**Webpack Configuration**:
- **PDF.js Fallbacks**: Configures fallbacks for Node.js modules (fs, path, crypto, canvas)
- **Canvas Ignore**: Ignores canvas module when required from pdfjs-dist
- **Alias Configuration**: Sets canvas alias to false

**Purpose**: Prevents webpack errors when bundling pdfjs-dist for client-side use

### TypeScript Configuration (`tsconfig.json`)

**Key Settings**:
- `target: "ES2022"` - Modern JavaScript target
- `strict: true` - Strict type checking
- `module: "esnext"` - ES modules
- `moduleResolution: "bundler"` - Bundler module resolution
- `jsx: "preserve"` - Preserve JSX for Next.js

**Path Aliases**:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/types/*` → `./src/types/*`

### Tailwind Configuration (`tailwind.config.js`)

**Content Paths**:
- `./src/pages/**/*.{js,ts,jsx,tsx,mdx}`
- `./src/components/**/*.{js,ts,jsx,tsx,mdx}`
- `./src/app/**/*.{js,ts,jsx,tsx,mdx}`

**Theme Extensions**:
- **Primary Colors**: Blue scale (50-900)
- **Font Family**: Inter (via Next.js font optimization)

### Package.json Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit"
}
```

---

## Build & Deployment

### Build Process

1. **Type Checking**: `tsc --noEmit`
2. **Linting**: `eslint` (via `next lint`)
3. **Build**: `next build`
   - Compiles TypeScript
   - Optimizes React components
   - Generates static pages (if any)
   - Creates production bundle

### Deployment Considerations

**Static Export**: Not configured (requires API routes or server-side features)

**Environment Variables**: None required (fully client-side)

**Browser Support**:
- Modern browsers with ES2022 support
- LocalStorage support required
- Blob URL support required

### Performance Optimizations

1. **Font Optimization**: Next.js font optimization for Inter font
2. **Code Splitting**: Automatic code splitting via Next.js
3. **Image Optimization**: Not used (no images in application)
4. **Bundle Size**: Client-side PDF generation adds to bundle size (jsPDF)

### Known Limitations

1. **PDF.js Not Used**: pdfjs-dist and react-pdf are installed but not actively used
2. **No Server-Side Rendering**: Main page is client-side only
3. **LocalStorage Dependency**: Requires browser localStorage support
4. **Client-Side Only**: No backend or API required

---

## Future Enhancements

Based on `.prd/more_templates.md`:

1. **More Templates**:
   - Add gray color options
   - Add gradient options
   - Add three different layout options
   - Combine colors, gradients, and layouts

2. **Potential Improvements**:
   - Server-side PDF generation (optional)
   - PDF template customization UI
   - Invoice history/management
   - Export to other formats (CSV, Excel)
   - Multi-language support
   - Cloud storage integration
   - Email sending functionality

---

## Conclusion

The Invoice Maker application is a well-structured, type-safe, client-side web application built with modern web technologies. It follows best practices for React/Next.js development, with clear separation of concerns, comprehensive validation, and an extensible template system. The architecture supports future enhancements while maintaining code quality and developer experience.

